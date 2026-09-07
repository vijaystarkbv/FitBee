import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../../types/database.types';
import {
  getStreakSummary,
  StreakSummary,
  formatDateKey,
  consumeStreakFreeze,
  declineStreakFreeze,
} from '../../services/streakService';
import { StreakCalendar } from './StreakCalendar';
import { StreakFreezeModal } from './StreakFreezeModal';
import { useClock } from '../../hooks/useClock';
import { ErrorBoundary } from '../common/ErrorBoundary';

interface StreakSectionProps {
  profile: Profile;
}

export const StreakSection: React.FC<StreakSectionProps> = ({ profile }) => {
  const { now } = useClock(); // Re-evaluates when Dev Time Machine shifts date
  const todayKey = formatDateKey(now);
  const [summary, setSummary] = useState<StreakSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);

  const fetchStreak = useCallback(async () => {
    try {
      const data = await getStreakSummary(profile);
      setSummary(data);
    } catch (err) {
      console.error('Failed to calculate streak data:', err);
    } finally {
      setLoading(false);
    }
  }, [profile?.id, todayKey]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  const handleUseFreeze = async () => {
    if (!summary?.missedDayEligibleForFreeze) return;
    await consumeStreakFreeze(profile, summary.missedDayEligibleForFreeze);
    await fetchStreak();
  };

  const handleDeclineFreeze = async () => {
    if (!summary?.missedDayEligibleForFreeze) return;
    await declineStreakFreeze(profile, summary.missedDayEligibleForFreeze);
    await fetchStreak();
  };

  if (loading || !summary) {
    return (
      <div className="hd-streak-section">
        <div className="hd-card" style={{ padding: 24, textAlign: 'center', color: '#9CA3AF' }}>
          Loading streak progress...
        </div>
      </div>
    );
  }

  return (
    <div className="hd-streak-section">
      {/* Freeze Prompt Modal if a missed day is eligible to be saved */}
      {summary.missedDayEligibleForFreeze && (
        <StreakFreezeModal
          missedDateStr={summary.missedDayEligibleForFreeze}
          freezeCount={summary.freezeCount}
          onUseFreeze={handleUseFreeze}
          onDecline={handleDeclineFreeze}
        />
      )}

      <div className="hd-card" style={{ padding: '22px 20px' }}>
      {/* CSS Micro-animation keyframe for checkmark bounce */}
      <style>{`
        @keyframes streakCheckBounce {
          0% { transform: scale(0.6); opacity: 0; }
          50% { transform: scale(1.18); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* ── Section Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 22 }}>🔥</span>
            <h2 className="hd-card-title" style={{ margin: 0 }}>
              {summary.currentStreak} {summary.currentStreak === 1 ? 'Day' : 'Days'} Streak
            </h2>

            {/* Freeze Counter Badge if user has available freezes */}
            {summary.freezeCount > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  color: '#2563EB',
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 12,
                }}
                title="Earned streak freeze available"
              >
                <span>❄️</span>
                <span>{summary.freezeCount}</span>
              </span>
            )}
          </div>
          <p className="hd-card-subtitle" style={{ margin: '2px 0 0', paddingLeft: 30 }}>
            Workout + Nutrition target consistency
          </p>
        </div>

        {/* Calendar History Toggle Icon Button */}
        <button
          type="button"
          onClick={() => setShowCalendar((prev) => !prev)}
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: showCalendar ? '#5C8D89' : '#F3F4F6',
            color: showCalendar ? '#FFFFFF' : '#4B5563',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: showCalendar ? '0 4px 12px rgba(92, 141, 137, 0.25)' : 'none',
          }}
          aria-label="Toggle streak calendar history"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </button>
      </div>

      {/* ── Weekly 7-Day Streak Row ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 8,
          textAlign: 'center',
        }}
      >
        {summary.weeklyDays.map((day) => {
          // Determine styling based on daily status
          let badgeBg = '#F3F4F6';
          let badgeColor = '#4B5563';
          let badgeShadow = 'none';

          if (day.status === 'FROZEN') {
            badgeBg = 'linear-gradient(180deg, #7BAAF0 0%, #6B9FE8 100%)';
            badgeColor = '#FFFFFF';
            badgeShadow = '0 4px 12px rgba(107, 159, 232, 0.25)';
          } else if (day.status === 'FULL') {
            badgeBg = 'linear-gradient(180deg, #E0824B 0%, #D9773F 100%)';
            badgeColor = '#FFFFFF';
            badgeShadow = '0 4px 12px rgba(217, 119, 63, 0.25)';
          } else if (day.status === 'PARTIAL' && day.isStreak) {
            badgeBg = 'linear-gradient(180deg, #EFB37D 0%, #E8A66A 100%)';
            badgeColor = '#451A03';
            badgeShadow = '0 3px 10px rgba(232, 166, 106, 0.22)';
          } else if (day.isToday) {
            badgeBg = 'rgba(92, 141, 137, 0.12)';
            badgeColor = '#5C8D89';
          } else if (day.isFuture) {
            badgeColor = '#D1D5DB';
          }

          return (
            <div
              key={day.dateStr}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {/* Day Badge */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 14,
                  background: badgeBg,
                  color: badgeColor,
                  fontSize: day.isStreak ? 15 : 13,
                  fontWeight: day.isStreak || day.isToday ? 750 : 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: day.isToday ? '2px solid #5C8D89' : '1px solid transparent',
                  transition: 'all 200ms ease',
                  animation: day.isStreak ? 'streakCheckBounce 280ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                  boxShadow: badgeShadow,
                }}
              >
                {day.status === 'FROZEN' ? (
                  <span>❄️</span>
                ) : day.status === 'FULL' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : day.status === 'PARTIAL' && day.isStreak ? (
                  <span style={{ fontSize: 13, fontWeight: 800 }}>⚡</span>
                ) : (
                  day.dayLabel
                )}
              </div>

              {/* Today Indicator Dot / Label */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: day.isToday ? 750 : 500,
                  color: day.isToday ? '#5C8D89' : '#9CA3AF',
                  textTransform: 'uppercase',
                }}
              >
                {day.isToday ? 'Today' : day.dayLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* ── Sliding Calendar History View ── */}
      {showCalendar && (
        <ErrorBoundary fallback={<div style={{ padding: 16, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>Unable to display calendar history.</div>}>
          <StreakCalendar streakMap={summary.streakMap || {}} />
        </ErrorBoundary>
      )}
      </div>
    </div>
  );
};
