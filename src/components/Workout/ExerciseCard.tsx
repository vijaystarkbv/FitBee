import React from 'react';
import { UserWorkoutExercise } from '../../types/database.types';
import { SetCounter } from './SetCounter';

interface ExerciseCardProps {
  exerciseItem: UserWorkoutExercise;
  sets: Array<{ setNumber: number; reps: number; weightKg: number; isCompleted?: boolean }>;
  onUpdateSet: (setNumber: number, weightKg: number, reps: number) => void;
  onToggleSetComplete?: (setNumber: number) => void;
  weightUnit?: 'kg' | 'lbs';
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseItem,
  sets,
  onUpdateSet,
  onToggleSetComplete,
  weightUnit = 'kg',
}) => {
  const exerciseName = exerciseItem.exercise?.name || 'Exercise';

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-zinc-100">{exerciseName}</h4>
          <p className="text-xs text-zinc-400">
            Target: {exerciseItem.target_sets} sets × {exerciseItem.target_reps} reps
          </p>
        </div>
        <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md font-medium capitalize">
          {exerciseItem.exercise?.category || 'general'}
        </span>
      </div>

      {/* Sets List */}
      <div className="space-y-2">
        {sets.map((set) => (
          <SetCounter
            key={set.setNumber}
            setNumber={set.setNumber}
            weightKg={set.weightKg}
            reps={set.reps}
            isCompleted={set.isCompleted}
            weightUnit={weightUnit}
            onUpdate={(weightKg, reps) => onUpdateSet(set.setNumber, weightKg, reps)}
            onToggleComplete={onToggleSetComplete ? () => onToggleSetComplete(set.setNumber) : undefined}
          />
        ))}
      </div>
    </div>
  );
};
