import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { ProgressRing } from './ProgressRing';
import { StreakSection } from './StreakSection';
import { Profile, NutritionLog, DailyWalkingLog } from '../../types/database.types';
import { getDailyWalkingLog } from '../../services/walkingService';
import { getDaysSinceLastWeightUpdate } from '../../services/nutritionTargetService';
import { useClock } from '../../hooks/useClock';
import { formatDateKey } from '../../utils/formatters';
import { NotificationPromptBanner } from './NotificationPromptBanner';
import './home.css';

interface HomeDashboardProps {
  profile: Profile;
  todayNutrition: NutritionLog | null;
  onResumeOnboarding?: () => void;
  onNavigateSettings: () => void;
}

function getGreeting(d: Date): string {
  const hour = d.getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  todayNutrition,
  onResumeOnboarding,
  onNavigateSettings,
}) => {
  const { now } = useClock();
  const dateStr = useMemo(() => formatDateKey(now), [now]);
  const greeting = useMemo(() => getGreeting(now), [now]);
  const displayName = profile.display_name || 'there';

  // Walking activity state
  const [walkingLog, setWalkingLog] = useState<DailyWalkingLog | null>(null);

  const loadWalking = useCallback(async () => {
    if (!profile.id) return;
    try {
      const data = await getDailyWalkingLog(profile.id, dateStr);
      setWalkingLog(data);
    } catch (err) {
      console.error('Failed to load walking activity on home:', err);
    }
  }, [profile.id, dateStr]);

  useEffect(() => {
    loadWalking();

    const handleWalkingUpdated = () => {
      loadWalking();
    };
    window.addEventListener('fitbee:walking_updated', handleWalkingUpdated);
    return () => window.removeEventListener('fitbee:walking_updated', handleWalkingUpdated);
  }, [loadWalking]);

  // Bi-weekly weight check-in reminder state
  const [daysSinceWeightUpdate, setDaysSinceWeightUpdate] = useState<number>(0);

  useEffect(() => {
    if (profile.id) {
      getDaysSinceLastWeightUpdate(profile.id, profile.updated_at).then((days) => {
        setDaysSinceWeightUpdate(days);
      });
    }
  }, [profile.id, profile.updated_at, now]);

  // Current nutrition from today's log (INTAKE — unchanged and uncapped)
  const currentCalories = todayNutrition?.total_calories || 0;
  const currentProtein = todayNutrition?.total_protein || 0;
  const currentCarbs = todayNutrition?.total_carbs || 0;
  const currentFat = todayNutrition?.total_fat || 0;

  // Walking expenditure
  const walkingCalories = walkingLog?.calories_burned || 0;
  const netAdjustedCalories = Math.max(0, currentCalories - walkingCalories);

  // Goals from profile (set by Gemini after onboarding)
  const goalCalories = profile.target_calories || 2000;
  const goalProtein = profile.target_protein || 120;
  const goalCarbs = profile.target_carbs || 250;
  const goalFat = profile.target_fat || 55;

  return (
    <>
      {/* ── Top bar ── */}
      <div className="hd-topbar">
        <div className="hd-logo">
          <div className="hd-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="hd-logo-text">FitBee</span>
        </div>
        <button className="hd-topbar-avatar" onClick={onNavigateSettings}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>

      {/* ── Greeting ── */}
      <div className="hd-greeting-section">
        <p className="hd-greeting">{greeting}</p>
        <h1 className="hd-greeting-name">Welcome back, {displayName}</h1>
      </div>

      {/* ── Onboarding banner (if skipped) ── */}
      {onResumeOnboarding && (
        <div className="hd-onboarding-banner">
          <button onClick={onResumeOnboarding}>
            ✨ Complete your onboarding to personalize your experience
          </button>
        </div>
      )}

      {/* ── Device-aware Push Notification Prompt Banner ── */}
      <NotificationPromptBanner userId={profile.id} />

      {/* ── 2-Week Weight Check-In Reminder Card ── */}
      {daysSinceWeightUpdate >= 14 && (
        <div
          style={{
            maxWidth: 520,
            margin: '0 auto 16px',
            padding: '0 24px',
          }}
        >
         <div
          style={{
            padding: '16px',
            background: 'linear-gradient(135deg, #F0FDFA 0%, #FFFFFF 100%)',
            border: '1.5px solid #5C8D89',
            borderRadius: 16,
            boxShadow: '0 2px 8px rgba(92, 141, 137, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#E6F0EE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5C8D89',
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                  <line x1="16" y1="8" x2="2" y2="22" />
                  <line x1="17.5" y1="15" x2="9" y2="15" />
                </svg>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#134E4A' }}>
                    Bi-Weekly Check-in Due
                  </h4>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 10,
                      background: '#CCFBF1',
                      color: '#0F766E',
                    }}
                  >
                    {daysSinceWeightUpdate} days
                  </span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#4B5563', lineHeight: 1.4 }}>
                  It's been 2 weeks since your last weight check-in. Update your weight in Profile to recalibrate your nutrition targets and ensure recommendations stay aligned.
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={onNavigateSettings}
              style={{
                padding: '8px 14px',
                borderRadius: 8,
                background: '#5C8D89',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 650,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              Update Weight in Profile
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        </div>
      )}

      {/* ── Nutrition card with progress rings ── */}
      <div className="hd-nutrition-card">
        <div className="hd-card">
          <h2 className="hd-card-title">Today's Nutrition</h2>
          <p className="hd-card-subtitle">Track your daily intake</p>

          <div className="hd-rings-grid">
            <ProgressRing
              current={currentCalories}
              goal={goalCalories}
              label="Calories"
              unit="kcal"
              animationDelay={200}
            />
            <ProgressRing
              current={currentProtein}
              goal={goalProtein}
              label="Protein"
              unit="g"
              animationDelay={350}
            />
            <ProgressRing
              current={currentCarbs}
              goal={goalCarbs}
              label="Carbs"
              unit="g"
              animationDelay={500}
            />
            <ProgressRing
              current={currentFat}
              goal={goalFat}
              label="Fat"
              unit="g"
              animationDelay={650}
            />
          </div>

          {/* ── Net Adjusted Calories Section ── */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 16,
              borderTop: '1px solid #E8E8E6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 650, color: '#1F2937' }}>
                Net adjusted calories
              </div>
              <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>
                {walkingCalories > 0 ? (
                  <>
                    <span>{currentCalories} kcal consumed</span>
                    <span style={{ margin: '0 4px' }}>−</span>
                    <span style={{ color: '#5C8D89', fontWeight: 600 }}>~{walkingCalories} kcal walking</span>
                  </>
                ) : (
                  <span>Actual food intake (no walking logged)</span>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#5C8D89' }}>
                ~{netAdjustedCalories} kcal
              </div>
              {walkingCalories > 0 && (
                <div style={{ fontSize: 11, color: '#5C8D89', fontWeight: 600, marginTop: 1 }}>
                  Walking −{walkingCalories} kcal
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Streak Section ── */}
      <StreakSection profile={profile} />
    </>
  );
};
