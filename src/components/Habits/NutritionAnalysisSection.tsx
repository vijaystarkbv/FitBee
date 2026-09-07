import React, { useState, useEffect, useCallback } from 'react';
import { Profile, NutritionLog } from '../../types/database.types';
import {
  UserNutritionTargets,
  getUserNutritionTargets,
  getWeekBoundaries,
  fetchNutritionLogsRange,
  calculateWeeklyAverages,
  classifyNutritionDayStatus,
  DayMacroSummary,
  formatDateKey,
} from '../../services/nutritionHistoryService';
import { WeeklyCalorieChart } from './WeeklyCalorieChart';
import { useClock } from '../../hooks/useClock';

import { WorkoutAnalysisSection } from './WorkoutAnalysisSection';

interface NutritionAnalysisSectionProps {
  profile: Profile;
  onViewMoreHistory: () => void;
  onViewWorkoutProgress: () => void;
  onViewWorkoutHistory: () => void;
  onStartExtraWorkout?: () => void;
}

const SHORT_DAY_LABELS = ['SU', 'M', 'T', 'W', 'TH', 'F', 'S'];
const FULL_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const NutritionAnalysisSection: React.FC<NutritionAnalysisSectionProps> = ({
  profile,
  onViewMoreHistory,
  onViewWorkoutProgress,
  onViewWorkoutHistory,
  onStartExtraWorkout,
}) => {
  const { now } = useClock();
  const todayDateStr = formatDateKey(now);

  // Strict target resolution respecting onboarding completion
  const targets: UserNutritionTargets = getUserNutritionTargets(profile);

  // Calculate Monday to Sunday week range around current clock
  const { monday, sunday, days } = getWeekBoundaries(now);
  const mondayStr = formatDateKey(monday);
  const sundayStr = formatDateKey(sunday);

  const [weeklyLogsMap, setWeeklyLogsMap] = useState<Record<string, NutritionLog>>({});
  const [loading, setLoading] = useState<boolean>(true);

  const loadWeeklyData = useCallback(async () => {
    setLoading(true);
    try {
      const logs = await fetchNutritionLogsRange(profile.id, mondayStr, sundayStr);
      setWeeklyLogsMap(logs);
    } catch (err) {
      console.error('Failed to load weekly nutrition logs:', err);
    } finally {
      setLoading(false);
    }
  }, [profile.id, mondayStr, sundayStr]);

  useEffect(() => {
    loadWeeklyData();
  }, [loadWeeklyData]);

  // Build Day summaries
  const daySummaries: DayMacroSummary[] = days.map((d) => {
    const dateStr = formatDateKey(d);
    const log = weeklyLogsMap[dateStr] || null;
    const statusDetails = classifyNutritionDayStatus(log, targets);
    const dayOfWeek = d.getDay();

    return {
      date: d,
      dateStr,
      dayLabel: SHORT_DAY_LABELS[dayOfWeek],
      fullDayName: FULL_DAY_NAMES[dayOfWeek],
      log,
      statusDetails,
    };
  });

  // Calculate weekly averages over actual logged days only
  const weekLogs = daySummaries.map((d) => d.log);
  const averages = calculateWeeklyAverages(weekLogs, targets);

  // Formatted date range label (e.g. "Aug 31 – Sep 6, 2026")
  const startMonth = monday.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
  const yearStr = sunday.getFullYear();
  const dateRangeLabel =
    startMonth === endMonth
      ? `${startMonth} ${monday.getDate()} – ${sunday.getDate()}, ${yearStr}`
      : `${startMonth} ${monday.getDate()} – ${endMonth} ${sunday.getDate()}, ${yearStr}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* ══════════════════════════════════════════════════════ */}
      {/* ── SECTION 1: NUTRITION LOGS ── */}
      {/* ══════════════════════════════════════════════════════ */}
      <div>
        {/* Section Heading */}
        <div style={{ marginBottom: 14 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 750,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#5C8D89',
            }}
          >
            Nutrition Logs
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 2 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: 0 }}>
              Macro Logs
            </h2>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>
              {dateRangeLabel}
            </span>
          </div>
        </div>

        {/* Weekly Analysis Card */}
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
              Loading weekly nutrition analysis...
            </div>
          ) : (
            <div>
              {/* Primary Weekly Calorie Chart */}
              <div style={{ marginBottom: 20 }}>
                <WeeklyCalorieChart
                  days={daySummaries}
                  targetCalories={targets.calories}
                  todayDateStr={todayDateStr}
                />
              </div>

              {/* Macro Summary Header */}
              <div style={{ marginBottom: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                  Weekly Consistency & Targets
                </h3>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
                  {averages.hasLogs
                    ? `Calculated from ${averages.loggedCount} ${averages.loggedCount === 1 ? 'day' : 'days'} with logged meals`
                    : 'No nutrition logs recorded for this week yet'}
                </p>
              </div>

              {!averages.hasLogs ? (
                /* Calm Empty State */
                <div
                  style={{
                    backgroundColor: '#FAFAF8',
                    borderRadius: 18,
                    padding: '20px 16px',
                    textAlign: 'center',
                    border: '1px dashed #E8E8E6',
                    marginBottom: 20,
                  }}
                >
                  <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>
                    Log your daily meals in the <strong>Log Meal</strong> tab to see your weekly macro consistency and averages.
                  </p>
                </div>
              ) : (
                /* Macro Summary Cards Grid */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  {/* Calories Avg Card */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#FAFAF8',
                      padding: '14px 16px',
                      borderRadius: 16,
                      border: '1px solid #E8E8E6',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>
                        Calories Average
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>
                        {averages.avgCalories.toLocaleString()}
                        {targets.calories > 0 && ` / ${targets.calories.toLocaleString()} kcal goal`}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: 10,
                        backgroundColor: '#E6F4EA',
                        color: '#4C8861',
                        fontSize: 13,
                        fontWeight: 750,
                      }}
                    >
                      {averages.calPercent}%
                    </div>
                  </div>

                  {/* Other 3 Macros: Protein, Carbs, Fat */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {/* Protein */}
                    <div
                      style={{
                        backgroundColor: '#FAFAF8',
                        padding: '12px 10px',
                        borderRadius: 16,
                        border: '1px solid #E8E8E6',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 650, color: '#4B5563' }}>Protein</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '4px 0 2px' }}>
                        {averages.avgProtein}g
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>
                        {targets.protein > 0 ? `${averages.avgProtein} / ${targets.protein}g` : 'average'}
                      </div>
                      {targets.protein > 0 && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#5C8D89', marginTop: 4 }}>
                          {averages.proteinPercent}%
                        </div>
                      )}
                    </div>

                    {/* Carbs */}
                    <div
                      style={{
                        backgroundColor: '#FAFAF8',
                        padding: '12px 10px',
                        borderRadius: 16,
                        border: '1px solid #E8E8E6',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 650, color: '#4B5563' }}>Carbs</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '4px 0 2px' }}>
                        {averages.avgCarbs}g
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>
                        {targets.carbs > 0 ? `${averages.avgCarbs} / ${targets.carbs}g` : 'average'}
                      </div>
                      {targets.carbs > 0 && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#D97706', marginTop: 4 }}>
                          {averages.carbsPercent}%
                        </div>
                      )}
                    </div>

                    {/* Fat */}
                    <div
                      style={{
                        backgroundColor: '#FAFAF8',
                        padding: '12px 10px',
                        borderRadius: 16,
                        border: '1px solid #E8E8E6',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 650, color: '#4B5563' }}>Fat</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: '4px 0 2px' }}>
                        {averages.avgFat}g
                      </div>
                      <div style={{ fontSize: 11, color: '#6B7280' }}>
                        {targets.fat > 0 ? `${averages.avgFat} / ${targets.fat}g` : 'average'}
                      </div>
                      {targets.fat > 0 && (
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#C96A6A', marginTop: 4 }}>
                          {averages.fatPercent}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* View More → Navigation Action */}
              <button
                type="button"
                onClick={onViewMoreHistory}
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
                  justifyContent: 'center',
                  gap: 8,
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
                <span>View full nutrition history</span>
                <span style={{ color: '#5C8D89', fontSize: 16 }}>→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* ── SECTION 2: WORKOUT LOGS ── */}
      {/* ══════════════════════════════════════════════════════ */}
      <div style={{ paddingTop: 8 }}>
        <WorkoutAnalysisSection
          profile={profile}
          onViewWorkoutProgress={onViewWorkoutProgress}
          onViewWorkoutHistory={onViewWorkoutHistory}
          onStartExtraWorkout={onStartExtraWorkout}
        />
      </div>
    </div>
  );
};
