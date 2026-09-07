import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../../types/database.types';
import {
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

interface WorkoutProgressPageProps {
  profile: Profile;
  onBackToAnalysis: () => void;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const WorkoutProgressPage: React.FC<WorkoutProgressPageProps> = ({
  profile,
  onBackToAnalysis,
}) => {
  const { now } = useClock();
  const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth());

  const [loading, setLoading] = useState<boolean>(true);
  const [weeklyAnalyses, setWeeklyAnalyses] = useState<WorkoutWeekAnalysis[]>([]);

  // Track expanded category per week card: { [weekIdx]: 'improved' | 'neutral' | 'decreased' | null }
  const [expandedPerWeek, setExpandedPerWeek] = useState<Record<number, 'improved' | 'neutral' | 'decreased' | null>>({});

  const loadMonthWeeks = useCallback(async () => {
    setLoading(true);
    try {
      const [plannedSchedule, masterMap] = await Promise.all([
        fetchUserPlannedSchedule(profile.id),
        fetchMasterExercisesMap(),
      ]);

      // Calculate all weeks touching this month
      const firstOfMonth = new Date(selectedYear, selectedMonth, 1);
      const lastOfMonth = new Date(selectedYear, selectedMonth + 1, 0);

      // Find first Monday on or before firstOfMonth
      const firstMonday = new Date(firstOfMonth);
      const dayOfWeek = firstMonday.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      firstMonday.setDate(firstMonday.getDate() + diffToMonday);
      firstMonday.setHours(0, 0, 0, 0);

      // Generate week intervals
      const weeks: { monday: Date; sunday: Date; days: Date[] }[] = [];
      let curMonday = new Date(firstMonday);

      while (curMonday <= lastOfMonth) {
        const curDays: Date[] = [];
        for (let i = 0; i < 7; i++) {
          const d = new Date(curMonday);
          d.setDate(curMonday.getDate() + i);
          d.setHours(0, 0, 0, 0);
          curDays.push(d);
        }
        const curSunday = new Date(curDays[6]);
        curSunday.setHours(23, 59, 59, 999);

        weeks.push({ monday: curMonday, sunday: curSunday, days: curDays });

        // Next week Monday
        const nextM = new Date(curMonday);
        nextM.setDate(curMonday.getDate() + 7);
        curMonday = nextM;
      }

      // Fetch logs for the entire spanning range
      const overallStartStr = formatDateKey(weeks[0].monday);
      const overallEndStr = formatDateKey(weeks[weeks.length - 1].sunday);

      const allLogs = await fetchWorkoutLogsForRange(profile.id, overallStartStr, overallEndStr);

      // Group logs by week
      const weekLogsList: any[][] = weeks.map((w) => {
        const mStr = formatDateKey(w.monday);
        const sStr = formatDateKey(w.sunday);
        return allLogs.filter((l) => {
          if (!l.start_time) return false;
          const logDate = formatDateKey(new Date(l.start_time));
          return logDate >= mStr && logDate <= sStr;
        });
      });

      // Build sequential comparisons:
      // Week 0: Baseline only (or against previous month's final week if fetched, but self-contained per prompt)
      // Week 1: Week 0 is baseline
      // Week 2: Week 1 is baseline
      const analyses: WorkoutWeekAnalysis[] = [];
      for (let i = 0; i < weeks.length; i++) {
        const currentLogs = weekLogsList[i];
        const prevLogs = i > 0 ? weekLogsList[i - 1] : [];

        const analysis = calculateWeeklyWorkoutAnalysis(
          weeks[i].days,
          currentLogs,
          prevLogs,
          plannedSchedule,
          now,
          masterMap
        );

        analyses.push(analysis);
      }

      // Display weeks chronologically from month's starting week to ending week
      setWeeklyAnalyses(analyses);
    } catch (err) {
      console.error('Failed to load monthly workout progress:', err);
    } finally {
      setLoading(false);
    }
  }, [profile.id, selectedYear, selectedMonth]);

  useEffect(() => {
    loadMonthWeeks();
  }, [loadMonthWeeks]);

  const toggleWeekCategory = (weekIdx: number, cat: 'improved' | 'neutral' | 'decreased') => {
    setExpandedPerWeek((prev) => ({
      ...prev,
      [weekIdx]: prev[weekIdx] === cat ? null : cat,
    }));
  };

  return (
    <div
      className="habits-container-responsive"
      style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: '20px 24px 100px',
        fontFamily: "'Inter', sans-serif",
      }}
    >

      {/* ── Back Navigation Button ── */}
      <button
        type="button"
        onClick={onBackToAnalysis}
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
        <span>Back to Analysis</span>
      </button>

      {/* ── Page Title ── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1F2937', margin: 0 }}>
          Workout Progress
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
          Sequential weekly progressive overload analysis
        </p>
      </div>

      {/* ── Month Selector Grid ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: 14,
          border: '1px solid #E8E8E6',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          marginBottom: 24,
        }}
      >
        {/* Year Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 4px' }}>
          <button
            type="button"
            className="fitbee-icon-btn"
            onClick={() => setSelectedYear((y) => y - 1)}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '1px solid #E8E8E6',
              backgroundColor: '#FAFAF8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            ←
          </button>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>{selectedYear}</span>
          <button
            type="button"
            className="fitbee-icon-btn"
            onClick={() => setSelectedYear((y) => y + 1)}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              border: '1px solid #E8E8E6',
              backgroundColor: '#FAFAF8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            →
          </button>
        </div>

        {/* 12 Months Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {MONTH_NAMES.map((name, idx) => {
            const isSelected = selectedMonth === idx;
            const isCurrentMonth = now.getFullYear() === selectedYear && now.getMonth() === idx;

            return (
              <button
                key={name}
                type="button"
                onClick={() => setSelectedMonth(idx)}
                style={{
                  padding: '8px 4px',
                  borderRadius: 12,
                  border: isSelected ? '1.5px solid #D9773F' : '1px solid transparent',
                  backgroundColor: isSelected ? '#FDF2E9' : isCurrentMonth ? '#F3F4F6' : 'transparent',
                  color: isSelected ? '#D9773F' : '#374151',
                  fontFamily: 'inherit',
                  fontSize: 12,
                  fontWeight: isSelected ? 750 : 500,
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 150ms ease',
                }}
              >
                {name.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Weekly Progression Cards ── */}
      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#6B7280', fontSize: 14 }}>
          Loading monthly progression...
        </div>
      ) : (() => {
        const activeWeeks = weeklyAnalyses.filter((w) => w.totalWorkouts > 0);
        const hasInactiveWeeks = activeWeeks.length > 0 && activeWeeks.length < weeklyAnalyses.length;
        const inactiveCount = weeklyAnalyses.length - activeWeeks.length;

        if (activeWeeks.length === 0) {
          return (
            <div className="fitbee-empty-month-state">
              No data was logged this month.
            </div>
          );
        }

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {activeWeeks.map((weekAnalysis, weekIdx) => {
              const expandedCat = expandedPerWeek[weekIdx] || null;
              const filteredEx: ExercisePerformanceComparison[] = expandedCat
                ? weekAnalysis.exerciseComparisons.filter((e) => e.classification === expandedCat)
                : [];

              return (
                <div
                  key={weekAnalysis.dateRangeLabel}
                  className="fitbee-card-interactive"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 24,
                    padding: 22,
                    border: '1px solid #E8E8E6',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Week Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      marginBottom: 12,
                      paddingBottom: 10,
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 750, color: '#1F2937', margin: 0 }}>
                        {weekAnalysis.dateRangeLabel}
                      </h3>
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF' }}>
                        {weekAnalysis.isBaselineOnly
                          ? 'Baseline week (100%)'
                          : 'Relative vs previous week baseline'}
                      </span>
                    </div>

                    <span style={{ fontSize: 12, fontWeight: 700, color: '#D9773F' }}>
                      {weekAnalysis.totalWorkouts} {weekAnalysis.totalWorkouts === 1 ? 'workout' : 'workouts'}
                    </span>
                  </div>

                  {/* Performance Graph */}
                  <div style={{ marginBottom: 16 }}>
                    <WorkoutPerformanceGraph
                      dayPoints={weekAnalysis.dayPoints}
                      isBaselineOnly={weekAnalysis.isBaselineOnly}
                    />
                  </div>

                  {/* Performance Category Pills */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    <button
                      type="button"
                      className="fitbee-btn"
                      onClick={() => toggleWeekCategory(weekIdx, 'improved')}
                      style={{
                        padding: '8px 6px',
                        borderRadius: 12,
                        border: expandedCat === 'improved' ? '2px solid #5E9F76' : '1px solid #E8E8E6',
                        backgroundColor: expandedCat === 'improved' ? '#EAF5EE' : '#FAFAF8',
                        color: '#2D6A4F',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      ↑ {weekAnalysis.improvedCount} improved
                    </button>

                    <button
                      type="button"
                      className="fitbee-btn"
                      onClick={() => toggleWeekCategory(weekIdx, 'neutral')}
                      style={{
                        padding: '8px 6px',
                        borderRadius: 12,
                        border: expandedCat === 'neutral' ? '2px solid #9CA3AF' : '1px solid #E8E8E6',
                        backgroundColor: expandedCat === 'neutral' ? '#F3F4F6' : '#FAFAF8',
                        color: '#4B5563',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      → {weekAnalysis.neutralCount} neutral
                    </button>

                    <button
                      type="button"
                      className="fitbee-btn"
                      onClick={() => toggleWeekCategory(weekIdx, 'decreased')}
                      style={{
                        padding: '8px 6px',
                        borderRadius: 12,
                        border: expandedCat === 'decreased' ? '2px solid #C96A6A' : '1px solid #E8E8E6',
                        backgroundColor: expandedCat === 'decreased' ? '#FDEBEB' : '#FAFAF8',
                        color: '#A83232',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      ↓ {weekAnalysis.decreasedCount} decreased
                    </button>
                  </div>

                  {/* Expanded Exercise Detail Bar Charts */}
                  {expandedCat && (
                    <div style={{ marginTop: 14, animation: 'fadeIn 200ms ease' }}>
                      <ExerciseDetailBarChart exercises={filteredEx} type={expandedCat} />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Concise note for remaining empty weeks if some had no data */}
            {hasInactiveWeeks && (
              <div className="fitbee-remaining-weeks-empty">
                The other {inactiveCount === 1 ? 'week had' : 'weeks had'} no data.
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
