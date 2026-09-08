import React, { useState, useEffect, useCallback } from 'react';
import { Habit } from '../../types/database.types';
import {
  fetchHabitMonthHistory,
  HabitMonthDayDetail,
} from '../../services/habitService';
import { formatDateKey } from '../../services/streakService';
import { HabitDayDetailModal } from './HabitDayDetailModal';
import { REALTIME_EVENTS } from '../../services/realtimeService';

interface HabitStreakCalendarProps {
  habit: Habit;
  userId: string;
  currentDate: Date;
  viewYear?: number;
  viewMonth?: number;
  onMonthChange?: (year: number, month: number) => void;
}

const WEEKDAY_HEADERS = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];

export const HabitStreakCalendar: React.FC<HabitStreakCalendarProps> = ({
  habit,
  userId,
  currentDate,
  viewYear: controlledYear,
  viewMonth: controlledMonth,
  onMonthChange,
}) => {
  const [internalYear, setInternalYear] = useState<number>(currentDate.getFullYear());
  const [internalMonth, setInternalMonth] = useState<number>(currentDate.getMonth()); // 0-indexed

  const isControlled = controlledYear !== undefined && controlledMonth !== undefined;
  const viewYear = isControlled ? controlledYear : internalYear;
  const viewMonth = isControlled ? controlledMonth : internalMonth;

  const [monthData, setMonthData] = useState<Record<string, HabitMonthDayDetail>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [selectedDayDetail, setSelectedDayDetail] = useState<HabitMonthDayDetail | null>(null);

  const todayStr = formatDateKey(currentDate);

  const loadMonth = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHabitMonthHistory(userId, habit.id, viewYear, viewMonth);
      setMonthData(data);
    } catch (err) {
      console.error('Failed to load habit month history:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, habit.id, viewYear, viewMonth]);

  useEffect(() => {
    loadMonth();

    const handleHabitUpdate = () => {
      loadMonth();
    };

    window.addEventListener(REALTIME_EVENTS.HABIT_SESSIONS_UPDATED, handleHabitUpdate);
    window.addEventListener(REALTIME_EVENTS.HABIT_LOGS_UPDATED, handleHabitUpdate);

    return () => {
      window.removeEventListener(REALTIME_EVENTS.HABIT_SESSIONS_UPDATED, handleHabitUpdate);
      window.removeEventListener(REALTIME_EVENTS.HABIT_LOGS_UPDATED, handleHabitUpdate);
    };
  }, [loadMonth]);

  const handlePrevMonth = () => {
    let nextY = viewYear;
    let nextM = viewMonth - 1;
    if (nextM < 0) {
      nextY = viewYear - 1;
      nextM = 11;
    }
    if (onMonthChange) {
      onMonthChange(nextY, nextM);
    } else {
      setInternalYear(nextY);
      setInternalMonth(nextM);
    }
  };

  const handleNextMonth = () => {
    let nextY = viewYear;
    let nextM = viewMonth + 1;
    if (nextM > 11) {
      nextY = viewYear + 1;
      nextM = 0;
    }
    if (onMonthChange) {
      onMonthChange(nextY, nextM);
    } else {
      setInternalYear(nextY);
      setInternalMonth(nextM);
    }
  };

  const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Build 7-column calendar matrix
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Day of week for 1st of month: 0 (Sun), 1 (Mon)... 6 (Sat)
  // Distance from Monday: 0 (Sun) -> 6, 1 (Mon) -> 0, etc.
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;

  const matrix: Array<Array<Date | null>> = [];
  let currentWeek: Array<Date | null> = [];

  // Padding before first day
  for (let i = 0; i < startDayOffset; i++) {
    currentWeek.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(new Date(viewYear, viewMonth, day));
    if (currentWeek.length === 7) {
      matrix.push(currentWeek);
      currentWeek = [];
    }
  }

  // Padding after last day
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    matrix.push(currentWeek);
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: '18px 16px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Month Navigation Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
          {monthLabel}
        </h3>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            className="fitbee-icon-btn"
            aria-label="Previous month"
            onClick={handlePrevMonth}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAF8',
              color: '#4B5563',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ←
          </button>
          <button
            type="button"
            className="fitbee-icon-btn"
            aria-label="Next month"
            onClick={handleNextMonth}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FAFAF8',
              color: '#4B5563',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* Weekday Header Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {WEEKDAY_HEADERS.map((h, i) => (
          <div
            key={i}
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#9CA3AF',
              textTransform: 'uppercase',
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, opacity: loading ? 0.6 : 1, transition: 'opacity 150ms ease' }}>
        {matrix.map((row, rowIdx) => (
          <div
            key={rowIdx}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              height: 38,
            }}
          >
            {row.map((cellDate, colIdx) => {
              if (!cellDate) {
                return <div key={colIdx} style={{ height: '100%' }} />;
              }

              const dStr = formatDateKey(cellDate);
              const dayDetail = monthData[dStr] || {
                dateStr: dStr,
                date: cellDate,
                isStreakDay: false,
                log: null,
                sessions: [],
              };

              const isStreak = dayDetail.isStreakDay;
              const isToday = dStr === todayStr;
              const isFuture = cellDate > currentDate && !isToday;
              const dayNum = cellDate.getDate();

              return (
                <div
                  key={colIdx}
                  id={`habit-calendar-cell-${dStr}`}
                  role="button"
                  data-date={dStr}
                  onClick={() => setSelectedDayDetail(dayDetail)}
                  title={`${dStr}: Click to view session log`}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: isStreak ? '#D9773F' : isToday ? 'rgba(92, 141, 137, 0.12)' : 'transparent',
                      color: isStreak ? '#FFFFFF' : isFuture ? '#D1D5DB' : isToday ? '#5C8D89' : '#4B5563',
                      border: isToday && !isStreak ? '1.8px solid #5C8D89' : 'none',
                      fontSize: 13,
                      fontWeight: isStreak || isToday ? 750 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isStreak ? '0 2px 4px rgba(217, 119, 63, 0.25)' : 'none',
                      transition: 'transform 120ms ease',
                    }}
                  >
                    {dayNum}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Habit Calendar Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          marginTop: 14,
          paddingTop: 10,
          borderTop: '1px solid #F3F4F6',
          fontSize: 11,
          fontWeight: 600,
          color: '#6B7280',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D9773F', display: 'inline-block' }} />
          <span>Target reached (Streak day)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E5E7EB', display: 'inline-block' }} />
          <span>Target missed / Rest</span>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDayDetail && (
        <HabitDayDetailModal
          isOpen={Boolean(selectedDayDetail)}
          onClose={() => setSelectedDayDetail(null)}
          date={selectedDayDetail.date}
          habit={habit}
          log={selectedDayDetail.log}
          sessions={selectedDayDetail.sessions}
        />
      )}
    </div>
  );
};
