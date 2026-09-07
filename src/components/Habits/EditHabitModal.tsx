import React, { useState } from 'react';
import { Habit } from '../../types/database.types';
import { updateHabit, deleteHabit } from '../../services/habitService';

interface EditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  habit: Habit;
  userId: string;
  onHabitUpdated: (updated: Habit) => void;
  onHabitDeleted: (habitId: string) => void;
}

export const EditHabitModal: React.FC<EditHabitModalProps> = ({
  isOpen,
  onClose,
  habit,
  userId,
  onHabitUpdated,
  onHabitDeleted,
}) => {
  const [name, setName] = useState(habit.name);
  const initialHours = habit.target_duration_seconds ? Math.floor(habit.target_duration_seconds / 3600) : 1;
  const initialMinutes = habit.target_duration_seconds ? Math.floor((habit.target_duration_seconds % 3600) / 60) : 0;
  const [hours, setHours] = useState<number>(initialHours);
  const [minutes, setMinutes] = useState<number>(initialMinutes);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(habit.notifications_enabled);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = await updateHabit(userId, habit.id, {
        name: name.trim(),
        targetHours: habit.type === 'DURATION' ? hours : undefined,
        targetMinutes: habit.type === 'DURATION' ? minutes : undefined,
        notifications_enabled: notificationsEnabled,
      });

      if (updated) {
        onHabitUpdated(updated);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update habit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteHabit(userId, habit.id);
      onHabitDeleted(habit.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete habit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          padding: '24px 22px',
          maxWidth: 420,
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: 0 }}>
            Edit Habit
          </h2>
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

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Habit Name */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 650, color: '#374151', marginBottom: 6 }}>
              Habit name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 14px',
                borderRadius: 12,
                border: '1.5px solid #D1D5DB',
                fontSize: 15,
                color: '#1F2937',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Duration Target (if timed) */}
          {habit.type === 'DURATION' && (
            <div style={{ backgroundColor: '#FAFAF8', padding: '12px 14px', borderRadius: 14, border: '1px solid #E5E7EB' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 650, color: '#374151', marginBottom: 6 }}>
                Daily target duration
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                    style={{
                      width: 54,
                      padding: '8px 8px',
                      borderRadius: 10,
                      border: '1.5px solid #D1D5DB',
                      fontSize: 15,
                      fontWeight: 650,
                      textAlign: 'center',
                    }}
                  />
                  <span style={{ fontSize: 13, color: '#4B5563' }}>hours</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    step="5"
                    value={minutes}
                    onChange={(e) => setMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    style={{
                      width: 54,
                      padding: '8px 8px',
                      borderRadius: 10,
                      border: '1.5px solid #D1D5DB',
                      fontSize: 15,
                      fontWeight: 650,
                      textAlign: 'center',
                    }}
                  />
                  <span style={{ fontSize: 13, color: '#4B5563' }}>mins</span>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 650, color: '#374151', marginBottom: 6 }}>
              Notifications
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(true)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: 12,
                  border: notificationsEnabled ? '1.5px solid #5C8D89' : '1px solid #D1D5DB',
                  backgroundColor: notificationsEnabled ? 'rgba(92, 141, 137, 0.08)' : '#FFFFFF',
                  color: notificationsEnabled ? '#3B6B67' : '#4B5563',
                  fontSize: 13,
                  fontWeight: 650,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                Enabled
              </button>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(false)}
                style={{
                  flex: 1,
                  padding: '9px',
                  borderRadius: 12,
                  border: !notificationsEnabled ? '1.5px solid #5C8D89' : '1px solid #D1D5DB',
                  backgroundColor: !notificationsEnabled ? 'rgba(92, 141, 137, 0.08)' : '#FFFFFF',
                  color: !notificationsEnabled ? '#3B6B67' : '#4B5563',
                  fontSize: 13,
                  fontWeight: 650,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                Disabled
              </button>
            </div>
          </div>

          {/* Delete confirmation or toggle */}
          {showConfirmDelete ? (
            <div style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 12, marginTop: 4 }}>
              <p style={{ fontSize: 13, color: '#991B1B', margin: '0 0 10px', fontWeight: 600 }}>
                Archive this habit? Past logs and history will be preserved.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: 8,
                    border: 'none',
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Confirm Archive
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowConfirmDelete(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#EF4444',
                fontSize: 13,
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              Archive this habit
            </button>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 14,
                border: '1.5px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#4B5563',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                flex: 1.5,
                padding: '12px',
                borderRadius: 14,
                border: 'none',
                backgroundColor: '#5C8D89',
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 700,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(92, 141, 137, 0.25)',
                transition: 'all 150ms ease',
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
