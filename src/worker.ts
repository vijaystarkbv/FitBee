import { buildPushPayload, PushMessage, PushSubscription, VapidKeys } from '@block65/webcrypto-web-push';
import { createClient } from '@supabase/supabase-js';
import {
  evaluateNotificationDecision,
  getUserLocalTimeInfo,
  EvaluationSlot,
} from './services/notificationEngine';

export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  GEMINI_API_KEY?: string;
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
  VAPID_SUBJECT?: string;
}

export interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
  type: string;
}

export interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

const DEFAULT_VAPID_PUBLIC_KEY =
  'BHT2BsY6ChvtsuFkXLxRIlQFacUv7643c583OUdZRAUBFwfOTXCxggu9txysmILuYNkWr4Z4wIG4mUpmLs-YvLY';
const DEFAULT_VAPID_PRIVATE_KEY =
  'h9E7GuVdXpdjl9Etfpvi1EgZpBSFL0Xe7-KYQUkbc90';
const DEFAULT_VAPID_SUBJECT = 'mailto:support@fitbee.com';

const DEFAULT_SUPABASE_URL = 'https://rbbaqzpfimffcgixyukr.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_L9KrnrVHAkBfHOPospS55A_cQOTr8II';

const VERIFIED_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data: any, status: number = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...CORS_HEADERS,
    },
  });
}

/**
 * Calls Gemini via Google Generative Language REST API using server-side secret
 */
async function callGemini(
  apiKey: string,
  prompt: string,
  responseMimeType: string = 'application/json'
): Promise<string> {
  let lastError: Error | null = null;

  for (const modelName of VERIFIED_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(apiKey)}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            responseMimeType: responseMimeType || 'application/json',
          },
        }),
      });

      if (!response.ok) {
        const errBody = await response.text().catch(() => '');
        console.error(`Gemini model ${modelName} error (${response.status}):`, errBody);
        lastError = new Error(`Gemini model ${modelName} returned HTTP ${response.status}: ${errBody}`);
        continue;
      }

      const data: any = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        return text;
      }
      lastError = new Error(`Gemini model ${modelName} returned empty candidate text`);
    } catch (err: any) {
      lastError = err instanceof Error ? err : new Error(String(err));
      continue;
    }
  }

  throw lastError || new Error('All verified Gemini models failed to respond');
}

/**
 * Creates a Supabase client configured for the Worker environment.
 */
function getWorkerSupabase(env: Env, authToken?: string) {
  const url = env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: authToken
      ? {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      : undefined,
  });
}

/**
 * Sends a Web Push payload to an individual PushSubscription via RFC 8291 / 8292.
 */
async function sendWebPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payloadData: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
  },
  vapid: VapidKeys
): Promise<{ success: boolean; statusCode: number; expired?: boolean; error?: string }> {
  try {
    const message: PushMessage = {
      data: JSON.stringify({
        title: payloadData.title,
        body: payloadData.body,
        icon: payloadData.icon || '/icons/icon-192.png',
        badge: payloadData.badge || '/icons/badge-72.png',
        tag: payloadData.tag || 'fitbee-notification',
        data: payloadData.data || {},
      }),
      options: {
        ttl: 3600,
        urgency: 'high',
      },
    };

    const pushSub: PushSubscription = {
      endpoint: subscription.endpoint,
      expirationTime: null,
      keys: {
        auth: subscription.auth,
        p256dh: subscription.p256dh,
      },
    };

    const pushPayload = await buildPushPayload(message, pushSub, vapid);

    const pushRes = await fetch(subscription.endpoint, {
      method: pushPayload.method,
      headers: pushPayload.headers,
      body: pushPayload.body,
    });

    if (!pushRes.ok) {
      const errText = await pushRes.text().catch(() => '');
      const isExpired = pushRes.status === 404 || pushRes.status === 410;
      return {
        success: false,
        statusCode: pushRes.status,
        expired: isExpired,
        error: errText,
      };
    }

    return { success: true, statusCode: pushRes.status };
  } catch (err: any) {
    return {
      success: false,
      statusCode: 500,
      error: err?.message || String(err),
    };
  }
}

/**
 * Dispatches a push notification to all active devices of a given user,
 * deactivating any expired subscriptions, and recording the delivery atomically.
 */
async function dispatchUserPush(
  env: Env,
  userId: string,
  notification: {
    localDate: string;
    slotTime: string;
    state: string;
    intensity: string;
    messageId: string;
    title: string;
    body: string;
    deepLinkUrl: string;
    metadata?: any;
  }
): Promise<{
  allowed: boolean;
  reason?: string;
  deliveredCount: number;
  totalSubscriptions: number;
}> {
  const supabase = getWorkerSupabase(env);
  const vapid: VapidKeys = {
    subject: env.VAPID_SUBJECT || DEFAULT_VAPID_SUBJECT,
    publicKey: env.VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY || DEFAULT_VAPID_PRIVATE_KEY,
  };

  // 1. Fetch active push subscriptions for user via SECURITY DEFINER RPC
  const { data: subs, error: subsError } = await supabase.rpc(
    'get_active_push_subscriptions',
    { p_user_id: userId }
  );

  if (subsError || !subs || subs.length === 0) {
    return {
      allowed: false,
      reason: 'No active push subscriptions found for user.',
      deliveredCount: 0,
      totalSubscriptions: 0,
    };
  }

  // 2. Dispatch push in parallel to all active endpoints
  let deliveredCount = 0;
  const expiredEndpoints: string[] = [];

  const pushPromises = (subs as any[]).map(async (sub) => {
    const res = await sendWebPushNotification(
      { endpoint: sub.endpoint, p256dh: sub.p256dh, auth: sub.auth },
      {
        title: notification.title,
        body: notification.body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        data: {
          url: notification.deepLinkUrl,
          state: notification.state,
          intensity: notification.intensity,
          slot: notification.slotTime,
          ...notification.metadata,
        },
      },
      vapid
    );

    if (res.success) {
      deliveredCount++;
    } else if (res.expired) {
      expiredEndpoints.push(sub.endpoint);
    }
  });

  await Promise.allSettled(pushPromises);

  // 3. Mark expired endpoints as inactive via RPC
  if (expiredEndpoints.length > 0) {
    await Promise.allSettled(
      expiredEndpoints.map((ep) =>
        supabase.rpc('deactivate_push_endpoint', { p_endpoint: ep })
      )
    );
  }

  if (deliveredCount === 0) {
    return {
      allowed: false,
      reason: 'All push subscription delivery attempts failed.',
      deliveredCount: 0,
      totalSubscriptions: subs.length,
    };
  }

  // 4. For manual developer tests, do not consume production slots or enforce daily cap
  if (notification.metadata?.manualTest) {
    return {
      allowed: true,
      deliveredCount,
      totalSubscriptions: subs.length,
    };
  }

  // 5. Record single delivery event atomically in notification_logs
  // enforcing the 5-per-day hard cap and slot idempotency
  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    'check_and_record_notification',
    {
      p_user_id: userId,
      p_local_date: notification.localDate,
      p_slot_time: notification.slotTime,
      p_notification_state: notification.state,
      p_intensity: notification.intensity,
      p_message_id: notification.messageId,
      p_title: notification.title,
      p_body: notification.body,
      p_delivered_devices: deliveredCount,
      p_metadata: {
        deepLinkUrl: notification.deepLinkUrl,
        ...notification.metadata,
      },
    }
  );

  if (rpcError) {
    console.error('Error in check_and_record_notification RPC:', rpcError);
    return {
      allowed: false,
      reason: rpcError.message,
      deliveredCount,
      totalSubscriptions: subs.length,
    };
  }

  return {
    allowed: rpcResult?.allowed !== false,
    reason: rpcResult?.reason,
    deliveredCount,
    totalSubscriptions: subs.length,
  };
}

/**
 * Hourly Cron Job: Evaluates notification eligibility across users and delivers pushes.
 */
async function runScheduledNotifications(env: Env): Promise<{
  processedUsers: number;
  sentCount: number;
  skippedCount: number;
  errors: any[];
}> {
  const supabase = getWorkerSupabase(env);
  const results = {
    processedUsers: 0,
    sentCount: 0,
    skippedCount: 0,
    errors: [] as any[],
  };

  try {
    // 1. Fetch users with notifications enabled in user_settings
    const { data: userSettingsList, error: settingsError } = await supabase
      .from('user_settings')
      .select('user_id, notifications_enabled, habit_notifications_enabled, food_notifications_enabled, workout_notifications_enabled, timezone')
      .eq('notifications_enabled', true);

    if (settingsError || !userSettingsList) {
      results.errors.push(settingsError || 'Failed to fetch user_settings');
      return results;
    }

    const CANDIDATE_HOURS: Record<number, EvaluationSlot> = {
      8: '08:00',
      12: '12:00',
      15: '15:00',
      19: '19:00',
      22: '22:00',
    };

    for (const settings of userSettingsList) {
      try {
        // Must have at least one category turned on
        if (
          !settings.habit_notifications_enabled &&
          !settings.food_notifications_enabled &&
          !settings.workout_notifications_enabled
        ) {
          results.skippedCount++;
          continue;
        }

        // Calculate user's local hour
        const timeInfo = getUserLocalTimeInfo(settings.timezone);
        const matchingSlot = CANDIDATE_HOURS[timeInfo.hour];

        // If current hour is not one of the 5 windows (08:00, 12:00, 15:00, 19:00, 22:00), skip
        if (!matchingSlot) {
          results.skippedCount++;
          continue;
        }

        // Check if user has active push subscriptions
        const { count: subCount } = await supabase
          .from('push_subscriptions')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', settings.user_id)
          .eq('is_active', true);

        if (!subCount || subCount === 0) {
          results.skippedCount++;
          continue;
        }

        results.processedUsers++;

        // Evaluate decision engine
        const evaluation = await evaluateNotificationDecision(settings.user_id, matchingSlot);

        if (!evaluation.shouldSend || !evaluation.message) {
          results.skippedCount++;
          continue;
        }

        // Dispatch push to user's active devices
        const dispatchRes = await dispatchUserPush(env, settings.user_id, {
          localDate: evaluation.localDate,
          slotTime: String(evaluation.slot),
          state: evaluation.state,
          intensity: evaluation.intensity,
          messageId: evaluation.message.id,
          title: evaluation.message.title,
          body: evaluation.message.body,
          deepLinkUrl: evaluation.deepLinkUrl,
          metadata: {
            pendingCategories: evaluation.pendingCategories,
          },
        });

        if (dispatchRes.allowed && dispatchRes.deliveredCount > 0) {
          results.sentCount++;
        } else {
          results.skippedCount++;
        }
      } catch (userErr: any) {
        results.errors.push({
          userId: settings.user_id,
          error: userErr?.message || String(userErr),
        });
      }
    }
  } catch (cronErr: any) {
    results.errors.push(cronErr?.message || String(cronErr));
  }

  return results;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // ── Handle CORS Preflight ──
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    // ── Route: GET /api/notifications/vapid-public-key ──
    if (url.pathname === '/api/notifications/vapid-public-key') {
      const publicKey = env.VAPID_PUBLIC_KEY || DEFAULT_VAPID_PUBLIC_KEY;
      return jsonResponse({ publicKey });
    }

    // ── Route: POST /api/notifications/evaluate ──
    if (url.pathname === '/api/notifications/evaluate') {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      try {
        const body: any = await request.json().catch(() => ({}));
        let userId = body?.userId;

        // Optionally extract userId from Authorization Bearer token
        const authHeader = request.headers.get('Authorization') || '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();

        if (!userId && token) {
          const supabase = getWorkerSupabase(env, token);
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            userId = user.id;
          }
        }

        if (!userId) {
          return jsonResponse({ error: 'User ID or valid bearer token is required' }, 400);
        }

        const slotOverride = body?.slotOverride;
        const sendPush = Boolean(body?.sendPush);
        const testPayload = body?.testPayload;

        // Run decision engine evaluation
        const evaluation = await evaluateNotificationDecision(userId, slotOverride);

        let pushResult: any = null;

        // If sendPush requested:
        if (sendPush) {
          const title = testPayload?.title || evaluation.message?.title || 'FitBee Check-in 🐝';
          const messageBody = testPayload?.body || evaluation.message?.body || 'Stay on track with your goals today!';
          const messageId = evaluation.message?.id || 'test_manual_push';

          pushResult = await dispatchUserPush(env, userId, {
            localDate: evaluation.localDate,
            slotTime: String(evaluation.slot),
            state: evaluation.state,
            intensity: evaluation.intensity,
            messageId,
            title,
            body: messageBody,
            deepLinkUrl: evaluation.deepLinkUrl,
            metadata: {
              manualTest: Boolean(testPayload),
              pendingCategories: evaluation.pendingCategories,
            },
          });
        }

        return jsonResponse({
          success: true,
          evaluation,
          pushResult,
        });
      } catch (err: any) {
        console.error('Error evaluating notifications:', err);
        return jsonResponse(
          {
            error: 'Failed to evaluate notifications',
            details: err?.message || String(err),
          },
          500
        );
      }
    }

    // ── Route: POST /api/notifications/cron ──
    if (url.pathname === '/api/notifications/cron') {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      try {
        const cronResult = await runScheduledNotifications(env);
        return jsonResponse({
          success: true,
          cronResult,
        });
      } catch (err: any) {
        return jsonResponse(
          {
            error: 'Failed to execute scheduled notification runner',
            details: err?.message || String(err),
          },
          500
        );
      }
    }

    // ── API Route: /api/gemini ──
    if (url.pathname === '/api/gemini' || url.pathname === '/api/gemini/') {
      if (request.method !== 'POST') {
        return jsonResponse({ error: 'Method not allowed' }, 405);
      }

      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '' || apiKey.includes('placeholder')) {
        return jsonResponse({ error: 'Gemini service is not configured on the server.' }, 503);
      }

      try {
        const body: any = await request.json();
        const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';
        const responseMimeType =
          typeof body?.responseMimeType === 'string' ? body.responseMimeType : 'application/json';

        if (!prompt) {
          return jsonResponse({ error: 'Prompt is required.' }, 400);
        }

        const text = await callGemini(apiKey, prompt, responseMimeType);
        return jsonResponse({ text }, 200);
      } catch (err: any) {
        console.error('FitBee Worker Gemini API error:', err?.message || 'Unknown error');
        return jsonResponse(
          {
            error: 'Failed to generate response from AI service.',
            details: String(err?.message || '').replace(/[a-zA-Z0-9_-]{35,}/g, '[REDACTED]'),
          },
          502
        );
      }
    }

    // ── Static Assets & SPA Routing fallback ──
    return env.ASSETS.fetch(request);
  },

  /**
   * Hourly Cloudflare Cron Trigger (triggers: { crons: ["0 * * * *"] })
   */
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(runScheduledNotifications(env));
  },
};
