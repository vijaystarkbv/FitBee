import React, { useState } from 'react';
import { useClock } from '../../hooks/useClock';
import { formatDateKey } from '../../utils/formatters';

export const DevTimeMachine: React.FC = () => {
  // Production Safety: Do NOT render anything in production builds
  if (!import.meta.env.DEV) {
    return null;
  }

  const { now, isSimulated, setSimulatedDate, advanceDays, reset } = useClock();
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Format date for display: "Thursday, September 3, 2026"
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Local calendar date string for <input type="date"> (YYYY-MM-DD)
  const isoDateString = formatDateKey(now);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const [year, month, day] = e.target.value.split('-').map(Number);
    const selectedDate = new Date(now);
    selectedDate.setFullYear(year, month - 1, day);
    setSimulatedDate(selectedDate);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 84,
        right: 20,
        zIndex: 99999,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Collapsed Floating Pill */}
      {!isExpanded ? (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          style={{
            backgroundColor: isSimulated ? '#5C8D89' : '#1F2937',
            color: '#FFFFFF',
            borderRadius: 30,
            padding: '10px 18px',
            fontSize: 13,
            fontWeight: 650,
            border: 'none',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'all 200ms ease',
          }}
        >
          <span>🧪</span>
          <span>{isSimulated ? `Simulated: ${formattedDate}` : 'Dev Time Machine'}</span>
          {isSimulated && (
            <span
              style={{
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: 10,
                textTransform: 'uppercase',
              }}
            >
              SIM
            </span>
          )}
        </button>
      ) : (
        /* Expanded Control Panel */
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            width: 320,
            padding: 20,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.22)',
            border: '1px solid #E5E7EB',
            animation: 'fadeInUp 200ms ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
              paddingBottom: 10,
              borderBottom: '1px solid #F3F4F6',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🧪</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>
                Time Machine
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '3px 8px',
                  borderRadius: 12,
                  backgroundColor: isSimulated ? 'rgba(92, 141, 137, 0.15)' : '#F3F4F6',
                  color: isSimulated ? '#5C8D89' : '#6B7280',
                }}
              >
                {isSimulated ? 'SIMULATED' : 'REAL TIME'}
              </span>

              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: 18,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '0 4px',
                }}
                aria-label="Minimize"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Current Date Display */}
          <div
            style={{
              backgroundColor: '#FAFAF8',
              borderRadius: 16,
              padding: '12px 16px',
              textAlign: 'center',
              marginBottom: 14,
              border: '1px solid #F3F4F6',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Current App Date
            </div>
            <div style={{ fontSize: 16, fontWeight: 750, color: '#1F2937', marginTop: 2 }}>
              {formattedDate}
            </div>
          </div>

          {/* Quick Shift Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
            <button
              type="button"
              onClick={() => advanceDays(-1)}
              style={btnStyle}
            >
              ← Previous day
            </button>
            <button
              type="button"
              onClick={() => advanceDays(1)}
              style={btnStyle}
            >
              Next day →
            </button>
            <button
              type="button"
              onClick={() => advanceDays(-7)}
              style={btnStyle}
            >
              -7 days
            </button>
            <button
              type="button"
              onClick={() => advanceDays(7)}
              style={btnStyle}
            >
              +7 days
            </button>
          </div>

          {/* Custom Date Picker Input */}
          <div style={{ marginBottom: 14 }}>
            <label
              htmlFor="simulated-date-input"
              style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 4 }}
            >
              Jump to specific date
            </label>
            <input
              id="simulated-date-input"
              type="date"
              value={isoDateString}
              onChange={handleDateChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 12,
                border: '1px solid #D1D5DB',
                fontSize: 13,
                fontFamily: 'inherit',
                color: '#1F2937',
                backgroundColor: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Reset Button */}
          <button
            type="button"
            onClick={reset}
            disabled={!isSimulated}
            style={{
              width: '100%',
              padding: '10px 0',
              borderRadius: 14,
              backgroundColor: isSimulated ? '#EF4444' : '#F3F4F6',
              color: isSimulated ? '#FFFFFF' : '#9CA3AF',
              fontSize: 13,
              fontWeight: 650,
              border: 'none',
              cursor: isSimulated ? 'pointer' : 'default',
              transition: 'all 150ms ease',
            }}
          >
            Reset to real time
          </button>
        </div>
      )}
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderRadius: 12,
  backgroundColor: '#F3F4F6',
  color: '#374151',
  fontSize: 12,
  fontWeight: 600,
  border: 'none',
  cursor: 'pointer',
  transition: 'background-color 150ms ease',
};
