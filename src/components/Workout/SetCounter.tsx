import React from 'react';
import { NumberPicker } from '../common/NumberPicker';

interface SetCounterProps {
  setNumber: number;
  weightKg: number;
  reps: number;
  isCompleted?: boolean;
  weightUnit?: 'kg' | 'lbs';
  onUpdate: (weightKg: number, reps: number) => void;
  onToggleComplete?: () => void;
}

export const SetCounter: React.FC<SetCounterProps> = ({
  setNumber,
  weightKg,
  reps,
  isCompleted = false,
  weightUnit = 'kg',
  onUpdate,
  onToggleComplete,
}) => {
  return (
    <div
      className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
        isCompleted
          ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
          : 'bg-zinc-900 border-zinc-800'
      }`}
    >
      <div className="flex items-center gap-2">
        {onToggleComplete && (
          <button
            type="button"
            onClick={onToggleComplete}
            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-colors ${
              isCompleted
                ? 'bg-emerald-500 text-zinc-950'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:border-amber-400'
            }`}
          >
            {isCompleted ? '✓' : ''}
          </button>
        )}
        <span className="font-bold text-xs text-amber-400 min-w-10">Set {setNumber}</span>
      </div>

      <div className="flex items-center gap-2">
        <NumberPicker
          label="Weight"
          value={weightKg}
          onChange={(newWeight) => onUpdate(newWeight, reps)}
          step={0.5}
          unit={weightUnit}
        />
        <NumberPicker
          label="Reps"
          value={reps}
          onChange={(newReps) => onUpdate(weightKg, newReps)}
          step={1}
        />
      </div>
    </div>
  );
};
