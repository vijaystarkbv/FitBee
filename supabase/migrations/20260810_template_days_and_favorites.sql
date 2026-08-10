CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

-- Create workout_template_days table
CREATE TABLE IF NOT EXISTS public.workout_template_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
    day_name TEXT NOT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for workout_template_days
ALTER TABLE public.workout_template_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own template days" ON public.workout_template_days
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workout_templates
            WHERE workout_templates.id = workout_template_days.template_id
            AND workout_templates.user_id = auth.uid()
        )
    );

-- Alter workout_template_exercises to link to days instead of templates directly
ALTER TABLE public.workout_template_exercises
    ADD COLUMN template_day_id UUID REFERENCES public.workout_template_days(id) ON DELETE CASCADE,
    ADD COLUMN target_time_seconds INTEGER;

-- We can drop template_id since we are moving to day-based grouping.
-- NOTE: Since there are 0 rows in production, this is safe.
ALTER TABLE public.workout_template_exercises
    DROP COLUMN template_id;

-- Ensure template_day_id is NOT NULL now
ALTER TABLE public.workout_template_exercises
    ALTER COLUMN template_day_id SET NOT NULL;

-- Fix RLS for workout_template_exercises now that it links through template_day_id
DROP POLICY IF EXISTS "Users can manage their own template exercises" ON public.workout_template_exercises;
CREATE POLICY "Users can manage their own template exercises" ON public.workout_template_exercises
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.workout_template_days
            JOIN public.workout_templates ON workout_templates.id = workout_template_days.template_id
            WHERE workout_template_days.id = workout_template_exercises.template_day_id
            AND workout_templates.user_id = auth.uid()
        )
    );

-- Add tracking_type to master_exercises for Timer vs Reps
ALTER TABLE public.master_exercises
    ADD COLUMN tracking_type TEXT NOT NULL DEFAULT 'reps' CHECK (tracking_type IN ('reps', 'timer'));

-- Create exercise_favorites table
CREATE TABLE IF NOT EXISTS public.exercise_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.master_exercises(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, exercise_id)
);

-- RLS for exercise_favorites
ALTER TABLE public.exercise_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own exercise favorites" ON public.exercise_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Add trigger for updated_at on workout_template_days
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.workout_template_days
    FOR EACH ROW EXECUTE FUNCTION public.update_modified_column();
