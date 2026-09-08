-- FitBee Supabase RLS Security Hardening
-- Hardens Row Level Security policies without modifying any tables, columns, or data.

-- 1. workout_logs hardening (replaces insecure qual: true policies)
DROP POLICY IF EXISTS "Users can view own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Users can update own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Users can insert own workout logs" ON public.workout_logs;
DROP POLICY IF EXISTS "Users can manage own workout logs" ON public.workout_logs;

CREATE POLICY "Users can manage own workout logs"
ON public.workout_logs
FOR ALL
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 2. workout_log_sets hardening (replaces insecure qual: true policy)
DROP POLICY IF EXISTS "Users can manage own workout log sets" ON public.workout_log_sets;

CREATE POLICY "Users can manage own workout log sets"
ON public.workout_log_sets
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.workout_logs
    WHERE public.workout_logs.id = public.workout_log_sets.workout_log_id
      AND public.workout_logs.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workout_logs
    WHERE public.workout_logs.id = public.workout_log_sets.workout_log_id
      AND public.workout_logs.user_id = auth.uid()
  )
);

-- 3. workout_templates hardening (restricts SELECT to own templates + system templates)
DROP POLICY IF EXISTS "Users can view workout templates" ON public.workout_templates;
DROP POLICY IF EXISTS "Users can view accessible workout templates" ON public.workout_templates;
DROP POLICY IF EXISTS "Users can manage their own workout templates" ON public.workout_templates;

CREATE POLICY "Users can view accessible workout templates"
ON public.workout_templates
FOR SELECT
TO public
USING (
  user_id = auth.uid()
  OR template_type = 'system'
  OR user_id IS NULL
);

CREATE POLICY "Users can manage their own workout templates"
ON public.workout_templates
FOR ALL
TO public
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 4. workout_template_days hardening
DROP POLICY IF EXISTS "Users can manage their own template days" ON public.workout_template_days;
DROP POLICY IF EXISTS "Users can view accessible template days" ON public.workout_template_days;

CREATE POLICY "Users can view accessible template days"
ON public.workout_template_days
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.workout_templates
    WHERE public.workout_templates.id = public.workout_template_days.template_id
      AND (
        public.workout_templates.user_id = auth.uid()
        OR public.workout_templates.template_type = 'system'
        OR public.workout_templates.user_id IS NULL
      )
  )
);

CREATE POLICY "Users can manage their own template days"
ON public.workout_template_days
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.workout_templates
    WHERE public.workout_templates.id = public.workout_template_days.template_id
      AND public.workout_templates.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workout_templates
    WHERE public.workout_templates.id = public.workout_template_days.template_id
      AND public.workout_templates.user_id = auth.uid()
  )
);

-- 5. workout_template_exercises hardening
DROP POLICY IF EXISTS "Users can manage their own template exercises" ON public.workout_template_exercises;
DROP POLICY IF EXISTS "Users can view accessible template exercises" ON public.workout_template_exercises;

CREATE POLICY "Users can view accessible template exercises"
ON public.workout_template_exercises
FOR SELECT
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.workout_template_days
    JOIN public.workout_templates ON public.workout_templates.id = public.workout_template_days.template_id
    WHERE public.workout_template_days.id = public.workout_template_exercises.template_day_id
      AND (
        public.workout_templates.user_id = auth.uid()
        OR public.workout_templates.template_type = 'system'
        OR public.workout_templates.user_id IS NULL
      )
  )
);

CREATE POLICY "Users can manage their own template exercises"
ON public.workout_template_exercises
FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 FROM public.workout_template_days
    JOIN public.workout_templates ON public.workout_templates.id = public.workout_template_days.template_id
    WHERE public.workout_template_days.id = public.workout_template_exercises.template_day_id
      AND public.workout_templates.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workout_template_days
    JOIN public.workout_templates ON public.workout_templates.id = public.workout_template_days.template_id
    WHERE public.workout_template_days.id = public.workout_template_exercises.template_day_id
      AND public.workout_templates.user_id = auth.uid()
  )
);

-- 6. weight_logs completion (adds UPDATE and DELETE policies)
DROP POLICY IF EXISTS "Users can update own weight logs" ON public.weight_logs;
DROP POLICY IF EXISTS "Users can delete own weight logs" ON public.weight_logs;

CREATE POLICY "Users can update own weight logs"
ON public.weight_logs
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight logs"
ON public.weight_logs
FOR DELETE
TO public
USING (auth.uid() = user_id);

-- 7. user_settings completion (adds ALL policy for user_id)
DROP POLICY IF EXISTS "Users can manage own settings" ON public.user_settings;

CREATE POLICY "Users can manage own settings"
ON public.user_settings
FOR ALL
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 8. exercise_favorites hardening (ensures WITH CHECK)
DROP POLICY IF EXISTS "Users can manage their own exercise favorites" ON public.exercise_favorites;

CREATE POLICY "Users can manage their own exercise favorites"
ON public.exercise_favorites
FOR ALL
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 9. nutrition_logs hardening (ensures WITH CHECK)
DROP POLICY IF EXISTS "Users can insert/update own nutrition logs" ON public.nutrition_logs;
DROP POLICY IF EXISTS "Users can manage own nutrition logs" ON public.nutrition_logs;

CREATE POLICY "Users can manage own nutrition logs"
ON public.nutrition_logs
FOR ALL
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
