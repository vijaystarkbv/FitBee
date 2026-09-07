import React from 'react';
import { WorkoutDayStatus } from '../../services/workoutHistoryService';

interface WorkoutDayDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  status: WorkoutDayStatus;
  isPlanned: boolean;
  plannedDayName?: string;
  log: any | null;
}

export const WorkoutDayDetailModal: React.FC<WorkoutDayDetailModalProps> = ({
  isOpen,
  onClose,
  date,
  status,
  isPlanned,
  plannedDayName,
  log,
}) => {
  if (!isOpen) return null;

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const isExtra = status === 'EXTRA';
  const isCompleted = status === 'COMPLETED';
  const isMissed = status === 'MISSED';
  const isRest = status === 'REST';

  // Extract exercises from log sets
  const exercisesMap: Record<
    string,
    {
      name: string;
      weight?: number;
      sets: Array<{ weight?: number; reps?: number; seconds?: number }>;
    }
  > = {};

  if (log && log.workout_log_sets) {
    log.workout_log_sets.forEach((s: any) => {
      const name = s.exercise_name || 'Exercise';
      if (!exercisesMap[name]) {
        exercisesMap[name] = { name, sets: [] };
      }
      exercisesMap[name].sets.push({
        weight: Number(s.weight_kg) || undefined,
        reps: s.reps_completed != null ? Number(s.reps_completed) : undefined,
        seconds: s.duration_seconds != null ? Number(s.duration_seconds) : undefined,
      });
    });
  }

  const exerciseList = Object.values(exercisesMap);

  // Status badge details
  const getBadge = () => {
    switch (status) {
      case 'COMPLETED':
        return { label: 'Completed Workout', color: '#2D6A4F', bg: '#EAF5EE', border: '#B7E4C7' };
      case 'EXTRA':
        return { label: 'Extra Workout', color: '#2A5A9E', bg: '#EBF2FC', border: '#BFDBFE' };
      case 'MISSED':
        return { label: 'Missed Workout', color: '#A83232', bg: '#FDEBEB', border: '#FECACA' };
      case 'REST':
      default:
        return { label: 'Rest Day', color: '#4B5563', bg: '#F3F4F6', border: '#E5E7EB' };
    }
  };

  const badge = getBadge();
  const workoutTitle = log?.day_name || (isPlanned ? plannedDayName || 'Planned Workout' : isExtra ? 'Extra Workout' : 'Rest Day');

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
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '26px 22px',
          width: '100%',
          maxWidth: 420,
          border: '1px solid #E8E8E6',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
          maxHeight: '85vh',
          overflowY: 'auto',
          animation: 'slideUp 220ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Date + Status Badge + Close */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>
              {formattedDate}
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 750, color: '#1F2937', margin: '2px 0 0' }}>
              {workoutTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: '#F3F4F6',
              border: 'none',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 16,
              transition: 'background-color 150ms',
            }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Status Badge */}
        <div style={{ marginBottom: 18 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '4px 10px',
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 700,
              color: badge.color,
              backgroundColor: badge.bg,
              border: `1px solid ${badge.border}`,
            }}
          >
            {badge.label}
          </span>
        </div>

        {/* Workout Content */}
        {(isCompleted || isExtra) && (
          <div>
            {exerciseList.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  borderRadius: 16,
                  padding: '20px 16px',
                  textAlign: 'center',
                  color: '#6B7280',
                  fontSize: 13,
                  border: '1px dashed #E8E8E6',
                }}
              >
                Workout marked completed, but no individual sets were recorded.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {exerciseList.map((ex, i) => {
                  // Check if weighted or timer
                  const weights = ex.sets.map((s) => s.weight).filter((w): w is number => w !== undefined && w > 0);
                  const isTimer = ex.sets.some((s) => s.seconds !== undefined);
                  const isWeighted = weights.length > 0;

                  return (
                    <div
                      key={i}
                      style={{
                        backgroundColor: '#FAFAF8',
                        borderRadius: 16,
                        padding: '14px 16px',
                        border: '1px solid #E8E8E6',
                      }}
                    >
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                        {ex.name}
                      </h4>

                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                        {isTimer ? (
                          <>
                            <span style={{ fontSize: 11.5, color: '#6B7280', marginRight: 2 }}>
                              {ex.sets.length} sets
                            </span>
                            {ex.sets.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  padding: '2px 7px',
                                  backgroundColor: '#EDEFEF',
                                  borderRadius: 4,
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  color: '#374151',
                                  lineHeight: 1.3,
                                }}
                              >
                                {s.seconds ?? 0}s
                              </span>
                            ))}
                          </>
                        ) : isWeighted ? (
                          <>
                            {ex.sets.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  padding: '2px 7px',
                                  backgroundColor: '#EDEFEF',
                                  borderRadius: 4,
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  color: '#374151',
                                  lineHeight: 1.3,
                                }}
                              >
                                {s.weight ? `${s.weight} kg × ` : ''}{s.reps ?? '-'}
                              </span>
                            ))}
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: 11.5, color: '#6B7280', marginRight: 2 }}>
                              {ex.sets.length} sets
                            </span>
                            {ex.sets.map((s, sIdx) => (
                              <span
                                key={sIdx}
                                style={{
                                  padding: '2px 7px',
                                  backgroundColor: '#EDEFEF',
                                  borderRadius: 4,
                                  fontSize: 11.5,
                                  fontWeight: 600,
                                  color: '#374151',
                                  lineHeight: 1.3,
                                }}
                              >
                                {s.reps ?? '-'}
                              </span>
                            ))}
                            <span style={{ fontSize: 11.5, color: '#6B7280', marginLeft: 2 }}>reps</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {isMissed && (
          <div
            style={{
              backgroundColor: '#FDEBEB',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
              border: '1px solid #FECACA',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: '#A83232', margin: 0 }}>
              Workout not completed.
            </p>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '4px 0 0' }}>
              This was a planned routine day that was missed.
            </p>
          </div>
        )}

        {isRest && (
          <div
            style={{
              backgroundColor: '#FAFAF8',
              borderRadius: 16,
              padding: '20px 16px',
              textAlign: 'center',
              border: '1px dashed #E8E8E6',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: '#4B5563', margin: 0 }}>
              No workout was scheduled.
            </p>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0 0' }}>
              Scheduled recovery day.
            </p>
          </div>
        )}

        {/* Done Button */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            height: 46,
            borderRadius: 16,
            backgroundColor: '#1F2937',
            color: '#FFFFFF',
            border: 'none',
            fontFamily: 'inherit',
            fontSize: 14,
            fontWeight: 650,
            cursor: 'pointer',
            marginTop: 20,
            transition: 'opacity 150ms',
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
};
