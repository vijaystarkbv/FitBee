import React, { useEffect, useState } from 'react';
import { NutritionLog, MealEntry, DailyWalkingLog } from '../../types/database.types';
import { UserNutritionTargets, fetchMealEntriesForLog } from '../../services/nutritionHistoryService';
import { getDailyWalkingLog } from '../../services/walkingService';
import { formatNumber } from '../../utils/formatters';

interface NutritionDayDetailModalProps {
  date: Date;
  dateStr: string;
  log: NutritionLog | null;
  targets: UserNutritionTargets;
  userId?: string;
  onClose: () => void;
}

export const NutritionDayDetailModal: React.FC<NutritionDayDetailModalProps> = ({
  date,
  dateStr,
  log,
  targets,
  userId,
  onClose,
}) => {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [loadingMeals, setLoadingMeals] = useState<boolean>(false);
  const [walkingLog, setWalkingLog] = useState<DailyWalkingLog | null>(null);
  const [loadingWalking, setLoadingWalking] = useState<boolean>(false);

  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedShortDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });

  // Check if log actually has meals or calories
  const hasRealLog = Boolean(
    log &&
      ((log.total_calories || 0) > 0 ||
        (log.total_protein || 0) > 0 ||
        (log.total_carbs || 0) > 0 ||
        (log.total_fat || 0) > 0)
  );

  useEffect(() => {
    if (log?.id && hasRealLog) {
      setLoadingMeals(true);
      fetchMealEntriesForLog(log.id)
        .then((data) => setMeals(data))
        .catch((err) => console.error('Failed to load meal details:', err))
        .finally(() => setLoadingMeals(false));
    }
  }, [log?.id, hasRealLog]);

  // Load date-specific walking activity
  useEffect(() => {
    const effectiveUid = userId || log?.user_id;
    if (effectiveUid && dateStr) {
      setLoadingWalking(true);
      getDailyWalkingLog(effectiveUid, dateStr)
        .then((data) => setWalkingLog(data))
        .catch((err) => console.error('Failed to load walking activity in history modal:', err))
        .finally(() => setLoadingWalking(false));
    } else {
      setWalkingLog(null);
    }
  }, [userId, log?.user_id, dateStr]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const calories = log?.total_calories || 0;
  const protein = log?.total_protein || 0;
  const carbs = log?.total_carbs || 0;
  const fat = log?.total_fat || 0;

  const calGoal = targets.calories;
  const pGoal = targets.protein;
  const cGoal = targets.carbs;
  const fGoal = targets.fat;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(3px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'fadeIn 200ms ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          maxWidth: 480,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 24,
          boxShadow: '0 20px 45px rgba(0,0,0,0.12)',
          fontFamily: "'Inter', system-ui, sans-serif",
          animation: 'scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Nutrition details for ${formattedDate}`}
      >
        {/* Header with Title and Close Button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#89B0AE',
                letterSpacing: '0.05em',
              }}
            >
              Daily Nutrition Log
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: '4px 0 0' }}>
              {formattedDate}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#F3F4F6',
              color: '#4B5563',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 600,
              transition: 'background 150ms ease',
            }}
            aria-label="Close nutrition details"
          >
            ✕
          </button>
        </div>

        {/* Content: Either detailed macros or clean empty state */}
        {!hasRealLog ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              backgroundColor: '#FAFAF8',
              borderRadius: 20,
              border: '1px dashed #E8E8E6',
              margin: '12px 0 6px',
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                color: '#9CA3AF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px',
                fontSize: 24,
              }}
            >
              🍽️
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 650, color: '#1F2937', margin: 0 }}>
              No meals were logged on {formattedShortDate}
            </h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '6px 0 0', lineHeight: 1.5 }}>
              There are no nutrition entries recorded for this day.
            </p>
          </div>
        ) : (
          <div>
            {/* Calories Card */}
            <div
              style={{
                backgroundColor: '#FAFAF8',
                borderRadius: 18,
                padding: '16px 18px',
                border: '1px solid #E8E8E6',
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1F2937' }}>Calories</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#5C8D89' }}>
                  {calories.toLocaleString()}
                  {calGoal > 0 ? (
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}>
                      {' '}/ {calGoal.toLocaleString()} kcal
                    </span>
                  ) : (
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}> kcal</span>
                  )}
                </span>
              </div>
              {calGoal > 0 && (
                <div style={{ height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, Math.round((calories / calGoal) * 100))}%`,
                      backgroundColor: '#5C8D89',
                      borderRadius: 4,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Macro Breakdown */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
                marginBottom: 20,
              }}
            >
              {/* Protein */}
              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  borderRadius: 16,
                  padding: '12px 10px',
                  border: '1px solid #E8E8E6',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 2 }}>Protein</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{protein}g</div>
                {pGoal > 0 && (
                  <div style={{ fontSize: 11, color: '#89B0AE', fontWeight: 600, marginTop: 2 }}>
                    Goal: {pGoal}g
                  </div>
                )}
              </div>

              {/* Carbs */}
              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  borderRadius: 16,
                  padding: '12px 10px',
                  border: '1px solid #E8E8E6',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 2 }}>Carbs</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{carbs}g</div>
                {cGoal > 0 && (
                  <div style={{ fontSize: 11, color: '#D97706', fontWeight: 600, marginTop: 2 }}>
                    Goal: {cGoal}g
                  </div>
                )}
              </div>

              {/* Fat */}
              <div
                style={{
                  backgroundColor: '#FAFAF8',
                  borderRadius: 16,
                  padding: '12px 10px',
                  border: '1px solid #E8E8E6',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', marginBottom: 2 }}>Fat</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{fat}g</div>
                {fGoal > 0 && (
                  <div style={{ fontSize: 11, color: '#C96A6A', fontWeight: 600, marginTop: 2 }}>
                    Goal: {fGoal}g
                  </div>
                )}
              </div>
            </div>

            {/* Logged Meals Breakdown */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', margin: '0 0 10px' }}>
                Meals Logged
              </h4>

              {loadingMeals ? (
                <div style={{ padding: 16, textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
                  Loading logged meals...
                </div>
              ) : meals.length === 0 ? (
                <div style={{ padding: '12px 14px', backgroundColor: '#FAFAF8', borderRadius: 12, fontSize: 13, color: '#6B7280' }}>
                  No meal entries breakdown stored for this log.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {meals.map((meal) => (
                    <div
                      key={meal.id}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#FAFAF8',
                        borderRadius: 14,
                        border: '1px solid #E8E8E6',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 650, color: '#1F2937' }}>
                          {meal.raw_text || 'Meal Entry'}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#5C8D89' }}>
                          {meal.calories} kcal
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#6B7280', display: 'flex', gap: 10 }}>
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Walking Activity Section ── */}
        <div style={{ marginTop: 20 }}>
          <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', margin: '0 0 10px' }}>
            Walking Activity
          </h4>

          {loadingWalking ? (
            <div style={{ padding: '14px', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
              Loading walking activity...
            </div>
          ) : walkingLog ? (
            <div
              style={{
                backgroundColor: '#FAFAF8',
                borderRadius: 16,
                padding: '14px 16px',
                border: '1px solid #E8E8E6',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Steps</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>
                  {formatNumber(walkingLog.steps)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Distance</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>
                  {walkingLog.distance_km} km
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>Estimated calories burned</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#5C8D89' }}>
                  ~{walkingLog.calories_burned} kcal
                </span>
              </div>
            </div>
          ) : (
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#FAFAF8',
                borderRadius: 12,
                fontSize: 13,
                color: '#6B7280',
                border: '1px solid #E8E8E6',
              }}
            >
              No walking activity logged.
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <div style={{ marginTop: 20 }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              width: '100%',
              height: 48,
              borderRadius: 18,
              backgroundColor: '#F3F4F6',
              color: '#374151',
              border: 'none',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 650,
              cursor: 'pointer',
              transition: 'background 150ms ease',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
