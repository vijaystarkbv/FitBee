-- Migration: Add Daily Walking Activities Tracking
-- Standalone daily manual walking tracker supporting steps, distance, and deterministic estimated calories

CREATE TABLE IF NOT EXISTS public.daily_walking_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TEXT NOT NULL, -- YYYY-MM-DD
    steps INTEGER NOT NULL DEFAULT 0,
    distance_km NUMERIC(6, 2) NOT NULL DEFAULT 0,
    calories_burned INTEGER NOT NULL DEFAULT 0,
    input_mode TEXT NOT NULL DEFAULT 'steps' CHECK (input_mode IN ('steps', 'distance')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (user_id, date)
);

-- Index for date and user lookups
CREATE INDEX IF NOT EXISTS idx_daily_walking_logs_user_date ON public.daily_walking_logs(user_id, date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.daily_walking_logs ENABLE ROW LEVEL SECURITY;

-- Security Policy: Users can only manage their own walking logs
DROP POLICY IF EXISTS "Users can manage their own daily walking logs" ON public.daily_walking_logs;
CREATE POLICY "Users can manage their own daily walking logs" ON public.daily_walking_logs
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
