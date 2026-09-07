import React from 'react';
import { NutritionLog } from '../../types/database.types';
import {
  UserNutritionTargets,
  classifyNutritionDayStatus,
  formatDateKey,
} from '../../services/nutritionHistoryService';

interface NutritionCalendarProps {
  viewDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  nutritionMap: Record<string, NutritionLog>;
  targets: UserNutritionTargets;
  todayDateStr: string;
  onSelectDate: (date: Date, log: NutritionLog | null) => void;
}

const WEEK_HEADERS = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];


export const NutritionCalendar: React.FC<NutritionCalendarProps> = ({
  viewDate,
  onPrevMonth,
  onNextMonth,
  nutritionMap,
  targets,
  todayDateStr,
  onSelectDate,
}) => {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // 1st of month and last day of month
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

  return (
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
      {/* Month Header Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          padding: '0 4px',
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1F2937', margin: 0 }}>
          {monthName}
        </h3>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onPrevMonth}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid #E8E8E6',
              backgroundColor: '#FAFAF8',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600,
              transition: 'all 180ms ease',
            }}
            aria-label="Previous month"
          >
            ←
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid #E8E8E6',
              backgroundColor: '#FAFAF8',
              color: '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 15,
              fontWeight: 600,
              transition: 'all 180ms ease',
            }}
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Weekday Column Headers (M, T, W, TH, F, S, SU) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          marginBottom: 10,
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
              letterSpacing: '0.04em',
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
                status: 'EMPTY' as const,
                log: null,
                dateStr: '',
                isToday: false,
                dayNum: 0,
                ariaLabel: '',
              };
            }

            const dateStr = formatDateKey(cellDate);
            const isToday = dateStr === todayDateStr;
            const dayNum = cellDate.getDate();
            const log = nutritionMap[dateStr] || null;
            const statusDetails = classifyNutritionDayStatus(log, targets);
            const status = statusDetails.status;

            const fullDateLabel = cellDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });
            const ariaLabel = `${fullDateLabel}, nutrition status: ${statusDetails.label}`;

            return {
              cellDate,
              colIndex,
              status,
              log,
              dateStr,
              isToday,
              dayNum,
              ariaLabel,
            };
          });

          // Detect consecutive active status runs in this row (HIT_MOST, PARTIAL, MISSED)
          interface CapsuleRun {
            startCol: number;
            endCol: number;
            status: 'HIT_MOST' | 'PARTIAL' | 'MISSED';
          }

          const runs: CapsuleRun[] = [];
          let currentRun: CapsuleRun | null = null;

          for (let col = 0; col < 7; col++) {
            const cell = cells[col];
            if (cell.status === 'HIT_MOST' || cell.status === 'PARTIAL' || cell.status === 'MISSED') {
              if (currentRun && currentRun.status === cell.status) {
                currentRun.endCol = col;
              } else {
                if (currentRun) runs.push(currentRun);
                currentRun = { startCol: col, endCol: col, status: cell.status };
              }
            } else {
              if (currentRun) {
                runs.push(currentRun);
                currentRun = null;
              }
            }
          }
          if (currentRun) runs.push(currentRun);

          const capsuleHeight = 34;
          const radius = capsuleHeight / 2; // 17px

          return (
            <div
              key={rowIndex}
              style={{
                position: 'relative',
                height: 44, // 44px touch target height
              }}
            >
              {/* Background Continuous Capsules Layer */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  pointerEvents: 'none',
                  zIndex: 0,
                }}
              >
                {runs.map((run, runIndex) => {
                  let bg = 'linear-gradient(180deg, #68AA80 0%, #5E9F76 100%)';
                  let border = '1px solid rgba(76, 136, 97, 0.35)';
                  let shadow = '0 2px 6px rgba(94, 159, 118, 0.22)';

                  if (run.status === 'PARTIAL') {
                    bg = 'linear-gradient(180deg, #EFB37D 0%, #E8A66A 100%)';
                    border = '1px solid rgba(217, 119, 63, 0.28)';
                    shadow = '0 2px 6px rgba(232, 166, 106, 0.22)';
                  } else if (run.status === 'MISSED') {
                    bg = 'linear-gradient(180deg, #D47777 0%, #C96A6A 100%)';
                    border = '1px solid rgba(179, 86, 86, 0.35)';
                    shadow = '0 2px 6px rgba(201, 106, 106, 0.22)';
                  }

                  const leftPct = ((run.startCol + 0.5) / 7) * 100;
                  const widthPct = ((run.endCol - run.startCol) / 7) * 100;

                  return (
                    <div
                      key={runIndex}
                      style={{
                        position: 'absolute',
                        left: `calc(${leftPct}% - ${radius}px)`,
                        width: `calc(${widthPct}% + ${2 * radius}px)`,
                        top: `calc(50% - ${radius}px)`,
                        height: capsuleHeight,
                        borderRadius: radius,
                        background: bg,
                        border: border,
                        boxShadow: shadow,
                        boxSizing: 'border-box',
                      }}
                    />
                  );
                })}
              </div>

              {/* Foreground Interactive Day Cells */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  height: '100%',
                  position: 'relative',
                  zIndex: 1,
                }}
              >
                {cells.map((cell, colIndex) => {
                  if (!cell.cellDate) {
                    return <div key={colIndex} style={{ height: '100%' }} />;
                  }

                  // Unlogged Day (⚪) - Neutral Circle
                  if (cell.status === 'NO_LOG') {
                    return (
                      <div
                        key={colIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectDate(cell.cellDate!, cell.log)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: '#FAFAF8',
                            border: cell.isToday ? '2px solid #5C8D89' : '1px solid #E5E7EB',
                            color: cell.isToday ? '#5C8D89' : '#6B7280',
                            fontSize: 13,
                            fontWeight: cell.isToday ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: 0,
                            fontFamily: 'inherit',
                            transition: 'all 150ms ease',
                          }}
                          aria-label={cell.ariaLabel}
                        >
                          {cell.dayNum}
                        </button>
                      </div>
                    );
                  }

                  // Active Logged Status (Hit most, Partial, Missed)
                  const isPartial = cell.status === 'PARTIAL';
                  const textColor = isPartial ? '#451A03' : '#FFFFFF';
                  const todayRingColor = isPartial ? '#451A03' : '#FFFFFF';

                  return (
                    <div
                      key={colIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => onSelectDate(cell.cellDate!, cell.log)}
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0,
                          fontFamily: 'inherit',
                          color: textColor,
                          fontSize: 13,
                          fontWeight: 700,
                          outline: 'none',
                        }}
                        aria-label={cell.ariaLabel}
                      >
                        {cell.isToday ? (
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: '50%',
                              border: `2px solid ${todayRingColor}`,
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
                      </button>
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
          marginTop: 20,
          paddingTop: 16,
          borderTop: '1px solid #E8E8E6',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
        }}
      >
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
          <span style={{ fontSize: 12, color: '#4B5563', fontWeight: 500 }}>
            Hit most targets
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#E8A66A',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 12, color: '#4B5563', fontWeight: 500 }}>
            Partially hit targets
          </span>
        </div>

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
          <span style={{ fontSize: 12, color: '#4B5563', fontWeight: 500 }}>
            Significantly missed
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#D1D5DB',
              border: '1px solid #E5E7EB',
              display: 'inline-block',
            }}
          />
          <span style={{ fontSize: 12, color: '#4B5563', fontWeight: 500 }}>
            No log
          </span>
        </div>
      </div>
    </div>
  );
};
