/**
 * FitBee Exercise Video Registry
 * 
 * Maps exercise names to their hosted Cloudflare R2 MP4 video URLs.
 * Scalable design following the hierarchy in FitBee_Exercise_Library.md:
 * Category -> Difficulty (Beginner | Intermediate | Advanced) -> Exercise Name.
 */

export interface ExerciseVideoInfo {
  url: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Master mapping of Cloudflare R2 hosted video URLs
export const EXERCISE_VIDEO_MAP: Record<string, string> = {
  // ==========================================
  // CHEST -> BEGINNER
  // ==========================================
  'Band Chest Press':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Band%20Chest%20Press.mp4',

  'Floor Dumbbell Press':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Floor%20Dumbbell%20Press.mp4',

  'Incline Push-up (Chair / Bench)':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Incline%20Push-up%20(Chair%20Bench).mp4',
  'Incline Push-up (Chair \\ Bench)':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Incline%20Push-up%20(Chair%20Bench).mp4',
  'Incline Push-up (Chair Bench)':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Incline%20Push-up%20(Chair%20Bench).mp4',

  'Knee Push-up':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Knee%20Push-up.mp4',

  'Machine Chest Press':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Machine%20Chest%20Press.mp4',

  'Neutral Grip Floor Press':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Neutral%20Grip%20Floor%20Press.mp4',

  'Smith Machine Bench Press':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Smith%20Machine%20Bench%20Press.mp4',

  'Wall Push-up':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Wall%20Push-up.mp4',
  'Wall Push-Up':
    'https://pub-63aec5bd2cc54ca7a8fedb2df35ffaf3.r2.dev/chest/Beginner/Wall%20Push-up.mp4',
};

/**
 * Returns the Cloudflare R2 video URL for a given exercise name.
 * Handles fuzzy name normalization (removing extra slashes, casing, spaces)
 * so future exercise additions match seamlessly.
 */
export function getExerciseVideoUrl(exerciseName: string): string | null {
  if (!exerciseName) return null;

  // Direct match
  if (EXERCISE_VIDEO_MAP[exerciseName]) {
    return EXERCISE_VIDEO_MAP[exerciseName];
  }

  // Normalized matching (ignore slashes, dashes, casing, and whitespace differences)
  const cleanTarget = exerciseName.toLowerCase().replace(/[\/\-\\()\s]/g, '');
  const matchedKey = Object.keys(EXERCISE_VIDEO_MAP).find((key) => {
    const cleanKey = key.toLowerCase().replace(/[\/\-\\()\s]/g, '');
    return cleanKey === cleanTarget;
  });

  return matchedKey ? EXERCISE_VIDEO_MAP[matchedKey] : null;
}
