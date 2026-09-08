import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../../types/database.types';
import {
  getUserNotificationPreferences,
  updateUserNotificationPreferences,
  registerPushSubscription,
  unsubscribePush,
  getNotificationPermissionState,
  isPushNotificationSupported,
  isCurrentDeviceRegistered,
} from '../../services/pushNotificationService';
import { UserNotificationSettings } from '../../services/notificationEngine';
import { NotificationDevEvaluator } from '../DevTools/NotificationDevEvaluator';
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
  const [isDeviceRegistered, setIsDeviceRegistered] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  // Load user preferences & check device registration state
  const loadPreferencesAndDeviceState = useCallback(async () => {
    setLoading(true);
    try {
      const prefs = await getUserNotificationPreferences(userId);
      setSettings(prefs);
      const perm = getNotificationPermissionState();
      setPermissionState(perm);
      const supported = isPushNotificationSupported();
      setPushSupported(supported);

      if (supported) {
        const registered = await isCurrentDeviceRegistered();
        setIsDeviceRegistered(registered);
      }
    } catch (err) {
      console.error('Failed to load notification settings:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadPreferencesAndDeviceState();
  }, [loadPreferencesAndDeviceState]);

  // Handle individual notification category toggle
  const handleToggle = async (
    key: 'habit_notifications_enabled' | 'food_notifications_enabled' | 'workout_notifications_enabled'
  ) => {
    const nextValue = !settings[key];
    const updated = { ...settings, [key]: nextValue };
    setSettings(updated);

    // If enabling a category on an unregistered device with default permission, register naturally
    if (nextValue && !isDeviceRegistered && permissionState === 'default' && pushSupported) {
      const registered = await registerPushSubscription(userId);
      setIsDeviceRegistered(registered);
      setPermissionState(getNotificationPermissionState());
    }

    setSaving(true);
    await updateUserNotificationPreferences(userId, { [key]: nextValue });
    setSaving(false);
  };

  // Device registration toggle (Register / Unregister this specific browser/device)
  const handleDeviceRegister = async () => {
    setActionLoading(true);
    try {
      const success = await registerPushSubscription(userId);
      setPermissionState(getNotificationPermissionState());
      const registered = await isCurrentDeviceRegistered();
      setIsDeviceRegistered(registered && success);
    } catch (err) {
      console.error('Failed to register device for push notifications:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeviceUnregister = async () => {
    setActionLoading(true);
    try {
      await unsubscribePush(userId);
      setIsDeviceRegistered(false);
      setPermissionState(getNotificationPermissionState());
    } catch (err) {
      console.error('Failed to unregister device from push notifications:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const allCategoriesOff =
    !settings.habit_notifications_enabled &&
    !settings.food_notifications_enabled &&
    !settings.workout_notifications_enabled;

  return (
    <div
      style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: '20px 24px 100px',
        fontFamily: "var(--hd-font, 'Inter', sans-serif)",
        boxSizing: 'border-box',
        opacity: loading ? 0.75 : 1,
        transition: 'opacity 150ms ease',
      }}
    >
      {/* ── Back Navigation ── */}
      <button
        onClick={onBack}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          fontSize: 14,
          fontWeight: 500,
          color: '#6B7280',
          cursor: 'pointer',
          padding: '0 0 20px',
        }}
        aria-label="Back to settings"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* ── Title & Status Header ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
            Notifications
          </h1>
          {saving && (
            <span style={{ fontSize: 12, color: '#5C8D89', fontWeight: 600 }}>Saving...</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
          Control your reminder preferences and device alerts.
        </p>
      </div>

      {/* ── Device Registration & Browser Permission Card ── */}
      {pushSupported && (
        <div className="hd-card" style={{ padding: '16px 20px', marginBottom: 16 }}>
          {permissionState === 'denied' ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  backgroundColor: '#FEF2F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#991B1B' }}>
                  Notifications Blocked
                </span>
                <p style={{ fontSize: 12, color: '#7F1D1D', margin: '3px 0 0', lineHeight: 1.4 }}>
                  Push notifications are blocked in this browser's site settings. Allow notifications to receive alerts when FitBee is in the background.
                </p>
              </div>
            </div>
          ) : isDeviceRegistered ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: '#F0FDF4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>
                    Push notifications active on this device
                  </span>
                  <p style={{ fontSize: 11, color: '#4B5563', margin: '2px 0 0' }}>
                    This browser is registered to receive reminders.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDeviceUnregister}
                disabled={actionLoading}
                style={{
                  background: 'none',
                  border: '1px solid #E5E7EB',
                  color: '#6B7280',
                  fontSize: 12,
                  fontWeight: 500,
                  padding: '5px 12px',
                  borderRadius: 8,
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {actionLoading ? 'Updating...' : 'Unregister'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: 'rgba(92, 141, 137, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: '#5C8D89',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1F2937' }}>
                    Push notifications are off on this device
                  </span>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0' }}>
                    Enable alerts to get reminders even when the app is closed.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDeviceRegister}
                disabled={actionLoading}
                style={{
                  backgroundColor: '#5C8D89',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: 8,
                  cursor: actionLoading ? 'not-allowed' : 'pointer',
                  opacity: actionLoading ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {actionLoading ? 'Enabling...' : 'Enable'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Notification Category Preferences Card ── */}
      <div className="hd-card" style={{ padding: '8px 24px', marginBottom: 16 }}>
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
              <p className="hd-settings-item-label" style={{ fontWeight: 600 }}>Habit Reminders</p>
              <p className="hd-settings-item-desc">Gentle nudges for habits scheduled today.</p>
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
              <p className="hd-settings-item-label" style={{ fontWeight: 600 }}>Nutrition Logging</p>
              <p className="hd-settings-item-desc">Prompts to keep your meals and macros logged.</p>
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
              <p className="hd-settings-item-label" style={{ fontWeight: 600 }}>Workout Reminders</p>
              <p className="hd-settings-item-desc">Alerts for scheduled workouts and training.</p>
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
        <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', margin: '12px 0 20px' }}>
          All notification categories are turned off. FitBee will not send any reminders.
        </p>
      )}

      {/* ── Developer Evaluator Tool (Gated strictly to DEV mode only) ── */}
      {import.meta.env.DEV && (
        <NotificationDevEvaluator profile={profile} />
      )}
    </div>
  );
};
