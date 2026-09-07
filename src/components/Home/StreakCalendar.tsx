import React, { useState } from 'react';
import { DayStreakInfo, formatDateKey } from '../../services/streakService';
import { clock } from '../../services/clock';

interface StreakCalendarProps {
  streakMap?: Record<string, DayStreakInfo>;
}


export const StreakCalendar: React.FC<StreakCalendarProps> = ({ streakMap = {} }) => {
  // Current active view month/year
  const [viewDate, setViewDate] = useState<Date>(() => clock.now());

  const currentNow = clock.now();
  const todayStr = formatDateKey(currentNow);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Navigation handlers
  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Build calendar matrix (rows of 7 days: Mon to Sun)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week for 1st of month: 0=Sun, 1=Mon...
  let startCol = firstDayOfMonth.getDay() - 1;
  if (startCol === -1) startCol = 6; // Sunday becomes index 6

  const daysInMonth = lastDayOfMonth.getDate();

  // Create grid matrix
  const matrix: (Date | null)[][] = [];
  let currentRow: (Date | null)[] = Array(startCol).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    currentRow.push(dateObj);

    if (currentRow.length === 7) {
      matrix.push(currentRow);
      currentRow = [];
    }
  }

  if (currentRow.length > 0) {
    while (currentRow.length < 7) {
      currentRow.push(null);
    }
    matrix.push(currentRow);
  }

  const WEEK_HEADERS = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: '20px 16px',
        border: '1px solid #E8E8E6',
        marginTop: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        animation: 'fadeInUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Month Header Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          padding: '0 4px',
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
          {monthName}
        </h3>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={handlePrevMonth}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#F3F4F6',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
            aria-label="Previous month"
          >
            ←
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#F3F4F6',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
            }}
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Weekday Column Headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {WEEK_HEADERS.map((h, i) => (
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

      {/* Monthly Grid with Seamless Continuous Streak Capsules */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {matrix.map((row, rowIndex) => {
          // Pre-compute cell data for this row
          const cells = row.map((cellDate, colIndex) => {
            if (!cellDate) {
              return {
                cellDate: null,
                colIndex,
                isStreak: false,
                status: 'EMPTY' as const,
                dateStr: '',
                isToday: false,
                isFuture: false,
                dayNum: 0,
              };
            }

            const dateStr = formatDateKey(cellDate);
            const isToday = dateStr === todayStr;
            const isFuture = cellDate > currentNow && !isToday;
            const dayNum = cellDate.getDate();

            const dayInfo = streakMap?.[dateStr];
            const isStreak = !isFuture && Boolean(dayInfo?.isStreak);
            const status = isStreak ? (dayInfo?.status || 'FULL') : 'MISSED';

            return {
              cellDate,
              colIndex,
              isStreak,
              status,
              dateStr,
              isToday,
              isFuture,
              dayNum,
            };
          });

          // Detect consecutive active streak runs in this row (FULL or PARTIAL)
          interface StreakRun {
            startCol: number;
            endCol: number;
            cells: typeof cells;
          }

          const activeRuns: StreakRun[] = [];
          let currentActiveRun: StreakRun | null = null;

          for (let col = 0; col < 7; col++) {
            const cell = cells[col];
            const isActive = cell.isStreak && (cell.status === 'FULL' || cell.status === 'PARTIAL');
            if (isActive) {
              if (currentActiveRun) {
                currentActiveRun.endCol = col;
                currentActiveRun.cells.push(cell);
              } else {
                currentActiveRun = { startCol: col, endCol: col, cells: [cell] };
              }
            } else {
              if (currentActiveRun) {
                activeRuns.push(currentActiveRun);
                currentActiveRun = null;
              }
            }
          }
          if (currentActiveRun) activeRuns.push(currentActiveRun);

          // Detect consecutive frozen runs in this row
          const frozenRuns: StreakRun[] = [];
          let currentFrozenRun: StreakRun | null = null;

          for (let col = 0; col < 7; col++) {
            const cell = cells[col];
            const isFrozen = cell.isStreak && cell.status === 'FROZEN';
            if (isFrozen) {
              if (currentFrozenRun) {
                currentFrozenRun.endCol = col;
                currentFrozenRun.cells.push(cell);
              } else {
                currentFrozenRun = { startCol: col, endCol: col, cells: [cell] };
              }
            } else {
              if (currentFrozenRun) {
                frozenRuns.push(currentFrozenRun);
                currentFrozenRun = null;
              }
            }
          }
          if (currentFrozenRun) frozenRuns.push(currentFrozenRun);

          return (
            <div
              key={rowIndex}
              style={{
                position: 'relative',
                height: 40,
                filter: 'drop-shadow(0 2px 4px rgba(217, 119, 63, 0.16))',
              }}
            >
              {/* Foreground Interactive Day Cells Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  height: '100%',
                  position: 'relative',
                }}
              >
                {cells.map((cell, colIndex) => {
                  if (!cell.cellDate) {
                    return <div key={colIndex} style={{ height: '100%' }} />;
                  }

                  // Normal Non-Streak Day
                  if (!cell.isStreak) {
                    return (
                      <div
                        key={colIndex}
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: cell.isToday ? 'rgba(92, 141, 137, 0.12)' : 'transparent',
                            color: cell.isFuture ? '#D1D5DB' : cell.isToday ? '#5C8D89' : '#4B5563',
                            fontSize: 13,
                            fontWeight: cell.isToday ? 750 : 500,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: cell.isToday ? '1.8px solid #5C8D89' : 'none',
                          }}
                        >
                          {cell.dayNum}
                        </div>
                      </div>
                    );
                  }

                  // Active streak run or Frozen run
                  const activeRun = activeRuns.find(r => colIndex >= r.startCol && colIndex <= r.endCol);
                  const frozenRun = frozenRuns.find(r => colIndex >= r.startCol && colIndex <= r.endCol);

                  let bgGradient = '';
                  let isRunStart = false;
                  let isRunMiddle = false;
                  let isRunEnd = false;
                  let isSingleDay = false;

                  if (activeRun) {
                    isSingleDay = activeRun.startCol === activeRun.endCol;
                    isRunStart = colIndex === activeRun.startCol && !isSingleDay;
                    isRunEnd = colIndex === activeRun.endCol && !isSingleDay;
                    isRunMiddle = colIndex > activeRun.startCol && colIndex < activeRun.endCol;

                    const prevCell = colIndex > activeRun.startCol ? cells[colIndex - 1] : null;
                    const nextCell = colIndex < activeRun.endCol ? cells[colIndex + 1] : null;
                    const prevStatus = prevCell?.status;
                    const nextStatus = nextCell?.status;

                    const COLOR_FULL = '#D9773F';
                    const COLOR_PARTIAL = '#E8A66A';
                    const COLOR_BLEND = '#E08E55'; // Midpoint between Full (#D9773F) and Partial (#E8A66A)

                    const isTransitionLeft = Boolean(prevStatus && prevStatus !== cell.status);
                    const isTransitionRight = Boolean(nextStatus && nextStatus !== cell.status);

                    if (isSingleDay) {
                      bgGradient = cell.status === 'FULL'
                        ? 'linear-gradient(180deg, #E0824B 0%, #D9773F 100%)'
                        : 'linear-gradient(180deg, #EFB37D 0%, #E8A66A 100%)';
                    } else if (isTransitionLeft || isTransitionRight) {
                      let hStops = '';
                      if (cell.status === 'FULL') {
                        if (isTransitionLeft && isTransitionRight) {
                          hStops = `${COLOR_BLEND} 0%, ${COLOR_FULL} 40%, ${COLOR_FULL} 60%, ${COLOR_BLEND} 100%`;
                        } else if (isTransitionLeft) {
                          hStops = `${COLOR_BLEND} 0%, ${COLOR_FULL} 50%, ${COLOR_FULL} 100%`;
                        } else {
                          hStops = `${COLOR_FULL} 0%, ${COLOR_FULL} 50%, ${COLOR_BLEND} 100%`;
                        }
                      } else {
                        // PARTIAL
                        if (isTransitionLeft && isTransitionRight) {
                          hStops = `${COLOR_BLEND} 0%, ${COLOR_PARTIAL} 40%, ${COLOR_PARTIAL} 60%, ${COLOR_BLEND} 100%`;
                        } else if (isTransitionLeft) {
                          hStops = `${COLOR_BLEND} 0%, ${COLOR_PARTIAL} 50%, ${COLOR_PARTIAL} 100%`;
                        } else {
                          hStops = `${COLOR_PARTIAL} 0%, ${COLOR_PARTIAL} 50%, ${COLOR_BLEND} 100%`;
                        }
                      }
                      bgGradient = `linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.05) 100%), linear-gradient(90deg, ${hStops})`;
                    } else {
                      const solidColor = cell.status === 'FULL' ? COLOR_FULL : COLOR_PARTIAL;
                      bgGradient = `linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(0, 0, 0, 0.05) 100%), linear-gradient(90deg, ${solidColor} 0%, ${solidColor} 100%)`;
                    }
                  } else if (frozenRun) {
                    isSingleDay = frozenRun.startCol === frozenRun.endCol;
                    isRunStart = colIndex === frozenRun.startCol && !isSingleDay;
                    isRunEnd = colIndex === frozenRun.endCol && !isSingleDay;
                    isRunMiddle = colIndex > frozenRun.startCol && colIndex < frozenRun.endCol;

                    bgGradient = 'linear-gradient(180deg, #7BAAF0 0%, #6B9FE8 100%)';
                  }

                  const isPartial = cell.status === 'PARTIAL';
                  const textColor = isPartial ? '#451A03' : '#FFFFFF';
                  const ringColor = isPartial ? '#451A03' : '#FFFFFF';

                  return (
                    <div
                      key={colIndex}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      {/* Capsule slice background for this day */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(50% - 16px)',
                          height: 32,
                          background: bgGradient,
                          zIndex: 0,
                          pointerEvents: 'none',
                          boxSizing: 'border-box',
                          ...(isSingleDay && {
                            left: 'calc(50% - 16px)',
                            width: 32,
                            borderRadius: 16,
                          }),
                          ...(isRunStart && {
                            left: 'calc(50% - 16px)',
                            right: 0,
                            borderTopLeftRadius: 16,
                            borderBottomLeftRadius: 16,
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0,
                          }),
                          ...(isRunMiddle && {
                            left: 0,
                            right: 0,
                            borderRadius: 0,
                          }),
                          ...(isRunEnd && {
                            left: 0,
                            width: 'calc(50% + 16px)',
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            borderTopRightRadius: 16,
                            borderBottomRightRadius: 16,
                          }),
                        }}
                      />

                      {/* Foreground Day Number */}
                      <div
                        style={{
                          position: 'relative',
                          zIndex: 2,
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: textColor,
                          fontSize: 13,
                          fontWeight: 750,
                        }}
                      >
                        {cell.isToday ? (
                          <span
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              border: `2px solid ${ringColor}`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxSizing: 'border-box',
                            }}
                          >
                            {cell.dayNum}
                          </span>
                        ) : (
                          cell.dayNum
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginTop: 18,
          paddingTop: 14,
          borderTop: '1px solid #E8E8E6',
          fontSize: 11,
          fontWeight: 600,
          color: '#4B5563',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D9773F', display: 'inline-block' }} />
          <span>Full completion</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#E8A66A', display: 'inline-block' }} />
          <span>Partial completion</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#6B9FE8', display: 'inline-block' }} />
          <span>Frozen day</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#D1D5DB', display: 'inline-block' }} />
          <span>Incomplete</span>
        </div>
      </div>
    </div>
  );
};
