export interface ExerciseModelConfig {
  primaryHighlightMeshNames: string[];
  secondaryHighlightMeshNames: string[];
  animationKey: string;
  category?: string;
  cameraFocusBone?: string;
  cameraOffsetY?: number;
}

export interface ExerciseDetailItem {
  id: string;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  location: 'Home' | 'Home Equipment' | 'Gym';
  equipment: string;
  target: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  howToPerform: string[];
  tips: string[];
  modelConfig: ExerciseModelConfig;
}
