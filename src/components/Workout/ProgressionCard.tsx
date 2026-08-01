import React, { useEffect, useState } from 'react';
import { Card } from '../common/Card';
import { UserWorkoutExercise, WorkoutLogSet } from '../../types/database.types';
import { ProgressionRecommendation } from '../../types/fitness.types';
import { calculateNextExerciseTarget } from '../../utils/progressionEngine';
import { supabase } from '../../services/supabaseClient';

interface ProgressionCardProps {
  exercises: UserWorkoutExercise[];
  userId: string;
}

export const ProgressionCard: React.FC<ProgressionCardProps> = ({ exercises, userId }) => {
  const [recommendations, setRecommendations] = useState<ProgressionRecommendation[]>([]);

  useEffect(() => {
    if (exercises && exercises.length > 0 && userId) {
      // Fetch recent sets history for these exercises
      const exIds = exercises.map((e) => e.exercise_id);
      supabase
        .from('workout_log_sets')
        .select('*')
        .in('exercise_id', exIds)
        .order('id', { ascending: false })
        .limit(50)
        .then(({ data }) => {
          const recentSets: WorkoutLogSet[] = data || [];
          const recs = exercises.map((ex) => calculateNextExerciseTarget(ex, recentSets));
          setRecommendations(recs);
        });
    }
  }, [exercises, userId]);

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <Card title="Progression Overload Recommendations" subtitle="Calculated deterministically from your recorded performance">
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.exerciseId}
            className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs"
          >
            <div>
              <span className="font-semibold text-zinc-200 block">{rec.exerciseName}</span>
              <span className="text-[10px] text-zinc-400 mt-0.5 block">{rec.reason}</span>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5 font-bold text-amber-400">
                <span>{rec.previousWeightKg} kg</span>
                <span className="text-zinc-500">→</span>
                <span className="text-emerald-400">{rec.suggestedWeightKg} kg</span>
              </div>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                Target: {rec.suggestedReps} reps
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
