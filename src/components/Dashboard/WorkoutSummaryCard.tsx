import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

interface WorkoutSummaryCardProps {
  workoutName: string;
  exerciseCount: number;
  lastLoggedDate: string | null;
  onStartWorkout: () => void;
}

export const WorkoutSummaryCard: React.FC<WorkoutSummaryCardProps> = ({
  workoutName,
  exerciseCount,
  lastLoggedDate,
  onStartWorkout,
}) => {
  return (
    <Card title="Today's Workout">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-sm text-zinc-100">{workoutName}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">{exerciseCount} Exercises Planned</p>
          </div>
          <span className="text-xs bg-zinc-800 text-amber-400 px-2.5 py-1 rounded-full font-semibold">
            {lastLoggedDate ? `Last done: ${lastLoggedDate}` : 'Ready'}
          </span>
        </div>

        <Button onClick={onStartWorkout} className="w-full">
          Start Workout Session
        </Button>
      </div>
    </Card>
  );
};
