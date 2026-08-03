BEGIN;

-- ============================================================================
-- FITBEE DATABASE REFACTORING & CLEANUP MIGRATION (TRANSACTIONAL & STRICT)
-- File: removing unnecessary tables and organizing the database.sql
-- Architecture Specification:
--   1. Single exercise master table: public.master_exercises (untouched).
--   2. Consolidated routine architecture: public.workout_templates (template_type: system | user).
--   3. Consolidated junction table: public.workout_template_exercises (references master_exercises.id).
--   4. Session logging: public.workout_logs & public.workout_log_sets (references master_exercises.id).
--   5. Soft deletes (deleted_at) and updated_at timestamps added.
--   6. Explicit FK dropping and clean removal of legacy tables without CASCADE.
--   7. Zero RLS modifications, zero fake data generation.
-- ============================================================================

-- STEP 1: Add updated_at Timestamps to Existing Profile & Preference Tables

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'user_settings' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.user_settings ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now());
  END IF;
END $$;


-- STEP 2: Refactor public.workout_templates (Unified Routine Table)

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_templates' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.workout_templates ADD COLUMN user_id uuid NULL REFERENCES public.profiles(id) ON DELETE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_templates' AND column_name = 'template_type'
  ) THEN
    ALTER TABLE public.workout_templates ADD COLUMN template_type text NOT NULL DEFAULT 'system' CHECK (template_type IN ('system', 'user'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_templates' AND column_name = 'forked_from_template_id'
  ) THEN
    ALTER TABLE public.workout_templates ADD COLUMN forked_from_template_id uuid NULL REFERENCES public.workout_templates(id) ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_templates' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE public.workout_templates ADD COLUMN deleted_at timestamp with time zone NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_templates' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.workout_templates ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_templates' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE public.workout_templates ADD COLUMN created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now());
  END IF;
END $$;

-- Drop redundant legacy columns from workout_templates if present
ALTER TABLE public.workout_templates DROP COLUMN IF EXISTS requires_dumbbells;
ALTER TABLE public.workout_templates DROP COLUMN IF EXISTS location_type;


-- STEP 3: Migrate Data from legacy user_workouts into workout_templates

DO $$
DECLARE
  v_user_workout_count INT := 0;
  v_templates_added INT := 0;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_workouts') THEN
    SELECT COUNT(*) INTO v_user_workout_count FROM public.user_workouts;

    INSERT INTO public.workout_templates (id, user_id, name, template_type, created_at, updated_at)
    SELECT 
      uw.id,
      uw.user_id,
      uw.name,
      'user' AS template_type,
      uw.created_at,
      uw.created_at AS updated_at
    FROM public.user_workouts uw
    ON CONFLICT (id) DO UPDATE SET
      user_id = EXCLUDED.user_id,
      template_type = 'user';

    -- Verify migration count
    SELECT COUNT(*) INTO v_templates_added FROM public.workout_templates WHERE template_type = 'user';
    IF v_templates_added < v_user_workout_count THEN
      RAISE EXCEPTION 'Migration Failed: Expected % user_workouts to migrate into workout_templates, but found %', v_user_workout_count, v_templates_added;
    END IF;
  END IF;
END $$;


-- STEP 4: Refactor / Create Consolidated workout_template_exercises Table

CREATE TABLE IF NOT EXISTS public.workout_template_exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL,
  exercise_id uuid NOT NULL,
  order_index integer NOT NULL,
  target_sets integer DEFAULT 3,
  target_reps integer DEFAULT 10,
  default_weight_kg numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT workout_template_exercises_pkey PRIMARY KEY (id),
  CONSTRAINT workout_template_exercises_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  CONSTRAINT workout_template_exercises_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.master_exercises(id) ON DELETE CASCADE
);


-- STEP 5: Strict Check for Unmatched Exercises & Migrate to workout_template_exercises

DO $$
DECLARE
  v_unmatched_list TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercises') THEN
    -- Check template_exercises for unmatched exercises
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'template_exercises') THEN
      SELECT string_agg(DISTINCT e.name, ', ') INTO v_unmatched_list
      FROM public.template_exercises te
      JOIN public.exercises e ON e.id = te.exercise_id
      LEFT JOIN public.master_exercises me ON LOWER(me.exercise_name) = LOWER(e.name) OR me.id = te.exercise_id
      WHERE me.id IS NULL;

      IF v_unmatched_list IS NOT NULL THEN
        RAISE EXCEPTION 'Migration Aborted: Found unmatched exercises in template_exercises: [%]', v_unmatched_list;
      END IF;

      -- Migrate template_exercises
      INSERT INTO public.workout_template_exercises (id, template_id, exercise_id, order_index, target_sets, target_reps, default_weight_kg)
      SELECT 
        te.id,
        te.template_id,
        COALESCE(me.id, te.exercise_id) AS exercise_id,
        te.order_index,
        te.default_sets AS target_sets,
        te.default_reps AS target_reps,
        0 AS default_weight_kg
      FROM public.template_exercises te
      LEFT JOIN public.exercises e ON e.id = te.exercise_id
      LEFT JOIN public.master_exercises me ON LOWER(me.exercise_name) = LOWER(e.name) OR me.id = te.exercise_id
      ON CONFLICT (id) DO NOTHING;
    END IF;

    -- Check user_workout_exercises for unmatched exercises
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_workout_exercises') THEN
      SELECT string_agg(DISTINCT e.name, ', ') INTO v_unmatched_list
      FROM public.user_workout_exercises uwe
      JOIN public.exercises e ON e.id = uwe.exercise_id
      LEFT JOIN public.master_exercises me ON LOWER(me.exercise_name) = LOWER(e.name) OR me.id = uwe.exercise_id
      WHERE me.id IS NULL;

      IF v_unmatched_list IS NOT NULL THEN
        RAISE EXCEPTION 'Migration Aborted: Found unmatched exercises in user_workout_exercises: [%]', v_unmatched_list;
      END IF;

      -- Migrate user_workout_exercises
      INSERT INTO public.workout_template_exercises (id, template_id, exercise_id, order_index, target_sets, target_reps, default_weight_kg)
      SELECT 
        uwe.id,
        uwe.user_workout_id AS template_id,
        COALESCE(me.id, uwe.exercise_id) AS exercise_id,
        uwe.order_index,
        uwe.target_sets,
        uwe.target_reps,
        COALESCE(uwe.target_weight_kg, 0) AS default_weight_kg
      FROM public.user_workout_exercises uwe
      LEFT JOIN public.exercises e ON e.id = uwe.exercise_id
      LEFT JOIN public.master_exercises me ON LOWER(me.exercise_name) = LOWER(e.name) OR me.id = uwe.exercise_id
      ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;
END $$;


-- STEP 6: Update workout_logs & workout_log_sets Foreign Keys with Strict Validation

-- 6a. Add template_id to workout_logs if missing & copy values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_logs' AND column_name = 'template_id'
  ) THEN
    ALTER TABLE public.workout_logs ADD COLUMN template_id uuid NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_logs' AND column_name = 'user_workout_id'
  ) THEN
    UPDATE public.workout_logs 
    SET template_id = user_workout_id 
    WHERE template_id IS NULL AND user_workout_id IS NOT NULL;
  END IF;
END $$;

-- Assertion: Verify that every affected workout_logs row has a valid template_id before dropping user_workout_id
DO $$
DECLARE
  v_invalid_log_count INT := 0;
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_logs' AND column_name = 'user_workout_id'
  ) THEN
    SELECT COUNT(*) INTO v_invalid_log_count
    FROM public.workout_logs
    WHERE user_workout_id IS NOT NULL AND template_id IS NULL;

    IF v_invalid_log_count > 0 THEN
      RAISE EXCEPTION 'Migration Aborted: % workout_logs records have a user_workout_id but failed to map to template_id', v_invalid_log_count;
    END IF;
  END IF;
END $$;

-- Drop old foreign key & column on user_workout_id
ALTER TABLE public.workout_logs DROP CONSTRAINT IF EXISTS workout_logs_user_workout_id_fkey;
ALTER TABLE public.workout_logs DROP CONSTRAINT IF EXISTS workout_logs_template_id_fkey;
ALTER TABLE public.workout_logs ADD CONSTRAINT workout_logs_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.workout_templates(id) ON DELETE SET NULL;
ALTER TABLE public.workout_logs DROP COLUMN IF EXISTS user_workout_id;

-- Add updated_at timestamp to workout_logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'workout_logs' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.workout_logs ADD COLUMN updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now());
  END IF;
END $$;


-- 6b. Check & Migrate workout_log_sets.exercise_id FK to master_exercises(id)
DO $$
DECLARE
  v_unmatched_sets TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'exercises') THEN
    SELECT string_agg(DISTINCT e.name, ', ') INTO v_unmatched_sets
    FROM public.workout_log_sets wls
    JOIN public.exercises e ON e.id = wls.exercise_id
    LEFT JOIN public.master_exercises me ON LOWER(me.exercise_name) = LOWER(e.name) OR me.id = wls.exercise_id
    WHERE me.id IS NULL;

    IF v_unmatched_sets IS NOT NULL THEN
      RAISE EXCEPTION 'Migration Aborted: Found unmatched exercises in workout_log_sets: [%]', v_unmatched_sets;
    END IF;

    -- Update exercise_id references in workout_log_sets
    UPDATE public.workout_log_sets wls
    SET exercise_id = COALESCE(me.id, wls.exercise_id)
    FROM public.exercises e
    JOIN public.master_exercises me ON LOWER(me.exercise_name) = LOWER(e.name)
    WHERE wls.exercise_id = e.id;
  END IF;
END $$;

ALTER TABLE public.workout_log_sets DROP CONSTRAINT IF EXISTS workout_log_sets_exercise_id_fkey;
ALTER TABLE public.workout_log_sets ADD CONSTRAINT workout_log_sets_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES public.master_exercises(id) ON DELETE CASCADE;


-- STEP 7: Row Count Validation & Safe Drop of Legacy Tables Without CASCADE

DO $$
DECLARE
  v_template_ex_legacy_count INT := 0;
  v_user_workout_ex_legacy_count INT := 0;
  v_migrated_ex_count INT := 0;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'template_exercises') THEN
    SELECT COUNT(*) INTO v_template_ex_legacy_count FROM public.template_exercises;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_workout_exercises') THEN
    SELECT COUNT(*) INTO v_user_workout_ex_legacy_count FROM public.user_workout_exercises;
  END IF;

  SELECT COUNT(*) INTO v_migrated_ex_count FROM public.workout_template_exercises;

  IF v_migrated_ex_count < (v_template_ex_legacy_count + v_user_workout_ex_legacy_count) THEN
    RAISE EXCEPTION 'Validation Failed: Expected at least % template exercise records, but found %', (v_template_ex_legacy_count + v_user_workout_ex_legacy_count), v_migrated_ex_count;
  END IF;
END $$;

-- Drop FK constraints explicitly before dropping tables
ALTER TABLE public.user_workout_exercises DROP CONSTRAINT IF EXISTS user_workout_exercises_user_workout_id_fkey;
ALTER TABLE public.user_workout_exercises DROP CONSTRAINT IF EXISTS user_workout_exercises_exercise_id_fkey;
ALTER TABLE public.template_exercises DROP CONSTRAINT IF EXISTS template_exercises_template_id_fkey;
ALTER TABLE public.template_exercises DROP CONSTRAINT IF EXISTS template_exercises_exercise_id_fkey;

-- Drop obsolete tables safely
DROP TABLE IF EXISTS public.user_workout_exercises;
DROP TABLE IF EXISTS public.user_workouts;
DROP TABLE IF EXISTS public.template_exercises;
DROP TABLE IF EXISTS public.exercises;


-- STEP 8: Create Performance Indexes across all relational foreign keys

CREATE INDEX IF NOT EXISTS idx_workout_templates_user ON public.workout_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_templates_type ON public.workout_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_workout_templates_deleted ON public.workout_templates(deleted_at);

CREATE INDEX IF NOT EXISTS idx_workout_template_exercises_template ON public.workout_template_exercises(template_id);
CREATE INDEX IF NOT EXISTS idx_workout_template_exercises_exercise ON public.workout_template_exercises(exercise_id);

CREATE INDEX IF NOT EXISTS idx_workout_logs_user ON public.workout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_template ON public.workout_logs(template_id);

CREATE INDEX IF NOT EXISTS idx_workout_log_sets_log ON public.workout_log_sets(workout_log_id);
CREATE INDEX IF NOT EXISTS idx_workout_log_sets_exercise ON public.workout_log_sets(exercise_id);


-- STEP 9: FINAL STRICT VALIDATION ASSERTIONS

DO $$
DECLARE
  v_orphan_fk_count INT := 0;
  v_legacy_table_count INT := 0;
  v_master_table_count INT := 0;
BEGIN
  -- Assertion 1: Check no orphaned foreign keys in workout_template_exercises
  SELECT COUNT(*) INTO v_orphan_fk_count
  FROM public.workout_template_exercises wte
  LEFT JOIN public.master_exercises me ON me.id = wte.exercise_id
  WHERE me.id IS NULL;

  IF v_orphan_fk_count > 0 THEN
    RAISE EXCEPTION 'Final Validation Failed: Found % orphan exercise references in workout_template_exercises', v_orphan_fk_count;
  END IF;

  -- Assertion 2: Check no orphaned foreign keys in workout_log_sets
  SELECT COUNT(*) INTO v_orphan_fk_count
  FROM public.workout_log_sets wls
  LEFT JOIN public.master_exercises me ON me.id = wls.exercise_id
  WHERE me.id IS NULL;

  IF v_orphan_fk_count > 0 THEN
    RAISE EXCEPTION 'Final Validation Failed: Found % orphan exercise references in workout_log_sets', v_orphan_fk_count;
  END IF;

  -- Assertion 3: Check no orphan template references in workout_logs
  SELECT COUNT(*) INTO v_orphan_fk_count
  FROM public.workout_logs wl
  LEFT JOIN public.workout_templates wt ON wt.id = wl.template_id
  WHERE wl.template_id IS NOT NULL AND wt.id IS NULL;

  IF v_orphan_fk_count > 0 THEN
    RAISE EXCEPTION 'Final Validation Failed: Found % orphan template references in workout_logs', v_orphan_fk_count;
  END IF;

  -- Assertion 4: Verify legacy exercises table no longer exists
  SELECT COUNT(*) INTO v_legacy_table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'exercises';

  IF v_legacy_table_count > 0 THEN
    RAISE EXCEPTION 'Final Validation Failed: Legacy table "exercises" still exists!';
  END IF;

  -- Assertion 5: Verify master_exercises exists as single source of truth
  SELECT COUNT(*) INTO v_master_table_count
  FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'master_exercises';

  IF v_master_table_count <> 1 THEN
    RAISE EXCEPTION 'Final Validation Failed: "master_exercises" table missing or unexpected count: %', v_master_table_count;
  END IF;

  RAISE NOTICE 'SUCCESS: All migration assertions and final validations passed successfully!';
END $$;

COMMIT;
