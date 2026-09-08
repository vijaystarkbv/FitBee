import React, { useState, useEffect, useCallback } from 'react';
import { Habit } from '../../types/database.types';
import {
  fetchHabitMonthWeeklyHistory,
  HabitMonthWeeklyData,
  HabitWeekDayPoint,
  formatDuration,
} from '../../services/habitService';
import { REALTIME_EVENTS } from '../../services/realtimeService';

interface HabitFourWeekChartProps {
  habit: Habit;
  userId: string;
  currentDate: Date;
  year?: number;
  month?: number; // 0-indexed
}

export const HabitFourWeekChart: React.FC<HabitFourWeekChartProps> = ({
  habit,
  userId,
  currentDate,
  year: propYear,
  month: propMonth,
}) => {
  const activeYear = propYear ?? currentDate.getFullYear();
  const activeMonth = propMonth ?? currentDate.getMonth();

  const [weeks, setWeeks] = useState<HabitMonthWeeklyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchHabitMonthWeeklyHistory(
        userId,
        habit.id,
        activeYear,
        activeMonth,
        currentDate
      );
      setWeeks(data);
    } catch (err) {
      console.error('Failed to load month habit history:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, habit.id, activeYear, activeMonth, currentDate]);

  useEffect(() => {
    loadData();

    const handleHabitUpdate = () => {
      loadData();
    };

    window.addEventListener(REALTIME_EVENTS.HABIT_SESSIONS_UPDATED, handleHabitUpdate);
    window.addEventListener(REALTIME_EVENTS.HABIT_LOGS_UPDATED, handleHabitUpdate);

    return () => {
      window.removeEventListener(REALTIME_EVENTS.HABIT_SESSIONS_UPDATED, handleHabitUpdate);
      window.removeEventListener(REALTIME_EVENTS.HABIT_LOGS_UPDATED, handleHabitUpdate);
    };
  }, [loadData]);

  if (loading) {
    return (
      <div style={{ padding: '24px 16px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
        Loading weekly habit progress...
      </div>
    );
  }

  // Filter only weeks that contain data
  const activeWeeks = weeks.filter((w) => w.hasData);
  const hasInactiveWeeks = activeWeeks.length > 0 && activeWeeks.length < weeks.length;
  const inactiveCount = weeks.length - activeWeeks.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 14 }}>
      {/* Section Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', margin: 0 }}>
          Weekly Progress
        </h3>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
          {habit.type === 'DURATION' ? 'Actual Duration' : 'Completion Rate'}
        </span>
      </div>

      {/* Case 1: Whole month has 0 data */}
      {activeWeeks.length === 0 ? (
        <div className="fitbee-empty-month-state">
          No data was logged this month.
        </div>
      ) : (
        <>
          {/* Case 2 & 3: Render only active weeks */}
          {activeWeeks.map((week) =>
            habit.type === 'DURATION' ? (
              <DurationWeekCard key={week.weekIndex} week={week} />
            ) : (
              <ChecklistWeekCard key={week.weekIndex} week={week} />
            )
          )}

          {/* Concise indication for remaining empty weeks if some had no data */}
          {hasInactiveWeeks && (
            <div className="fitbee-remaining-weeks-empty">
              The other {inactiveCount === 1 ? 'week had' : 'weeks had'} no data.
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Weekly Card for Duration Habits (with SVG Line Graph)
 */
const DurationWeekCard: React.FC<{ week: HabitMonthWeeklyData }> = ({ week }) => {
  const [hoveredPoint, setHoveredPoint] = useState<HabitWeekDayPoint | null>(null);

  // Determine Y-axis max: default 10h, adjust if any day exceeds 10h
  const maxDayHours = Math.max(0, ...week.days.map((d) => d.hours));
  const maxAxisHours = maxDayHours > 10 ? Math.ceil(maxDayHours / 2) * 2 : 10;
  const midAxisHours = maxAxisHours / 2;

  // SVG dimensions
  const width = 380;
  const height = 150;
  const paddingLeft = 42;
  const paddingRight = 24;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const chartBottom = height - paddingBottom;

  const getX = (index: number) => paddingLeft + index * (chartWidth / 6);
  const getY = (hours: number) =>
    chartBottom - (Math.min(hours, maxAxisHours) / maxAxisHours) * chartHeight;

  // Plotted points: only include days up to today if current week
  const validPoints = week.days
    .map((d, idx) => ({ ...d, idx, x: getX(idx), y: getY(d.hours) }))
    .filter((d) => !d.isFuture);

  // SVG Line path
  let pathD = '';
  if (validPoints.length > 1) {
    pathD = `M ${validPoints[0].x} ${validPoints[0].y}`;
    for (let i = 1; i < validPoints.length; i++) {
      const prev = validPoints[i - 1];
      const curr = validPoints[i];
      const cx = (prev.x + curr.x) / 2;
      pathD += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }
  } else if (validPoints.length === 1) {
    pathD = `M ${validPoints[0].x} ${validPoints[0].y} L ${validPoints[0].x} ${validPoints[0].y}`;
  }

  // Gradient area
  let areaD = '';
  if (validPoints.length > 1) {
    const first = validPoints[0];
    const last = validPoints[validPoints.length - 1];
    areaD = `${pathD} L ${last.x} ${chartBottom} L ${first.x} ${chartBottom} Z`;
  }

  const gradId = `habit_grad_${week.weekIndex}_${week.startDate}`;

  const formattedWeekTotal =
    week.totalHours > 0 || week.totalMinutes > 0
      ? `${week.totalHours}h ${week.totalMinutes > 0 ? `${week.totalMinutes}m ` : ''}this week 🔥`
      : '0h this week';

  return (
    <div
      className="fitbee-card-interactive"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: '16px 16px 14px',
        border: '1px solid #E8E8E6',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Week Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>
            Week {week.weekIndex}
          </span>
          {week.isCurrentWeek && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#5C8D89',
                backgroundColor: 'rgba(92, 141, 137, 0.08)',
                border: '1px solid rgba(92, 141, 137, 0.2)',
                borderRadius: 6,
                padding: '1px 5px',
              }}
            >
              Current
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#5C8D89', backgroundColor: '#F4F8F7', padding: '2px 6px', borderRadius: 6 }}>
            {week.loggedCount} {week.loggedCount === 1 ? 'day' : 'days'} logged
          </span>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>
            {week.weekLabel}
          </span>
        </div>
      </div>

      {/* Interactive Tooltip Banner */}
      <div style={{ height: 20, marginBottom: 2 }}>
        {hoveredPoint ? (
          <span style={{ fontSize: 12, fontWeight: 700, color: '#5C8D89' }}>
            {hoveredPoint.fullDayName}: {formatDuration(hoveredPoint.seconds)}
          </span>
        ) : (
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>
            Hover points to see daily duration
          </span>
        )}
      </div>

      {/* SVG Chart */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5C8D89" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#5C8D89" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Top Line (Max 10h) */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={width - paddingRight}
            y2={paddingTop}
            stroke="#F3F4F6"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x={paddingLeft - 8}
            y={paddingTop + 4}
            textAnchor="end"
            fill="#9CA3AF"
            fontSize="10"
            fontWeight="600"
          >
            {maxAxisHours}h
          </text>

          {/* Middle Line (5h) */}
          <line
            x1={paddingLeft}
            y1={getY(midAxisHours)}
            x2={width - paddingRight}
            y2={getY(midAxisHours)}
            stroke="#F3F4F6"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x={paddingLeft - 8}
            y={getY(midAxisHours) + 4}
            textAnchor="end"
            fill="#9CA3AF"
            fontSize="10"
            fontWeight="600"
          >
            {midAxisHours}h
          </text>

          {/* Base X Axis Line */}
          <line
            x1={paddingLeft}
            y1={chartBottom}
            x2={width - paddingRight}
            y2={chartBottom}
            stroke="#E5E7EB"
            strokeWidth="1"
          />

          {/* Area Fill */}
          {areaD && <path d={areaD} fill={`url(#${gradId})`} />}

          {/* Line Path */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#5C8D89"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points & X-Axis Day Labels */}
          {week.days.map((d, idx) => {
            const x = getX(idx);
            const y = getY(d.hours);
            const isHovered = hoveredPoint?.dateStr === d.dateStr;

            return (
              <g key={d.dateStr}>
                <text
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  fill={d.isToday ? '#5C8D89' : '#9CA3AF'}
                  fontSize="11"
                  fontWeight={d.isToday ? '800' : '600'}
                >
                  {d.dayLabel}
                </text>

                {!d.isFuture && (
                  <g
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPoint(d)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <circle cx={x} cy={y} r="12" fill="transparent" />
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 5.5 : 4}
                      fill={d.hours > 0 ? '#5C8D89' : '#E5E7EB'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Weekly Total Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 10,
          borderTop: '1px solid #F3F4F6',
          marginTop: 6,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6B7280' }}>
          Total Time
        </span>
        <span style={{ fontSize: 13, fontWeight: 800, color: '#5C8D89' }}>
          {formattedWeekTotal}
        </span>
      </div>
    </div>
  );
};

/**
 * Weekly Card for Checklist Habits
 */
const ChecklistWeekCard: React.FC<{ week: HabitMonthWeeklyData }> = ({ week }) => {
  return (
    <div
      className="fitbee-card-interactive"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: '16px 16px 14px',
        border: '1px solid #E8E8E6',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Week Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1F2937' }}>
            Week {week.weekIndex}
          </span>
          {week.isCurrentWeek && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#5C8D89',
                backgroundColor: 'rgba(92, 141, 137, 0.08)',
                border: '1px solid rgba(92, 141, 137, 0.2)',
                borderRadius: 6,
                padding: '1px 5px',
              }}
            >
              Current
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#5C8D89', backgroundColor: '#F4F8F7', padding: '2px 6px', borderRadius: 6 }}>
            {week.loggedCount} {week.loggedCount === 1 ? 'day' : 'days'} logged
          </span>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#6B7280' }}>
            {week.weekLabel}
          </span>
        </div>
      </div>

      {/* 7-Day Completion Status Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginTop: 8 }}>
        {week.days.map((d) => {
          const isDone = d.isCompleted;
          const bg = isDone ? '#EAF5EE' : d.isFuture ? '#FAFAF8' : '#F3F4F6';
          const border = isDone ? '#A7F3D0' : d.isToday ? '#5C8D89' : '#E5E7EB';
          const textColor = isDone ? '#2D6A4F' : d.isToday ? '#5C8D89' : '#6B7280';

          return (
            <div
              key={d.dateStr}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 4px',
                borderRadius: 12,
                backgroundColor: bg,
                border: `1px solid ${border}`,
                opacity: d.isFuture ? 0.6 : 1,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: textColor, marginBottom: 4 }}>
                {d.dayLabel}
              </span>
              <span style={{ fontSize: 12, fontWeight: 800, color: textColor }}>
                {isDone ? '✓' : d.isFuture ? '·' : '—'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
