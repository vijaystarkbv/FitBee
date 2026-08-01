import React, { useMemo } from 'react';
import { ProgressRing } from './ProgressRing';
import { Profile, NutritionLog } from '../../types/database.types';
import './home.css';

interface HomeDashboardProps {
  profile: Profile;
  todayNutrition: NutritionLog | null;
  onResumeOnboarding?: () => void;
  onNavigateSettings: () => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  todayNutrition,
  onResumeOnboarding,
  onNavigateSettings,
}) => {
  const greeting = useMemo(() => getGreeting(), []);
  const displayName = profile.display_name || 'there';

  // Current nutrition from today's log
  const currentCalories = todayNutrition?.total_calories || 0;
  const currentProtein = todayNutrition?.total_protein || 0;
  const currentCarbs = todayNutrition?.total_carbs || 0;
  const currentFat = todayNutrition?.total_fat || 0;

  // Goals from profile (set by Gemini after onboarding)
  const goalCalories = profile.target_calories || 2000;
  const goalProtein = profile.target_protein || 120;
  const goalCarbs = profile.target_carbs || 250;
  const goalFat = profile.target_fat || 55;

  return (
    <>
      {/* ── Top bar ── */}
      <div className="hd-topbar">
        <div className="hd-logo">
          <div className="hd-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="hd-logo-text">FitBee</span>
        </div>
        <button className="hd-topbar-avatar" onClick={onNavigateSettings}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>

      {/* ── Greeting ── */}
      <div className="hd-greeting-section">
        <p className="hd-greeting">{greeting}</p>
        <h1 className="hd-greeting-name">Welcome back, {displayName}</h1>
      </div>

      {/* ── Onboarding banner (if skipped) ── */}
      {onResumeOnboarding && (
        <div className="hd-onboarding-banner">
          <button onClick={onResumeOnboarding}>
            ✨ Complete your onboarding to personalize your experience
          </button>
        </div>
      )}

      {/* ── Nutrition card with progress rings ── */}
      <div className="hd-nutrition-card">
        <div className="hd-card">
          <h2 className="hd-card-title">Today's Nutrition</h2>
          <p className="hd-card-subtitle">Track your daily intake</p>

          <div className="hd-rings-grid">
            <ProgressRing
              current={currentCalories}
              goal={goalCalories}
              label="Calories"
              unit="kcal"
              animationDelay={200}
            />
            <ProgressRing
              current={currentProtein}
              goal={goalProtein}
              label="Protein"
              unit="g"
              animationDelay={350}
            />
            <ProgressRing
              current={currentCarbs}
              goal={goalCarbs}
              label="Carbs"
              unit="g"
              animationDelay={500}
            />
            <ProgressRing
              current={currentFat}
              goal={goalFat}
              label="Fat"
              unit="g"
              animationDelay={650}
            />
          </div>
        </div>
      </div>

      {/* ── Create Your Plan card (shown when onboarding complete) ── */}
      {profile.onboarding_completed && (
        <div className="hd-plan-card">
          <div className="hd-plan-card-inner">
            <div>
              <p className="hd-plan-title">Create Your Plan</p>
              <p className="hd-plan-subtitle">Build a personalized workout routine</p>
            </div>
            <button className="hd-plan-btn">Coming Soon</button>
          </div>
        </div>
      )}
    </>
  );
};
