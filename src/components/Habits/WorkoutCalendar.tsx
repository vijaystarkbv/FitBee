import React from 'react';
import { WorkoutDayStatus, formatDateKey } from '../../services/workoutHistoryService';

interface WorkoutCalendarProps {
  viewDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  dailyMap: Record<
    string,
    {
      status: WorkoutDayStatus;
      log: any | null;
      isPlanned: boolean;
      isPartiallyCompleted?: boolean;
      completedCount?: number;
      totalCount?: number;
    }
  >;
  todayDateStr: string;
  onSelectDate: (
    date: Date,
    status: WorkoutDayStatus,
    isPlanned: boolean,
    log: any | null,
    isPartiallyCompleted?: boolean,
    completedCount?: number,
    totalCount?: number
  ) => void;
}

const WEEK_HEADERS = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({
  viewDate,
  onPrevMonth,
  onNextMonth,
  dailyMap,
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

  // Capsule status styling definitions:
  // COMPLETED = 🟢 Soft green
  // MISSED = 🔴 Soft red
  // EXTRA = 🔵 Soft blue
  // REST = ⚪ Soft neutral
  const getStatusStyles = (status: WorkoutDayStatus) => {
    switch (status) {
      case 'COMPLETED':
        return {
          bg: '#EAF5EE',
          text: '#2D6A4F',
          dot: '#5E9F76',
          label: 'Completed planned workout',
        };
      case 'MISSED':
        return {
          bg: '#FDEBEB',
          text: '#A83232',
          dot: '#C96A6A',
          label: 'Missed planned workout',
        };
      case 'EXTRA':
        return {
          bg: '#EBF2FC',
          text: '#2A5A9E',
          dot: '#6B9FE8',
          label: 'Extra workout',
        };
      case 'NONE':
        return {
          bg: 'transparent',
          text: '#9CA3AF',
          dot: 'transparent',
          label: 'No workout schedule',
        };
      case 'REST':
      default:
        return {
          bg: '#F9FAFB',
          text: '#6B7280',
          dot: '#D1D5DB',
          label: 'Rest day',
        };
    }
  };

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
                status: 'REST' as WorkoutDayStatus,
                isPlanned: false,
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
            const dayInfo = dailyMap[dateStr] || { status: 'REST', log: null, isPlanned: false };
            const status = dayInfo.status;
            const isPlanned = dayInfo.isPlanned;
            const log = dayInfo.log;
            const isPartiallyCompleted = dayInfo.isPartiallyCompleted;
            const completedCount = dayInfo.completedCount;
            const totalCount = dayInfo.totalCount;

            const fullDateLabel = cellDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });
            const styles = getStatusStyles(status);
            const ariaLabel = `${fullDateLabel}, workout status: ${styles.label}`;

            return {
              cellDate,
              colIndex,
              status,
              isPlanned,
              log,
              isPartiallyCompleted,
              completedCount,
              totalCount,
              dateStr,
              isToday,
              dayNum,
              ariaLabel,
            };
          });

          // Detect consecutive active status runs in this row (COMPLETED, MISSED, EXTRA, REST)
          interface CapsuleRun {
            startCol: number;
            endCol: number;
            status: WorkoutDayStatus;
          }

          const runs: CapsuleRun[] = [];
          let currentRun: CapsuleRun | null = null;

          for (let col = 0; col < 7; col++) {
            const cell = cells[col];
            if (cell.cellDate !== null) {
              if (currentRun && currentRun.status === cell.status) {
                currentRun.endCol = col;
              } else {
                if (currentRun) runs.push(currentRun);
                currentRun = {
                  startCol: col,
                  endCol: col,
                  status: cell.status,
                };
              }
            } else {
              if (currentRun) {
                runs.push(currentRun);
                currentRun = null;
              }
            }
          }
          if (currentRun) runs.push(currentRun);

          return (
            <div
              key={rowIndex}
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                height: 48,
              }}
            >
              {/* Layer 1: Seamless Continuous Capsule Spans */}
              {runs.map((run, runIndex) => {
                if (run.status === 'NONE') return null;
                const styles = getStatusStyles(run.status);
                const leftPercent = (run.startCol / 7) * 100;
                const widthPercent = ((run.endCol - run.startCol + 1) / 7) * 100;

                return (
                  <div
                    key={`run-${rowIndex}-${runIndex}`}
                    style={{
                      position: 'absolute',
                      top: 2,
                      bottom: 2,
                      left: `calc(${leftPercent}% + 2px)`,
                      width: `calc(${widthPercent}% - 4px)`,
                      backgroundColor: styles.bg,
                      borderRadius: 22,
                      zIndex: 1,
                      pointerEvents: 'none',
                    }}
                  />
                );
              })}

              {/* Layer 2: Interactive Day Cells (Touch Target >= 44x44px) */}
              {cells.map((cell, colIndex) => {
                if (!cell.cellDate) {
                  return <div key={`empty-${colIndex}`} style={{ minWidth: 44, minHeight: 44 }} />;
                }

                const styles = getStatusStyles(cell.status);

                return (
                  <button
                    key={cell.dateStr}
                    type="button"
                    onClick={() =>
                      onSelectDate(
                        cell.cellDate!,
                        cell.status,
                        cell.isPlanned,
                        cell.log,
                        cell.isPartiallyCompleted,
                        cell.completedCount,
                        cell.totalCount
                      )
                    }
                    aria-label={cell.ariaLabel}
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      width: '100%',
                      height: '100%',
                      minWidth: 44,
                      minHeight: 44,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent',
                      border: cell.isToday ? '2px solid #5C8D89' : 'none',
                      borderRadius: 22,
                      cursor: 'pointer',
                      padding: 0,
                      margin: 0,
                      outline: 'none',
                      transition: 'transform 150ms ease',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: cell.isToday ? 800 : 650,
                        color: styles.text,
                        lineHeight: 1,
                      }}
                    >
                      {cell.dayNum}
                    </span>

                    {/* Tiny Status Indicator Dot */}
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        backgroundColor: styles.dot,
                        marginTop: 4,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
