import React, { useState, useEffect, useCallback } from 'react';
import { Profile, NutritionLog } from '../../types/database.types';
import { getStreakSummary, StreakSummary, formatDateKey } from '../../services/streakService';
import {
  getUserNutritionTargets,
  calculateNutritionTargetsScore,
} from '../../services/nutritionHistoryService';
import { NutritionAnalysisSection } from './NutritionAnalysisSection';
import { NutritionHistoryPage } from './NutritionHistoryPage';
import { WorkoutHistoryPage } from './WorkoutHistoryPage';
import { WorkoutProgressPage } from './WorkoutProgressPage';
import { ExtraWorkoutFlow } from '../Workout/ExtraWorkoutFlow';
import { DailyHitlistPage } from './DailyHitlistPage';
import { fetchUserHabits, fetchHabitDataForDate } from '../../services/habitService';
import { Habit, HabitLog, HabitSession } from '../../types/database.types';
import { useClock } from '../../hooks/useClock';
import '../Home/home.css';

interface HabitsPageProps {
  profile: Profile;
  todayNutrition: NutritionLog | null;
  onBackToHome: () => void;
}

export const HabitsPage: React.FC<HabitsPageProps> = ({ profile, todayNutrition, onBackToHome }) => {
  const { now } = useClock();
  const todayKey = formatDateKey(now);
  const [summary, setSummary] = useState<StreakSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Daily Hitlist Preview State
  const [hitlistHabits, setHitlistHabits] = useState<Habit[]>([]);
  const [hitlistLogs, setHitlistLogs] = useState<Record<string, HabitLog>>({});
  const [hitlistSessions, setHitlistSessions] = useState<Record<string, HabitSession[]>>({});

  // Main navigation state: 'habit' | 'analysis'
  const [activeTab, setActiveTab] = useState<'habit' | 'analysis'>('habit');
  // Sub-view navigation state: 'main' | 'nutrition_history' | 'workout_history' | 'workout_progress' | 'extra_workout' | 'daily_hitlist'
  const [subView, setSubView] = useState<
    'main' | 'nutrition_history' | 'workout_history' | 'workout_progress' | 'extra_workout' | 'daily_hitlist'
  >('main');

  // Touch coordinates for mobile horizontal swipe
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const loadHitlistPreview = useCallback(async () => {
    try {
      const userHabits = await fetchUserHabits(profile.id);
      setHitlistHabits(userHabits);
      const data = await fetchHabitDataForDate(profile.id, todayKey);
      setHitlistLogs(data.logs);
      setHitlistSessions(data.sessions);
    } catch (err) {
      console.warn('Could not load hitlist preview in Habits tab:', err);
    }
  }, [profile.id, todayKey]);

  const fetchStreak = useCallback(async () => {
    try {
      const data = await getStreakSummary(profile);
      setSummary(data);
    } catch (err) {
      console.error('Failed to load streak summary for Habits page:', err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, todayKey]);

  useEffect(() => {
    fetchStreak();
    loadHitlistPreview();
  }, [fetchStreak, loadHitlistPreview]);

  const formattedToday = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Current nutrition from today's log
  const currentCalories = todayNutrition?.total_calories || 0;
  const currentProtein = todayNutrition?.total_protein || 0;
  const currentCarbs = todayNutrition?.total_carbs || 0;
  const currentFat = todayNutrition?.total_fat || 0;

  // Strict targets from user profile
  const targets = getUserNutritionTargets(profile);
  const goalCalories = targets.calories;
  const goalProtein = targets.protein;
  const goalCarbs = targets.carbs;
  const goalFat = targets.fat;

  // Overall 4-metric target completion score using target proximity
  const nutritionScoreResult = calculateNutritionTargetsScore(
    {
      calories: currentCalories,
      protein: currentProtein,
      carbs: currentCarbs,
      fat: currentFat,
    },
    targets
  );
  const nutritionTargetPercentage = nutritionScoreResult.overallScore;
  const isNutritionComplete = nutritionScoreResult.isCompleted;

  // Daily Hitlist completed count
  const completedHitlistCount = hitlistHabits.filter((h) => {
    if (h.type === 'DURATION') {
      const sessions = hitlistSessions[h.id] || [];
      const totalSec = sessions.reduce((acc, s) => acc + s.duration_seconds, 0);
      return h.target_duration_seconds ? totalSec >= h.target_duration_seconds : false;
    }
    return Boolean(hitlistLogs[h.id]?.is_completed);
  }).length;

  // Horizontal swipe gesture detection for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    // Must be predominantly horizontal swipe with distance > 45px
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0 && activeTab === 'habit') {
        // Swiped left -> advance to Analysis
        setActiveTab('analysis');
      } else if (deltaX > 0 && activeTab === 'analysis') {
        // Swiped right -> back to Habit
        setActiveTab('habit');
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  // If user opened dedicated History or Progress view
  if (subView === 'nutrition_history') {
    return (
      <NutritionHistoryPage
        profile={profile}
        onBackToAnalysis={() => setSubView('main')}
      />
    );
  }

  if (subView === 'workout_history') {
    return (
      <WorkoutHistoryPage
        profile={profile}
        onBackToAnalysis={() => setSubView('main')}
      />
    );
  }

  if (subView === 'workout_progress') {
    return (
      <WorkoutProgressPage
        profile={profile}
        onBackToAnalysis={() => setSubView('main')}
      />
    );
  }

  if (subView === 'extra_workout') {
    return (
      <ExtraWorkoutFlow
        onBack={() => setSubView('main')}
        onComplete={() => {
          setSubView('main');
          fetchStreak();
        }}
      />
    );
  }

  if (subView === 'daily_hitlist') {
    return (
      <DailyHitlistPage
        profile={profile}
        onBack={() => {
          setSubView('main');
          loadHitlistPreview();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px', textAlign: 'center', color: '#6B7280', fontFamily: "'Inter', sans-serif" }}>
        Loading Habits & Streak Progress...
      </div>
    );
  }

  return (
    <div
      className="habits-container-responsive"
      style={{ maxWidth: 520, margin: '0 auto', padding: '20px 24px 100px', fontFamily: "'Inter', sans-serif" }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* ── Back to Home button ── */}
      <button
        type="button"
        onClick={onBackToHome}
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
          marginBottom: 20,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>
          Daily Habits & Consistency
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>
          {formattedToday}
        </p>
      </div>

      {/* ── Segmented Two-State Tab Navigation (Habit | Analysis) ── */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#F3F4F6',
          borderRadius: 16,
          padding: 4,
          marginBottom: 24,
          position: 'relative',
        }}
        role="tablist"
        aria-label="Habits or Analysis views"
      >
        {/* Habit Tab Button */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'habit'}
          onClick={() => setActiveTab('habit')}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 12,
            border: 'none',
            backgroundColor: activeTab === 'habit' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'habit' ? '#1F2937' : '#6B7280',
            fontWeight: activeTab === 'habit' ? 700 : 550,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: activeTab === 'habit' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>Habit</span>
        </button>

        {/* Analysis Tab Button */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'analysis'}
          onClick={() => setActiveTab('analysis')}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 12,
            border: 'none',
            backgroundColor: activeTab === 'analysis' ? '#FFFFFF' : 'transparent',
            color: activeTab === 'analysis' ? '#1F2937' : '#6B7280',
            fontWeight: activeTab === 'analysis' ? 700 : 550,
            fontSize: 14,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: activeTab === 'analysis' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <span>Analysis</span>
        </button>
      </div>

      {/* ── View 1: Habit Content (Unchanged & Intact) ── */}
      {activeTab === 'habit' && (
        <div style={{ animation: 'fadeIn 220ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
          {/* Habit Completion Status Banner */}
          {summary && (
            <div
              style={{
                backgroundColor: summary.todayIsStreak ? '#E6F4EA' : '#FFFBEB',
                borderRadius: 20,
                padding: '16px 20px',
                border: summary.todayIsStreak ? '1px solid #A7F3D0' : '1px solid #FDE68A',
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: summary.todayIsStreak ? '#5E9F76' : '#F59E0B',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                }}
              >
                {summary.todayIsStreak ? '✓' : '⚡'}
              </div>

              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                  {summary.todayIsStreak
                    ? 'Today\'s Habits Completed!'
                    : 'Habits In Progress'}
                </h3>
                <p style={{ fontSize: 13, color: '#4B5563', margin: '2px 0 0' }}>
                  {summary.todayIsStreak
                    ? 'Streak day awarded for completing workout & nutrition targets.'
                    : 'Complete your workout and daily nutrition goals to secure today\'s streak.'}
                </p>
              </div>
            </div>
          )}

          {/* Daily Checklist Card */}
          <div className="hd-card" style={{ padding: 22, marginBottom: 20 }}>
            <h2 className="hd-card-title" style={{ marginBottom: 16 }}>
              Today's Habit Checklist
            </h2>

            {/* Habit 1: Workout / Rest Day */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 16,
                backgroundColor: '#FAFAF8',
                marginBottom: 12,
                border: '1px solid #E8E8E6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(92,141,137,0.12)', color: '#5C8D89', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 12h12" />
                    <path d="M4 8v8" />
                    <path d="M20 8v8" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 650, color: '#1F2937', margin: 0 }}>
                    {summary?.todayIsRestDay ? 'Scheduled Rest Day' : 'Workout Session'}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
                    {summary?.todayIsRestDay
                      ? 'Rest & recovery automatically satisfies workout requirement'
                      : 'Complete all exercises for today\'s routine'}
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: 12,
                  backgroundColor: summary?.todayWorkoutComplete ? '#E6F4EA' : '#F3F4F6',
                  color: summary?.todayWorkoutComplete ? '#5E9F76' : '#9CA3AF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {summary?.todayWorkoutComplete ? '✓ Satisfied' : 'Pending'}
              </div>
            </div>

            {/* Habit 2: Nutrition Targets */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                borderRadius: 16,
                backgroundColor: '#FAFAF8',
                border: '1px solid #E8E8E6',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(137,176,174,0.18)', color: '#89B0AE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
                    <path d="M15 2v18" />
                    <line x1="6" y1="2" x2="6" y2="22" />
                    <line x1="3" y1="2" x2="9" y2="2" />
                    <line x1="3" y1="6" x2="9" y2="6" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 650, color: '#1F2937', margin: 0 }}>
                    Nutrition Targets
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
                    Finished {nutritionTargetPercentage}% of today's target
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '4px 10px',
                  borderRadius: 12,
                  backgroundColor: isNutritionComplete ? '#E6F4EA' : '#F3F4F6',
                  color: isNutritionComplete ? '#5E9F76' : '#9CA3AF',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {isNutritionComplete ? '✓ Met' : 'Incomplete'}
              </div>
            </div>
          </div>

          {/* ── Your Daily Hitlist Card (Section 1) ── */}
          <div
            id="hitlist-entry-card"
            className="hd-card"
            onClick={() => setSubView('daily_hitlist')}
            style={{
              padding: 20,
              marginBottom: 20,
              cursor: 'pointer',
              transition: 'all 180ms ease',
              border: '1px solid #E8E8E6',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: hitlistHabits.length > 0 ? 10 : 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: 'rgba(92, 141, 137, 0.12)',
                    color: '#5C8D89',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                  }}
                >
                  📋
                </div>
                <div>
                  <h2 className="hd-card-title" style={{ margin: 0, fontSize: 16 }}>
                    Your Daily Hitlist
                  </h2>
                  <p style={{ fontSize: 13, color: '#6B7280', margin: '2px 0 0' }}>
                    {hitlistHabits.length === 0
                      ? 'Create your daily checklist habits'
                      : `${completedHitlistCount} of ${hitlistHabits.length} habits completed today`}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {hitlistHabits.length === 0 ? (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      backgroundColor: 'rgba(92, 141, 137, 0.12)',
                      color: '#5C8D89',
                      fontSize: 12,
                      fontWeight: 700,
                      border: '1px solid rgba(92, 141, 137, 0.25)',
                    }}
                  >
                    + Create
                  </span>
                ) : (
                  <span
                    style={{
                      padding: '4px 10px',
                      borderRadius: 12,
                      backgroundColor: completedHitlistCount === hitlistHabits.length && hitlistHabits.length > 0 ? '#EAF5EE' : '#F3F4F6',
                      color: completedHitlistCount === hitlistHabits.length && hitlistHabits.length > 0 ? '#2D6A4F' : '#6B7280',
                      fontSize: 12,
                      fontWeight: 750,
                    }}
                  >
                    {completedHitlistCount === hitlistHabits.length && hitlistHabits.length > 0
                      ? '✓ All Done'
                      : `${Math.round((completedHitlistCount / hitlistHabits.length) * 100)}%`}
                  </span>
                )}
                <span style={{ color: '#9CA3AF', fontSize: 16, marginLeft: 2 }}>→</span>
              </div>
            </div>

            {/* If habits exist, show compact progress bar */}
            {hitlistHabits.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                <div style={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.round((completedHitlistCount / hitlistHabits.length) * 100))}%`,
                      backgroundColor: completedHitlistCount === hitlistHabits.length ? '#2D6A4F' : '#5C8D89',
                      borderRadius: 3,
                      transition: 'width 250ms ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Macro Progress Breakdown Card */}
          <div className="hd-card" style={{ padding: 22 }}>
            <h2 className="hd-card-title" style={{ marginBottom: 14 }}>
              Today's Macronutrients
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <MacroBar label="Calories" current={currentCalories} goal={goalCalories} unit="kcal" color="#5C8D89" />
              <MacroBar label="Protein" current={currentProtein} goal={goalProtein} unit="g" color="#89B0AE" />
              <MacroBar label="Carbs" current={currentCarbs} goal={goalCarbs} unit="g" color="#F59E0B" />
              <MacroBar label="Fat" current={currentFat} goal={goalFat} unit="g" color="#EF4444" />
            </div>
          </div>
        </div>
      )}

      {/* ── View 2: Analysis Content ── */}
      {activeTab === 'analysis' && (
        <div style={{ animation: 'fadeIn 220ms cubic-bezier(0.4, 0, 0.2, 1)' }}>
          <NutritionAnalysisSection
            profile={profile}
            onViewMoreHistory={() => setSubView('nutrition_history')}
            onViewWorkoutProgress={() => setSubView('workout_progress')}
            onViewWorkoutHistory={() => setSubView('workout_history')}
            onStartExtraWorkout={() => setSubView('extra_workout')}
          />
        </div>
      )}
    </div>
  );
};

const MacroBar: React.FC<{ label: string; current: number; goal: number; unit: string; color: string }> = ({
  label,
  current,
  goal,
  unit,
  color,
}) => {
  const percent = goal > 0 ? Math.round((current / goal) * 100) : 0;
  const visualFill = Math.min(100, percent);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
        <span>{label}</span>
        <span>
          {current} / {goal} {unit} ({percent}%)
        </span>
      </div>
      <div style={{ height: 8, borderRadius: 4, backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${visualFill}%`,
            backgroundColor: color,
            borderRadius: 4,
            transition: 'width 300ms ease',
          }}
        />
      </div>
    </div>
  );
};
