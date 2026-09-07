import React, { useState } from 'react';

interface StreakFreezeModalProps {
  missedDateStr: string;
  freezeCount: number;
  onUseFreeze: () => Promise<void> | void;
  onDecline: () => Promise<void> | void;
}

export const StreakFreezeModal: React.FC<StreakFreezeModalProps> = ({
  missedDateStr,
  freezeCount,
  onUseFreeze,
  onDecline,
}) => {
  const [submitting, setSubmitting] = useState(false);

  // Format date string (YYYY-MM-DD) for display
  const formattedDate = (() => {
    try {
      const parts = missedDateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      }
    } catch (e) {
      // fallback
    }
    return missedDateStr;
  })();

  const handleUse = async () => {
    setSubmitting(true);
    try {
      await onUseFreeze();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async () => {
    setSubmitting(true);
    try {
      await onDecline();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-freeze-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(31, 41, 55, 0.45)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        animation: 'fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          padding: '28px 24px',
          maxWidth: 400,
          width: '100%',
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.14)',
          border: '1px solid #E8E8E6',
          textAlign: 'center',
          animation: 'scaleIn 220ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Ice / Freeze Icon Badge */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #DBEAFE, #93C5FD)',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: '0 6px 18px rgba(59, 130, 246, 0.25)',
            fontSize: 28,
          }}
        >
          ❄️
        </div>

        {/* Title */}
        <h2
          id="streak-freeze-title"
          style={{
            fontSize: 20,
            fontWeight: 750,
            color: '#1F2937',
            margin: '0 0 10px',
            letterSpacing: '-0.01em',
          }}
        >
          Keep your streak going?
        </h2>

        {/* Explanation */}
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.55,
            color: '#4B5563',
            margin: '0 0 18px',
          }}
        >
          You missed activities on <strong>{formattedDate}</strong>, but you have{' '}
          <strong style={{ color: '#3B72C4' }}>
            {freezeCount} streak {freezeCount === 1 ? 'freeze' : 'freezes'}
          </strong>{' '}
          available. Using one will protect your progress and preserve your current streak.
        </p>

        {/* Freeze Resource Card */}
        <div
          style={{
            backgroundColor: '#F0F6FF',
            borderRadius: 16,
            padding: '12px 16px',
            border: '1px solid #BFDBFE',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>🧊</span>
            <span style={{ fontSize: 13, fontWeight: 650, color: '#2B5BA8' }}>
              Streak Freeze Available
            </span>
          </div>
          <span
            style={{
              backgroundColor: '#6B9FE8',
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 10,
            }}
          >
            {freezeCount} left
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            type="button"
            onClick={handleUse}
            disabled={submitting}
            style={{
              width: '100%',
              minHeight: 46,
              borderRadius: 14,
              border: 'none',
              background: 'linear-gradient(180deg, #7BAAF0 0%, #6B9FE8 100%)',
              color: '#FFFFFF',
              fontSize: 15,
              fontWeight: 700,
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(107, 159, 232, 0.28)',
              fontFamily: 'inherit',
              transition: 'all 180ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span>❄️</span>
            <span>{submitting ? 'Preserving...' : 'Use Freeze'}</span>
          </button>

          <button
            type="button"
            onClick={handleDecline}
            disabled={submitting}
            style={{
              width: '100%',
              minHeight: 44,
              borderRadius: 14,
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              color: '#6B7280',
              fontSize: 14,
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 180ms ease',
            }}
          >
            Let Streak End
          </button>
        </div>
      </div>
    </div>
  );
};
