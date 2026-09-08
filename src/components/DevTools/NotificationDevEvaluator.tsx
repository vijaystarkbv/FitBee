import React, { useState } from 'react';
import { Profile } from '../../types/database.types';
import {
  evaluateNotificationDecision,
  NotificationEvaluationResult,
} from '../../services/notificationEngine';
import {
  registerPushSubscription,
  getNotificationPermissionState,
} from '../../services/pushNotificationService';

interface NotificationDevEvaluatorProps {
  profile: Profile;
}

export const NotificationDevEvaluator: React.FC<NotificationDevEvaluatorProps> = ({ profile }) => {
  // Production Safety: Do NOT render anything in production builds
  if (!import.meta.env.DEV) {
    return null;
  }

  const userId = profile.id;
  const [evalResult, setEvalResult] = useState<NotificationEvaluationResult | null>(null);
  const [evalLoading, setEvalLoading] = useState<boolean>(false);
  const [pushSending, setPushSending] = useState<boolean>(false);
  const [pushStatusMessage, setPushStatusMessage] = useState<string | null>(null);

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
      const perm = getNotificationPermissionState();
      if (perm === 'denied') {
        setPushStatusMessage('Notifications are blocked in your browser settings. Please allow notifications for FitBee.');
        return;
      }

      // Ensure device is actively registered with a push subscription
      await registerPushSubscription(userId);

      const requestBody = {
        userId,
        sendPush: true,
        testPayload: {
          title: 'FitBee Test Notification 🐝',
          body: 'Your push notifications are working.',
        },
      };

      let res: Response;
      try {
        res = await fetch('/api/notifications/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
        if (!res.ok && res.status === 404) {
          throw new Error('Local route 404, falling back to worker');
        }
      } catch {
        res = await fetch('https://fitbee.veyro.workers.dev/api/notifications/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
      }

      const data = await res.json();
      if (data.pushResult?.deliveredCount > 0) {
        setPushStatusMessage(`Sent to ${data.pushResult.deliveredCount} active device(s)! Check your Windows notification center / phone notification shade.`);
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
    <div
      style={{
        marginTop: 24,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        border: '1.5px dashed #5C8D89',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#134E4A' }}>
              Notification Engine Evaluator
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#D97706',
                background: '#FEF3C7',
                padding: '2px 6px',
                borderRadius: 6,
              }}
            >
              DEV ONLY
            </span>
          </div>
          <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
            Inspect what the decision engine calculates for current account state.
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
            backgroundColor: '#FFFFFF',
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
  );
};
