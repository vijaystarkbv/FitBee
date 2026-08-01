import React, { useState } from 'react';
import { UserWorkout, UserWorkoutExercise, Exercise } from '../../types/database.types';
import { Card } from '../common/Card';
import { ExerciseCard } from './ExerciseCard';
import { Button } from '../common/Button';
import { RestTimer } from '../common/RestTimer';
import { AddExerciseModal } from './AddExerciseModal';
import { supabase } from '../../services/supabaseClient';

interface WorkoutCardProps {
  workout: UserWorkout;
  exercises: UserWorkoutExercise[];
  onSaveWorkout: (
    notes: string,
    completedSets: Array<{ exerciseId: string; setNumber: number; reps: number; weightKg: number }>
  ) => Promise<void>;
  onRefreshWorkout?: () => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  exercises,
  onSaveWorkout,
  onRefreshWorkout,
}) => {
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Local state for exercise sets with set completion checkmarks
  const [sessionSets, setSessionSets] = useState<{
    [exerciseId: string]: Array<{
      setNumber: number;
      reps: number;
      weightKg: number;
      isCompleted: boolean;
    }>;
  }>(() => {
    const initialState: any = {};
    exercises.forEach((ex) => {
      const setsArray = [];
      for (let i = 1; i <= ex.target_sets; i++) {
        setsArray.push({
          setNumber: i,
          reps: ex.target_reps,
          weightKg: ex.target_weight_kg || 0,
          isCompleted: false,
        });
      }
      initialState[ex.exercise_id] = setsArray;
    });
    return initialState;
  });

  const handleUpdateSet = (
    exerciseId: string,
    setNumber: number,
    weightKg: number,
    reps: number
  ) => {
    setSessionSets((prev) => {
      const currentSets = prev[exerciseId] || [];
      const updated = currentSets.map((s) =>
        s.setNumber === setNumber ? { ...s, weightKg, reps } : s
      );
      return { ...prev, [exerciseId]: updated };
    });
  };

  const handleToggleSetComplete = (exerciseId: string, setNumber: number) => {
    setSessionSets((prev) => {
      const currentSets = prev[exerciseId] || [];
      const updated = currentSets.map((s) =>
        s.setNumber === setNumber ? { ...s, isCompleted: !s.isCompleted } : s
      );
      return { ...prev, [exerciseId]: updated };
    });
    setShowRestTimer(true);
  };

  const handleAddExerciseToRoutine = async (
    exercise: Exercise,
    targetSets: number,
    targetReps: number,
    targetWeightKg: number
  ) => {
    await supabase.from('user_workout_exercises').insert({
      user_workout_id: workout.id,
      exercise_id: exercise.id,
      order_index: exercises.length + 1,
      target_sets: targetSets,
      target_reps: targetReps,
      target_weight_kg: targetWeightKg,
    });

    if (onRefreshWorkout) onRefreshWorkout();
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccessMessage(null);
    try {
      const flattenedSets: Array<{
        exerciseId: string;
        setNumber: number;
        reps: number;
        weightKg: number;
      }> = [];

      Object.entries(sessionSets).forEach(([exId, setList]) => {
        setList.forEach((s) => {
          flattenedSets.push({
            exerciseId: exId,
            setNumber: s.setNumber,
            reps: s.reps,
            weightKg: s.weightKg,
          });
        });
      });

      await onSaveWorkout(notes, flattenedSets);
      setNotes('');
      setSaveSuccessMessage('✓ Workout session saved successfully!');

      setTimeout(() => {
        setSaveSuccessMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error(err);
      alert(`Failed to save workout session: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      title={workout.name}
      subtitle="Log your sets and exercise performance"
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRestTimer(!showRestTimer)}
            className="text-xs font-semibold bg-zinc-800 text-amber-400 hover:bg-zinc-700 px-2.5 py-1 rounded-lg transition-colors"
          >
            ⏱️ {showRestTimer ? 'Hide Rest Timer' : 'Rest Timer'}
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
          >
            + Add Exercise
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {saveSuccessMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg font-semibold animate-in fade-in">
            {saveSuccessMessage}
          </div>
        )}

        {/* Optional Active Rest Timer */}
        {showRestTimer && (
          <div className="animate-in fade-in duration-200">
            <RestTimer defaultSeconds={60} />
          </div>
        )}

        {/* Exercise List */}
        <div className="space-y-4">
          {exercises.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exerciseItem={ex}
              sets={sessionSets[ex.exercise_id] || []}
              onUpdateSet={(setNum, weight, reps) =>
                handleUpdateSet(ex.exercise_id, setNum, weight, reps)
              }
              onToggleSetComplete={(setNum) => handleToggleSetComplete(ex.exercise_id, setNum)}
            />
          ))}
        </div>

        {/* Optional Workout Notes */}
        <div className="space-y-1.5 pt-2 border-t border-zinc-800">
          <label className="text-xs font-semibold text-zinc-300">Workout Notes (Optional)</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='e.g., "Felt strong today", "Shoulder felt tight"'
            className="input-field"
          />
        </div>

        <Button onClick={handleSave} isLoading={isSaving} className="w-full">
          Save Completed Workout
        </Button>
      </div>

      <AddExerciseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddExercise={handleAddExerciseToRoutine}
      />
    </Card>
  );
};
