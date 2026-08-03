-- FitBee Migration: Add Row Level Security (RLS) policies for meal_entries
-- Run this in your Supabase SQL Editor if users cannot access meal_entries

CREATE POLICY "Users can manage own meal entries"
ON public.meal_entries
FOR ALL
USING (
    EXISTS (
        SELECT 1
        FROM public.nutrition_logs
        WHERE nutrition_logs.id = meal_entries.nutrition_log_id
        AND nutrition_logs.user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1
        FROM public.nutrition_logs
        WHERE nutrition_logs.id = meal_entries.nutrition_log_id
        AND nutrition_logs.user_id = auth.uid()
    )
);