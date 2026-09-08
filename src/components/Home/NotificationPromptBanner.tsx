import React, { useState, useEffect } from 'react';
import {
  isPushNotificationSupported,
  getNotificationPermissionState,
  isCurrentDeviceRegistered,
  registerPushSubscription,
} from '../../services/pushNotificationService';

interface NotificationPromptBannerProps {
  userId: string;
}

export const NotificationPromptBanner: React.FC<NotificationPromptBannerProps> = ({ userId }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!userId || !isPushNotificationSupported()) return;

    const checkEligibility = async () => {
      try {
        const perm = getNotificationPermissionState();
        // If already granted, auto-registration handles it; if denied, don't nag
        if (perm !== 'default') return;

        // Check if user dismissed prompt or unregistered
        const dismissed = localStorage.getItem('fitbee_push_prompt_dismissed');
        const unregistered = localStorage.getItem('fitbee_push_unregistered_' + userId);
        if (dismissed || unregistered) return;

        const alreadyRegistered = await isCurrentDeviceRegistered();
        if (!alreadyRegistered) {
          setVisible(true);
        }
      } catch (err) {
        console.warn('Error checking push prompt eligibility:', err);
      }
    };

    checkEligibility();
  }, [userId]);

  const handleEnable = async () => {
    setLoading(true);
    try {
      const ok = await registerPushSubscription(userId);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          setVisible(false);
        }, 2200);
      } else {
        setVisible(false);
      }
    } catch (err) {
      console.error('Failed to enable push from prompt:', err);
      setVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem('fitbee_push_prompt_dismissed', 'true');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      style={{
        maxWidth: 520,
        margin: '14px auto 0',
        padding: '0 24px',
        boxSizing: 'border-box',
        animation: 'hdFadeUp 350ms cubic-bezier(0.16, 1, 0.3, 1) both',
        fontFamily: "var(--hd-font, 'Inter', sans-serif)",
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E8E8E6',
          borderRadius: 16,
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          padding: '12px 16px',
        }}
      >
        {success ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#166534', padding: '4px 0' }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: '#DCFCE7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
                Reminders enabled on this device! 🐝
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11.5, color: '#15803D' }}>
                FitBee will gently keep your habits and goals on track.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: 'rgba(92, 141, 137, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#5C8D89',
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 650, color: '#1F2937' }}>
                  Stay consistent with reminders
                </h4>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6B7280', lineHeight: 1.35 }}>
                  Get gentle, intelligent check-ins for your habits, workouts, and nutrition throughout your day.
                </p>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 8,
                marginTop: 10,
              }}
            >
              <button
                type="button"
                onClick={handleDismiss}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: 12,
                  fontWeight: 500,
                  padding: '5px 10px',
                  cursor: 'pointer',
                  borderRadius: 6,
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                Not now
              </button>
              <button
                type="button"
                onClick={handleEnable}
                disabled={loading}
                style={{
                  backgroundColor: '#5C8D89',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: 8,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  boxShadow: '0 2px 6px rgba(92, 141, 137, 0.25)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {loading ? 'Enabling...' : 'Enable Reminders'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
