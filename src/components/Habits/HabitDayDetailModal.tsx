import React from 'react';
import { Habit, HabitLog, HabitSession } from '../../types/database.types';
import { formatDuration, formatTimeAmPm } from '../../services/habitService';

interface HabitDayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  habit: Habit;
  log: HabitLog | null;
  sessions: HabitSession[];
}

export const HabitDayDetailModal: React.FC<HabitDayDetailModalProps> = ({
  isOpen,
  onClose,
  date,
  habit,
  log,
  sessions,
}) => {
  if (!isOpen) return null;

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isTimed = habit.type === 'DURATION';
  const targetSeconds = log?.target_duration_seconds ?? habit.target_duration_seconds ?? 0;
  const actualSeconds = log?.actual_duration_seconds ?? sessions.reduce((acc, s) => acc + s.duration_seconds, 0);

  const isCompleted = isTimed ? (targetSeconds > 0 && actualSeconds >= targetSeconds) : Boolean(log?.is_completed);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 180ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClick={onClose}
    >
      <div
        id="habit-day-detail-modal"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '24px 22px',
          maxWidth: 440,
          width: '100%',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)',
          border: '1px solid #E8E8E6',
          position: 'relative',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box',
          animation: 'scaleIn 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Habit History Log
            </span>
            <h3 style={{ fontSize: 18, fontWeight: 750, color: '#1F2937', margin: '2px 0 0' }}>
              {formattedDate}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              color: '#9CA3AF',
              cursor: 'pointer',
              padding: 4,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Habit Card Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 16,
            backgroundColor: '#FAFAF8',
            border: '1px solid #E5E7EB',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{isTimed ? '⏱️' : '✓'}</span>
            <div>
              <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                {habit.name}
              </h4>
              <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
                {isTimed ? `Daily target: ${formatDuration(targetSeconds)}` : 'Checklist task'}
              </p>
            </div>
          </div>

          <div
            style={{
              padding: '4px 10px',
              borderRadius: 12,
              backgroundColor: isCompleted ? '#EAF5EE' : '#FDEBEB',
              color: isCompleted ? '#2D6A4F' : '#A83232',
              border: isCompleted ? '1px solid #B7E4C7' : '1px solid #FECACA',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {isCompleted ? '✓ Target completed' : 'Target not reached'}
          </div>
        </div>

        {/* Timed Habit Sessions */}
        {isTimed ? (
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#4B5563', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Logged Sessions ({sessions.length})
            </h4>

            {sessions.length === 0 ? (
              <div style={{ padding: '18px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: 14, color: '#9CA3AF', fontSize: 13 }}>
                No timer sessions recorded on this day.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 220, overflowY: 'auto', marginBottom: 14, paddingRight: 2 }}>
                {sessions.map((s, i) => (
                  <div
                    key={s.id || i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 12,
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 650, color: '#1F2937' }}>
                        Session {s.session_index || i + 1}
                      </span>
                      <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>
                        {formatTimeAmPm(s.started_at)} – {formatTimeAmPm(s.ended_at)}
                      </p>
                    </div>

                    <div
                      style={{
                        backgroundColor: '#F3F4F6',
                        padding: '3px 9px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        color: '#374151',
                      }}
                    >
                      {formatDuration(s.duration_seconds)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Duration Summary */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid #E5E7EB',
                marginTop: 6,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>
                Total Actual Time
              </span>
              <span style={{ fontSize: 15, fontWeight: 800, color: isCompleted ? '#2D6A4F' : '#5C8D89' }}>
                {formatDuration(actualSeconds)} / {formatDuration(targetSeconds)}
              </span>
            </div>
          </div>
        ) : (
          /* Checklist Habit Detail */
          <div style={{ padding: '14px', backgroundColor: '#FAFAF8', borderRadius: 14, border: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>
                Daily Status
              </span>
              <span style={{ fontSize: 14, fontWeight: 750, color: isCompleted ? '#2D6A4F' : '#9CA3AF' }}>
                {isCompleted ? '✓ Completed' : 'Incomplete'}
              </span>
            </div>
            {log?.completed_at && (
              <p style={{ fontSize: 11, color: '#6B7280', margin: '6px 0 0' }}>
                Marked completed at {formatTimeAmPm(log.completed_at)}
              </p>
            )}
          </div>
        )}

        {/* Close Button */}
        <div style={{ marginTop: 18 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 14,
              border: 'none',
              backgroundColor: '#5C8D89',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(92, 141, 137, 0.25)',
              transition: 'all 150ms ease',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
