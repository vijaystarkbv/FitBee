-- Migration: 20260907_dynamic_nutrition_targets.sql
-- Description: Creates nutrition_target_versions and nutrition_progress_updates tables for longitudinal nutrition tracking

-- 1. Nutrition Target Versions Table
CREATE TABLE IF NOT EXISTS public.nutrition_target_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ, -- NULL denotes the currently active target
    calories INTEGER NOT NULL CHECK (calories >= 500),
    protein INTEGER NOT NULL CHECK (protein >= 20),
    carbs INTEGER NOT NULL CHECK (carbs >= 20),
    fat INTEGER NOT NULL CHECK (fat >= 10),
    source TEXT NOT NULL CHECK (source IN ('onboarding', 'gemini_recommendation', 'manual_user_edit')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_target_versions_user_dates 
ON public.nutrition_target_versions (user_id, effective_from DESC);

-- Enable RLS for nutrition_target_versions
ALTER TABLE public.nutrition_target_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own target versions"
ON public.nutrition_target_versions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. Nutrition Progress Updates Table (Longitudinal Recalibration Events)
CREATE TABLE IF NOT EXISTS public.nutrition_progress_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL,
    weight_kg NUMERIC(5, 2) NOT NULL CHECK (weight_kg > 0),
    previous_weight_kg NUMERIC(5, 2),
    weight_change_kg NUMERIC(5, 2),
    days_since_last_update INTEGER,
    active_target_calories INTEGER NOT NULL,
    active_target_protein INTEGER NOT NULL,
    active_target_carbs INTEGER NOT NULL,
    active_target_fat INTEGER NOT NULL,
    goal TEXT NOT NULL,
    expected_trend TEXT NOT NULL,
    actual_trend TEXT NOT NULL,
    fitbee_recommended_calories INTEGER,
    fitbee_recommended_protein INTEGER,
    fitbee_recommended_carbs INTEGER,
    fitbee_recommended_fat INTEGER,
    statement_ids JSONB DEFAULT '[]'::jsonb,
    user_action TEXT NOT NULL DEFAULT 'pending' CHECK (user_action IN ('pending', 'accepted', 'rejected', 'manual_override')),
    user_selected_calories INTEGER,
    user_selected_protein INTEGER,
    user_selected_carbs INTEGER,
    user_selected_fat INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_progress_updates_user_time 
ON public.nutrition_progress_updates (user_id, recorded_at DESC);

-- Enable RLS for nutrition_progress_updates
ALTER TABLE public.nutrition_progress_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own progress updates"
ON public.nutrition_progress_updates
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
