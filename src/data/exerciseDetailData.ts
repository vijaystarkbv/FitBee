import { ExerciseDetailItem } from '../types/exerciseDetail';

export const EXERCISE_DETAILS_REGISTRY: Record<string, ExerciseDetailItem> = {
  'Neck Flexion': {
    id: 'neck_flexion',
    name: 'Neck Flexion',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Bodyweight',
    target: 'Neck Mobility',
    primaryMuscles: ['Neck'],
    secondaryMuscles: [],
    howToPerform: [
      'Stand or sit upright with your shoulders relaxed.',
      'Slowly lower your chin toward your chest without rounding your back.',
      'Pause briefly when you feel a gentle stretch in the back of your neck.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Move only until you feel a comfortable stretch.',
      'Keep your shoulders relaxed.',
      'Perform the movement slowly.',
      'Avoid jerking your head.'
    ],
    modelConfig: {
      primaryHighlightMeshNames: ['neck', 'sternocleidomastoid'],
      secondaryHighlightMeshNames: [],
      animationKey: 'neck_flexion',
      cameraFocusBone: 'neck',
      cameraOffsetY: 0.15
    }
  },
  'Neck Extension': {
    id: 'neck_extension',
    name: 'Neck Extension',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Bodyweight',
    target: 'Neck Mobility',
    primaryMuscles: ['Neck'],
    secondaryMuscles: [],
    howToPerform: [
      'Stand or sit upright with your shoulders relaxed and your head facing forward.',
      'Slowly lift your chin and gently tilt your head backward using only your neck.',
      'Pause briefly when you feel a comfortable stretch in the front of your neck.',
      'Return slowly to the starting position with smooth, controlled movement.'
    ],
    tips: [
      'Move only within a comfortable range. Never force your neck backward.',
      'Keep your shoulders relaxed and avoid leaning your upper body.',
      'Perform the movement slowly and maintain full control throughout the exercise.',
      'Stop immediately if you experience pain, dizziness, or discomfort.'
    ],
    modelConfig: {
      primaryHighlightMeshNames: ['neck', 'sternocleidomastoid'],
      secondaryHighlightMeshNames: [],
      animationKey: 'neck_extension',
      cameraFocusBone: 'neck',
      cameraOffsetY: 0.15
    }
  }
};

export function getExerciseDetailByName(name: string): ExerciseDetailItem {
  if (EXERCISE_DETAILS_REGISTRY[name]) {
    return EXERCISE_DETAILS_REGISTRY[name];
  }

  // Fallback for unpopulated exercises during testing
  return {
    id: name.toLowerCase().replace(/\s+/g, '_'),
    name: name,
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Bodyweight',
    target: 'General Mobility',
    primaryMuscles: ['Target Muscle'],
    secondaryMuscles: [],
    howToPerform: [
      'Assume comfortable starting position.',
      'Execute movement with controlled velocity.',
      'Pause at maximum range of motion.',
      'Return smoothly to starting position.'
    ],
    tips: [
      'Maintain steady breathing throughout.',
      'Keep form controlled and avoid sudden snapping.'
    ],
    modelConfig: {
      primaryHighlightMeshNames: [],
      secondaryHighlightMeshNames: [],
      animationKey: 'default'
    }
  };
}
