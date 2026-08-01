import { supabase } from './supabaseClient';
import { UserWorkout, WorkoutLog } from '../types/database.types';

/**
 * Creates or assigns a user workout from master templates
 */
export async function createDefaultUserWorkout(
  userId: string,
  workoutName: string,
  templateName: string
): Promise<UserWorkout> {
  const { data: workout, error } = await supabase
    .from('user_workouts')
    .insert({
      user_id: userId,
      name: workoutName,
    })
    .select('*')
    .single();

  if (error) throw error;

  // Fetch template exercises
  const { data: template } = await supabase
    .from('workout_templates')
    .select('*, template_exercises(*, exercises(*))')
    .eq('name', templateName)
    .maybeSingle();

  if (template && template.template_exercises) {
    const userExercises = template.template_exercises.map((te: any) => ({
      user_workout_id: workout.id,
      exercise_id: te.exercise_id,
      order_index: te.order_index,
      target_sets: te.default_sets || 3,
      target_reps: te.default_reps || 10,
      target_weight_kg: 0,
    }));

    await supabase.from('user_workout_exercises').insert(userExercises);
  }

  return workout;
}

/**
 * Logs a completed workout session with exercise notes
 */
export async function logWorkoutSession(
  userId: string,
  userWorkoutId: string,
  notes: string | null,
  completedSets: Array<{ exerciseId: string; setNumber: number; reps: number; weightKg: number }>
): Promise<WorkoutLog> {
  const { data: log, error } = await supabase
    .from('workout_logs')
    .insert({
      user_id: userId,
      user_workout_id: userWorkoutId,
      notes: notes || null,
    })
    .select('*')
    .single();

  if (error) throw error;

  if (completedSets.length > 0) {
    const setRows = completedSets.map((s) => ({
      workout_log_id: log.id,
      exercise_id: s.exerciseId,
      set_number: s.setNumber,
      reps_completed: s.reps,
      weight_kg: s.weightKg,
    }));

    await supabase.from('workout_log_sets').insert(setRows);
  }

  return log;
}
