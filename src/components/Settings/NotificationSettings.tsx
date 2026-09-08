import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../../types/database.types';
import {
  getUserNotificationPreferences,
  updateUserNotificationPreferences,
  registerPushSubscription,
  unsubscribePush,
  getNotificationPermissionState,
  isPushNotificationSupported,
} from '../../services/pushNotificationService';
import {
  UserNotificationSettings,
  evaluateNotificationDecision,
  NotificationEvaluationResult,
} from '../../services/notificationEngine';
import '../Home/home.css';

interface NotificationSettingsProps {
  profile: Profile;
  onBack: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ profile, onBack }) => {
  const userId = profile.id;

  const [settings, setSettings] = useState<UserNotificationSettings>({
    user_id: userId,
    notifications_enabled: true,
    habit_notifications_enabled: true,
    food_notifications_enabled: true,
    workout_notifications_enabled: true,
    timezone: 'UTC',
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [pushSupported, setPushSupported] = useState<boolean>(true);

  // Dev test tool evaluation state
  const [evalResult, setEvalResult] = useState<NotificationEvaluationResult | null>(null);
  const [evalLoading, setEvalLoading] = useState<boolean>(false);
  const [pushSending, setPushSending] = useState<boolean>(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

  // Load preferences
  const loadPreferences = useCallback(async () => {
    setLoading(true);
    try {
      const prefs = await getUserNotificationPreferences(userId);
      setSettings(prefs);
      setPermissionState(getNotificationPermissionState());
      setPushSupported(isPushNotificationSupported());
    } catch (err) {
      console.error('Failed to load notification settings:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  // Handle individual toggle change
  const handleToggle = async (
    key: 'habit_notifications_enabled' | 'food_notifications_enabled' | 'workout_notifications_enabled'
  ) => {
    const nextValue = !settings[key];
    const updated = { ...settings, [key]: nextValue };
    setSettings(updated);

    // If user is enabling a category and permission is default, request browser push permission
    if (nextValue && permissionState === 'default' && pushSupported) {
      await registerPushSubscription(userId);
      setPermissionState(getNotificationPermissionState());
    }

    setSaving(true);
    await updateUserNotificationPreferences(userId, { [key]: nextValue });
    setSaving(false);
  };

  const allCategoriesOff =
    !settings.habit_notifications_enabled &&
    !settings.food_notifications_enabled &&
    !settings.workout_notifications_enabled;

  // Development evaluation test runner
  const handleRunEvaluationTest = async () => {
    setEvalLoading(true);
    try {
      const res = await evaluateNotificationDecision(userId, undefined, profile);
      setEvalResult(res);
    } catch (err) {
      console.error('Failed to evaluate notification decision:', err);
    } finally {
      setEvalLoading(false);
    }
  };

  // Send real test push notification to this device via Cloudflare Worker
  const handleSendTestPush = async () => {
    setPushSending(true);
    setPushStatusMessage(null);
    try {
      // Ensure current device is registered
      if (permissionState === 'default') {
        await registerPushSubscription(userId);
        setPermissionState(getNotificationPermissionState());
      }

      const res = await fetch('/api/notifications/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          sendPush: true,
          testPayload: {
            title: 'FitBee Test Notification 🐝',
            body: 'Push notifications are configured and working seamlessly!',
          },
        }),
      });

      const data = await res.json();
      if (data.pushResult?.deliveredCount > 0) {
        setPushStatusMessage(`Sent to ${data.pushResult.deliveredCount} active device(s)!`);
      } else if (data.pushResult?.reason) {
        setPushStatusMessage(`Push status: ${data.pushResult.reason}`);
      } else {
        setPushStatusMessage('Push test request completed.');
      }
    } catch (err: any) {
      setPushStatusMessage(`Push failed: ${err?.message || String(err)}`);
    } finally {
      setPushSending(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '16px 20px 100px', opacity: loading ? 0.7 : 1 }}>
      {/* ── Top Header with Back Navigation ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: '#1F2937',
            cursor: 'pointer',
            padding: 8,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Back to settings"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: 0 }}>
              Notifications
            </h1>
            {saving && (
              <span style={{ fontSize: 11, color: '#5C8D89', fontWeight: 600 }}>Saving...</span>
            )}
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '2px 0 0' }}>
            Control your FitBee reminders and daily alerts.
          </p>
        </div>
      </div>

      {/* ── Browser / Device Push Permission Banner ── */}
      {permissionState === 'denied' && (
        <div
          style={{
            padding: 14,
            borderRadius: 12,
            backgroundColor: '#FEF2F2',
            border: '1px solid #F87171',
            marginBottom: 16,
            display: 'flex',
            gap: 12,
            alignItems: 'flex-start',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div style={{ fontSize: 13, color: '#991B1B', lineHeight: 1.4 }}>
            <strong>Push notifications are blocked.</strong>
            <p style={{ margin: '4px 0 0' }}>
              Your browser has notifications disabled for FitBee. To receive reminders when the app is closed, allow notifications in your browser or device site settings.
            </p>
          </div>
        </div>
      )}

      {permissionState === 'default' && pushSupported && (
        <div
          style={{
            padding: 14,
            borderRadius: 12,
            backgroundColor: '#F0FDFA',
            border: '1px solid #5C8D89',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#134E4A' }}>
              Enable Device Push Reminders
            </span>
            <p style={{ fontSize: 12, color: '#2DD4BF', margin: '2px 0 0' }}>
              Receive reminders even when the PWA is closed.
            </p>
          </div>
          <button
            onClick={async () => {
              await registerPushSubscription(userId);
              setPermissionState(getNotificationPermissionState());
            }}
            style={{
              backgroundColor: '#5C8D89',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Allow
          </button>
        </div>
      )}

      {permissionState === 'granted' && (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 10,
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#166534' }}>
              Push notifications permitted on this device
            </span>
          </div>
          <button
            onClick={async () => {
              await unsubscribePush(userId);
              setPermissionState(getNotificationPermissionState());
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#991B1B',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '2px 6px',
            }}
          >
            Unregister
          </button>
        </div>
      )}

      {/* ── Category Reminders Card ── */}
      <div className="hd-settings-card" style={{ marginBottom: 16 }}>
        {/* Habit Notifications Toggle */}
        <div className="hd-settings-item" style={{ cursor: 'default' }}>
          <div className="hd-settings-item-left" style={{ flex: 1 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(92, 141, 137, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div>
              <p className="hd-settings-item-label" style={{ fontWeight: 600 }}>Habit Notifications</p>
              <p className="hd-settings-item-desc">Reminders for habits scheduled today.</p>
            </div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.habit_notifications_enabled}
              onChange={() => handleToggle('habit_notifications_enabled')}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.habit_notifications_enabled ? '#5C8D89' : '#D1D5DB',
                borderRadius: 24,
                transition: 'background-color 0.2s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  content: '""',
                  height: 18,
                  width: 18,
                  left: settings.habit_notifications_enabled ? 23 : 3,
                  bottom: 3,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </span>
          </label>
        </div>

        {/* Food Logging Notifications Toggle */}
        <div className="hd-settings-item" style={{ cursor: 'default' }}>
          <div className="hd-settings-item-left" style={{ flex: 1 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(92, 141, 137, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
                <line x1="6" y1="1" x2="6" y2="4" />
                <line x1="10" y1="1" x2="10" y2="4" />
                <line x1="14" y1="1" x2="14" y2="4" />
              </svg>
            </div>
            <div>
              <p className="hd-settings-item-label" style={{ fontWeight: 600 }}>Food Logging Notifications</p>
              <p className="hd-settings-item-desc">Reminders to keep your nutrition log up to date.</p>
            </div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.food_notifications_enabled}
              onChange={() => handleToggle('food_notifications_enabled')}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.food_notifications_enabled ? '#5C8D89' : '#D1D5DB',
                borderRadius: 24,
                transition: 'background-color 0.2s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  content: '""',
                  height: 18,
                  width: 18,
                  left: settings.food_notifications_enabled ? 23 : 3,
                  bottom: 3,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </span>
          </label>
        </div>

        {/* Workout Notifications Toggle */}
        <div className="hd-settings-item" style={{ borderBottom: 'none', cursor: 'default' }}>
          <div className="hd-settings-item-left" style={{ flex: 1 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(92, 141, 137, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 5v14" />
                <path d="M18 5v14" />
                <path d="M2 9h4" />
                <path d="M2 15h4" />
                <path d="M18 9h4" />
                <path d="M18 15h4" />
                <path d="M6 12h12" />
              </svg>
            </div>
            <div>
              <p className="hd-settings-item-label" style={{ fontWeight: 600 }}>Workout Notifications</p>
              <p className="hd-settings-item-desc">Reminders for workouts scheduled today.</p>
            </div>
          </div>
          <label style={{ position: 'relative', display: 'inline-block', width: 44, height: 24, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.workout_notifications_enabled}
              onChange={() => handleToggle('workout_notifications_enabled')}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: settings.workout_notifications_enabled ? '#5C8D89' : '#D1D5DB',
                borderRadius: 24,
                transition: 'background-color 0.2s',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  content: '""',
                  height: 18,
                  width: 18,
                  left: settings.workout_notifications_enabled ? 23 : 3,
                  bottom: 3,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '50%',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }}
              />
            </span>
          </label>
        </div>
      </div>

      {allCategoriesOff && (
        <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: '8px 0 20px' }}>
          All notification categories are turned off. FitBee will not send any reminders.
        </p>
      )}

      {/* ── Policy & Hard Cap Info ── */}
      <div
        style={{
          padding: 14,
          borderRadius: 12,
          backgroundColor: '#F9FAFB',
          border: '1px solid #E5E7EB',
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
            Daily Notification Limits & Policy
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
          FitBee evaluates reminders up to 5 times per day (8 AM, 12 PM, 3 PM, 7 PM, 10 PM in your timezone: <strong>{settings.timezone}</strong>). FitBee guarantees a hard ceiling of 5 total notifications per day and automatically silences reminders as soon as you complete your goals.
        </p>
      </div>

      {/* ── Developer State Evaluation Tool ── */}
      <div
        style={{
          padding: 16,
          borderRadius: 12,
          backgroundColor: '#FFFFFF',
          border: '1.5px dashed #5C8D89',
          marginTop: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#134E4A' }}>
              Notification Engine Live Evaluator
            </span>
            <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
              Test what FitBee's decision engine calculates for your current account state right now.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleRunEvaluationTest}
              disabled={evalLoading}
              style={{
                backgroundColor: '#5C8D89',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: evalLoading ? 'not-allowed' : 'pointer',
                opacity: evalLoading ? 0.6 : 1,
              }}
            >
              {evalLoading ? 'Evaluating...' : 'Evaluate State'}
            </button>
            <button
              onClick={handleSendTestPush}
              disabled={pushSending}
              style={{
                backgroundColor: '#0F766E',
                color: '#FFFFFF',
                border: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: pushSending ? 'not-allowed' : 'pointer',
                opacity: pushSending ? 0.6 : 1,
              }}
            >
              {pushSending ? 'Sending...' : 'Test Push 🔔'}
            </button>
          </div>
        </div>

        {pushStatusMessage && (
          <div
            style={{
              padding: '6px 10px',
              borderRadius: 6,
              backgroundColor: '#F0FDFA',
              border: '1px solid #99F6E4',
              color: '#0D9488',
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            {pushStatusMessage}
          </div>
        )}

        {evalResult && (
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              fontSize: 12,
              color: '#1E293B',
              lineHeight: 1.5,
            }}
          >
            <div><strong>Should Send:</strong> {evalResult.shouldSend ? 'YES ✅' : 'NO 🛑'}</div>
            <div><strong>Combined State:</strong> <code>{evalResult.state}</code></div>
            <div><strong>Intensity:</strong> <code>{evalResult.intensity}</code></div>
            <div><strong>Local Date:</strong> {evalResult.localDate} (Slot: {evalResult.slot})</div>
            <div><strong>Pending Categories:</strong> {evalResult.pendingCategories.join(', ') || 'None'}</div>
            {evalResult.reason && (
              <div style={{ color: '#64748B', marginTop: 4 }}>
                <strong>Reason:</strong> {evalResult.reason}
              </div>
            )}
            {evalResult.message && (
              <div
                style={{
                  marginTop: 8,
                  padding: 10,
                  borderRadius: 6,
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                }}
              >
                <div style={{ fontWeight: 700, color: '#1E40AF' }}>{evalResult.message.title}</div>
                <div style={{ color: '#1E3A8A' }}>{evalResult.message.body}</div>
                <div style={{ fontSize: 11, color: '#60A5FA', marginTop: 4 }}>
                  Message ID: {evalResult.message.id} | Deep link: {evalResult.deepLinkUrl}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
