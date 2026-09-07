import React, { useState } from 'react';
import { Habit, HabitType } from '../../types/database.types';
import { createHabit } from '../../services/habitService';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onHabitCreated: (habit: Habit) => void;
}

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({
  isOpen,
  onClose,
  userId,
  onHabitCreated,
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<HabitType>('DURATION');
  const [hours, setHours] = useState<number>(3);
  const [minutes, setMinutes] = useState<number>(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectSuggestion = (suggestedName: string, suggestedType: HabitType) => {
    setName(suggestedName);
    setType(suggestedType);
    if (suggestedName === 'Study') {
      setHours(3);
      setMinutes(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter a habit name');
      return;
    }

    if (type === 'DURATION' && hours === 0 && minutes === 0) {
      setErrorMsg('Please set a daily target duration greater than 0');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const habit = await createHabit(userId, {
        name: name.trim(),
        type,
        targetHours: type === 'DURATION' ? hours : undefined,
        targetMinutes: type === 'DURATION' ? minutes : undefined,
        notifications_enabled: notificationsEnabled,
      });

      onHabitCreated(habit);
      onClose();
    } catch (err) {
      console.error('Failed to create habit:', err);
      setErrorMsg('Failed to create habit. Please try again.');
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: 0 }}>
            Create Daily Habit
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

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#B91C1C',
              padding: '8px 12px',
              borderRadius: 12,
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Habit Name */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 650, color: '#374151', marginBottom: 6 }}>
              Habit name
            </label>
            <input
              id="habit-name-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Study, Meditation, Reading..."
              autoFocus
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
                transition: 'border-color 150ms ease',
              }}
            />

            {/* Suggestion Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
              <button
                id="suggestion-study-btn"
                type="button"
                onClick={() => handleSelectSuggestion('Study', 'DURATION')}
                style={{
                  background: name === 'Study' ? 'rgba(92, 141, 137, 0.12)' : '#F3F4F6',
                  color: name === 'Study' ? '#5C8D89' : '#4B5563',
                  border: name === 'Study' ? '1.5px solid #5C8D89' : '1px solid #E5E7EB',
                  borderRadius: 16,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 650,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                ⏱️ Study (Suggested)
              </button>
              <button
                type="button"
                onClick={() => handleSelectSuggestion('Meditation', 'DURATION')}
                style={{
                  background: name === 'Meditation' ? 'rgba(92, 141, 137, 0.12)' : '#F3F4F6',
                  color: name === 'Meditation' ? '#5C8D89' : '#4B5563',
                  border: name === 'Meditation' ? '1.5px solid #5C8D89' : '1px solid #E5E7EB',
                  borderRadius: 16,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 650,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                Meditation
              </button>
              <button
                type="button"
                onClick={() => handleSelectSuggestion('Read', 'CHECKLIST')}
                style={{
                  background: name === 'Read' ? 'rgba(92, 141, 137, 0.12)' : '#F3F4F6',
                  color: name === 'Read' ? '#5C8D89' : '#4B5563',
                  border: name === 'Read' ? '1.5px solid #5C8D89' : '1px solid #E5E7EB',
                  borderRadius: 16,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 650,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                📖 Read
              </button>
            </div>
          </div>

          {/* Tracking Mode */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 650, color: '#374151', marginBottom: 6 }}>
              How do you want to track this?
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                id="habit-type-duration-btn"
                type="button"
                onClick={() => setType('DURATION')}
                style={{
                  flex: 1,
                  padding: '12px 10px',
                  borderRadius: 14,
                  border: type === 'DURATION' ? '2px solid #5C8D89' : '1.5px solid #E5E7EB',
                  backgroundColor: type === 'DURATION' ? 'rgba(92, 141, 137, 0.08)' : '#FAFAF8',
                  color: type === 'DURATION' ? '#3B6B67' : '#4B5563',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 150ms ease',
                }}
              >
                <span>⏱️ Keep timer</span>
                <span style={{ fontSize: 11, fontWeight: 400, color: '#6B7280' }}>Timed duration goal</span>
              </button>

              <button
                id="habit-type-checklist-btn"
                type="button"
                onClick={() => setType('CHECKLIST')}
                style={{
                  flex: 1,
                  padding: '12px 10px',
                  borderRadius: 14,
                  border: type === 'CHECKLIST' ? '2px solid #5C8D89' : '1.5px solid #E5E7EB',
                  backgroundColor: type === 'CHECKLIST' ? 'rgba(92, 141, 137, 0.08)' : '#FAFAF8',
                  color: type === 'CHECKLIST' ? '#3B6B67' : '#4B5563',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 150ms ease',
                }}
              >
                <span>✓ Checklist task</span>
                <span style={{ fontSize: 11, fontWeight: 400, color: '#6B7280' }}>Simple binary check</span>
              </button>
            </div>
          </div>

          {/* Daily Duration Target (if Timed) */}
          {type === 'DURATION' && (
            <div style={{ backgroundColor: '#FAFAF8', padding: '12px 14px', borderRadius: 14, border: '1px solid #E5E7EB' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 650, color: '#374151', marginBottom: 6 }}>
                How long do you want to do this each day?
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
              <p style={{ fontSize: 11, color: '#6B7280', margin: '8px 0 0' }}>
                Accumulate your target through unlimited sessions each day.
              </p>
            </div>
          )}

          {/* Notification Preference */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 650, color: '#374151', marginBottom: 6 }}>
              Do you want notifications for this habit?
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
                Yes
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
                No
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
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
              id="habit-submit-btn"
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
              {isSubmitting ? 'Saving...' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
