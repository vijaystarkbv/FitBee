import React from 'react';
import { NutritionSummaryCard } from './NutritionSummaryCard';
import { WorkoutSummaryCard } from './WorkoutSummaryCard';
import { WeightHistoryCard } from './WeightHistoryCard';
import { Profile, NutritionLog, WeightLog, UserWorkout } from '../../types/database.types';

interface DashboardProps {
  profile: Profile;
  todayNutrition: NutritionLog | null;
  userWorkout: UserWorkout | null;
  exerciseCount: number;
  weightLogs: WeightLog[];
  onOpenNutritionTab: () => void;
  onOpenWorkoutTab: () => void;
  onLogNewWeight: (weightKg: number) => Promise<void>;
  onResumeOnboarding?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  todayNutrition,
  userWorkout,
  exerciseCount,
  weightLogs,
  onOpenNutritionTab,
  onOpenWorkoutTab,
  onLogNewWeight,
  onResumeOnboarding,
}) => {
  const goalDisplay = profile.goal ? profile.goal.replace(/_/g, ' ') : 'Not set';

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 px-4">
      {/* Onboarding pending banner */}
      {onResumeOnboarding && (
        <button
          onClick={onResumeOnboarding}
          className="w-full p-4 rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/5 text-amber-400 font-semibold text-sm text-center hover:bg-amber-500/10 transition-colors cursor-pointer"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          ✨ Complete your onboarding to personalize your experience
        </button>
      )}

      {/* Create Your Plan card — shown when onboarding is complete */}
      {profile.onboarding_completed && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-900 border border-zinc-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Create Your Plan</h3>
              <p className="text-xs text-zinc-400 mt-1">Your personalized workout plan is ready to be built.</p>
            </div>
            <button className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 font-semibold text-sm transition-colors cursor-pointer">
              Coming Soon
            </button>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100">Daily Dashboard</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Goal: <strong className="text-amber-400 capitalize">{goalDisplay}</strong> | Location: <strong className="text-zinc-200 capitalize">{profile.training_location || 'Not set'}</strong>
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Nutrition Summary */}
        <NutritionSummaryCard
          currentCalories={todayNutrition?.total_calories || 0}
          targetCalories={profile.target_calories || 2000}
          currentProtein={todayNutrition?.total_protein || 0}
          targetProtein={profile.target_protein || 120}
          currentCarbs={todayNutrition?.total_carbs || 0}
          targetCarbs={profile.target_carbs || 250}
          currentFat={todayNutrition?.total_fat || 0}
          targetFat={profile.target_fat || 55}
          onOpenNutritionTab={onOpenNutritionTab}
        />

        {/* Today's Workout Summary */}
        <WorkoutSummaryCard
          workoutName={userWorkout?.name || 'Starter Workout Routine'}
          exerciseCount={exerciseCount}
          lastLoggedDate={null}
          onStartWorkout={onOpenWorkoutTab}
        />
      </div>

      {/* Body Weight Tracking */}
      <WeightHistoryCard
        currentWeightKg={profile.weight_kg || 70}
        weightLogs={weightLogs}
        weightUnit={profile.weight_unit || 'kg'}
        onLogNewWeight={onLogNewWeight}
      />
    </div>
  );
};
