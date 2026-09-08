-- Migration: 20260908_workout_template_versions.sql
-- Description: Creates workout_template_versions table for effective-dated historical workout template versioning

CREATE TABLE IF NOT EXISTS public.workout_template_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE,
    effective_from TIMESTAMPTZ NOT NULL,
    effective_to TIMESTAMPTZ, -- NULL denotes the currently active version
    scheduled_days TEXT[] NOT NULL DEFAULT '{}',
    days_config JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workout_template_versions_user_dates 
ON public.workout_template_versions (user_id, effective_from DESC);

-- Enable RLS
ALTER TABLE public.workout_template_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own workout template versions"
ON public.workout_template_versions
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Seed initial version for existing active templates (if any exist)
DO $$
DECLARE
    tmpl RECORD;
    day_rec RECORD;
    v_days TEXT[];
    v_config JSONB;
BEGIN
    FOR tmpl IN 
        SELECT id, user_id, created_at 
        FROM public.workout_templates 
        WHERE deleted_at IS NULL AND user_id IS NOT NULL
    LOOP
        -- Check if a version already exists for this template
        IF NOT EXISTS (SELECT 1 FROM public.workout_template_versions WHERE template_id = tmpl.id) THEN
            v_days := ARRAY(
                SELECT TRIM(day_name) 
                FROM public.workout_template_days 
                WHERE template_id = tmpl.id AND is_enabled = true
                ORDER BY order_index ASC
            );

            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', d.id,
                    'day_name', d.day_name,
                    'is_enabled', d.is_enabled,
                    'order_index', d.order_index,
                    'exercises', COALESCE((
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'id', e.id,
                                'exercise_id', e.exercise_id,
                                'order_index', e.order_index,
                                'target_sets', e.target_sets,
                                'target_reps', e.target_reps,
                                'target_time_seconds', e.target_time_seconds,
                                'default_weight_kg', e.default_weight_kg
                            ) ORDER BY e.order_index ASC
                        )
                        FROM public.workout_template_exercises e
                        WHERE e.template_day_id = d.id
                    ), '[]'::jsonb)
                ) ORDER BY d.order_index ASC
            ) INTO v_config
            FROM public.workout_template_days d
            WHERE d.template_id = tmpl.id;

            INSERT INTO public.workout_template_versions (
                user_id,
                template_id,
                effective_from,
                effective_to,
                scheduled_days,
                days_config,
                created_at
            ) VALUES (
                tmpl.user_id,
                tmpl.id,
                tmpl.created_at,
                NULL,
                COALESCE(v_days, '{}'),
                COALESCE(v_config, '[]'::jsonb),
                tmpl.created_at
            );
        END IF;
    END LOOP;
END $$;
