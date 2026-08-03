import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Exercise } from '../../types/database.types';
import { supabase } from '../../services/supabaseClient';
import { Button } from '../common/Button';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (exercise: Exercise, targetSets: number, targetReps: number, targetWeightKg: number) => Promise<void>;
}

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isOpen,
  onClose,
  onAddExercise,
}) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(10);
  const [weightKg, setWeightKg] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      supabase.from('master_exercises').select('*').order('exercise_name').then(({ data }) => {
        if (data && data.length > 0) {
          const mapped: Exercise[] = data.map((d: any) => ({
            id: d.id,
            name: d.exercise_name || d.name,
            category: d.exercise_category || d.category,
            equipment_required: d.equipment_required,
            created_at: d.created_at
          }));
          setExercises(mapped);
          setSelectedExerciseId(mapped[0].id);
        }
      });
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    const selected = exercises.find((ex) => ex.id === selectedExerciseId);
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await onAddExercise(selected, sets, reps, weightKg);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to add exercise');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Exercise to Routine">
      <div className="space-y-4">
        {/* Exercise Selection */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-300">Select Exercise</label>
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="input-field"
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.category} • {ex.equipment_required})
              </option>
            ))}
          </select>
        </div>

        {/* Target Sets & Reps */}
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Sets</label>
            <input
              type="number"
              min="1"
              max="10"
              value={sets}
              onChange={(e) => setSets(parseInt(e.target.value) || 3)}
              className="input-field"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Target Reps</label>
            <input
              type="number"
              min="1"
              max="50"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value) || 10)}
              className="input-field"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Weight (kg)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={weightKg}
              onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} className="w-1/3">
            Cancel
          </Button>
          <Button onClick={handleConfirm} isLoading={isSubmitting} className="w-2/3">
            Add to Routine
          </Button>
        </div>
      </div>
    </Modal>
  );
};
