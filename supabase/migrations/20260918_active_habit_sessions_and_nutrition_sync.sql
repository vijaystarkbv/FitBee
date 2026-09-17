-- ============================================================================
-- FitBee Active Habit Sessions, Nutrition Realtime Sync & Stop Atomicity
-- Migration: 20260918_active_habit_sessions_and_nutrition_sync.sql
-- ============================================================================

-- 1. Create active_habit_sessions table for cross-device live timer state
CREATE TABLE IF NOT EXISTS public.active_habit_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- YYYY-MM-DD format
    status TEXT NOT NULL CHECK (status IN ('RUNNING', 'PAUSED')),
    started_at TIMESTAMPTZ NOT NULL,
    accumulated_seconds INTEGER NOT NULL DEFAULT 0,
    last_resumed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_habit_active UNIQUE (user_id, habit_id)
);

CREATE INDEX IF NOT EXISTS idx_active_habit_sessions_user ON public.active_habit_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_active_habit_sessions_habit ON public.active_habit_sessions(habit_id);

-- Enable RLS on active_habit_sessions
ALTER TABLE public.active_habit_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own active habit sessions" ON public.active_habit_sessions;
CREATE POLICY "Users can manage their own active habit sessions" ON public.active_habit_sessions
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.active_habit_sessions REPLICA IDENTITY FULL;

-- 2. Add user_id to meal_entries for user-scoped realtime subscriptions
ALTER TABLE public.meal_entries
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Backfill existing meal_entries with user_id from nutrition_logs
UPDATE public.meal_entries me
SET user_id = nl.user_id
FROM public.nutrition_logs nl
WHERE me.nutrition_log_id = nl.id
  AND me.user_id IS NULL;

CREATE INDEX IF NOT EXISTS idx_meal_entries_user_id ON public.meal_entries(user_id);

DROP POLICY IF EXISTS "Users can manage own meal entries direct" ON public.meal_entries;
CREATE POLICY "Users can manage own meal entries direct" ON public.meal_entries
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.meal_entries REPLICA IDENTITY FULL;

-- 3. Add active_habit_sessions and meal_entries to supabase_realtime publication
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'active_habit_sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.active_habit_sessions;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'meal_entries'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.meal_entries;
  END IF;
END $$;

-- 4. Atomic function to stop an active session safely without duplicate creation
CREATE OR REPLACE FUNCTION public.stop_active_habit_session(
    p_user_id UUID,
    p_habit_id UUID,
    p_ended_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_active RECORD;
    v_target_seconds INT;
    v_final_duration INT;
    v_additional_seconds INT := 0;
    v_session_index INT;
    v_new_session_id UUID;
    v_date TEXT;
    v_total_today_duration INT;
    v_is_completed BOOLEAN;
    v_log_id UUID;
BEGIN
    -- Lock and fetch active session row to prevent race conditions
    SELECT * INTO v_active
    FROM public.active_habit_sessions
    WHERE user_id = p_user_id AND habit_id = p_habit_id
    FOR UPDATE;

    IF v_active IS NULL THEN
        RETURN jsonb_build_object('success', false, 'reason', 'no_active_session');
    END IF;

    v_date := v_active.date;

    -- Calculate duration
    IF v_active.status = 'RUNNING' AND v_active.last_resumed_at IS NOT NULL THEN
        v_additional_seconds := GREATEST(0, EXTRACT(EPOCH FROM (p_ended_at - v_active.last_resumed_at))::INT);
    END IF;

    v_final_duration := v_active.accumulated_seconds + v_additional_seconds;

    -- If final duration is 0, delete the active session without saving an empty log
    IF v_final_duration <= 0 THEN
        DELETE FROM public.active_habit_sessions WHERE id = v_active.id;
        RETURN jsonb_build_object('success', true, 'duration_seconds', 0, 'session', null);
    END IF;

    -- Fetch habit target duration
    SELECT target_duration_seconds INTO v_target_seconds
    FROM public.habits
    WHERE id = p_habit_id;

    -- Calculate next session index for this habit on this date
    SELECT COALESCE(MAX(session_index), 0) + 1 INTO v_session_index
    FROM public.habit_sessions
    WHERE user_id = p_user_id AND habit_id = p_habit_id AND date = v_date;

    -- Insert completed session record
    INSERT INTO public.habit_sessions (
        user_id,
        habit_id,
        date,
        session_index,
        started_at,
        ended_at,
        duration_seconds,
        created_at
    ) VALUES (
        p_user_id,
        p_habit_id,
        v_date,
        v_session_index,
        v_active.started_at,
        p_ended_at,
        v_final_duration,
        p_ended_at
    )
    RETURNING id INTO v_new_session_id;

    -- Re-sum all completed sessions for this habit and date
    SELECT COALESCE(SUM(duration_seconds), 0) INTO v_total_today_duration
    FROM public.habit_sessions
    WHERE user_id = p_user_id AND habit_id = p_habit_id AND date = v_date;

    v_is_completed := (v_target_seconds IS NOT NULL AND v_target_seconds > 0 AND v_total_today_duration >= v_target_seconds);

    -- Upsert habit daily log
    INSERT INTO public.habit_logs (
        user_id,
        habit_id,
        date,
        is_completed,
        target_duration_seconds,
        actual_duration_seconds,
        completed_at,
        updated_at
    ) VALUES (
        p_user_id,
        p_habit_id,
        v_date,
        v_is_completed,
        v_target_seconds,
        v_total_today_duration,
        CASE WHEN v_is_completed THEN p_ended_at ELSE NULL END,
        p_ended_at
    )
    ON CONFLICT (habit_id, date) DO UPDATE SET
        is_completed = EXCLUDED.is_completed,
        target_duration_seconds = EXCLUDED.target_duration_seconds,
        actual_duration_seconds = EXCLUDED.actual_duration_seconds,
        completed_at = CASE WHEN EXCLUDED.is_completed THEN COALESCE(public.habit_logs.completed_at, EXCLUDED.completed_at) ELSE NULL END,
        updated_at = EXCLUDED.updated_at
    RETURNING id INTO v_log_id;

    -- Delete active session row
    DELETE FROM public.active_habit_sessions WHERE id = v_active.id;

    RETURN jsonb_build_object(
        'success', true,
        'session_id', v_new_session_id,
        'duration_seconds', v_final_duration,
        'total_duration_today', v_total_today_duration,
        'is_completed', v_is_completed,
        'date', v_date,
        'session_index', v_session_index,
        'started_at', v_active.started_at,
        'ended_at', p_ended_at
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.stop_active_habit_session(UUID, UUID, TIMESTAMPTZ) TO authenticated, anon, service_role;

-- 5. Clean up duplicate test sessions for vijaybvvijay3@gmail.com caused by old double-UUID bug
DELETE FROM public.habit_sessions
WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (
      PARTITION BY user_id, habit_id, date, started_at, duration_seconds 
      ORDER BY created_at ASC
    ) as rnum
    FROM public.habit_sessions
    WHERE user_id = 'a789e533-cf57-45d5-8d02-e2be95765202'
  ) t
  WHERE t.rnum > 1
);

-- Recompute habit_logs.actual_duration_seconds for vijaybvvijay3@gmail.com
UPDATE public.habit_logs hl
SET actual_duration_seconds = sub.total_duration,
    is_completed = (hl.target_duration_seconds IS NOT NULL AND hl.target_duration_seconds > 0 AND sub.total_duration >= hl.target_duration_seconds)
FROM (
  SELECT habit_id, date, SUM(duration_seconds) as total_duration
  FROM public.habit_sessions
  WHERE user_id = 'a789e533-cf57-45d5-8d02-e2be95765202'
  GROUP BY habit_id, date
) sub
WHERE hl.habit_id = sub.habit_id
  AND hl.date = sub.date
  AND hl.user_id = 'a789e533-cf57-45d5-8d02-e2be95765202';
