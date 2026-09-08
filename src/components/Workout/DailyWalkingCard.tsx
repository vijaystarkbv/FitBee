import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Profile, DailyWalkingLog, WalkingInputMode } from '../../types/database.types';
import {
  getDailyWalkingLog,
  saveDailyWalkingLog,
  stepsToDistanceKm,
  distanceToSteps,
  calculateWalkingCalories,
} from '../../services/walkingService';
import { useClock } from '../../hooks/useClock';
import { formatNumber, formatDateKey } from '../../utils/formatters';

interface DailyWalkingCardProps {
  profile?: Profile | null;
  userId?: string;
}

export const DailyWalkingCard: React.FC<DailyWalkingCardProps> = ({ profile, userId: propUserId }) => {
  const { now } = useClock();
  const dateStr = useMemo(() => formatDateKey(now), [now]);

  const effectiveUserId = profile?.id || propUserId || '';
  const heightCm = profile?.height_cm;
  const gender = profile?.gender;
  const weightKg = profile?.weight_kg;

  const [log, setLog] = useState<DailyWalkingLog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Form input state
  const [inputMode, setInputMode] = useState<WalkingInputMode>('steps');
  const [stepsInput, setStepsInput] = useState<string>('');
  const [distanceInput, setDistanceInput] = useState<string>('');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load existing log for current application date
  const loadDayLog = useCallback(async () => {
    if (!effectiveUserId) return;
    setLoading(true);
    try {
      const data = await getDailyWalkingLog(effectiveUserId, dateStr);
      setLog(data);
      if (data) {
        setInputMode(data.input_mode);
        if (data.input_mode === 'steps') {
          setStepsInput(data.steps > 0 ? String(data.steps) : '');
          setDistanceInput(data.distance_km > 0 ? String(data.distance_km) : '');
        } else {
          setDistanceInput(data.distance_km > 0 ? String(data.distance_km) : '');
          setStepsInput(data.steps > 0 ? String(data.steps) : '');
        }
        setIsEditing(false);
      } else {
        // Reset inputs for days without logs (e.g. midnight reset)
        setStepsInput('');
        setDistanceInput('');
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Failed to load daily walking activity:', err);
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId, dateStr]);

  useEffect(() => {
    loadDayLog();
  }, [loadDayLog]);

  // Real-time deterministic derivations
  const currentNumericSteps = parseFloat(stepsInput) || 0;
  const currentNumericDistance = parseFloat(distanceInput) || 0;

  const derivedDistance = useMemo(() => {
    if (inputMode === 'steps') {
      return stepsToDistanceKm(currentNumericSteps, heightCm, gender);
    }
    return currentNumericDistance;
  }, [inputMode, currentNumericSteps, currentNumericDistance, heightCm, gender]);

  const derivedSteps = useMemo(() => {
    if (inputMode === 'distance') {
      return distanceToSteps(currentNumericDistance, heightCm, gender);
    }
    return Math.round(currentNumericSteps);
  }, [inputMode, currentNumericSteps, currentNumericDistance, heightCm, gender]);

  const estimatedCalories = useMemo(() => {
    return calculateWalkingCalories(derivedDistance, weightKg);
  }, [derivedDistance, weightKg]);

  const handleSave = async () => {
    if (!effectiveUserId) {
      setErrorMessage('User session missing.');
      return;
    }

    setErrorMessage(null);

    let finalSteps = 0;
    let finalDistance = 0;

    if (inputMode === 'steps') {
      if (isNaN(currentNumericSteps) || currentNumericSteps <= 0) {
        setErrorMessage('Please enter a valid step count greater than 0.');
        return;
      }
      if (currentNumericSteps > 150000) {
        setErrorMessage('Please enter a realistic step count (maximum 150,000).');
        return;
      }
      finalSteps = Math.round(currentNumericSteps);
      finalDistance = derivedDistance;
    } else {
      if (isNaN(currentNumericDistance) || currentNumericDistance <= 0) {
        setErrorMessage('Please enter a valid distance in km greater than 0.');
        return;
      }
      if (currentNumericDistance > 100) {
        setErrorMessage('Please enter a realistic walking distance (maximum 100 km).');
        return;
      }
      finalDistance = Number(currentNumericDistance.toFixed(2));
      finalSteps = derivedSteps;
    }

    setSaveLoading(true);
    try {
      const saved = await saveDailyWalkingLog(effectiveUserId, dateStr, {
        steps: finalSteps,
        distance_km: finalDistance,
        calories_burned: estimatedCalories,
        input_mode: inputMode,
      });
      setLog(saved);
      setIsEditing(false);
    } catch (err: any) {
      console.error('Failed to save walking activity:', err);
      setErrorMessage('Failed to save walking activity. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div
      className="workout-entry-card"
      style={{
        marginTop: 12,
        flexDirection: 'column',
        alignItems: 'stretch',
        padding: '20px',
        cursor: 'default',
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          className="workout-entry-icon"
          style={{
            backgroundColor: '#E6F4F1',
            color: '#5C8D89',
            flexShrink: 0,
          }}
        >
          {/* Walking / Shoe icon */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 4v16M17 4v16M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" style={{ display: 'none' }} />
            {/* Clean walking icon */}
            <circle cx="13.5" cy="4" r="2" />
            <path d="M6 21l3-7 3 3 3-5 4 4" />
            <path d="M13 13l-2-3-4 2" />
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="workout-entry-title" style={{ margin: 0 }}>Daily Walking</h2>
            {log && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#5C8D89',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 8,
                }}
              >
                Edit
              </button>
            )}
          </div>
          <p className="workout-entry-desc" style={{ margin: '2px 0 0' }}>
            Record today's steps or distance to account for energy expenditure.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '16px 0', textAlign: 'center', color: '#9CA3AF', fontSize: 13 }}>
          Loading activity...
        </div>
      ) : log && !isEditing ? (
        /* ── Saved State Summary View ── */
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              backgroundColor: '#FAFAF8',
              padding: '12px 14px',
              borderRadius: 16,
              border: '1px solid #E8E8E6',
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>
                Steps {log.input_mode === 'steps' ? '(Logged)' : '(Estimated)'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginTop: 2 }}>
                {formatNumber(log.steps)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>
                Distance {log.input_mode === 'distance' ? '(Logged)' : '(Estimated)'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', marginTop: 2 }}>
                {log.distance_km} km
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>
                Estimated Burned
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#5C8D89', marginTop: 2 }}>
                ~{log.calories_burned} kcal
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Entry / Edit View ── */
        <div style={{ marginTop: 16 }}>
          {/* Seamless Mode Switcher (Pill segmented control, no clumsy "OR") */}
          <div
            style={{
              display: 'flex',
              backgroundColor: '#F3F4F6',
              borderRadius: 12,
              padding: 3,
              marginBottom: 14,
            }}
          >
            <button
              type="button"
              onClick={() => setInputMode('steps')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 10,
                border: 'none',
                backgroundColor: inputMode === 'steps' ? '#5C8D89' : 'transparent',
                color: inputMode === 'steps' ? '#FFFFFF' : '#4B5563',
                fontSize: 13,
                fontWeight: 650,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Steps
            </button>
            <button
              type="button"
              onClick={() => setInputMode('distance')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 10,
                border: 'none',
                backgroundColor: inputMode === 'distance' ? '#5C8D89' : 'transparent',
                color: inputMode === 'distance' ? '#FFFFFF' : '#4B5563',
                fontSize: 13,
                fontWeight: 650,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              Distance
            </button>
          </div>

          {/* Form Input Field */}
          {inputMode === 'steps' ? (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Steps walked
              </label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 7842"
                value={stepsInput}
                onChange={(e) => setStepsInput(e.target.value)}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 14,
                  border: '1.5px solid #E5E7EB',
                  padding: '0 14px',
                  fontSize: 15,
                  fontFamily: 'inherit',
                  color: '#1F2937',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Distance walked (km)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                placeholder="e.g. 5.6"
                value={distanceInput}
                onChange={(e) => setDistanceInput(e.target.value)}
                style={{
                  width: '100%',
                  height: 46,
                  borderRadius: 14,
                  border: '1.5px solid #E5E7EB',
                  padding: '0 14px',
                  fontSize: 15,
                  fontFamily: 'inherit',
                  color: '#1F2937',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          {/* Real-time Dynamic Estimates */}
          {(currentNumericSteps > 0 || currentNumericDistance > 0) && (
            <div
              style={{
                marginTop: 12,
                padding: '10px 14px',
                backgroundColor: '#FAFAF8',
                borderRadius: 12,
                border: '1px solid #E8E8E6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: 12,
                color: '#4B5563',
              }}
            >
              <span>
                {inputMode === 'steps' ? (
                  <>
                    Estimated distance: <strong>~{derivedDistance} km</strong>
                  </>
                ) : (
                  <>
                    Estimated steps: <strong>~{formatNumber(derivedSteps)}</strong>
                  </>
                )}
              </span>
              <span>
                Estimated energy burned: <strong style={{ color: '#5C8D89' }}>~{estimatedCalories} kcal</strong>
              </span>
            </div>
          )}

          {errorMessage && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#C96A6A', fontWeight: 500 }}>
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={handleSave}
              disabled={saveLoading}
              style={{
                flex: 1,
                height: 44,
                borderRadius: 14,
                backgroundColor: '#5C8D89',
                color: '#FFFFFF',
                border: 'none',
                fontFamily: 'inherit',
                fontSize: 14,
                fontWeight: 650,
                cursor: saveLoading ? 'default' : 'pointer',
                opacity: saveLoading ? 0.7 : 1,
                transition: 'all 150ms ease',
              }}
            >
              {saveLoading ? 'Saving...' : log ? 'Update Activity' : 'Save Activity'}
            </button>

            {log && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{
                  padding: '0 16px',
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: '#F3F4F6',
                  color: '#4B5563',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
