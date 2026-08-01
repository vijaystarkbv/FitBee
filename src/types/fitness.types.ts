import { Exercise } from './database.types';

export interface EquipmentDetail {
  max_weight_kg?: number;
  resistance_level?: string;
}

export interface OnboardingFormState {
  display_name?: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height_cm: number;
  height_ft?: number;
  height_in?: number;
  weight_kg: number;
  weight_lbs?: number;
  target_weight_kg?: number;
  target_weight_lbs?: number;
  height_unit: 'cm' | 'ft';
  weight_unit: 'kg' | 'lbs';
  goal: 'gain_muscle' | 'lose_fat' | 'maintain_weight' | 'improve_fitness';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active';
  training_location: 'home' | 'gym' | 'both' | 'none';
  has_dumbbells: boolean;
  max_dumbbell_weight_kg: number | null;
  max_dumbbell_weight_lbs?: number | null;
  equipment: string[];
  equipmentDetails: Record<string, EquipmentDetail>;
  target_calories: number;
  target_protein: number;
  target_carbs: number;
  target_fat: number;
}

export interface ProgressionRecommendation {
  exerciseId: string;
  exerciseName: string;
  previousWeightKg: number;
  previousReps: number;
  suggestedWeightKg: number;
  suggestedReps: number;
  reason: string;
}

export interface ActiveExerciseSession {
  exercise: Exercise;
  targetSets: number;
  targetReps: number;
  targetWeightKg: number;
  setsCompleted: Array<{
    setNumber: number;
    reps: number;
    weightKg: number;
  }>;
}

export interface DailyNutritionSummary {
  date: string;
  caloriesCurrent: number;
  caloriesTarget: number;
  proteinCurrent: number;
  proteinTarget: number;
  carbsCurrent: number;
  carbsTarget: number;
  fatCurrent: number;
  fatTarget: number;
}
