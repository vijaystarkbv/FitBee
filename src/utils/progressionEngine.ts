import { PROGRESSION_CONFIG } from '../config/progressionConfig';
import { WorkoutLogSet, UserWorkoutExercise } from '../types/database.types';
import { ProgressionRecommendation } from '../types/fitness.types';

/**
 * Pure Deterministic Progressive Overload Calculator
 * Analyzes recent historical workout set logs and generates next session targets.
 * NEVER calls AI.
 */
export function calculateNextExerciseTarget(
  targetExercise: UserWorkoutExercise,
  recentSets: WorkoutLogSet[]
): ProgressionRecommendation {
  const exerciseId = targetExercise.exercise_id;
  const exerciseName = targetExercise.exercise?.name || 'Exercise';
  
  // Filter sets belonging to this exercise
  const exerciseHistory = recentSets.filter((s) => s.exercise_id === exerciseId);

  // Default initial baseline if no history exists yet
  if (exerciseHistory.length === 0) {
    const defaultWeight = targetExercise.default_weight_kg ?? targetExercise.target_weight_kg ?? 0;
    return {
      exerciseId,
      exerciseName,
      previousWeightKg: defaultWeight,
      previousReps: targetExercise.target_reps,
      suggestedWeightKg: defaultWeight,
      suggestedReps: targetExercise.target_reps,
      reason: 'Initial baseline target.',
    };
  }

  // Calculate average reps and max weight performed in recent sets
  const totalRepsCompleted = exerciseHistory.reduce((sum, s) => sum + s.reps_completed, 0);
  const totalTargetReps = targetExercise.target_sets * targetExercise.target_reps;
  const lastWeightKg = Math.max(...exerciseHistory.map((s) => s.weight_kg));
  const completionRatio = totalRepsCompleted / (totalTargetReps || 1);

  // Overload Decision Logic
  if (completionRatio >= PROGRESSION_CONFIG.COMPLETION_THRESHOLD_RATIO) {
    // User successfully completed 100%+ of target reps -> Progressively increase weight
    const isDumbbell = targetExercise.exercise?.equipment_required === 'dumbbell';
    const weightStep = isDumbbell
      ? PROGRESSION_CONFIG.DUMBBELL_WEIGHT_INCREMENT_KG
      : PROGRESSION_CONFIG.DEFAULT_WEIGHT_INCREMENT_KG;

    const newWeight = Number((lastWeightKg + weightStep).toFixed(1));

    return {
      exerciseId,
      exerciseName,
      previousWeightKg: lastWeightKg,
      previousReps: targetExercise.target_reps,
      suggestedWeightKg: newWeight,
      suggestedReps: targetExercise.target_reps,
      reason: `Target hit! Increased weight by +${weightStep} kg.`,
    };
  } else {
    // User struggled to hit target reps -> Keep weight, reinforce reps
    return {
      exerciseId,
      exerciseName,
      previousWeightKg: lastWeightKg,
      previousReps: Math.round(totalRepsCompleted / (targetExercise.target_sets || 1)),
      suggestedWeightKg: lastWeightKg,
      suggestedReps: targetExercise.target_reps,
      reason: 'Consolidate current weight before increasing.',
    };
  }
}
