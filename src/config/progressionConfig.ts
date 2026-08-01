// FitBee Configurable Progressive Overload Parameters
// Business logic calculations consume these parameters to determine exercise targets.

export const PROGRESSION_CONFIG = {
  // Number of historical workout sessions evaluated for progressive overload
  EVALUATION_SESSION_COUNT: 3,

  // Weight increment (in kg) added when target reps are consistently hit
  DEFAULT_WEIGHT_INCREMENT_KG: 2.5,
  DUMBBELL_WEIGHT_INCREMENT_KG: 1.0,

  // Additional reps recommended when weight cannot be increased
  DEFAULT_REP_INCREMENT: 2,

  // Required completion ratio (1.0 = 100% of target reps completed across sets)
  COMPLETION_THRESHOLD_RATIO: 1.0,
} as const;

export type ProgressionConfig = typeof PROGRESSION_CONFIG;
