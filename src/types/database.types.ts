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

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  equipment_required: EquipmentRequired;
  created_at: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  location_type: TrainingLocation;
  requires_dumbbells: boolean;
  description: string | null;
}

export interface TemplateExercise {
  id: string;
  template_id: string;
  exercise_id: string;
  order_index: number;
  default_sets: number;
  default_reps: number;
}

export interface UserWorkout {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
}

export interface UserWorkoutExercise {
  id: string;
  user_workout_id: string;
  exercise_id: string;
  order_index: number;
  target_sets: number;
  target_reps: number;
  target_weight_kg: number;
  exercise?: Exercise;
}

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
