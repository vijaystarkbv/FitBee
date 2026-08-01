import React from 'react';
import { Card } from '../common/Card';
import { WorkoutLog } from '../../types/database.types';
import { formatDateReadable } from '../../utils/formatters';

interface WorkoutHistoryViewProps {
  logs: WorkoutLog[];
}

export const WorkoutHistoryView: React.FC<WorkoutHistoryViewProps> = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <Card title="Past Workout Log History">
        <p className="text-xs text-zinc-400 py-2">No completed workouts logged yet. Complete your first session above!</p>
      </Card>
    );
  }

  return (
    <Card title="Past Workout History" subtitle="Your recorded training sessions and notes">
      <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between font-semibold text-zinc-200">
              <span className="text-amber-400 font-bold">Session</span>
              <span className="text-zinc-400">{formatDateReadable(log.logged_at)}</span>
            </div>

            {log.notes && (
              <p className="text-zinc-300 italic text-[11px] bg-zinc-950/60 p-2 rounded border border-zinc-800/80">
                "{log.notes}"
              </p>
            )}

            {log.workout_log_sets && log.workout_log_sets.length > 0 && (
              <div className="pt-1 text-[11px] text-zinc-400 space-y-0.5">
                {log.workout_log_sets.map((s) => (
                  <div key={s.id} className="flex justify-between">
                    <span>{s.exercise?.name || 'Exercise'} (Set {s.set_number})</span>
                    <span className="font-semibold text-zinc-200">{s.reps_completed} reps @ {s.weight_kg} kg</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
