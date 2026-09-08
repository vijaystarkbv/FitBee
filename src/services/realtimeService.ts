import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export const REALTIME_EVENTS = {
  HABITS_UPDATED: 'fitbee:habits_updated',
  HABIT_SESSIONS_UPDATED: 'fitbee:habit_sessions_updated',
  HABIT_LOGS_UPDATED: 'fitbee:habit_logs_updated',
  WALKING_UPDATED: 'fitbee:walking_updated',
  WORKOUT_UPDATED: 'fitbee:workout_updated',
  NUTRITION_UPDATED: 'fitbee:nutrition_updated',
  WEIGHT_UPDATED: 'fitbee:weight_updated',
} as const;

let currentChannel: RealtimeChannel | null = null;
let currentUserId: string | null = null;

/**
 * Dispatches a custom window event for decoupled UI component reactivity.
 */
function dispatchSyncEvent(eventName: string, detail: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  }
}

/**
 * Initializes a user-scoped Realtime channel.
 * Listens only to rows matching user_id = userId.
 * Subscribers strictly update local React state / memory cache and NEVER write back to Supabase.
 */
export function initRealtime(userId: string): () => void {
  if (!userId) return () => {};

  if (currentChannel && currentUserId === userId) {
    return () => {};
  }

  // Teardown previous channel if switching users
  if (currentChannel) {
    supabase.removeChannel(currentChannel);
    currentChannel = null;
    currentUserId = null;
  }

  currentUserId = userId;
  const channelName = `realtime:fitbee_user_${userId}_${Date.now()}`;

  const channel = supabase.channel(channelName);

  // 1. Habit definitions
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'habits',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      dispatchSyncEvent(REALTIME_EVENTS.HABITS_UPDATED, { payload, userId });
    }
  );

  // 2. Habit timer sessions
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'habit_sessions',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      dispatchSyncEvent(REALTIME_EVENTS.HABIT_SESSIONS_UPDATED, { payload, userId });
    }
  );

  // 3. Habit daily completion logs
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'habit_logs',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      dispatchSyncEvent(REALTIME_EVENTS.HABIT_LOGS_UPDATED, { payload, userId });
    }
  );

  // 4. Daily walking logs
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'daily_walking_logs',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      dispatchSyncEvent(REALTIME_EVENTS.WALKING_UPDATED, { payload, userId, data: payload.new });
    }
  );

  // 5. Workout logs
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'workout_logs',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      dispatchSyncEvent(REALTIME_EVENTS.WORKOUT_UPDATED, { payload, userId });
    }
  );

  // 6. Nutrition logs
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'nutrition_logs',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      dispatchSyncEvent(REALTIME_EVENTS.NUTRITION_UPDATED, { payload, userId });
    }
  );

  // 7. Weight logs
  channel.on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'weight_logs',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      dispatchSyncEvent(REALTIME_EVENTS.WEIGHT_UPDATED, { payload, userId });
    }
  );

  channel.subscribe((status, err) => {
    if (status === 'SUBSCRIBED') {
      // Channel active
    } else if (err) {
      console.warn('Realtime subscription issue:', err);
    }
  });

  currentChannel = channel;

  return () => {
    if (currentChannel === channel) {
      supabase.removeChannel(channel);
      currentChannel = null;
      currentUserId = null;
    }
  };
}

/**
 * Manually cleans up current Realtime channel on logout.
 */
export function cleanupRealtime(): void {
  if (currentChannel) {
    supabase.removeChannel(currentChannel);
    currentChannel = null;
    currentUserId = null;
  }
}
