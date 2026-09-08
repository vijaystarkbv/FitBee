/**
 * FitBee Push Notification Client Service
 *
 * Manages:
 * - Service worker registration (/sw.js)
 * - PushManager subscription lifecycle
 * - Syncing subscriptions with Supabase push_subscriptions table
 * - Fetching and updating user_settings notification category preferences
 */

import { supabase } from './supabaseClient';
import { UserNotificationSettings } from './notificationEngine';

export const VAPID_PUBLIC_KEY =
  'BHT2BsY6ChvtsuFkXLxRIlQFacUv7643c583OUdZRAUBFwfOTXCxggu9txysmILuYNkWr4Z4wIG4mUpmLs-YvLY';

/**
 * Converts a base64url string to a Uint8Array for PushManager subscription.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Checks if Push notifications and Service Workers are supported by the browser.
 */
export function isPushNotificationSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Gets the current browser notification permission.
 */
export function getNotificationPermissionState(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'default';
  }
  return Notification.permission;
}

/**
 * Fetches the user's notification preferences from Supabase user_settings.
 * If no row exists, creates a default row with the user's local timezone.
 */
export async function getUserNotificationPreferences(userId: string): Promise<UserNotificationSettings> {
  if (!userId) {
    return {
      user_id: '',
      notifications_enabled: true,
      habit_notifications_enabled: true,
      food_notifications_enabled: true,
      workout_notifications_enabled: true,
      timezone: 'UTC',
    };
  }

  const detectedTz =
    (typeof Intl !== 'undefined' && Intl.DateTimeFormat().resolvedOptions().timeZone) || 'UTC';

  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (!error && data) {
      return {
        user_id: userId,
        notifications_enabled: data.notifications_enabled !== false,
        habit_notifications_enabled: data.habit_notifications_enabled !== false,
        food_notifications_enabled: data.food_notifications_enabled !== false,
        workout_notifications_enabled: data.workout_notifications_enabled !== false,
        timezone: data.timezone || detectedTz,
      };
    }

    // Insert default settings row if missing
    const defaultSettings = {
      user_id: userId,
      theme: 'dark',
      notifications_enabled: true,
      habit_notifications_enabled: true,
      food_notifications_enabled: true,
      workout_notifications_enabled: true,
      timezone: detectedTz,
    };

    const { data: created } = await supabase
      .from('user_settings')
      .upsert(defaultSettings, { onConflict: 'user_id' })
      .select('*')
      .maybeSingle();

    if (created) {
      return {
        user_id: userId,
        notifications_enabled: created.notifications_enabled,
        habit_notifications_enabled: created.habit_notifications_enabled,
        food_notifications_enabled: created.food_notifications_enabled,
        workout_notifications_enabled: created.workout_notifications_enabled,
        timezone: created.timezone || detectedTz,
      };
    }
  } catch (err) {
    console.warn('Could not load user notification preferences:', err);
  }

  return {
    user_id: userId,
    notifications_enabled: true,
    habit_notifications_enabled: true,
    food_notifications_enabled: true,
    workout_notifications_enabled: true,
    timezone: detectedTz,
  };
}

/**
 * Updates notification preferences in Supabase.
 */
export async function updateUserNotificationPreferences(
  userId: string,
  updates: Partial<UserNotificationSettings>
): Promise<boolean> {
  if (!userId) return false;

  try {
    const payload: any = {
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    if (updates.notifications_enabled !== undefined) payload.notifications_enabled = updates.notifications_enabled;
    if (updates.habit_notifications_enabled !== undefined) payload.habit_notifications_enabled = updates.habit_notifications_enabled;
    if (updates.food_notifications_enabled !== undefined) payload.food_notifications_enabled = updates.food_notifications_enabled;
    if (updates.workout_notifications_enabled !== undefined) payload.workout_notifications_enabled = updates.workout_notifications_enabled;
    if (updates.timezone !== undefined) payload.timezone = updates.timezone;

    const { error } = await supabase
      .from('user_settings')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.error('Failed to update notification settings:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error saving notification preferences:', err);
    return false;
  }
}

/**
 * Registers the Service Worker (/sw.js) and requests PushManager subscription.
 * Saves subscription to Supabase push_subscriptions table.
 */
export async function registerPushSubscription(userId: string): Promise<boolean> {
  if (!isPushNotificationSupported() || !userId) {
    return false;
  }

  try {
    // 1. Request notification permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return false;
    }

    // 2. Register Service Worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });
    await navigator.serviceWorker.ready;

    // 3. Subscribe via PushManager with VAPID applicationServerKey
    const convertedKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedKey as unknown as BufferSource,
    });

    // 4. Extract subscription keys
    const subJson = subscription.toJSON();
    const endpoint = subscription.endpoint;
    const p256dh = subJson.keys?.p256dh;
    const auth = subJson.keys?.auth;

    if (!endpoint || !p256dh || !auth) {
      console.warn('Incomplete push subscription payload received');
      return false;
    }

    // Determine device type
    const ua = navigator.userAgent;
    let deviceType = 'desktop';
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      deviceType = 'tablet';
    } else if (/Mobile|Android|iP(hone|od)/i.test(ua)) {
      deviceType = 'mobile';
    }

    // 5. Upsert subscription to Supabase
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          user_id: userId,
          endpoint,
          p256dh,
          auth,
          user_agent: ua,
          device_type: deviceType,
          is_active: true,
          last_seen_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      );

    if (error) {
      console.error('Failed to save push subscription to Supabase:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error during push registration:', err);
    return false;
  }
}

/**
 * Unsubscribes from push notifications on the current browser client and updates Supabase.
 */
export async function unsubscribePush(userId: string): Promise<boolean> {
  if (!isPushNotificationSupported() || !userId) return false;

  try {
    const registration = await navigator.serviceWorker.getRegistration('/sw.js');
    if (registration) {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();

        // Mark inactive in Supabase
        await supabase
          .from('push_subscriptions')
          .update({ is_active: false, updated_at: new Date().toISOString() })
          .eq('endpoint', endpoint);
      }
    }
    return true;
  } catch (err) {
    console.error('Error unsubscribing push notification:', err);
    return false;
  }
}
