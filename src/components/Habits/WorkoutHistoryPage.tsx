import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../../types/database.types';
import {
  fetchUserPlannedSchedule,
  fetchMonthlyWorkoutHistory,
  MonthlyWorkoutSummary,
  WorkoutDayStatus,
  formatDateKey,
} from '../../services/workoutHistoryService';
import { WorkoutCalendar } from './WorkoutCalendar';
import { WorkoutDayDetailModal } from './WorkoutDayDetailModal';
import { useClock } from '../../hooks/useClock';

interface WorkoutHistoryPageProps {
  profile: Profile;
  onBackToAnalysis: () => void;
}

export const WorkoutHistoryPage: React.FC<WorkoutHistoryPageProps> = ({
  profile,
  onBackToAnalysis,
}) => {
  const { now } = useClock();
  const todayDateStr = formatDateKey(now);

  // Month navigation state
  const [viewDate, setViewDate] = useState<Date>(new Date(now.getFullYear(), now.getMonth(), 1));
  const [summary, setSummary] = useState<MonthlyWorkoutSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Selected Day Modal state
  const [selectedDayModal, setSelectedDayModal] = useState<{
    date: Date;
    status: WorkoutDayStatus;
    isPlanned: boolean;
    log: any | null;
    isPartiallyCompleted?: boolean;
    completedCount?: number;
    totalCount?: number;
  } | null>(null);

  const loadMonthlyData = useCallback(async () => {
    setLoading(true);
    try {
      const plannedSchedule = await fetchUserPlannedSchedule(profile.id);
      const data = await fetchMonthlyWorkoutHistory(
        profile.id,
        viewDate.getFullYear(),
        viewDate.getMonth(),
        plannedSchedule,
        now
      );
      setSummary(data);
    } catch (err) {
      console.error('Failed to load monthly workout history:', err);
    } finally {
      setLoading(false);
    }
  }, [profile.id, viewDate.getFullYear(), viewDate.getMonth(), now]);

  useEffect(() => {
    loadMonthlyData();
  }, [loadMonthlyData]);

  const handlePrevMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
  };

  const handleSelectDate = (
    date: Date,
    status: WorkoutDayStatus,
    isPlanned: boolean,
    log: any | null,
    isPartiallyCompleted?: boolean,
    completedCount?: number,
    totalCount?: number
  ) => {
    setSelectedDayModal({
      date,
      status,
      isPlanned,
      log,
      isPartiallyCompleted,
      completedCount,
      totalCount,
    });
  };

  return (
    <div
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
          Workout History
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
          Monthly workout logs and scheduled routine tracking
        </p>
      </div>

      {/* ── Monthly Summary Card ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '22px 20px',
          border: '1px solid #E8E8E6',
          boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 750, color: '#1F2937', margin: 0 }}>
            {summary?.monthLabel || 'Monthly Summary'}
          </h2>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#D9773F' }}>
            {summary?.completionRate ?? 0}% completed
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '20px 0', textAlign: 'center', color: '#6B7280', fontSize: 13 }}>
            Loading monthly summary...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Workouts Completed / Planned */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#FAFAF8',
                padding: '12px 14px',
                borderRadius: 14,
                border: '1px solid #E8E8E6',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                Workouts completed
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#1F2937' }}>
                  {summary?.workoutsCompleted ?? 0}
                </span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>
                  / {summary?.plannedWorkouts ?? 0} planned
                </span>
              </div>
            </div>

            {/* Exercises Performed & Sets Completed */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '1px solid #E8E8E6',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                  Exercises performed
                </span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', marginTop: 2 }}>
                  {summary?.exercisesPerformed ?? 0}
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  padding: '12px 14px',
                  borderRadius: 14,
                  border: '1px solid #E8E8E6',
                  textAlign: 'center',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                  Sets completed
                </span>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#1F2937', marginTop: 2 }}>
                  {summary?.setsCompleted ?? 0}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Monthly Calendar with Seamless Capsules ── */}
      <WorkoutCalendar
        viewDate={viewDate}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        dailyMap={summary?.dailyMap || {}}
        todayDateStr={todayDateStr}
        onSelectDate={handleSelectDate}
      />

      {/* ── Calendar Status Legend ── */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          padding: '16px 20px',
          border: '1px solid #E8E8E6',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Calendar Status
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 12 }}>
          {/* Completed Planned */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#5E9F76',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
              Completed workout
            </span>
          </div>

          {/* Missed Planned */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#C96A6A',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
              Missed planned
            </span>
          </div>

          {/* Extra Workout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#6B9FE8',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
              Extra workout
            </span>
          </div>

          {/* Rest Day */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#D1D5DB',
                display: 'inline-block',
              }}
            />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
              Rest / no workout
            </span>
          </div>
        </div>
      </div>

      {/* ── Day Detail Modal ── */}
      {selectedDayModal && (
        <WorkoutDayDetailModal
          isOpen={Boolean(selectedDayModal)}
          onClose={() => setSelectedDayModal(null)}
          date={selectedDayModal.date}
          status={selectedDayModal.status}
          isPlanned={selectedDayModal.isPlanned}
          log={selectedDayModal.log}
          isPartiallyCompleted={selectedDayModal.isPartiallyCompleted}
          completedCount={selectedDayModal.completedCount}
          totalCount={selectedDayModal.totalCount}
        />
      )}
    </div>
  );
};
