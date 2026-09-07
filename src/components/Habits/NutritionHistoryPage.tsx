import React, { useState, useEffect, useCallback } from 'react';
import { Profile, NutritionLog } from '../../types/database.types';
import {
  UserNutritionTargets,
  getUserNutritionTargets,
  fetchNutritionLogsRange,
  buildMonthWeeklySummaries,
  WeekSummary,
  formatDateKey,
} from '../../services/nutritionHistoryService';
import { NutritionCalendar } from './NutritionCalendar';
import { NutritionDayDetailModal } from './NutritionDayDetailModal';
import { WeeklyCalorieChart } from './WeeklyCalorieChart';
import { useClock } from '../../hooks/useClock';

interface NutritionHistoryPageProps {
  profile: Profile;
  onBackToAnalysis: () => void;
}

export const NutritionHistoryPage: React.FC<NutritionHistoryPageProps> = ({
  profile,
  onBackToAnalysis,
}) => {
  const { now } = useClock();
  const todayDateStr = formatDateKey(now);

  // Targets strictly resolved from user profile without arbitrary hardcoding
  const targets: UserNutritionTargets = getUserNutritionTargets(profile);

  // Active viewing month initialized from centralized clock
  const [viewDate, setViewDate] = useState<Date>(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [nutritionMap, setNutritionMap] = useState<Record<string, NutritionLog>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDay, setSelectedDay] = useState<{ date: Date; log: NutritionLog | null } | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Load data for the selected month (+ padding days for complete weeks)
  const loadMonthData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch from 7 days before start of month to 7 days after end of month to cover all boundary weeks
      const startDate = new Date(year, month, -6);
      const endDate = new Date(year, month + 1, 7);

      const startStr = formatDateKey(startDate);
      const endStr = formatDateKey(endDate);

      const logs = await fetchNutritionLogsRange(profile.id, startStr, endStr);
      setNutritionMap(logs);
    } catch (err) {
      console.error('Failed to load month nutrition history:', err);
    } finally {
      setLoading(false);
    }
  }, [profile.id, year, month]);

  useEffect(() => {
    loadMonthData();
  }, [loadMonthData]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Build weekly summaries for this month
  const weeklySummaries: WeekSummary[] = buildMonthWeeklySummaries(year, month, nutritionMap, targets);

  const monthTitle = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 24px 100px', fontFamily: "'Inter', sans-serif" }}>
      {/* ── Back button ── */}
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
          marginBottom: 20,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Analysis
      </button>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>
          Nutrition History
        </h1>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '4px 0 0' }}>
          Monthly breakdown & consistency calendar for {monthTitle}
        </p>
      </div>

      {loading ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#6B7280' }}>
          Loading nutrition records for {monthTitle}...
        </div>
      ) : (
        <>
          {/* ── Section 1: Monthly Calendar ── */}
          <NutritionCalendar
            viewDate={viewDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            nutritionMap={nutritionMap}
            targets={targets}
            todayDateStr={todayDateStr}
            onSelectDate={(date, log) => setSelectedDay({ date, log })}
          />

          {/* ── Section 2: Weekly Summaries in Month ── */}
          <div style={{ marginBottom: 16 }}>
            <h2
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: '0 0 14px',
              }}
            >
              Weekly Breakdowns
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {(() => {
                const activeWeeks = weeklySummaries.filter((w) => w.hasLogs);
                const hasInactiveWeeks = activeWeeks.length > 0 && activeWeeks.length < weeklySummaries.length;
                const inactiveCount = weeklySummaries.length - activeWeeks.length;

                if (activeWeeks.length === 0) {
                  return (
                    <div className="fitbee-empty-month-state">
                      No data was logged this month.
                    </div>
                  );
                }

                return (
                  <>
                    {activeWeeks.map((week) => (
                      <div
                        key={week.weekIndex}
                        className="fitbee-card-interactive"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderRadius: 24,
                          padding: 20,
                          border: '1px solid #E8E8E6',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                        }}
                      >
                        {/* Week Header */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 14,
                            paddingBottom: 10,
                            borderBottom: '1px solid #F3F4F6',
                          }}
                        >
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                            {week.label}
                          </h3>
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: '#5C8D89',
                              backgroundColor: '#F4F8F7',
                              padding: '4px 8px',
                              borderRadius: 8,
                            }}
                          >
                            {week.loggedCount} {week.loggedCount === 1 ? 'day' : 'days'} logged
                          </span>
                        </div>

                        <div>
                          {/* Macro Average Stats Grid */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(4, 1fr)',
                              gap: 8,
                              marginBottom: 16,
                            }}
                          >
                            {/* Calories */}
                            <div
                              style={{
                                backgroundColor: '#FAFAF8',
                                borderRadius: 12,
                                padding: '10px 8px',
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Calories</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', marginTop: 2 }}>
                                {week.avgCalories}
                              </div>
                              <div style={{ fontSize: 10, color: '#5C8D89', fontWeight: 600, marginTop: 1 }}>
                                avg kcal
                              </div>
                            </div>

                            {/* Protein */}
                            <div
                              style={{
                                backgroundColor: '#FAFAF8',
                                borderRadius: 12,
                                padding: '10px 8px',
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Protein</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', marginTop: 2 }}>
                                {week.avgProtein}g
                              </div>
                              <div style={{ fontSize: 10, color: '#89B0AE', fontWeight: 600, marginTop: 1 }}>
                                {week.proteinPercent}%
                              </div>
                            </div>

                            {/* Carbs */}
                            <div
                              style={{
                                backgroundColor: '#FAFAF8',
                                borderRadius: 12,
                                padding: '10px 8px',
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Carbs</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', marginTop: 2 }}>
                                {week.avgCarbs}g
                              </div>
                              <div style={{ fontSize: 10, color: '#D97706', fontWeight: 600, marginTop: 1 }}>
                                {week.carbsPercent}%
                              </div>
                            </div>

                            {/* Fat */}
                            <div
                              style={{
                                backgroundColor: '#FAFAF8',
                                borderRadius: 12,
                                padding: '10px 8px',
                                textAlign: 'center',
                              }}
                            >
                              <div style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>Fat</div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', marginTop: 2 }}>
                                {week.avgFat}g
                              </div>
                              <div style={{ fontSize: 10, color: '#C96A6A', fontWeight: 600, marginTop: 1 }}>
                                {week.fatPercent}%
                              </div>
                            </div>
                          </div>

                          {/* Weekly Trend Chart */}
                          <WeeklyCalorieChart
                            days={week.days}
                            targetCalories={targets.calories}
                            todayDateStr={todayDateStr}
                          />
                        </div>
                      </div>
                    ))}

                    {/* Concise note for remaining empty weeks if some had no data */}
                    {hasInactiveWeeks && (
                      <div className="fitbee-remaining-weeks-empty">
                        The other {inactiveCount === 1 ? 'week had' : 'weeks had'} no data.
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </>
      )}

      {/* ── Day Detail Modal ── */}
      {selectedDay && (
        <NutritionDayDetailModal
          date={selectedDay.date}
          dateStr={formatDateKey(selectedDay.date)}
          log={selectedDay.log}
          targets={targets}
          userId={profile.id}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
};
