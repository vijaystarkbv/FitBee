-- ============================================================================
-- FitBee: Hitlist Session Persistence, Idempotent Stop & Notification State
-- Migration: 20260918_fix_habit_persistence_and_notifications.sql
-- ============================================================================

-- 1. Enhanced stop_active_habit_session with Idempotency & Full Record Returns
DROP FUNCTION IF EXISTS public.stop_active_habit_session(UUID, UUID, TIMESTAMPTZ);

CREATE OR REPLACE FUNCTION public.stop_active_habit_session(
    p_user_id UUID,
    p_habit_id UUID,
    p_ended_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    p_active_session_id UUID DEFAULT NULL
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
    v_date TEXT;
    v_total_today_duration INT;
    v_is_completed BOOLEAN;
    v_saved_session RECORD;
    v_saved_log RECORD;
BEGIN
    -- 1. Check if session was ALREADY stopped/finalized (Idempotent defense)
    IF p_active_session_id IS NOT NULL THEN
        SELECT * INTO v_saved_session
        FROM public.habit_sessions
        WHERE id = p_active_session_id;

        IF v_saved_session IS NOT NULL THEN
            SELECT * INTO v_saved_log
            FROM public.habit_logs
            WHERE user_id = p_user_id AND habit_id = p_habit_id AND date = v_saved_session.date;

            RETURN jsonb_build_object(
                'success', true,
                'already_stopped', true,
                'session', row_to_json(v_saved_session),
                'log', row_to_json(v_saved_log)
            );
        END IF;
    END IF;

    -- 2. Lock and fetch active session row
    IF p_active_session_id IS NOT NULL THEN
        SELECT * INTO v_active
        FROM public.active_habit_sessions
        WHERE id = p_active_session_id
        FOR UPDATE;
    END IF;

    -- Fallback: lock by (user_id, habit_id) if active session id was not provided or not matched
    IF v_active IS NULL THEN
        SELECT * INTO v_active
        FROM public.active_habit_sessions
        WHERE user_id = p_user_id AND habit_id = p_habit_id
        FOR UPDATE;
    END IF;

    -- If still null, check if any completed session for this habit started at approximately the same time today
    IF v_active IS NULL THEN
        SELECT * INTO v_saved_session
        FROM public.habit_sessions
        WHERE user_id = p_user_id AND habit_id = p_habit_id
        ORDER BY created_at DESC
        LIMIT 1;

        IF v_saved_session IS NOT NULL AND v_saved_session.ended_at >= (p_ended_at - INTERVAL '2 minutes') THEN
            SELECT * INTO v_saved_log
            FROM public.habit_logs
            WHERE user_id = p_user_id AND habit_id = p_habit_id AND date = v_saved_session.date;

            RETURN jsonb_build_object(
                'success', true,
                'already_stopped', true,
                'session', row_to_json(v_saved_session),
                'log', row_to_json(v_saved_log)
            );
        END IF;

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
        RETURN jsonb_build_object('success', true, 'duration_seconds', 0, 'session', null, 'log', null);
    END IF;

    -- Fetch habit target duration
    SELECT target_duration_seconds INTO v_target_seconds
    FROM public.habits
    WHERE id = p_habit_id;

    -- Calculate next session index for this habit on this date
    SELECT COALESCE(MAX(session_index), 0) + 1 INTO v_session_index
    FROM public.habit_sessions
    WHERE user_id = p_user_id AND habit_id = p_habit_id AND date = v_date;

    -- Insert completed session record using v_active.id as the primary key
    -- This enforces database-level idempotency: one active session row can only produce one completed row!
    INSERT INTO public.habit_sessions (
        id,
        user_id,
        habit_id,
        date,
        session_index,
        started_at,
        ended_at,
        duration_seconds,
        created_at
    ) VALUES (
        v_active.id,
        p_user_id,
        p_habit_id,
        v_date,
        v_session_index,
        v_active.started_at,
        p_ended_at,
        v_final_duration,
        p_ended_at
    )
    ON CONFLICT (id) DO UPDATE SET
        ended_at = EXCLUDED.ended_at,
        duration_seconds = EXCLUDED.duration_seconds
    RETURNING * INTO v_saved_session;

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
    RETURNING * INTO v_saved_log;

    -- Delete active session row
    DELETE FROM public.active_habit_sessions WHERE id = v_active.id;

    RETURN jsonb_build_object(
        'success', true,
        'session', row_to_json(v_saved_session),
        'log', row_to_json(v_saved_log)
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.stop_active_habit_session(UUID, UUID, TIMESTAMPTZ, UUID) TO authenticated, anon, service_role;

-- 2. Authoritative Context-Aware Notification State RPC (bypasses RLS in Worker cron safely)
CREATE OR REPLACE FUNCTION public.get_user_notification_raw_state(
    p_user_id UUID,
    p_local_date TEXT,
    p_weekday TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_total_habits INT := 0;
    v_completed_habits INT := 0;
    v_habit_pending BOOLEAN := false;

    v_is_scheduled BOOLEAN := false;
    v_is_completed BOOLEAN := false;
    v_workout_pending BOOLEAN := false;

    v_active_version RECORD;
    v_nut_log RECORD;
    v_food_pending BOOLEAN := true;
    v_current_calories NUMERIC := 0;
    v_current_protein NUMERIC := 0;
    v_is_logged_today BOOLEAN := false;
BEGIN
    -- 1. Habits
    SELECT COUNT(*) INTO v_total_habits
    FROM public.habits
    WHERE user_id = p_user_id AND is_active = true AND notifications_enabled = true;

    IF v_total_habits > 0 THEN
        SELECT COUNT(DISTINCT hl.habit_id) INTO v_completed_habits
        FROM public.habit_logs hl
        JOIN public.habits h ON h.id = hl.habit_id
        WHERE hl.user_id = p_user_id
          AND hl.date = p_local_date
          AND hl.is_completed = true
          AND h.is_active = true
          AND h.notifications_enabled = true;

        v_habit_pending := (v_completed_habits < v_total_habits);
    ELSE
        v_habit_pending := false;
    END IF;

    -- 2. Workout
    -- Check if a workout template version active on p_local_date schedules p_weekday
    SELECT EXISTS (
        SELECT 1 FROM public.workout_template_versions
        WHERE user_id = p_user_id
          AND effective_from::date <= p_local_date::date
          AND (effective_to IS NULL OR effective_to::date > p_local_date::date)
          AND p_weekday = ANY(scheduled_days)
    ) INTO v_is_scheduled;

    IF v_is_scheduled THEN
        -- Check if user logged any workout on p_local_date
        SELECT EXISTS (
            SELECT 1 FROM public.workout_logs
            WHERE user_id = p_user_id
              AND (logged_at::date = p_local_date::date OR (logged_at AT TIME ZONE 'UTC')::date = p_local_date::date)
        ) INTO v_is_completed;

        v_workout_pending := NOT v_is_completed;
    ELSE
        v_workout_pending := false;
    END IF;

    -- 3. Nutrition
    SELECT * INTO v_nut_log
    FROM public.nutrition_logs
    WHERE user_id = p_user_id AND date = p_local_date::date;

    IF v_nut_log IS NOT NULL THEN
        v_current_calories := COALESCE(v_nut_log.total_calories, 0);
        v_current_protein := COALESCE(v_nut_log.total_protein, 0);
        v_is_logged_today := (v_current_calories > 0 OR v_current_protein > 0);
        v_food_pending := NOT v_is_logged_today;
    ELSE
        v_food_pending := true;
    END IF;

    RETURN jsonb_build_object(
        'habitPending', v_habit_pending,
        'foodPending', v_food_pending,
        'workoutPending', v_workout_pending,
        'habitDetails', jsonb_build_object(
            'totalHabits', v_total_habits,
            'completedHabits', v_completed_habits,
            'incompleteHabits', GREATEST(0, v_total_habits - v_completed_habits)
        ),
        'workoutDetails', jsonb_build_object(
            'isScheduledToday', v_is_scheduled,
            'isCompletedToday', v_is_completed
        ),
        'foodDetails', jsonb_build_object(
            'isLoggedToday', v_is_logged_today,
            'isTargetsMet', NOT v_food_pending,
            'currentCalories', v_current_calories
        )
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_user_notification_raw_state(UUID, TEXT, TEXT) TO authenticated, anon, service_role;
