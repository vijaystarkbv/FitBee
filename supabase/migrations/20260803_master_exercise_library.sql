-- FitBee Master Exercise Library Migration
-- Generated from FitBee_Exercise_Library.md (397 entries with accurate muscle groups & difficulty levels)

-- 1. Populate / Update Master Exercise Library (397 rows)
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0001', 'Neck Flexion', 'Warm-up & Mobility', 'Neck', 'Beginner', 'Home', 'None', ARRAY['Neck Mobility']::text[], ARRAY[]::text[], 'ex0001_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0002', 'Neck Extension', 'Warm-up & Mobility', 'Neck', 'Beginner', 'Home', 'None', ARRAY['Neck Mobility']::text[], ARRAY[]::text[], 'ex0002_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0003', 'Neck Side Stretch', 'Warm-up & Mobility', 'Neck', 'Beginner', 'Home', 'None', ARRAY['Neck']::text[], ARRAY[]::text[], 'ex0003_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0004', 'Neck Rotation', 'Warm-up & Mobility', 'Neck', 'Beginner', 'Home', 'None', ARRAY['Neck Mobility']::text[], ARRAY[]::text[], 'ex0004_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0005', 'Chin Tuck', 'Warm-up & Mobility', 'Neck', 'Beginner', 'Home', 'None', ARRAY['Neck Posture']::text[], ARRAY[]::text[], 'ex0005_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0006', 'Shoulder Rolls', 'Warm-up & Mobility', 'Shoulders', 'Beginner', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY[]::text[], 'ex0006_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0007', 'Arm Circles', 'Warm-up & Mobility', 'Shoulders', 'Beginner', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY[]::text[], 'ex0007_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0008', 'Reverse Arm Circles', 'Warm-up & Mobility', 'Rear Delts', 'Beginner', 'Home', 'None', ARRAY['Rear Shoulders']::text[], ARRAY[]::text[], 'ex0008_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0009', 'Cross Body Shoulder Stretch', 'Warm-up & Mobility', 'Rear Delts', 'Beginner', 'Home', 'None', ARRAY['Rear Shoulders']::text[], ARRAY[]::text[], 'ex0009_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0010', 'Wall Angels', 'Warm-up & Mobility', 'Shoulders', 'Intermediate', 'Home', 'Wall', ARRAY['Shoulders']::text[], ARRAY['Upper Back']::text[], 'ex0010_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0011', 'Resistance Band Shoulder Opener', 'Warm-up & Mobility', 'Shoulders', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Shoulders']::text[], ARRAY['Chest']::text[], 'ex0011_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0012', 'Doorway Chest Stretch', 'Warm-up & Mobility', 'Chest', 'Beginner', 'Home', 'Doorway', ARRAY['Chest']::text[], ARRAY[]::text[], 'ex0012_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0013', 'Standing Chest Opener', 'Warm-up & Mobility', 'Chest', 'Beginner', 'Home', 'None', ARRAY['Chest']::text[], ARRAY[]::text[], 'ex0013_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0014', 'Prayer Stretch', 'Warm-up & Mobility', 'Chest', 'Beginner', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Wrists']::text[], 'ex0014_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0015', 'Band Chest Stretch', 'Warm-up & Mobility', 'Chest', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Chest']::text[], ARRAY[]::text[], 'ex0015_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0016', 'Cat-Cow Stretch', 'Warm-up & Mobility', 'Upper Back & Traps', 'Beginner', 'Home', 'None', ARRAY['Spine']::text[], ARRAY['Back']::text[], 'ex0016_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0017', 'Child''s Pose', 'Warm-up & Mobility', 'Back', 'Beginner', 'Home', 'None', ARRAY['Back']::text[], ARRAY[]::text[], 'ex0017_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0018', 'Thread the Needle', 'Warm-up & Mobility', 'Upper Back & Traps', 'Beginner', 'Home', 'None', ARRAY['Upper Back']::text[], ARRAY[]::text[], 'ex0018_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0019', 'Cobra Stretch', 'Warm-up & Mobility', 'Lower Back', 'Intermediate', 'Home', 'None', ARRAY['Lower Back']::text[], ARRAY['Abs']::text[], 'ex0019_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0020', 'Seated Spinal Twist', 'Warm-up & Mobility', 'Upper Back & Traps', 'Intermediate', 'Home', 'None', ARRAY['Spine']::text[], ARRAY[]::text[], 'ex0020_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0021', 'Standing Side Stretch', 'Warm-up & Mobility', 'Lats & Upper Back', 'Intermediate', 'Home', 'None', ARRAY['Lats']::text[], ARRAY['Obliques']::text[], 'ex0021_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0022', 'Hip Circles', 'Warm-up & Mobility', 'Hips & Adductors', 'Beginner', 'Home', 'None', ARRAY['Hip Mobility']::text[], ARRAY[]::text[], 'ex0022_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0023', 'Hip Opener', 'Warm-up & Mobility', 'Hips & Adductors', 'Beginner', 'Home', 'None', ARRAY['Hips']::text[], ARRAY[]::text[], 'ex0023_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0024', 'World''s Greatest Stretch', 'Warm-up & Mobility', 'Warm-up & Mobility', 'Intermediate', 'Home', 'None', ARRAY['Full Lower Body']::text[], ARRAY[]::text[], 'ex0024_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0025', 'Butterfly Stretch', 'Warm-up & Mobility', 'Hips & Adductors', 'Intermediate', 'Home', 'None', ARRAY['Inner Thigh']::text[], ARRAY[]::text[], 'ex0025_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0026', 'Figure Four Stretch', 'Warm-up & Mobility', 'Glutes', 'Intermediate', 'Home', 'None', ARRAY['Glutes']::text[], ARRAY[]::text[], 'ex0026_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0027', 'Standing Quad Stretch', 'Warm-up & Mobility', 'Quads', 'Beginner', 'Home', 'None', ARRAY['Quads']::text[], ARRAY[]::text[], 'ex0027_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0028', 'Standing Hamstring Stretch', 'Warm-up & Mobility', 'Hamstrings', 'Beginner', 'Home', 'None', ARRAY['Hamstrings']::text[], ARRAY[]::text[], 'ex0028_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0029', 'Seated Hamstring Stretch', 'Warm-up & Mobility', 'Hamstrings', 'Beginner', 'Home', 'None', ARRAY['Hamstrings']::text[], ARRAY[]::text[], 'ex0029_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0030', 'Side Lunge Stretch', 'Warm-up & Mobility', 'Hips & Adductors', 'Intermediate', 'Home', 'None', ARRAY['Adductors']::text[], ARRAY[]::text[], 'ex0030_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0031', 'Deep Squat Hold', 'Warm-up & Mobility', 'Quads', 'Intermediate', 'Home', 'None', ARRAY['Hips']::text[], ARRAY['Ankles']::text[], 'ex0031_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0032', 'Kneeling Hip Flexor Stretch', 'Warm-up & Mobility', 'Hips & Adductors', 'Intermediate', 'Home', 'None', ARRAY['Hip Flexors']::text[], ARRAY[]::text[], 'ex0032_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0033', 'Ankle Circles', 'Warm-up & Mobility', 'Calves & Ankles', 'Beginner', 'Home', 'None', ARRAY['Ankles']::text[], ARRAY[]::text[], 'ex0033_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0034', 'Heel-to-Toe Rock', 'Warm-up & Mobility', 'Calves & Ankles', 'Beginner', 'Home', 'None', ARRAY['Ankles']::text[], ARRAY[]::text[], 'ex0034_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0035', 'Wall Calf Stretch', 'Warm-up & Mobility', 'Calves & Ankles', 'Beginner', 'Home', 'Wall', ARRAY['Calves']::text[], ARRAY[]::text[], 'ex0035_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0036', 'Toe Raises', 'Warm-up & Mobility', 'Calves & Ankles', 'Beginner', 'Home', 'None', ARRAY['Tibialis']::text[], ARRAY[]::text[], 'ex0036_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0037', 'Dynamic Calf Stretch', 'Warm-up & Mobility', 'Calves & Ankles', 'Intermediate', 'Home', 'None', ARRAY['Calves']::text[], ARRAY[]::text[], 'ex0037_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0038', 'Wrist Circles', 'Warm-up & Mobility', 'Forearms', 'Beginner', 'Home', 'None', ARRAY['Wrists']::text[], ARRAY[]::text[], 'ex0038_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0039', 'Wrist Flexor Stretch', 'Warm-up & Mobility', 'Forearms', 'Beginner', 'Home', 'None', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0039_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0040', 'Wrist Extensor Stretch', 'Warm-up & Mobility', 'Forearms', 'Beginner', 'Home', 'None', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0040_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0041', 'Palm Pulses', 'Warm-up & Mobility', 'Forearms', 'Intermediate', 'Home', 'None', ARRAY['Wrists']::text[], ARRAY[]::text[], 'ex0041_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0042', 'Fingertip Stretch', 'Warm-up & Mobility', 'Warm-up & Mobility', 'Intermediate', 'Home', 'None', ARRAY['Fingers']::text[], ARRAY['Forearms']::text[], 'ex0042_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0043', 'Jumping Jacks', 'Warm-up & Mobility', 'Warm-up & Mobility', 'Beginner', 'Home', 'None', ARRAY['Full Body Warm-up']::text[], ARRAY[]::text[], 'ex0043_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0044', 'High Knees', 'Warm-up & Mobility', 'Warm-up & Mobility', 'Beginner', 'Home', 'None', ARRAY['Legs']::text[], ARRAY['Cardio']::text[], 'ex0044_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0045', 'Butt Kicks', 'Warm-up & Mobility', 'Hamstrings', 'Beginner', 'Home', 'None', ARRAY['Hamstrings']::text[], ARRAY[]::text[], 'ex0045_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0046', 'March in Place', 'Warm-up & Mobility', 'Warm-up & Mobility', 'Beginner', 'Home', 'None', ARRAY['Full Body']::text[], ARRAY[]::text[], 'ex0046_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0047', 'Arm Swings', 'Warm-up & Mobility', 'Shoulders', 'Beginner', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY['Chest']::text[], 'ex0047_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0048', 'Leg Swings', 'Warm-up & Mobility', 'Hips & Adductors', 'Intermediate', 'Home', 'None', ARRAY['Hips']::text[], ARRAY['Hamstrings']::text[], 'ex0048_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0049', 'Inchworm Walkout', 'Warm-up & Mobility', 'Warm-up & Mobility', 'Intermediate', 'Home', 'None', ARRAY['Full Body']::text[], ARRAY[]::text[], 'ex0049_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0050', 'World''s Greatest Stretch Flow', 'Warm-up & Mobility', 'Warm-up & Mobility', 'Intermediate', 'Home', 'None', ARRAY['Full Body']::text[], ARRAY[]::text[], 'ex0050_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0051', 'Bear Crawl', 'Warm-up & Mobility', 'Warm-up & Mobility', 'Advanced', 'Home', 'None', ARRAY['Full Body']::text[], ARRAY[]::text[], 'ex0051_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0052', 'Crab Walk', 'Warm-up & Mobility', 'Warm-up & Mobility', 'Advanced', 'Home', 'None', ARRAY['Full Body']::text[], ARRAY[]::text[], 'ex0052_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0053', 'Wall Push-up', 'Chest', 'Chest', 'Beginner', 'Home', 'Wall', ARRAY['Chest']::text[], ARRAY['Front Shoulders']::text[], 'ex0053_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0054', 'Incline Push-up (Chair/Bench)', 'Chest', 'Chest', 'Beginner', 'Home', 'Chair', ARRAY['Chest']::text[], ARRAY['Triceps']::text[], 'ex0054_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0055', 'Knee Push-up', 'Chest', 'Chest', 'Beginner', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Triceps']::text[], 'ex0055_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0056', 'Standard Push-up', 'Chest', 'Chest', 'Intermediate', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Triceps', 'Core']::text[], 'ex0056_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0057', 'Wide Push-up', 'Chest', 'Chest', 'Intermediate', 'Home', 'None', ARRAY['Chest']::text[], ARRAY[]::text[], 'ex0057_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0058', 'Close-Grip Push-up', 'Chest', 'Triceps', 'Intermediate', 'Home', 'None', ARRAY['Triceps']::text[], ARRAY['Chest']::text[], 'ex0058_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0059', 'Diamond Push-up', 'Chest', 'Triceps', 'Intermediate', 'Home', 'None', ARRAY['Triceps']::text[], ARRAY['Inner Chest']::text[], 'ex0059_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0060', 'Staggered Push-up', 'Chest', 'Chest', 'Intermediate', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Core', 'Triceps']::text[], 'ex0060_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0061', 'Archer Push-up', 'Chest', 'Chest', 'Advanced', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Shoulders', 'Core']::text[], 'ex0061_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0062', 'Decline Push-up (Feet Elevated)', 'Chest', 'Upper Chest', 'Advanced', 'Home', 'None', ARRAY['Upper Chest']::text[], ARRAY['Shoulders']::text[], 'ex0062_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0063', 'Pike Push-up', 'Chest', 'Upper Chest', 'Advanced', 'Home', 'None', ARRAY['Upper Chest']::text[], ARRAY['Shoulders']::text[], 'ex0063_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0064', 'Hindu Push-up', 'Chest', 'Chest', 'Advanced', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Shoulders', 'Triceps']::text[], 'ex0064_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0065', 'Pseudo Planche Push-up', 'Chest', 'Chest', 'Advanced', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Front Shoulders', 'Triceps']::text[], 'ex0065_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0066', 'Explosive Push-up', 'Chest', 'Chest', 'Advanced', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Triceps', 'Power']::text[], 'ex0066_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0067', 'Clap Push-up', 'Chest', 'Chest', 'Advanced', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Triceps', 'Explosive Power']::text[], 'ex0067_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0068', 'One-Arm Push-up', 'Chest', 'Chest', 'Advanced', 'Home', 'None', ARRAY['Chest']::text[], ARRAY['Core', 'Triceps']::text[], 'ex0068_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0069', 'Floor Dumbbell Press', 'Chest', 'Chest', 'Beginner', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Chest']::text[], ARRAY['Triceps']::text[], 'ex0069_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0070', 'Neutral Grip Floor Press', 'Chest', 'Chest', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Chest']::text[], ARRAY['Triceps']::text[], 'ex0070_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0071', 'Alternating Floor Press', 'Chest', 'Chest', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Chest']::text[], ARRAY['Core']::text[], 'ex0071_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0072', 'Single Arm Floor Press', 'Chest', 'Chest', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Chest']::text[], ARRAY['Core']::text[], 'ex0072_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0073', 'Dumbbell Squeeze Press', 'Chest', 'Chest', 'Intermediate', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Inner Chest']::text[], ARRAY[]::text[], 'ex0073_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0074', 'Weighted Push-up (Weight Vest/Backpack)', 'Chest', 'Chest', 'Advanced', 'Home Equipment', 'Weight Vest / Backpack', ARRAY['Chest']::text[], ARRAY['Triceps']::text[], 'ex0074_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0075', 'Band Chest Press', 'Chest', 'Chest', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Chest']::text[], ARRAY['Triceps']::text[], 'ex0075_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0076', 'Standing Band Chest Fly', 'Chest', 'Chest', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Chest']::text[], ARRAY[]::text[], 'ex0076_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0077', 'Low-to-High Band Fly', 'Chest', 'Upper Chest', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Upper Chest']::text[], ARRAY[]::text[], 'ex0077_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0078', 'High-to-Low Band Fly', 'Chest', 'Lower Chest', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Lower Chest']::text[], ARRAY[]::text[], 'ex0078_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0079', 'Single Arm Band Press', 'Chest', 'Chest', 'Advanced', 'Home Equipment', 'Resistance Band', ARRAY['Chest']::text[], ARRAY['Core']::text[], 'ex0079_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0080', 'Machine Chest Press', 'Chest', 'Chest', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Chest']::text[], ARRAY['Triceps']::text[], 'ex0080_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0081', 'Smith Machine Bench Press', 'Chest', 'Chest', 'Beginner', 'Gym', 'Smith Machine', ARRAY['Chest']::text[], ARRAY['Triceps']::text[], 'ex0081_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0082', 'Flat Barbell Bench Press', 'Chest', 'Chest', 'Intermediate', 'Gym', 'Barbell', ARRAY['Chest']::text[], ARRAY['Triceps', 'Front Shoulders']::text[], 'ex0082_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0083', 'Incline Barbell Bench Press', 'Chest', 'Upper Chest', 'Intermediate', 'Gym', 'Barbell', ARRAY['Upper Chest']::text[], ARRAY['Shoulders']::text[], 'ex0083_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0084', 'Decline Bench Press', 'Chest', 'Lower Chest', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Lower Chest']::text[], ARRAY[]::text[], 'ex0084_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0085', 'Flat Dumbbell Bench Press', 'Chest', 'Chest', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Chest']::text[], ARRAY['Stabilizers']::text[], 'ex0085_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0086', 'Incline Dumbbell Bench Press', 'Chest', 'Upper Chest', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Upper Chest']::text[], ARRAY[]::text[], 'ex0086_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0087', 'Decline Dumbbell Bench Press', 'Chest', 'Lower Chest', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Lower Chest']::text[], ARRAY[]::text[], 'ex0087_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0088', 'Pec Deck Machine', 'Chest', 'Chest', 'Intermediate', 'Gym', 'Gym Machine', ARRAY['Chest Isolation']::text[], ARRAY[]::text[], 'ex0088_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0089', 'Cable Chest Fly', 'Chest', 'Chest', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Chest Isolation']::text[], ARRAY[]::text[], 'ex0089_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0090', 'Incline Cable Fly', 'Chest', 'Upper Chest', 'Advanced', 'Gym', 'Cable Machine', ARRAY['Upper Chest']::text[], ARRAY[]::text[], 'ex0090_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0091', 'Decline Cable Fly', 'Chest', 'Lower Chest', 'Advanced', 'Gym', 'Cable Machine', ARRAY['Lower Chest']::text[], ARRAY[]::text[], 'ex0091_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0092', 'Single Arm Cable Press', 'Chest', 'Chest', 'Advanced', 'Gym', 'Cable Machine', ARRAY['Chest']::text[], ARRAY['Core']::text[], 'ex0092_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0093', 'Ring Push-up (Gymnastics Rings)', 'Chest', 'Chest', 'Advanced', 'Gym', 'Gymnastics Rings', ARRAY['Chest']::text[], ARRAY['Core', 'Stabilizers']::text[], 'ex0093_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0094', 'Superman Hold', 'Back', 'Lower Back', 'Beginner', 'Home', 'None', ARRAY['Lower Back']::text[], ARRAY[]::text[], 'ex0094_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0095', 'Superman Raise', 'Back', 'Lower Back', 'Beginner', 'Home', 'None', ARRAY['Lower Back']::text[], ARRAY[]::text[], 'ex0095_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0096', 'Alternating Superman', 'Back', 'Lower Back', 'Beginner', 'Home', 'None', ARRAY['Lower Back']::text[], ARRAY[]::text[], 'ex0096_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0097', 'Reverse Snow Angel', 'Back', 'Upper Back & Traps', 'Intermediate', 'Home', 'None', ARRAY['Upper Back']::text[], ARRAY['Rear Shoulders']::text[], 'ex0097_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0098', 'Cobra Hold', 'Back', 'Lower Back', 'Intermediate', 'Home', 'None', ARRAY['Lower Back']::text[], ARRAY['Upper Back']::text[], 'ex0098_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0099', 'Reverse Plank', 'Back', 'Back', 'Intermediate', 'Home', 'None', ARRAY['Back']::text[], ARRAY['Core', 'Glutes']::text[], 'ex0099_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0100', 'Table Bridge', 'Back', 'Back', 'Intermediate', 'Home', 'None', ARRAY['Back']::text[], ARRAY['Glutes']::text[], 'ex0100_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0101', 'Bird Dog', 'Back', 'Lower Back', 'Intermediate', 'Home', 'None', ARRAY['Lower Back']::text[], ARRAY['Core']::text[], 'ex0101_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0102', 'Prone Y Raise', 'Back', 'Upper Back & Traps', 'Advanced', 'Home', 'None', ARRAY['Upper Back']::text[], ARRAY['Rear Shoulders']::text[], 'ex0102_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0103', 'Prone T Raise', 'Back', 'Upper Back & Traps', 'Advanced', 'Home', 'None', ARRAY['Upper Back']::text[], ARRAY['Rear Shoulders']::text[], 'ex0103_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0104', 'Prone W Raise', 'Back', 'Upper Back & Traps', 'Advanced', 'Home', 'None', ARRAY['Upper Back']::text[], ARRAY['Rear Shoulders']::text[], 'ex0104_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0105', 'Swimmer', 'Back', 'Back', 'Advanced', 'Home', 'None', ARRAY['Full Back']::text[], ARRAY['Rear Shoulders']::text[], 'ex0105_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0106', 'Australian Row', 'Back', 'Lats & Upper Back', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Upper Back']::text[], ARRAY['Biceps']::text[], 'ex0106_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0107', 'Assisted Pull-up', 'Back', 'Lats & Upper Back', 'Beginner', 'Home Equipment', 'Pull-up Bar', ARRAY['Lats']::text[], ARRAY['Biceps']::text[], 'ex0107_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0108', 'Chin-up', 'Back', 'Lats & Upper Back', 'Intermediate', 'Home Equipment', 'Pull-up Bar', ARRAY['Lats']::text[], ARRAY['Biceps']::text[], 'ex0108_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0109', 'Pull-up', 'Back', 'Lats & Upper Back', 'Intermediate', 'Home Equipment', 'Pull-up Bar', ARRAY['Lats']::text[], ARRAY['Upper Back', 'Biceps']::text[], 'ex0109_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0110', 'Neutral Grip Pull-up', 'Back', 'Lats & Upper Back', 'Intermediate', 'Home Equipment', 'Pull-up Bar', ARRAY['Lats']::text[], ARRAY['Biceps']::text[], 'ex0110_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0111', 'Wide Grip Pull-up', 'Back', 'Lats & Upper Back', 'Advanced', 'Home Equipment', 'Pull-up Bar', ARRAY['Upper Lats']::text[], ARRAY['Upper Back']::text[], 'ex0111_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0112', 'Archer Pull-up', 'Back', 'Lats & Upper Back', 'Advanced', 'Home Equipment', 'Pull-up Bar', ARRAY['Lats']::text[], ARRAY['Biceps']::text[], 'ex0112_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0113', 'Commando Pull-up', 'Back', 'Lats & Upper Back', 'Advanced', 'Home Equipment', 'Pull-up Bar', ARRAY['Back']::text[], ARRAY['Biceps', 'Core']::text[], 'ex0113_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0114', 'Typewriter Pull-up', 'Back', 'Lats & Upper Back', 'Advanced', 'Home Equipment', 'Pull-up Bar', ARRAY['Lats']::text[], ARRAY['Upper Back']::text[], 'ex0114_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0115', 'Muscle-up', 'Back', 'Back', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Back']::text[], ARRAY['Chest', 'Arms']::text[], 'ex0115_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0116', 'Band Row', 'Back', 'Lats & Upper Back', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Mid Back']::text[], ARRAY['Lats']::text[], 'ex0116_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0117', 'Seated Band Row', 'Back', 'Lats & Upper Back', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Mid Back']::text[], ARRAY[]::text[], 'ex0117_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0118', 'Straight Arm Pulldown', 'Back', 'Lats & Upper Back', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Lats']::text[], ARRAY[]::text[], 'ex0118_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0119', 'Face Pull', 'Back', 'Upper Back & Traps', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Upper Back']::text[], ARRAY['Rear Shoulders']::text[], 'ex0119_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0120', 'Band Lat Pulldown', 'Back', 'Lats & Upper Back', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Lats']::text[], ARRAY[]::text[], 'ex0120_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0121', 'Single Arm Band Row', 'Back', 'Lats & Upper Back', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Lats']::text[], ARRAY['Core']::text[], 'ex0121_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0122', 'High Row', 'Back', 'Lats & Upper Back', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Upper Back']::text[], ARRAY[]::text[], 'ex0122_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0123', 'Low Row', 'Back', 'Lats & Upper Back', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Mid Back']::text[], ARRAY[]::text[], 'ex0123_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0124', 'Dumbbell Row', 'Back', 'Lats & Upper Back', 'Beginner', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Lats']::text[], ARRAY['Mid Back']::text[], 'ex0124_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0125', 'Chest Supported Row', 'Back', 'Lats & Upper Back', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Mid Back']::text[], ARRAY[]::text[], 'ex0125_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0126', 'Reverse Fly', 'Back', 'Upper Back & Traps', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Upper Back']::text[], ARRAY['Rear Shoulders']::text[], 'ex0126_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0127', 'Renegade Row', 'Back', 'Lats & Upper Back', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Back']::text[], ARRAY['Core']::text[], 'ex0127_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0128', 'Single Arm Row', 'Back', 'Lats & Upper Back', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Lats']::text[], ARRAY[]::text[], 'ex0128_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0129', 'Bent-over Dumbbell Row', 'Back', 'Lats & Upper Back', 'Advanced', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Lats']::text[], ARRAY['Mid Back']::text[], 'ex0129_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0130', 'Assisted Pull-up Machine', 'Back', 'Lats & Upper Back', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Lats']::text[], ARRAY['Biceps']::text[], 'ex0130_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0131', 'Seated Row Machine', 'Back', 'Lats & Upper Back', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Mid Back']::text[], ARRAY[]::text[], 'ex0131_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0132', 'Lat Pulldown', 'Back', 'Lats & Upper Back', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Lats']::text[], ARRAY['Biceps']::text[], 'ex0132_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0133', 'Close Grip Lat Pulldown', 'Back', 'Lats & Upper Back', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Lats']::text[], ARRAY[]::text[], 'ex0133_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0134', 'Wide Grip Lat Pulldown', 'Back', 'Lats & Upper Back', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Upper Lats']::text[], ARRAY[]::text[], 'ex0134_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0135', 'Cable Seated Row', 'Back', 'Lats & Upper Back', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Mid Back']::text[], ARRAY[]::text[], 'ex0135_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0136', 'Straight Arm Cable Pulldown', 'Back', 'Lats & Upper Back', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Lats']::text[], ARRAY[]::text[], 'ex0136_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0137', 'Cable Face Pull', 'Back', 'Upper Back & Traps', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Upper Back']::text[], ARRAY['Rear Shoulders']::text[], 'ex0137_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0138', 'T-Bar Row', 'Back', 'Lats & Upper Back', 'Advanced', 'Gym', 'T-Bar Row Station', ARRAY['Mid Back']::text[], ARRAY['Lats']::text[], 'ex0138_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0139', 'Barbell Bent-over Row', 'Back', 'Lats & Upper Back', 'Advanced', 'Gym', 'Barbell', ARRAY['Lats']::text[], ARRAY['Mid Back']::text[], 'ex0139_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0140', 'Pendlay Row', 'Back', 'Lats & Upper Back', 'Advanced', 'Gym', 'Barbell', ARRAY['Upper Back']::text[], ARRAY['Lats']::text[], 'ex0140_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0141', 'Rack Pull', 'Back', 'Back', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Entire Posterior Chain']::text[], ARRAY[]::text[], 'ex0141_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0142', 'Deadlift', 'Back', 'Back', 'Advanced', 'Gym', 'Barbell', ARRAY['Full Back']::text[], ARRAY['Glutes', 'Hamstrings']::text[], 'ex0142_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0143', 'Meadows Row', 'Back', 'Lats & Upper Back', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Lats']::text[], ARRAY['Upper Back']::text[], 'ex0143_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0144', 'Wall Push-up', 'Shoulders', 'Front Delts', 'Beginner', 'Home', 'Wall', ARRAY['Front Shoulders']::text[], ARRAY['Chest']::text[], 'ex0144_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0145', 'Incline Pike Push-up', 'Shoulders', 'Front Delts', 'Beginner', 'Home', 'None', ARRAY['Front Shoulders']::text[], ARRAY[]::text[], 'ex0145_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0146', 'Pike Push-up', 'Shoulders', 'Front Delts', 'Intermediate', 'Home', 'None', ARRAY['Front Shoulders']::text[], ARRAY['Upper Chest']::text[], 'ex0146_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0147', 'Elevated Pike Push-up', 'Shoulders', 'Front Delts', 'Advanced', 'Home', 'None', ARRAY['Front Shoulders']::text[], ARRAY[]::text[], 'ex0147_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0148', 'Hindu Push-up', 'Shoulders', 'Front Delts', 'Advanced', 'Home', 'None', ARRAY['Front Shoulders']::text[], ARRAY['Chest', 'Triceps']::text[], 'ex0148_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0149', 'Wall Handstand Hold', 'Shoulders', 'Shoulders', 'Beginner', 'Home', 'Wall', ARRAY['Shoulders']::text[], ARRAY['Core']::text[], 'ex0149_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0150', 'Wall Walk', 'Shoulders', 'Shoulders', 'Intermediate', 'Home', 'Wall', ARRAY['Shoulders']::text[], ARRAY['Core']::text[], 'ex0150_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0151', 'Handstand Shoulder Tap', 'Shoulders', 'Shoulders', 'Advanced', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY['Core']::text[], 'ex0151_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0152', 'Handstand Push-up (Wall Assisted)', 'Shoulders', 'Shoulders', 'Advanced', 'Home', 'Wall', ARRAY['Shoulders']::text[], ARRAY['Triceps']::text[], 'ex0152_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0153', 'Freestanding Handstand Push-up', 'Shoulders', 'Shoulders', 'Advanced', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY['Triceps', 'Core']::text[], 'ex0153_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0154', 'Plank Shoulder Tap', 'Shoulders', 'Shoulders', 'Beginner', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY['Core']::text[], 'ex0154_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0155', 'Bear Crawl Hold', 'Shoulders', 'Shoulders', 'Beginner', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY['Core']::text[], 'ex0155_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0156', 'Bear Crawl', 'Shoulders', 'Shoulders', 'Intermediate', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY['Core']::text[], 'ex0156_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0157', 'Crab Walk', 'Shoulders', 'Shoulders', 'Intermediate', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY['Core']::text[], 'ex0157_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0158', 'Arm Circles', 'Shoulders', 'Shoulders', 'Beginner', 'Home', 'None', ARRAY['Shoulders']::text[], ARRAY[]::text[], 'ex0158_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0159', 'Reverse Arm Circles', 'Shoulders', 'Rear Delts', 'Beginner', 'Home', 'None', ARRAY['Rear Shoulders']::text[], ARRAY[]::text[], 'ex0159_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0160', 'Wall Angels', 'Shoulders', 'Rear Delts', 'Beginner', 'Home', 'Wall', ARRAY['Rear Shoulders']::text[], ARRAY['Upper Back']::text[], 'ex0160_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0161', 'Scapular Push-up', 'Shoulders', 'Front Delts', 'Intermediate', 'Home', 'None', ARRAY['Front Shoulders']::text[], ARRAY['Serratus']::text[], 'ex0161_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0162', 'Shoulder CARs', 'Shoulders', 'Shoulders', 'Intermediate', 'Home', 'None', ARRAY['Full Shoulder Mobility']::text[], ARRAY[]::text[], 'ex0162_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0163', 'Dumbbell Shoulder Press', 'Shoulders', 'Front Delts', 'Beginner', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Front Shoulders']::text[], ARRAY['Triceps']::text[], 'ex0163_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0164', 'Arnold Press', 'Shoulders', 'Shoulders', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Full Shoulders']::text[], ARRAY[]::text[], 'ex0164_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0165', 'Seated Dumbbell Press', 'Shoulders', 'Front Delts', 'Intermediate', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Front Shoulders']::text[], ARRAY[]::text[], 'ex0165_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0166', 'Standing Dumbbell Press', 'Shoulders', 'Front Delts', 'Intermediate', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Front Shoulders']::text[], ARRAY['Core']::text[], 'ex0166_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0167', 'Front Raise', 'Shoulders', 'Front Delts', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Front Shoulders']::text[], ARRAY[]::text[], 'ex0167_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0168', 'Lateral Raise', 'Shoulders', 'Shoulders', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Side Shoulders']::text[], ARRAY[]::text[], 'ex0168_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0169', 'Bent-over Reverse Fly', 'Shoulders', 'Rear Delts', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Rear Shoulders']::text[], ARRAY[]::text[], 'ex0169_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0170', 'Upright Row', 'Shoulders', 'Shoulders', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Side Shoulders']::text[], ARRAY['Traps']::text[], 'ex0170_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0171', 'Cuban Press', 'Shoulders', 'Rotator Cuff', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Rotator Cuff']::text[], ARRAY['Shoulders']::text[], 'ex0171_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0172', 'Leaning Lateral Raise', 'Shoulders', 'Shoulders', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Side Shoulders']::text[], ARRAY[]::text[], 'ex0172_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0173', 'Band Shoulder Press', 'Shoulders', 'Front Delts', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Front Shoulders']::text[], ARRAY[]::text[], 'ex0173_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0174', 'Band Front Raise', 'Shoulders', 'Front Delts', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Front Shoulders']::text[], ARRAY[]::text[], 'ex0174_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0175', 'Band Lateral Raise', 'Shoulders', 'Shoulders', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Side Shoulders']::text[], ARRAY[]::text[], 'ex0175_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0176', 'Band Reverse Fly', 'Shoulders', 'Rear Delts', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Rear Shoulders']::text[], ARRAY[]::text[], 'ex0176_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0177', 'Band Face Pull', 'Shoulders', 'Rear Delts', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Rear Shoulders']::text[], ARRAY['Upper Back']::text[], 'ex0177_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0178', 'Band Upright Row', 'Shoulders', 'Shoulders', 'Advanced', 'Home Equipment', 'Resistance Band', ARRAY['Side Shoulders']::text[], ARRAY[]::text[], 'ex0178_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0179', 'Shoulder Press Machine', 'Shoulders', 'Front Delts', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Front Shoulders']::text[], ARRAY['Triceps']::text[], 'ex0179_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0180', 'Smith Machine Shoulder Press', 'Shoulders', 'Front Delts', 'Beginner', 'Gym', 'Smith Machine', ARRAY['Front Shoulders']::text[], ARRAY[]::text[], 'ex0180_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0181', 'Machine Lateral Raise', 'Shoulders', 'Shoulders', 'Intermediate', 'Gym', 'Gym Machine', ARRAY['Side Shoulders']::text[], ARRAY[]::text[], 'ex0181_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0182', 'Cable Front Raise', 'Shoulders', 'Front Delts', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Front Shoulders']::text[], ARRAY[]::text[], 'ex0182_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0183', 'Cable Lateral Raise', 'Shoulders', 'Shoulders', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Side Shoulders']::text[], ARRAY[]::text[], 'ex0183_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0184', 'Cable Reverse Fly', 'Shoulders', 'Rear Delts', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Rear Shoulders']::text[], ARRAY[]::text[], 'ex0184_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0185', 'Cable Face Pull', 'Shoulders', 'Rear Delts', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Rear Shoulders']::text[], ARRAY['Upper Back']::text[], 'ex0185_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0186', 'Behind-the-Neck Press', 'Shoulders', 'Front Delts', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Front Shoulders']::text[], ARRAY[]::text[], 'ex0186_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0187', 'Single Arm Cable Press', 'Shoulders', 'Front Delts', 'Advanced', 'Gym', 'Cable Machine', ARRAY['Front Shoulders']::text[], ARRAY['Core']::text[], 'ex0187_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0188', 'Cable Y Raise', 'Shoulders', 'Rear Delts', 'Advanced', 'Gym', 'Cable Machine', ARRAY['Rear Shoulders']::text[], ARRAY['Rotator Cuff']::text[], 'ex0188_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0189', 'Self Resistance Curl', 'Arms', 'Biceps', 'Beginner', 'Home', 'None', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0189_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0190', 'Isometric Bicep Hold', 'Arms', 'Biceps', 'Beginner', 'Home', 'None', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0190_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0191', 'Towel Curl (Leg Resistance)', 'Arms', 'Biceps', 'Intermediate', 'Home', 'None', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0191_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0192', 'Single Arm Self Resistance Curl', 'Arms', 'Biceps', 'Advanced', 'Home', 'None', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0192_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0193', 'Assisted Chin-up', 'Arms', 'Biceps', 'Beginner', 'Home Equipment', 'Pull-up Bar', ARRAY['Biceps']::text[], ARRAY['Lats']::text[], 'ex0193_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0194', 'Chin-up', 'Arms', 'Biceps', 'Intermediate', 'Home Equipment', 'Pull-up Bar', ARRAY['Biceps']::text[], ARRAY['Lats']::text[], 'ex0194_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0195', 'Close Grip Chin-up', 'Arms', 'Biceps', 'Intermediate', 'Home Equipment', 'Pull-up Bar', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0195_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0196', 'Commando Pull-up', 'Arms', 'Biceps', 'Advanced', 'Home Equipment', 'Pull-up Bar', ARRAY['Biceps']::text[], ARRAY['Back']::text[], 'ex0196_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0197', 'Archer Chin-up', 'Arms', 'Biceps', 'Advanced', 'Home Equipment', 'Pull-up Bar', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0197_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0198', 'Standing Dumbbell Curl', 'Arms', 'Biceps', 'Beginner', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0198_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0199', 'Alternating Dumbbell Curl', 'Arms', 'Biceps', 'Beginner', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0199_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0200', 'Hammer Curl', 'Arms', 'Biceps', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Biceps']::text[], ARRAY['Forearms']::text[], 'ex0200_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0201', 'Concentration Curl', 'Arms', 'Biceps', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0201_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0202', 'Incline Dumbbell Curl', 'Arms', 'Biceps', 'Intermediate', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0202_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0203', 'Cross Body Hammer Curl', 'Arms', 'Biceps', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Biceps']::text[], ARRAY['Brachialis']::text[], 'ex0203_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0204', 'Zottman Curl', 'Arms', 'Biceps', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Biceps']::text[], ARRAY['Forearms']::text[], 'ex0204_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0205', 'Drag Curl', 'Arms', 'Biceps', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0205_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0206', 'Band Curl', 'Arms', 'Biceps', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0206_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0207', 'Single Arm Band Curl', 'Arms', 'Biceps', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0207_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0208', 'Hammer Band Curl', 'Arms', 'Biceps', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Biceps']::text[], ARRAY['Forearms']::text[], 'ex0208_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0209', 'High Band Curl', 'Arms', 'Biceps', 'Advanced', 'Home Equipment', 'Resistance Band', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0209_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0210', 'Machine Bicep Curl', 'Arms', 'Biceps', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0210_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0211', 'EZ Bar Curl', 'Arms', 'Biceps', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0211_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0212', 'Barbell Curl', 'Arms', 'Biceps', 'Intermediate', 'Gym', 'Barbell', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0212_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0213', 'Preacher Curl', 'Arms', 'Biceps', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0213_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0214', 'Cable Curl', 'Arms', 'Biceps', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0214_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0215', 'Bayesian Cable Curl', 'Arms', 'Biceps', 'Advanced', 'Gym', 'Cable Machine', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0215_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0216', 'Spider Curl', 'Arms', 'Biceps', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0216_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0217', 'Incline EZ Bar Curl', 'Arms', 'Biceps', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Biceps']::text[], ARRAY[]::text[], 'ex0217_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0218', 'Wall Push-up', 'Arms', 'Triceps', 'Beginner', 'Home', 'Wall', ARRAY['Triceps']::text[], ARRAY['Chest']::text[], 'ex0218_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0219', 'Bench Dip', 'Arms', 'Triceps', 'Beginner', 'Home', 'Bench / Chair', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0219_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0220', 'Chair Dip', 'Arms', 'Triceps', 'Beginner', 'Home', 'Chair', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0220_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0221', 'Close Grip Push-up', 'Arms', 'Triceps', 'Intermediate', 'Home', 'None', ARRAY['Triceps']::text[], ARRAY['Chest']::text[], 'ex0221_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0222', 'Diamond Push-up', 'Arms', 'Triceps', 'Intermediate', 'Home', 'None', ARRAY['Triceps']::text[], ARRAY['Chest']::text[], 'ex0222_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0223', 'Hindu Push-up', 'Arms', 'Triceps', 'Advanced', 'Home', 'None', ARRAY['Triceps']::text[], ARRAY['Chest']::text[], 'ex0223_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0224', 'Tiger Bend Push-up', 'Arms', 'Triceps', 'Advanced', 'Home', 'None', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0224_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0225', 'Overhead Tricep Extension', 'Arms', 'Triceps', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0225_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0226', 'Single Arm Overhead Extension', 'Arms', 'Triceps', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0226_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0227', 'Tricep Kickback', 'Arms', 'Triceps', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0227_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0228', 'Skull Crusher (Dumbbell)', 'Arms', 'Triceps', 'Intermediate', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0228_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0229', 'Tate Press', 'Arms', 'Triceps', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0229_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0230', 'Band Pushdown', 'Arms', 'Triceps', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0230_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0231', 'Overhead Band Extension', 'Arms', 'Triceps', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0231_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0232', 'Single Arm Band Extension', 'Arms', 'Triceps', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0232_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0233', 'Band Kickback', 'Arms', 'Triceps', 'Advanced', 'Home Equipment', 'Resistance Band', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0233_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0234', 'Machine Tricep Extension', 'Arms', 'Triceps', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0234_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0235', 'Cable Pushdown', 'Arms', 'Triceps', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0235_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0236', 'Rope Pushdown', 'Arms', 'Triceps', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0236_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0237', 'Straight Bar Pushdown', 'Arms', 'Triceps', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0237_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0238', 'EZ Bar Skull Crusher', 'Arms', 'Triceps', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0238_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0239', 'Close Grip Bench Press', 'Arms', 'Triceps', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Triceps']::text[], ARRAY['Chest']::text[], 'ex0239_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0240', 'Weighted Dips', 'Arms', 'Triceps', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Triceps']::text[], ARRAY['Chest']::text[], 'ex0240_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0241', 'Cable Overhead Extension', 'Arms', 'Triceps', 'Advanced', 'Gym', 'Cable Machine', ARRAY['Triceps']::text[], ARRAY[]::text[], 'ex0241_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0242', 'Fingertip Plank', 'Arms', 'Forearms', 'Beginner', 'Home', 'None', ARRAY['Forearms']::text[], ARRAY['Grip']::text[], 'ex0242_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0243', 'Fingertip Push-up (Wall)', 'Arms', 'Forearms', 'Beginner', 'Home', 'Wall', ARRAY['Forearms']::text[], ARRAY['Grip']::text[], 'ex0243_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0244', 'Wrist Push-up (Knees)', 'Arms', 'Forearms', 'Intermediate', 'Home', 'None', ARRAY['Forearms']::text[], ARRAY['Wrists']::text[], 'ex0244_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0245', 'Reverse Wrist Push-up', 'Arms', 'Forearms', 'Intermediate', 'Home', 'None', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0245_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0246', 'Fingertip Push-up', 'Arms', 'Forearms', 'Advanced', 'Home', 'None', ARRAY['Forearms']::text[], ARRAY['Grip']::text[], 'ex0246_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0247', 'One-Hand Fingertip Plank', 'Arms', 'Forearms', 'Advanced', 'Home', 'None', ARRAY['Forearms']::text[], ARRAY['Grip']::text[], 'ex0247_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0248', 'Standard Grip Squeeze', 'Arms', 'Forearms', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Forearms']::text[], ARRAY['Grip']::text[], 'ex0248_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0249', 'Timed Grip Hold', 'Arms', 'Forearms', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Grip Strength']::text[], ARRAY[]::text[], 'ex0249_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0250', 'Negative Grip Reps', 'Arms', 'Forearms', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0250_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0251', 'Single Finger Grip', 'Arms', 'Forearms', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Grip']::text[], ARRAY['Fingers']::text[], 'ex0251_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0252', 'Overcrush Hold', 'Arms', 'Forearms', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Grip Strength']::text[], ARRAY[]::text[], 'ex0252_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0253', 'Wrist Curl', 'Arms', 'Forearms', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0253_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0254', 'Reverse Wrist Curl', 'Arms', 'Forearms', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0254_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0255', 'Hammer Curl', 'Arms', 'Forearms', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Forearms']::text[], ARRAY['Brachialis']::text[], 'ex0255_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0256', 'Reverse Curl', 'Arms', 'Forearms', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Forearms']::text[], ARRAY['Biceps']::text[], 'ex0256_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0257', 'Farmer''s Carry', 'Arms', 'Forearms', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Grip']::text[], ARRAY['Forearms']::text[], 'ex0257_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0258', 'Plate Pinch Hold', 'Arms', 'Forearms', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Grip Strength']::text[], ARRAY[]::text[], 'ex0258_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0259', 'Wrist Roller', 'Arms', 'Forearms', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0259_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0260', 'Bottom-Up Dumbbell Hold', 'Arms', 'Forearms', 'Advanced', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Grip']::text[], ARRAY['Wrist Stability']::text[], 'ex0260_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0261', 'Band Wrist Curl', 'Arms', 'Forearms', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0261_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0262', 'Band Reverse Wrist Curl', 'Arms', 'Forearms', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0262_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0263', 'Band Finger Extension', 'Arms', 'Forearms', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Finger Extensors']::text[], ARRAY[]::text[], 'ex0263_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0264', 'Band Grip Hold', 'Arms', 'Forearms', 'Advanced', 'Home Equipment', 'Resistance Band', ARRAY['Grip Strength']::text[], ARRAY[]::text[], 'ex0264_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0265', 'Wrist Curl Machine', 'Arms', 'Forearms', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0265_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0266', 'Reverse Wrist Curl Machine', 'Arms', 'Forearms', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0266_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0267', 'Cable Wrist Curl', 'Arms', 'Forearms', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Forearms']::text[], ARRAY[]::text[], 'ex0267_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0268', 'Cable Reverse Curl', 'Arms', 'Forearms', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Forearms']::text[], ARRAY['Biceps']::text[], 'ex0268_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0269', 'Fat Grip Barbell Hold', 'Arms', 'Forearms', 'Advanced', 'Gym', 'Barbell', ARRAY['Grip Strength']::text[], ARRAY[]::text[], 'ex0269_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0270', 'Towel Dead Hang', 'Arms', 'Forearms', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Grip']::text[], ARRAY['Forearms']::text[], 'ex0270_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0271', 'Thick Bar Farmer Carry', 'Arms', 'Forearms', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Grip']::text[], ARRAY['Forearms']::text[], 'ex0271_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0272', 'Forearm Plank', 'Core', 'Abs & Core', 'Beginner', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Lower Back']::text[], 'ex0272_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0273', 'High Plank', 'Core', 'Abs & Core', 'Beginner', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Shoulders']::text[], 'ex0273_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0274', 'Knee Plank', 'Core', 'Abs & Core', 'Beginner', 'Home', 'None', ARRAY['Core']::text[], ARRAY[]::text[], 'ex0274_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0275', 'Side Plank', 'Core', 'Obliques', 'Intermediate', 'Home', 'None', ARRAY['Obliques']::text[], ARRAY['Core']::text[], 'ex0275_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0276', 'Plank Shoulder Tap', 'Core', 'Abs & Core', 'Intermediate', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Shoulders']::text[], 'ex0276_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0277', 'Plank Reach', 'Core', 'Abs & Core', 'Intermediate', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Shoulders']::text[], 'ex0277_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0278', 'Reverse Plank', 'Core', 'Abs & Core', 'Intermediate', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Lower Back', 'Glutes']::text[], 'ex0278_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0279', 'Walking Plank', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Shoulders']::text[], 'ex0279_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0280', 'Plank Jack', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Cardio']::text[], 'ex0280_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0281', 'RKC Plank', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Deep Core']::text[], ARRAY[]::text[], 'ex0281_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0282', 'Crunch', 'Core', 'Abs & Core', 'Beginner', 'Home', 'None', ARRAY['Upper Abs']::text[], ARRAY[]::text[], 'ex0282_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0283', 'Heel Touch', 'Core', 'Obliques', 'Beginner', 'Home', 'None', ARRAY['Obliques']::text[], ARRAY[]::text[], 'ex0283_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0284', 'Toe Touch', 'Core', 'Abs & Core', 'Intermediate', 'Home', 'None', ARRAY['Upper Abs']::text[], ARRAY[]::text[], 'ex0284_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0285', 'Reverse Crunch', 'Core', 'Lower Abs', 'Intermediate', 'Home', 'None', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0285_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0286', 'Bicycle Crunch', 'Core', 'Obliques', 'Intermediate', 'Home', 'None', ARRAY['Obliques']::text[], ARRAY['Core']::text[], 'ex0286_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0287', 'Cross Crunch', 'Core', 'Obliques', 'Intermediate', 'Home', 'None', ARRAY['Obliques']::text[], ARRAY[]::text[], 'ex0287_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0288', 'V-Up', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Full Core']::text[], ARRAY[]::text[], 'ex0288_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0289', 'Jackknife Sit-up', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Full Core']::text[], ARRAY[]::text[], 'ex0289_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0290', 'Hollow Body Crunch', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Deep Core']::text[], ARRAY[]::text[], 'ex0290_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0291', 'Bent Knee Leg Raise', 'Core', 'Lower Abs', 'Beginner', 'Home', 'None', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0291_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0292', 'Flutter Kick', 'Core', 'Lower Abs', 'Beginner', 'Home', 'None', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0292_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0293', 'Scissor Kick', 'Core', 'Lower Abs', 'Intermediate', 'Home', 'None', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0293_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0294', 'Leg Raise', 'Core', 'Lower Abs', 'Intermediate', 'Home', 'None', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0294_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0295', 'Double Leg Raise', 'Core', 'Lower Abs', 'Advanced', 'Home', 'None', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0295_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0296', 'Dragon Flag Progression', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Full Core']::text[], ARRAY[]::text[], 'ex0296_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0297', 'Dragon Flag', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Full Core']::text[], ARRAY[]::text[], 'ex0297_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0298', 'Dead Bug', 'Core', 'Abs & Core', 'Beginner', 'Home', 'None', ARRAY['Deep Core']::text[], ARRAY[]::text[], 'ex0298_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0299', 'Bird Dog', 'Core', 'Abs & Core', 'Beginner', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Lower Back']::text[], 'ex0299_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0300', 'Hollow Hold', 'Core', 'Abs & Core', 'Intermediate', 'Home', 'None', ARRAY['Deep Core']::text[], ARRAY[]::text[], 'ex0300_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0301', 'Superman Hold', 'Core', 'Lower Back', 'Intermediate', 'Home', 'None', ARRAY['Lower Back']::text[], ARRAY['Core']::text[], 'ex0301_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0302', 'Bear Crawl Hold', 'Core', 'Abs & Core', 'Intermediate', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Shoulders']::text[], 'ex0302_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0303', 'Bear Crawl', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Shoulders']::text[], 'ex0303_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0304', 'Crab Walk', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Core']::text[], ARRAY['Shoulders']::text[], 'ex0304_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0305', 'Hollow Rock', 'Core', 'Abs & Core', 'Advanced', 'Home', 'None', ARRAY['Deep Core']::text[], ARRAY[]::text[], 'ex0305_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0306', 'Kneeling Ab Rollout', 'Core', 'Abs & Core', 'Beginner', 'Home Equipment', 'Ab Wheel', ARRAY['Core']::text[], ARRAY[]::text[], 'ex0306_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0307', 'Partial Rollout', 'Core', 'Abs & Core', 'Beginner', 'Home Equipment', 'Ab Wheel', ARRAY['Core']::text[], ARRAY[]::text[], 'ex0307_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0308', 'Full Rollout', 'Core', 'Abs & Core', 'Intermediate', 'Home Equipment', 'Ab Wheel', ARRAY['Full Core']::text[], ARRAY[]::text[], 'ex0308_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0309', 'Standing Rollout', 'Core', 'Abs & Core', 'Advanced', 'Home Equipment', 'Ab Wheel', ARRAY['Full Core']::text[], ARRAY[]::text[], 'ex0309_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0310', 'Single Arm Rollout', 'Core', 'Abs & Core', 'Advanced', 'Home Equipment', 'Ab Wheel', ARRAY['Core']::text[], ARRAY[]::text[], 'ex0310_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0311', 'Band Wood Chop', 'Core', 'Obliques', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Obliques']::text[], ARRAY[]::text[], 'ex0311_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0312', 'Pallof Press', 'Core', 'Abs & Core', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Deep Core']::text[], ARRAY[]::text[], 'ex0312_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0313', 'Pallof Hold', 'Core', 'Abs & Core', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Deep Core']::text[], ARRAY[]::text[], 'ex0313_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0314', 'Standing Band Crunch', 'Core', 'Abs & Core', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Upper Abs']::text[], ARRAY[]::text[], 'ex0314_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0315', 'Band Rotation', 'Core', 'Obliques', 'Advanced', 'Home Equipment', 'Resistance Band', ARRAY['Obliques']::text[], ARRAY[]::text[], 'ex0315_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0316', 'Hanging Knee Raise', 'Core', 'Lower Abs', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0316_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0317', 'Hanging Leg Raise', 'Core', 'Lower Abs', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0317_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0318', 'Hanging Windshield Wiper', 'Core', 'Obliques', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Obliques']::text[], ARRAY[]::text[], 'ex0318_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0319', 'Toes-to-Bar', 'Core', 'Abs & Core', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Full Core']::text[], ARRAY[]::text[], 'ex0319_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0320', 'Machine Crunch', 'Core', 'Abs & Core', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Upper Abs']::text[], ARRAY[]::text[], 'ex0320_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0321', 'Roman Chair Knee Raise', 'Core', 'Lower Abs', 'Beginner', 'Gym', 'Gym Equipment', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0321_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0322', 'Cable Crunch', 'Core', 'Abs & Core', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Upper Abs']::text[], ARRAY[]::text[], 'ex0322_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0323', 'Cable Wood Chop', 'Core', 'Obliques', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Obliques']::text[], ARRAY[]::text[], 'ex0323_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0324', 'Cable Pallof Press', 'Core', 'Abs & Core', 'Intermediate', 'Gym', 'Cable Machine', ARRAY['Deep Core']::text[], ARRAY[]::text[], 'ex0324_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0325', 'Decline Sit-up', 'Core', 'Abs & Core', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Upper Abs']::text[], ARRAY[]::text[], 'ex0325_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0326', 'Hanging Leg Raise Station', 'Core', 'Lower Abs', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Lower Abs']::text[], ARRAY[]::text[], 'ex0326_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0327', 'Landmine Rotation', 'Core', 'Obliques', 'Advanced', 'Gym', 'Landmine Station', ARRAY['Obliques']::text[], ARRAY[]::text[], 'ex0327_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0328', 'Dragon Flag Bench', 'Core', 'Abs & Core', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Full Core']::text[], ARRAY[]::text[], 'ex0328_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0329', 'Chair Squat', 'Legs', 'Quads', 'Beginner', 'Home', 'Chair', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0329_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0330', 'Box Squat', 'Legs', 'Quads', 'Beginner', 'Home', 'None', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0330_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0331', 'Bodyweight Squat', 'Legs', 'Quads', 'Beginner', 'Home', 'None', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0331_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0332', 'Narrow Squat', 'Legs', 'Lats & Upper Back', 'Intermediate', 'Home', 'None', ARRAY['Quads']::text[], ARRAY[]::text[], 'ex0332_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0333', 'Wide Squat', 'Legs', 'Quads', 'Intermediate', 'Home', 'None', ARRAY['Glutes']::text[], ARRAY['Adductors']::text[], 'ex0333_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0334', 'Sumo Squat', 'Legs', 'Quads', 'Intermediate', 'Home', 'None', ARRAY['Glutes']::text[], ARRAY['Inner Thigh']::text[], 'ex0334_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0335', 'Jump Squat', 'Legs', 'Quads', 'Advanced', 'Home', 'None', ARRAY['Quads']::text[], ARRAY['Glutes', 'Power']::text[], 'ex0335_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0336', 'Shrimp Squat', 'Legs', 'Quads', 'Advanced', 'Home', 'None', ARRAY['Quads']::text[], ARRAY['Balance']::text[], 'ex0336_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0337', 'Skater Squat', 'Legs', 'Quads', 'Advanced', 'Home', 'None', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0337_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0338', 'Pistol Squat', 'Legs', 'Quads', 'Advanced', 'Home', 'None', ARRAY['Full Legs']::text[], ARRAY['Balance']::text[], 'ex0338_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0339', 'Static Split Squat', 'Legs', 'Quads', 'Beginner', 'Home', 'None', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0339_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0340', 'Forward Lunge', 'Legs', 'Quads', 'Beginner', 'Home', 'None', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0340_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0341', 'Reverse Lunge', 'Legs', 'Glutes', 'Intermediate', 'Home', 'None', ARRAY['Glutes']::text[], ARRAY['Hamstrings']::text[], 'ex0341_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0342', 'Walking Lunge', 'Legs', 'Quads', 'Intermediate', 'Home', 'None', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0342_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0343', 'Side Lunge', 'Legs', 'Hips & Adductors', 'Intermediate', 'Home', 'None', ARRAY['Adductors']::text[], ARRAY['Glutes']::text[], 'ex0343_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0344', 'Curtsy Lunge', 'Legs', 'Glutes', 'Advanced', 'Home', 'None', ARRAY['Glutes']::text[], ARRAY['Adductors']::text[], 'ex0344_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0345', 'Jumping Lunge', 'Legs', 'Quads', 'Advanced', 'Home', 'None', ARRAY['Quads']::text[], ARRAY['Power']::text[], 'ex0345_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0346', 'Glute Bridge', 'Legs', 'Glutes', 'Beginner', 'Home', 'None', ARRAY['Glutes']::text[], ARRAY['Hamstrings']::text[], 'ex0346_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0347', 'Frog Pump', 'Legs', 'Glutes', 'Beginner', 'Home', 'None', ARRAY['Glutes']::text[], ARRAY[]::text[], 'ex0347_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0348', 'Donkey Kick', 'Legs', 'Glutes', 'Beginner', 'Home', 'None', ARRAY['Glutes']::text[], ARRAY[]::text[], 'ex0348_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0349', 'Fire Hydrant', 'Legs', 'Legs', 'Intermediate', 'Home', 'None', ARRAY['Glute Medius']::text[], ARRAY[]::text[], 'ex0349_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0350', 'Single Leg Glute Bridge', 'Legs', 'Glutes', 'Intermediate', 'Home', 'None', ARRAY['Glutes']::text[], ARRAY['Hamstrings']::text[], 'ex0350_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0351', 'Hip Thrust (Bench)', 'Legs', 'Glutes', 'Intermediate', 'Home', 'Bench / Chair', ARRAY['Glutes']::text[], ARRAY[]::text[], 'ex0351_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0352', 'Nordic Curl Progression', 'Legs', 'Hamstrings', 'Advanced', 'Home', 'None', ARRAY['Hamstrings']::text[], ARRAY[]::text[], 'ex0352_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0353', 'Standing Calf Raise', 'Legs', 'Calves & Ankles', 'Beginner', 'Home', 'None', ARRAY['Calves']::text[], ARRAY[]::text[], 'ex0353_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0354', 'Seated Calf Raise (Chair)', 'Legs', 'Legs', 'Beginner', 'Home', 'Chair', ARRAY['Soleus']::text[], ARRAY[]::text[], 'ex0354_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0355', 'Single Leg Calf Raise', 'Legs', 'Calves & Ankles', 'Intermediate', 'Home', 'None', ARRAY['Calves']::text[], ARRAY[]::text[], 'ex0355_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0356', 'Elevated Calf Raise', 'Legs', 'Calves & Ankles', 'Intermediate', 'Home', 'None', ARRAY['Calves']::text[], ARRAY[]::text[], 'ex0356_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0357', 'Jump Rope (Imaginary)', 'Legs', 'Calves & Ankles', 'Intermediate', 'Home', 'None', ARRAY['Calves']::text[], ARRAY['Cardio']::text[], 'ex0357_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0358', 'Explosive Calf Hop', 'Legs', 'Calves & Ankles', 'Advanced', 'Home', 'None', ARRAY['Calves']::text[], ARRAY[]::text[], 'ex0358_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0359', 'Single Leg Stand', 'Legs', 'Legs', 'Beginner', 'Home', 'None', ARRAY['Balance']::text[], ARRAY['Ankles']::text[], 'ex0359_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0360', 'Heel Walk', 'Legs', 'Calves & Ankles', 'Beginner', 'Home', 'None', ARRAY['Tibialis']::text[], ARRAY[]::text[], 'ex0360_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0361', 'Toe Walk', 'Legs', 'Calves & Ankles', 'Beginner', 'Home', 'None', ARRAY['Calves']::text[], ARRAY[]::text[], 'ex0361_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0362', 'Single Leg Reach', 'Legs', 'Legs', 'Intermediate', 'Home', 'None', ARRAY['Balance']::text[], ARRAY['Glutes']::text[], 'ex0362_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0363', 'Airplane Balance', 'Legs', 'Legs', 'Advanced', 'Home', 'None', ARRAY['Balance']::text[], ARRAY['Glutes']::text[], 'ex0363_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0364', 'Goblet Squat', 'Legs', 'Quads', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0364_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0365', 'Romanian Deadlift', 'Legs', 'Hamstrings', 'Beginner', 'Home Equipment', 'Home Equipment', ARRAY['Hamstrings']::text[], ARRAY['Glutes']::text[], 'ex0365_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0366', 'Dumbbell Lunge', 'Legs', 'Quads', 'Intermediate', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0366_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0367', 'Bulgarian Split Squat', 'Legs', 'Quads', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0367_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0368', 'Dumbbell Step-up', 'Legs', 'Quads', 'Intermediate', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0368_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0369', 'Dumbbell Hip Thrust', 'Legs', 'Glutes', 'Intermediate', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Glutes']::text[], ARRAY[]::text[], 'ex0369_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0370', 'Dumbbell Sumo Squat', 'Legs', 'Quads', 'Advanced', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Inner Thigh']::text[], ARRAY['Glutes']::text[], 'ex0370_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0371', 'Single Leg Romanian Deadlift', 'Legs', 'Hamstrings', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Hamstrings']::text[], ARRAY['Balance']::text[], 'ex0371_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0372', 'Dumbbell Jump Squat', 'Legs', 'Quads', 'Advanced', 'Home Equipment', 'Adjustable Dumbbells', ARRAY['Power']::text[], ARRAY[]::text[], 'ex0372_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0373', 'Band Squat', 'Legs', 'Quads', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0373_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0374', 'Lateral Band Walk', 'Legs', 'Lats & Upper Back', 'Beginner', 'Home Equipment', 'Resistance Band', ARRAY['Glute Medius']::text[], ARRAY[]::text[], 'ex0374_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0375', 'Band Glute Bridge', 'Legs', 'Glutes', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Glutes']::text[], ARRAY[]::text[], 'ex0375_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0376', 'Standing Hamstring Curl', 'Legs', 'Hamstrings', 'Intermediate', 'Home Equipment', 'Home Equipment', ARRAY['Hamstrings']::text[], ARRAY[]::text[], 'ex0376_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0377', 'Band Kickback', 'Legs', 'Glutes', 'Intermediate', 'Home Equipment', 'Resistance Band', ARRAY['Glutes']::text[], ARRAY[]::text[], 'ex0377_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0378', 'Monster Walk', 'Legs', 'Glutes', 'Advanced', 'Home Equipment', 'Home Equipment', ARRAY['Glutes']::text[], ARRAY['Hip Stability']::text[], 'ex0378_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0379', 'Leg Press', 'Legs', 'Quads', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0379_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0380', 'Leg Extension Machine', 'Legs', 'Quads', 'Beginner', 'Gym', 'Gym Machine', ARRAY['Quads']::text[], ARRAY[]::text[], 'ex0380_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0381', 'Seated Hamstring Curl', 'Legs', 'Hamstrings', 'Beginner', 'Gym', 'Gym Equipment', ARRAY['Hamstrings']::text[], ARRAY[]::text[], 'ex0381_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0382', 'Standing Hamstring Curl', 'Legs', 'Hamstrings', 'Beginner', 'Gym', 'Gym Equipment', ARRAY['Hamstrings']::text[], ARRAY[]::text[], 'ex0382_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0383', 'Smith Machine Squat', 'Legs', 'Quads', 'Intermediate', 'Gym', 'Smith Machine', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0383_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0384', 'Barbell Back Squat', 'Legs', 'Quads', 'Intermediate', 'Gym', 'Barbell', ARRAY['Full Legs']::text[], ARRAY[]::text[], 'ex0384_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0385', 'Front Squat', 'Legs', 'Quads', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Quads']::text[], ARRAY[]::text[], 'ex0385_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0386', 'Hack Squat', 'Legs', 'Quads', 'Intermediate', 'Gym', 'Gym Equipment', ARRAY['Quads']::text[], ARRAY[]::text[], 'ex0386_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0387', 'Walking Barbell Lunge', 'Legs', 'Quads', 'Intermediate', 'Gym', 'Barbell', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0387_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0388', 'Barbell Romanian Deadlift', 'Legs', 'Hamstrings', 'Intermediate', 'Gym', 'Barbell', ARRAY['Hamstrings']::text[], ARRAY['Glutes']::text[], 'ex0388_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0389', 'Hip Thrust Machine', 'Legs', 'Glutes', 'Intermediate', 'Gym', 'Gym Machine', ARRAY['Glutes']::text[], ARRAY[]::text[], 'ex0389_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0390', 'Standing Calf Raise Machine', 'Legs', 'Calves & Ankles', 'Intermediate', 'Gym', 'Gym Machine', ARRAY['Calves']::text[], ARRAY[]::text[], 'ex0390_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0391', 'Seated Calf Raise Machine', 'Legs', 'Legs', 'Intermediate', 'Gym', 'Gym Machine', ARRAY['Soleus']::text[], ARRAY[]::text[], 'ex0391_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0392', 'Bulgarian Split Squat (Barbell)', 'Legs', 'Quads', 'Advanced', 'Gym', 'Barbell', ARRAY['Quads']::text[], ARRAY['Glutes']::text[], 'ex0392_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0393', 'Jefferson Squat', 'Legs', 'Quads', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Legs']::text[], ARRAY['Core']::text[], 'ex0393_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0394', 'Sissy Squat Machine', 'Legs', 'Quads', 'Advanced', 'Gym', 'Gym Machine', ARRAY['Quads']::text[], ARRAY[]::text[], 'ex0394_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0395', 'Zercher Squat', 'Legs', 'Quads', 'Advanced', 'Gym', 'Gym Equipment', ARRAY['Quads']::text[], ARRAY['Core']::text[], 'ex0395_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0396', 'Deficit Deadlift', 'Legs', 'Hamstrings', 'Advanced', 'Gym', 'Barbell', ARRAY['Hamstrings']::text[], ARRAY['Glutes']::text[], 'ex0396_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
INSERT INTO public.master_exercises (exercise_code, exercise_name, exercise_category, exercise_group, difficulty, workout_location, equipment_required, primary_muscles, secondary_muscles, animation_key, animation_status)
VALUES ('EX0397', 'Trap Bar Deadlift', 'Legs', 'Legs', 'Advanced', 'Gym', 'Barbell', ARRAY['Full Legs']::text[], ARRAY['Posterior Chain']::text[], 'ex0397_anim', 'Pending')
ON CONFLICT (exercise_code) DO UPDATE SET
  exercise_name = EXCLUDED.exercise_name,
  exercise_category = EXCLUDED.exercise_category,
  exercise_group = EXCLUDED.exercise_group,
  difficulty = EXCLUDED.difficulty,
  workout_location = EXCLUDED.workout_location,
  equipment_required = EXCLUDED.equipment_required,
  primary_muscles = EXCLUDED.primary_muscles,
  secondary_muscles = EXCLUDED.secondary_muscles;
