import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface NutritionCardProps {
  currentCalories: number;
  targetCalories: number;
  currentProtein: number;
  targetProtein: number;
  currentCarbs: number;
  targetCarbs: number;
  currentFat: number;
  targetFat: number;
}

export const NutritionCard: React.FC<NutritionCardProps> = ({
  currentCalories,
  targetCalories,
  currentProtein,
  targetProtein,
  currentCarbs,
  targetCarbs,
  currentFat,
  targetFat,
}) => {
  return (
    <Card title="Today's Nutrition Summary">
      <div className="space-y-4">
        {/* Calories Progress */}
        <ProgressBar
          label="Calories"
          current={currentCalories}
          target={targetCalories}
          unit="kcal"
          color="amber"
        />

        {/* Macros Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <ProgressBar
            label="Protein"
            current={currentProtein}
            target={targetProtein}
            unit="g"
            color="emerald"
          />
          <ProgressBar
            label="Carbohydrates"
            current={currentCarbs}
            target={targetCarbs}
            unit="g"
            color="blue"
          />
          <ProgressBar
            label="Fat"
            current={currentFat}
            target={targetFat}
            unit="g"
            color="purple"
          />
        </div>
      </div>
    </Card>
  );
};
