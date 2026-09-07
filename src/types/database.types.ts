// FitBee Database Types matching Supabase schema

export type Gender = 'male' | 'female' | 'other';
export type FitnessGoal = 'gain_weight' | 'lose_weight' | 'gain_muscle' | 'lose_fat' | 'maintain_weight' | 'improve_fitness';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active';
export type TrainingLocation = 'home' | 'gym' | 'both' | 'none';
export type HeightUnit = 'cm' | 'ft';
export type WeightUnit = 'kg' | 'lbs';
export type ExerciseCategory = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
export type EquipmentRequired = 'none' | 'dumbbell' | 'gym_machine' | 'barbell';
export type ThemePreference = 'dark' | 'light' | 'system';

export interface Profile {
  id: string;
  updated_at: string;
  display_name: string | null;
  age: number | null;
  gender: Gender | null;
  height_cm: number | null;
  weight_kg: number | null;
  target_weight_kg: number | null;
  goal: FitnessGoal | null;
  activity_level: ActivityLevel | null;
  training_location: TrainingLocation | null;
  has_dumbbells: boolean;
  max_dumbbell_weight_kg: number | null;
  target_calories: number | null;
  target_protein: number | null;
  target_carbs: number | null;
  target_fat: number | null;
  height_unit: HeightUnit;
  weight_unit: WeightUnit;
  onboarding_completed: boolean;
  streak_freeze_count?: number | null;
  frozen_dates?: string[] | null;
  streak_milestones_awarded?: number | null;
}

export interface UserEquipment {
  id: string;
  user_id: string;
  equipment_name: string;
  max_weight_kg: number | null;
  resistance_level: string | null;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: ThemePreference;
  notifications_enabled: boolean;
  language: string;
  created_at: string;
}

export interface WeightLog {
  id: string;
  user_id: string;
  logged_at: string;
  weight_kg: number;
}

export type ExerciseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type AnimationStatus = 'Pending' | 'Processing' | 'Ready' | 'Failed';

export interface MasterExercise {
  id: string;
  exercise_code: string; // Immutable unique code e.g., 'EX0001', 'EX0002'
  exercise_name: string;
  exercise_category: string; // Warm-up & Mobility, Chest, Back, Shoulders, Arms, Core, Legs
  exercise_group: string; // e.g., Push-up, Biceps - Dumbbell, Planks, Squats
  difficulty: ExerciseDifficulty;
  workout_location: string; // Home, Home Equipment, Gym
  equipment_required: string;
  primary_muscles: string[];
  secondary_muscles: string[];
  tracking_type: 'reps' | 'timer';
  animation_key: string | null;
  animation_status: AnimationStatus;
  thumbnail_url?: string | null;
  animation_url?: string | null;
  description?: string | null;
  instructions?: string | null;
  common_mistakes?: string | null;
  beginner_tips?: string | null;
  breathing?: string | null;
  tempo?: string | null;
  notes?: string | null;
  created_at: string;
  // Compatibility aliases
  name?: string;
  category?: string;
}

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment_required: EquipmentRequired;
  created_at: string;
}

export type TemplateType = 'system' | 'user';

export interface WorkoutTemplate {
  id: string;
  user_id: string | null;
  name: string;
  description: string | null;
  template_type: TemplateType;
  forked_from_template_id: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutTemplateDay {
  id: string;
  template_id: string;
  day_name: string;
  is_enabled: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  name?: string; // fallback alias for UI usage
}

export interface WorkoutTemplateExercise {
  id: string;
  template_day_id: string;
  exercise_id: string;
  order_index: number;
  target_sets: number;
  target_reps: number;
  target_time_seconds: number | null;
  default_weight_kg: number;
  created_at: string;
  updated_at: string;
  exercise?: MasterExercise;
  // Compatibility alias
  target_weight_kg?: number;
}

// Backward-compatibility type aliases
export type UserWorkout = WorkoutTemplate;
export type UserWorkoutExercise = WorkoutTemplateExercise;

export interface WorkoutLog {
  id: string;
  user_id: string;
  user_workout_id: string | null;
  logged_at: string;
  notes: string | null;
  workout_log_sets?: WorkoutLogSet[];
}

export interface WorkoutLogSet {
  id: string;
  workout_log_id: string;
  exercise_id: string;
  set_number: number;
  reps_completed: number;
  weight_kg: number;
  exercise?: Exercise;
}

export interface NutritionLog {
  id: string;
  user_id: string;
  date: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
}

export interface ParsedFoodItem {
  id?: string;
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealEntry {
  id: string;
  nutrition_log_id: string;
  raw_text: string;
  created_at: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  parsed_breakdown: ParsedFoodItem[];
}

export interface ExerciseFavorite {
  id: string;
  user_id: string;
  exercise_id: string;
  created_at: string;
}

export type HabitType = 'CHECKLIST' | 'DURATION';

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  type: HabitType;
  target_duration_seconds: number | null;
  notifications_enabled: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitSession {
  id: string;
  user_id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  session_index: number;
  started_at: string;
  ended_at: string;
  duration_seconds: number;
  created_at: string;
}

export interface HabitLog {
  id: string;
  user_id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  is_completed: boolean;
  target_duration_seconds: number | null;
  actual_duration_seconds: number;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export type WalkingInputMode = 'steps' | 'distance';

export interface DailyWalkingLog {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  steps: number;
  distance_km: number;
  calories_burned: number;
  input_mode: WalkingInputMode;
  created_at: string;
  updated_at: string;
}

export type TargetVersionSource = 'onboarding' | 'gemini_recommendation' | 'manual_user_edit' | 'user_override' | 'system_invariant_repair' | 'system_recalculation';

export interface NutritionTargetVersion {
  id: string;
  user_id: string;
  effective_from: string; // ISO timestamp or YYYY-MM-DD
  effective_to: string | null; // null for current active target
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  source: TargetVersionSource;
  created_at: string;
}

export type ProgressUpdateAction =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'manual_override'
  | 'accepted_recommendation'
  | 'kept_previous'
  | 'customized';

export interface NutritionProgressUpdate {
  id: string;
  user_id: string;
  recorded_at: string; // ISO timestamp from clock.now()
  weight_kg: number;
  previous_weight_kg: number | null;
  weight_change_kg: number | null;
  days_since_last_update: number | null;
  active_target_calories: number;
  active_target_protein: number;
  active_target_carbs: number;
  active_target_fat: number;
  goal: FitnessGoal;
  expected_trend: string;
  actual_trend: string;
  fitbee_recommended_calories: number | null;
  fitbee_recommended_protein: number | null;
  fitbee_recommended_carbs: number | null;
  fitbee_recommended_fat: number | null;
  statement_ids: string[] | null;
  user_action: ProgressUpdateAction;
  user_selected_calories: number | null;
  user_selected_protein: number | null;
  user_selected_carbs: number | null;
  user_selected_fat: number | null;
  created_at: string;
  // Component compatibility aliases
  date?: string;
  weight?: number;
  previous_weight?: number;
  target_calories_at_time?: number;
  target_protein_at_time?: number;
  target_carbs_at_time?: number;
  target_fat_at_time?: number;
  target_source_at_time?: string;
}
