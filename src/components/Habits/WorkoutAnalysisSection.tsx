import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../../types/database.types';
import {
  getWeekBoundaries,
  formatDateKey,
  fetchUserPlannedSchedule,
  fetchWorkoutLogsForRange,
  fetchMasterExercisesMap,
  calculateWeeklyWorkoutAnalysis,
  WorkoutWeekAnalysis,
  ExercisePerformanceComparison,
} from '../../services/workoutHistoryService';
import { WorkoutPerformanceGraph } from './WorkoutPerformanceGraph';
import { ExerciseDetailBarChart } from './ExerciseDetailBarChart';
import { useClock } from '../../hooks/useClock';

interface WorkoutAnalysisSectionProps {
  profile: Profile;
  onViewWorkoutProgress: () => void;
  onViewWorkoutHistory: () => void;
  onStartExtraWorkout?: () => void;
}

export const WorkoutAnalysisSection: React.FC<WorkoutAnalysisSectionProps> = ({
  profile,
  onViewWorkoutProgress,
  onViewWorkoutHistory,
  onStartExtraWorkout,
}) => {
  const { now } = useClock();

  // Weekly boundaries around current clock
  const { monday, sunday, days } = getWeekBoundaries(now);
  const mondayStr = formatDateKey(monday);
  const sundayStr = formatDateKey(sunday);

  // Previous week boundaries for relative baseline comparison
  const prevMonday = new Date(monday);
  prevMonday.setDate(monday.getDate() - 7);
  const prevSunday = new Date(sunday);
  prevSunday.setDate(sunday.getDate() - 7);
  const prevMondayStr = formatDateKey(prevMonday);
  const prevSundayStr = formatDateKey(prevSunday);

  const [loading, setLoading] = useState<boolean>(true);
  const [analysis, setAnalysis] = useState<WorkoutWeekAnalysis | null>(null);

  // Expanded category: null | 'improved' | 'neutral' | 'decreased'
  const [expandedCategory, setExpandedCategory] = useState<'improved' | 'neutral' | 'decreased' | null>(null);

  const loadWeeklyData = useCallback(async () => {
    setLoading(true);
    try {
      const [plannedSchedule, currentLogs, prevLogs, masterMap] = await Promise.all([
        fetchUserPlannedSchedule(profile.id),
        fetchWorkoutLogsForRange(profile.id, mondayStr, sundayStr),
        fetchWorkoutLogsForRange(profile.id, prevMondayStr, prevSundayStr),
        fetchMasterExercisesMap(),
      ]);

      const result = calculateWeeklyWorkoutAnalysis(
        days,
        currentLogs,
        prevLogs,
        plannedSchedule,
        now,
        masterMap
      );

      setAnalysis(result);
    } catch (err) {
      console.error('Failed to load weekly workout analysis:', err);
    } finally {
      setLoading(false);
    }
  }, [profile.id, mondayStr, sundayStr, prevMondayStr, prevSundayStr]);

  useEffect(() => {
    loadWeeklyData();
  }, [loadWeeklyData]);

  const toggleCategory = (cat: 'improved' | 'neutral' | 'decreased') => {
    setExpandedCategory((prev) => (prev === cat ? null : cat));
  };

  const getFilteredExercises = (cat: 'improved' | 'neutral' | 'decreased'): ExercisePerformanceComparison[] => {
    if (!analysis) return [];
    return analysis.exerciseComparisons.filter((ex) => ex.classification === cat);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ── Section Header ── */}
      <div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 750,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#D9773F',
          }}
        >
          Workout Logs
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 2 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: 0 }}>
            Workout Activity
          </h2>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>
            {analysis?.dateRangeLabel || 'This Week'}
          </span>
        </div>
      </div>

      {/* ── Main Workout Analysis Card ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: 24,
          border: '1px solid #E8E8E6',
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
        }}
      >
        {loading ? (
          <div style={{ padding: '36px 0', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
            Loading weekly workout analysis...
          </div>
        ) : !analysis ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280' }}>
            Unable to load workout analysis.
          </div>
        ) : (
          <div>
            {/* ── 1. Weekly Workout Activity Dots ── */}
            <div
              style={{
                backgroundColor: '#FAFAF8',
                borderRadius: 20,
                padding: '16px 14px',
                border: '1px solid #E8E8E6',
                marginBottom: 20,
              }}
            >
              {/* Day Dots Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  gap: 4,
                  marginBottom: 10,
                }}
              >
                {analysis.days.map((d, idx) => {
                  let dotColor = '#E5E7EB'; // Rest / default
                  let dotBorder = 'none';

                  if (d.status === 'COMPLETED') {
                    dotColor = '#D9773F'; // Completed workout day (🟠)
                  } else if (d.status === 'EXTRA') {
                    dotColor = '#6B9FE8'; // Extra workout (🔵)
                  } else if (d.status === 'MISSED') {
                    dotColor = '#FFFFFF';
                    dotBorder = '2px solid #C96A6A'; // Missed planned
                  } else if (d.isPlanned) {
                    dotColor = '#FFFFFF';
                    dotBorder = '2px solid #D9773F'; // Upcoming planned
                  }

                  return (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      {/* Circle Indicator */}
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: dotColor,
                          border: dotBorder,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 200ms ease',
                        }}
                      />
                      {/* Day Label */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: d.isPlanned ? '#1F2937' : '#9CA3AF',
                        }}
                      >
                        {d.dayLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Legend & Summary text */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                  borderTop: '1px dashed #E8E8E6',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#6B7280',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {analysis.plannedDaysCount === 0 ? (
                    <span>○ No routine scheduled</span>
                  ) : (
                    <>
                      <span>🟠 Workout day</span>
                      <span>·</span>
                      <span>○ Non-workout day</span>
                    </>
                  )}
                </div>
                {analysis.extraWorkoutsCount > 0 && (
                  <span style={{ color: '#2A5A9E' }}>🔵 Extra ({analysis.extraWorkoutsCount})</span>
                )}
              </div>

              {/* Planned vs Completed Stats */}
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 750, color: '#1F2937' }}>
                    {analysis.totalWorkouts} {analysis.totalWorkouts === 1 ? 'workout' : 'workouts'}
                  </div>
                  <div style={{ fontSize: 12, color: '#6B7280', marginTop: 1 }}>
                    {analysis.plannedDaysCount === 0
                      ? 'No planned workout schedule'
                      : `${analysis.completedPlannedCount} / ${analysis.plannedDaysCount} planned workouts completed`}
                  </div>
                </div>

                {onStartExtraWorkout && (
                  <button
                    type="button"
                    onClick={onStartExtraWorkout}
                    style={{
                      height: 32,
                      padding: '0 12px',
                      borderRadius: 16,
                      backgroundColor: '#EEF2FF',
                      border: '1px solid #C7D2FE',
                      color: '#4338CA',
                      fontFamily: 'inherit',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      transition: 'all 180ms ease',
                    }}
                  >
                    <span>+ Extra Workout</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── 2. Weekly Performance Graph ── */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                  Weekly Performance
                </h3>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
                  {analysis.isBaselineOnly
                    ? 'Baseline week (100%) — establishing initial performance'
                    : 'Progressive overload relative to previous week baseline'}
                </p>

              </div>

              <WorkoutPerformanceGraph
                dayPoints={analysis.dayPoints}
                isBaselineOnly={analysis.isBaselineOnly}
              />
            </div>

            {/* ── 3. Summary Metrics: Workouts, Exercises, Sets ── */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  borderRadius: 16,
                  padding: '12px 14px',
                  border: '1px solid #E8E8E6',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                  Workouts
                </span>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1F2937', marginTop: 2 }}>
                  {analysis.totalWorkouts}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  borderRadius: 16,
                  padding: '12px 14px',
                  border: '1px solid #E8E8E6',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                  Exercises
                </span>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1F2937', marginTop: 2 }}>
                  {analysis.totalExercises}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  borderRadius: 16,
                  padding: '12px 14px',
                  border: '1px solid #E8E8E6',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                  Sets
                </span>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1F2937', marginTop: 2 }}>
                  {analysis.totalSets}
                </div>
              </div>
            </div>

            {/* ── 4. Improved / Neutral / Decreased Performance Pills ── */}
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Performance Breakdown
              </span>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 8 }}>
                {/* Improved Pill */}
                <button
                  type="button"
                  onClick={() => toggleCategory('improved')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 14,
                    border: expandedCategory === 'improved' ? '2px solid #5E9F76' : '1px solid #E8E8E6',
                    backgroundColor: expandedCategory === 'improved' ? '#EAF5EE' : '#FAFAF8',
                    color: '#2D6A4F',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 180ms ease',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 800 }}>↑ {analysis.improvedCount}</span>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>improved</span>
                </button>

                {/* Neutral Pill */}
                <button
                  type="button"
                  onClick={() => toggleCategory('neutral')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 14,
                    border: expandedCategory === 'neutral' ? '2px solid #9CA3AF' : '1px solid #E8E8E6',
                    backgroundColor: expandedCategory === 'neutral' ? '#F3F4F6' : '#FAFAF8',
                    color: '#4B5563',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 180ms ease',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 800 }}>→ {analysis.neutralCount}</span>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>unchanged</span>
                </button>

                {/* Decreased Pill */}
                <button
                  type="button"
                  onClick={() => toggleCategory('decreased')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 14,
                    border: expandedCategory === 'decreased' ? '2px solid #C96A6A' : '1px solid #E8E8E6',
                    backgroundColor: expandedCategory === 'decreased' ? '#FDEBEB' : '#FAFAF8',
                    color: '#A83232',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'all 180ms ease',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 800 }}>↓ {analysis.decreasedCount}</span>
                  <span style={{ fontSize: 11, fontWeight: 600 }}>decreased</span>
                </button>
              </div>

              {/* Drill-down Bar Chart Section */}
              {expandedCategory && (
                <div style={{ marginTop: 14, animation: 'fadeIn 200ms ease' }}>
                  <ExerciseDetailBarChart
                    exercises={getFilteredExercises(expandedCategory)}
                    type={expandedCategory}
                  />
                </div>
              )}
            </div>

            {/* ── 5. Navigation Action Buttons ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* View Workout Progress */}
              <button
                type="button"
                onClick={onViewWorkoutProgress}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 18,
                  backgroundColor: '#FAFAF8',
                  border: '1px solid #E8E8E6',
                  color: '#1F2937',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  fontWeight: 650,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 18px',
                  transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAFAF8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>View workout progress</span>
                <span style={{ color: '#D9773F', fontSize: 16 }}>→</span>
              </button>

              {/* View Workout History */}
              <button
                type="button"
                onClick={onViewWorkoutHistory}
                style={{
                  width: '100%',
                  height: 48,
                  borderRadius: 18,
                  backgroundColor: '#FAFAF8',
                  border: '1px solid #E8E8E6',
                  color: '#1F2937',
                  fontFamily: 'inherit',
                  fontSize: 14,
                  fontWeight: 650,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 18px',
                  transition: 'all 180ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F3F4F6';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FAFAF8';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>View workout history</span>
                <span style={{ color: '#D9773F', fontSize: 16 }}>→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
