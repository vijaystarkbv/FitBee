-- Migration: Add Daily Hitlist Habits, Habit Sessions, and Habit Daily Logs
-- Supports personal habits (checklist and timed duration), multi-session logging, and independent streaks

-- 1. Habits definition table
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('CHECKLIST', 'DURATION')),
    target_duration_seconds INTEGER, -- NULL for CHECKLIST, > 0 for DURATION
    notifications_enabled BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habit individual timer sessions table
CREATE TABLE IF NOT EXISTS public.habit_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- YYYY-MM-DD
    session_index INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_seconds INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Habit daily logs & completion tracking table
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- YYYY-MM-DD
    is_completed BOOLEAN NOT NULL DEFAULT false,
    target_duration_seconds INTEGER, -- Snapshot of target on that date for historical integrity
    actual_duration_seconds INTEGER DEFAULT 0,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (habit_id, date)
);

-- Indices for rapid querying by user, habit, and date
CREATE INDEX IF NOT EXISTS idx_habits_user_active ON public.habits(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_habit_sessions_habit_date ON public.habit_sessions(habit_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_sessions_user_date ON public.habit_sessions(user_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON public.habit_logs(habit_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date ON public.habit_logs(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

-- Security Policies: Users can only view and manage their own habits and logs
DROP POLICY IF EXISTS "Users can manage their own habits" ON public.habits;
CREATE POLICY "Users can manage their own habits" ON public.habits
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own habit sessions" ON public.habit_sessions;
CREATE POLICY "Users can manage their own habit sessions" ON public.habit_sessions
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own habit logs" ON public.habit_logs;
CREATE POLICY "Users can manage their own habit logs" ON public.habit_logs
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

