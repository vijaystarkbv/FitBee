import React from 'react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';

interface NutritionSummaryCardProps {
  currentCalories: number;
  targetCalories: number;
  currentProtein: number;
  targetProtein: number;
  currentCarbs: number;
  targetCarbs: number;
  currentFat: number;
  targetFat: number;
  onOpenNutritionTab: () => void;
}

export const NutritionSummaryCard: React.FC<NutritionSummaryCardProps> = ({
  currentCalories,
  targetCalories,
  currentProtein,
  targetProtein,
  currentCarbs,
  targetCarbs,
  currentFat,
  targetFat,
  onOpenNutritionTab,
}) => {
  return (
    <Card
      title="Today's Nutrition"
      action={
        <button
          onClick={onOpenNutritionTab}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          + Log Meal
        </button>
      }
    >
      <div className="space-y-3">
        <ProgressBar
          label="Calories"
          current={currentCalories}
          target={targetCalories}
          unit="kcal"
          color="amber"
        />

        <div className="grid grid-cols-3 gap-2 pt-1 text-xs">
          <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-center">
            <span className="text-zinc-400 text-[10px] block">Protein</span>
            <span className="font-bold text-emerald-400">
              {currentProtein} / {targetProtein}g
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-center">
            <span className="text-zinc-400 text-[10px] block">Carbs</span>
            <span className="font-bold text-blue-400">
              {currentCarbs} / {targetCarbs}g
            </span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-center">
            <span className="text-zinc-400 text-[10px] block">Fat</span>
            <span className="font-bold text-purple-400">
              {currentFat} / {targetFat}g
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
