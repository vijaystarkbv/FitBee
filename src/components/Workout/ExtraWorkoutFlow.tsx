import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { MasterExercise } from '../../types/database.types';
import { ExerciseLibraryFlow } from './ExerciseLibrary/ExerciseLibraryFlow';
import { saveExtraWorkoutSession } from '../../services/workoutHistoryService';
import { useClock } from '../../hooks/useClock';
import './ExerciseLibrary/exerciseLibrary.css';

interface ExtraWorkoutFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

interface ExtraExerciseSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  timeSeconds: number;
}

interface SelectedExerciseData {
  masterEx: MasterExercise;
  sets: ExtraExerciseSet[];
}

export const ExtraWorkoutFlow: React.FC<ExtraWorkoutFlowProps> = ({ onBack, onComplete }) => {
  const { now } = useClock();

  const [step, setStep] = useState<'select' | 'perform'>('select');
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [exercisesData, setExercisesData] = useState<SelectedExerciseData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  // When user finishes selection in ExerciseLibraryFlow
  const handleExercisesSelected = async (names: string[]) => {
    // Deduplicate names while preserving order
    const uniqueNames = Array.from(new Set(names.filter(Boolean)));
    if (uniqueNames.length === 0) return;
    setLoading(true);
    try {
      // Query master exercises for selected names
      const { data, error } = await supabase
        .from('master_exercises')
        .select('*')
        .in('exercise_name', uniqueNames);

      if (error) throw error;

      // Index master exercises by lowercase trimmed exercise_name to deduplicate any duplicate DB rows
      const exerciseMap = new Map<string, MasterExercise>();
      (data || []).forEach((ex: MasterExercise) => {
        const key = (ex.exercise_name || ex.name || '').trim().toLowerCase();
        if (key && !exerciseMap.has(key)) {
          exerciseMap.set(key, ex);
        }
      });

      // Map 1-to-1 against unique selected names
      const mapped: SelectedExerciseData[] = [];
      const validNames: string[] = [];

      uniqueNames.forEach((name) => {
        const key = name.trim().toLowerCase();
        const ex = exerciseMap.get(key);
        if (ex) {
          validNames.push(ex.exercise_name || name);
          mapped.push({
            masterEx: ex,
            sets: [
              { setNumber: 1, weightKg: 0, reps: 10, timeSeconds: 60 },
              { setNumber: 2, weightKg: 0, reps: 10, timeSeconds: 60 },
              { setNumber: 3, weightKg: 0, reps: 10, timeSeconds: 60 },
            ],
          });
        }
      });

      setSelectedNames(validNames);
      setExercisesData(mapped);
      setStep('perform');
    } catch (err) {
      console.error('Failed to load selected exercises for extra workout:', err);
      alert('Failed to load selected exercises. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSet = (exIndex: number) => {
    setExercisesData((prev) => {
      const copy = [...prev];
      const ex = copy[exIndex];
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSetNumber = ex.sets.length + 1;
      ex.sets.push({
        setNumber: newSetNumber,
        weightKg: lastSet ? lastSet.weightKg : 0,
        reps: lastSet ? lastSet.reps : 10,
        timeSeconds: lastSet ? lastSet.timeSeconds : 60,
      });
      return copy;
    });
  };

  const handleRemoveSet = (exIndex: number, setIndex: number) => {
    setExercisesData((prev) => {
      const copy = [...prev];
      const ex = copy[exIndex];
      if (ex.sets.length <= 1) return prev; // Keep at least one set
      ex.sets = ex.sets.filter((_, idx) => idx !== setIndex).map((s, idx) => ({
        ...s,
        setNumber: idx + 1,
      }));
      return copy;
    });
  };

  const handleUpdateSetField = (
    exIndex: number,
    setIndex: number,
    field: 'weightKg' | 'reps' | 'timeSeconds',
    value: number
  ) => {
    setExercisesData((prev) => {
      const copy = [...prev];
      const set = copy[exIndex].sets[setIndex];
      if (set) {
        set[field] = Math.max(0, value);
      }
      return copy;
    });
  };

  const handleSaveWorkout = async () => {
    setIsSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) throw new Error('Not authenticated');

      const allSetsToSave: Array<{
        exerciseId: string;
        exerciseName: string;
        setNumber: number;
        weightKg: number;
        repsCompleted: number | null;
        durationSeconds: number | null;
      }> = [];

      exercisesData.forEach((exData) => {
        const isTimer = exData.masterEx.tracking_type === 'timer';
        exData.sets.forEach((s) => {
          allSetsToSave.push({
            exerciseId: exData.masterEx.id,
            exerciseName: exData.masterEx.exercise_name,
            setNumber: s.setNumber,
            weightKg: s.weightKg,
            repsCompleted: isTimer ? null : s.reps,
            durationSeconds: isTimer ? s.timeSeconds : null,
          });
        });
      });

      await saveExtraWorkoutSession(
        session.user.id,
        now,
        1800, // 30 minutes default duration
        notes || 'Extra workout completed',
        allSetsToSave
      );

      onComplete();
    } catch (err) {
      console.error('Failed to save extra workout:', err);
      alert('Failed to save workout. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '60px 24px', textAlign: 'center', color: '#6B7280', fontFamily: "'Inter', sans-serif" }}>
        Loading selected exercises...
      </div>
    );
  }

  if (step === 'select') {
    return (
      <ExerciseLibraryFlow
        onBackToWorkout={onBack}
        mode="select"
        maxSelection={4}
        onSelectMultipleForTemplate={handleExercisesSelected}
        initialSelectedExercises={selectedNames}
      />
    );
  }

  return (
    <div
      style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: '20px 24px 100px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── Top Back Button ── */}
      <button
        type="button"
        onClick={() => setStep('select')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 500,
          color: '#6B7280',
          padding: 0,
          marginBottom: 16,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span>Change Exercises</span>
      </button>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: '#6B9FE8',
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 750, color: '#6B9FE8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            One-Day Session
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', margin: '4px 0 0' }}>
          Extra Workout
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
          {now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          {' · '}{exercisesData.length} {exercisesData.length === 1 ? 'Exercise' : 'Exercises'}
        </p>
      </div>

      {/* ── Exercise Sets Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 24 }}>
        {exercisesData.map((exData, exIdx) => {
          const ex = exData.masterEx;
          const isTimer = ex.tracking_type === 'timer';

          return (
            <div
              key={ex.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: '20px 18px',
                border: '1px solid #E8E8E6',
                boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
              }}
            >
              {/* Exercise Header */}
              <div style={{ marginBottom: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 750, color: '#1F2937', margin: 0 }}>
                  {ex.exercise_name}
                </h3>
                <span style={{ fontSize: 12, color: '#6B7280' }}>
                  {ex.exercise_category} · {ex.tracking_type === 'timer' ? 'Timed Exercise' : 'Rep-based'}
                </span>
              </div>

              {/* Sets Table */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                {exData.sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FAFAF8',
                      padding: '10px 12px',
                      borderRadius: 14,
                      border: '1px solid #E8E8E6',
                    }}
                  >
                    {/* Set # */}
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#6B7280', width: 44 }}>
                      Set {set.setNumber}
                    </span>

                    {/* Weight Input (kg) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={set.weightKg === 0 ? '' : set.weightKg}
                        placeholder="0"
                        onChange={(e) =>
                          handleUpdateSetField(
                            exIdx,
                            setIdx,
                            'weightKg',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        style={{
                          width: 54,
                          height: 34,
                          borderRadius: 8,
                          border: '1px solid #D1D5DB',
                          textAlign: 'center',
                          fontSize: 13,
                          fontWeight: 600,
                          backgroundColor: '#FFFFFF',
                        }}
                      />
                      <span style={{ fontSize: 12, color: '#6B7280' }}>kg</span>
                    </div>

                    {/* Reps or Timer Input */}
                    {isTimer ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="number"
                          min="5"
                          step="5"
                          value={set.timeSeconds}
                          onChange={(e) =>
                            handleUpdateSetField(
                              exIdx,
                              setIdx,
                              'timeSeconds',
                              parseInt(e.target.value) || 0
                            )
                          }
                          style={{
                            width: 54,
                            height: 34,
                            borderRadius: 8,
                            border: '1px solid #D1D5DB',
                            textAlign: 'center',
                            fontSize: 13,
                            fontWeight: 600,
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                        <span style={{ fontSize: 12, color: '#6B7280' }}>sec</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={set.reps}
                          onChange={(e) =>
                            handleUpdateSetField(
                              exIdx,
                              setIdx,
                              'reps',
                              parseInt(e.target.value) || 0
                            )
                          }
                          style={{
                            width: 54,
                            height: 34,
                            borderRadius: 8,
                            border: '1px solid #D1D5DB',
                            textAlign: 'center',
                            fontSize: 13,
                            fontWeight: 600,
                            backgroundColor: '#FFFFFF',
                          }}
                        />
                        <span style={{ fontSize: 12, color: '#6B7280' }}>reps</span>
                      </div>
                    )}

                    {/* Remove set button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveSet(exIdx, setIdx)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                      }}
                      aria-label="Remove set"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Set Button */}
              <button
                type="button"
                onClick={() => handleAddSet(exIdx)}
                style={{
                  width: '100%',
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: '#FAFAF8',
                  border: '1.5px dashed #CBD5E1',
                  color: '#5C8D89',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 650,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                + Add Set
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Optional Notes ── */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
          Notes (optional)
        </label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How did this extra workout feel?"
          style={{
            width: '100%',
            borderRadius: 14,
            border: '1px solid #E5E7EB',
            padding: '10px 14px',
            fontFamily: 'inherit',
            fontSize: 13,
            backgroundColor: '#FFFFFF',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* ── Action Buttons ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          onClick={handleSaveWorkout}
          disabled={isSaving}
          style={{
            width: '100%',
            height: 52,
            borderRadius: 18,
            backgroundColor: '#5C8D89',
            color: '#FFFFFF',
            border: 'none',
            fontFamily: 'inherit',
            fontSize: 15,
            fontWeight: 700,
            cursor: isSaving ? 'not-allowed' : 'pointer',
            opacity: isSaving ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 4px 14px rgba(92, 141, 137, 0.25)',
          }}
        >
          {isSaving ? 'Saving Workout...' : 'Finish & Save Workout'}
        </button>

        <button
          type="button"
          onClick={onBack}
          style={{
            width: '100%',
            height: 46,
            borderRadius: 18,
            backgroundColor: '#FAFAF8',
            color: '#6B7280',
            border: '1px solid #E8E8E6',
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
