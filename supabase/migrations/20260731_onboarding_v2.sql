-- FitBee Onboarding V2 Migration
-- Run this in Supabase SQL Editor after the initial schema migration

-- 1. Expand the 'goal' constraint to support new fitness goals
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_goal_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_goal_check
  CHECK (goal IN ('gain_weight', 'lose_weight', 'gain_muscle', 'lose_fat', 'maintain_weight', 'improve_fitness'));

-- 2. Expand the 'training_location' constraint to support 'both' and 'none'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_training_location_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_training_location_check
  CHECK (training_location IN ('home', 'gym', 'both', 'none'));

-- 3. Make profile columns nullable for skip-onboarding flow
-- (Users who skip onboarding won't have these values yet)
ALTER TABLE public.profiles ALTER COLUMN age DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN gender DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN height_cm DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN weight_kg DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN goal DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN activity_level DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN training_location DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN target_calories DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN target_protein DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN target_carbs DROP NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN target_fat DROP NOT NULL;

-- 4. Create user_equipment table for multi-equipment tracking
CREATE TABLE IF NOT EXISTS public.user_equipment (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  equipment_name text NOT NULL,
  max_weight_kg numeric(5,2) DEFAULT NULL,
  resistance_level text DEFAULT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, equipment_name)
);

-- 5. Enable RLS on user_equipment
ALTER TABLE public.user_equipment ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for user_equipment
CREATE POLICY "Users can view own equipment"
  ON public.user_equipment FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own equipment"
  ON public.user_equipment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own equipment"
  ON public.user_equipment FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own equipment"
  ON public.user_equipment FOR DELETE
  USING (auth.uid() = user_id);
