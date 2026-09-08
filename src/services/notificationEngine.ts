/**
 * FitBee Context-Aware Notification Decision Engine
 *
 * Implements:
 * - Local timezone & evaluation window resolution (08:00, 12:00, 15:00, 19:00, 22:00)
 * - Raw daily state calculation (Habits, Food, Workout)
 * - User preference filtering
 * - Mandatory category combination logic (single combined notification)
 * - Time-based and context-aware intensity scaling (CALM, NUDGE, CHAOS)
 * - Non-gendered, varied message selection
 * - 5/day hard limit & idempotency verification
 */

import { supabase } from './supabaseClient';
import {
  NotificationState,
  NotificationIntensity,
  NotificationMessageItem,
  selectNotificationMessage,
} from './notificationMessages';
import { calculateNutritionTargetsScore, getUserNutritionTargets } from './nutritionHistoryService';
import { Profile } from '../types/database.types';

export const EVALUATION_SLOTS = ['08:00', '12:00', '15:00', '19:00', '22:00'] as const;
export type EvaluationSlot = (typeof EVALUATION_SLOTS)[number];

export interface UserNotificationSettings {
  user_id: string;
  notifications_enabled: boolean;
  habit_notifications_enabled: boolean;
  food_notifications_enabled: boolean;
  workout_notifications_enabled: boolean;
  timezone: string;
}

export interface UserLocalTimeInfo {
  localDate: string; // YYYY-MM-DD
  localTime: string; // HH:mm
  hour: number;
  minute: number;
  weekdayName: string; // 'Monday', 'Tuesday', etc.
  currentSlot: EvaluationSlot | null;
}

export interface RawCategoryState {
  habitPending: boolean;
  foodPending: boolean;
  workoutPending: boolean;
  habitDetails: {
    totalHabits: number;
    completedHabits: number;
    incompleteHabits: number;
  };
  workoutDetails: {
    isScheduledToday: boolean;
    isCompletedToday: boolean;
  };
  foodDetails: {
    isLoggedToday: boolean;
    isTargetsMet: boolean;
    currentCalories: number;
  };
}

export interface NotificationEvaluationResult {
  shouldSend: boolean;
  userId: string;
  localDate: string;
  slot: EvaluationSlot | string;
  state: NotificationState | 'NONE';
  intensity: NotificationIntensity;
  message?: NotificationMessageItem;
  deepLinkUrl: string;
  reason?: string;
  pendingCategories: ('HABIT' | 'FOOD' | 'WORKOUT')[];
}


/**
 * Resolves user local date, time, weekday, and matching evaluation slot based on their timezone.
 */
export function getUserLocalTimeInfo(timezone: string = 'UTC', baseDate: Date = new Date()): UserLocalTimeInfo {
  let tz = timezone || 'UTC';
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
  } catch (_) {
    tz = 'UTC';
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'long',
  });

  const parts = formatter.formatToParts(baseDate);
  const partMap: Record<string, string> = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }

  const year = partMap.year;
  const month = partMap.month;
  const day = partMap.day;
  const hour = parseInt(partMap.hour || '0', 10);
  const minute = parseInt(partMap.minute || '0', 10);
  const weekdayName = partMap.weekday || 'Monday';

  const localDate = `${year}-${month}-${day}`;
  const localTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;

  // Match slot: within the evaluation window
  let currentSlot: EvaluationSlot | null = null;
  if (hour === 8) currentSlot = '08:00';
  else if (hour === 12) currentSlot = '12:00';
  else if (hour === 15) currentSlot = '15:00';
  else if (hour === 19) currentSlot = '19:00';
  else if (hour === 22) currentSlot = '22:00';

  return {
    localDate,
    localTime,
    hour,
    minute,
    weekdayName,
    currentSlot,
  };
}

/**
 * Determines notification intensity from evaluation slot and local time.
 */
export function getIntensityForSlot(slot: EvaluationSlot | string, hour?: number): NotificationIntensity {
  if (slot === '22:00' || (hour !== undefined && hour >= 21)) {
    return 'CHAOS';
  }
  if (slot === '15:00' || slot === '19:00' || (hour !== undefined && hour >= 14 && hour < 21)) {
    return 'NUDGE';
  }
  return 'CALM';
}

/**
 * Deep link target based on final combined notification state.
 */
export function getDeepLinkForState(state: NotificationState | 'NONE'): string {
  switch (state) {
    case 'HABIT':
      return '/?tab=habits';
    case 'FOOD':
      return '/?tab=meal';
    case 'WORKOUT':
      return '/?tab=workout';
    case 'HABIT_FOOD':
    case 'HABIT_WORKOUT':
    case 'FOOD_WORKOUT':
    case 'HABIT_FOOD_WORKOUT':
    default:
      return '/?tab=home';
  }
}

/**
 * Calculates raw daily pending state for Habits, Food, and Workout.
 * Uses existing Supabase tables and models as the canonical source of truth.
 */
export async function calculateRawDailyState(
  userId: string,
  localDate: string,
  weekdayName: string,
  profile?: Profile | null
): Promise<RawCategoryState> {
  // ─────────────────────────────────────────────────────────────
  // 1. HABITS
  // ─────────────────────────────────────────────────────────────
  let habitPending = false;
  let totalHabits = 0;
  let completedHabits = 0;

  try {
    const { data: habits } = await supabase
      .from('habits')
      .select('id, is_active')
      .eq('user_id', userId)
      .eq('is_active', true);

    const activeHabits = habits || [];
    totalHabits = activeHabits.length;

    if (totalHabits > 0) {
      const { data: logs } = await supabase
        .from('habit_logs')
        .select('habit_id, is_completed')
        .eq('user_id', userId)
        .eq('date', localDate);

      const completedSet = new Set<string>();
      (logs || []).forEach((l) => {
        if (l.is_completed) completedSet.add(l.habit_id);
      });

      completedHabits = completedSet.size;
      // Pending if any active habit is not completed today
      habitPending = completedHabits < totalHabits;
    } else {
      // User has no active habits at all -> never send habit notification
      habitPending = false;
    }
  } catch (err) {
    console.warn('Error evaluating habits for notification:', err);
  }

  // ─────────────────────────────────────────────────────────────
  // 2. FOOD / NUTRITION
  // ─────────────────────────────────────────────────────────────
  let foodPending = true;
  let isLoggedToday = false;
  let isTargetsMet = false;
  let currentCalories = 0;

  try {
    const { data: nutLog } = await supabase
      .from('nutrition_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', localDate)
      .maybeSingle();

    if (nutLog) {
      currentCalories = Number(nutLog.total_calories) || 0;
      isLoggedToday = currentCalories > 0 || (Number(nutLog.total_protein) || 0) > 0;

      if (profile) {
        const targets = getUserNutritionTargets(profile, localDate);
        const scoreResult = calculateNutritionTargetsScore(
          {
            calories: currentCalories,
            protein: Number(nutLog.total_protein) || 0,
            carbs: Number(nutLog.total_carbs) || 0,
            fat: Number(nutLog.total_fat) || 0,
          },
          targets
        );

        isTargetsMet = scoreResult.isCompleted;
        // If targets are met or nutrition score is complete, requirement is satisfied
        if (isTargetsMet) {
          foodPending = false;
        }
      }
    } else {
      // No log created yet -> food logging is pending
      foodPending = true;
    }
  } catch (err) {
    console.warn('Error evaluating nutrition for notification:', err);
  }

  // ─────────────────────────────────────────────────────────────
  // 3. WORKOUT
  // ─────────────────────────────────────────────────────────────
  let workoutPending = false;
  let isScheduledToday = false;
  let isCompletedToday = false;

  try {
    // Check if user has an active workout template with today enabled
    const { data: templates } = await supabase
      .from('workout_templates')
      .select('id, name, workout_template_days(id, day_name, is_enabled)')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (templates && templates.length > 0) {
      const activeTemplate = templates[0];
      const enabledDayNames = new Set(
        (activeTemplate.workout_template_days || [])
          .filter((d: any) => d.is_enabled && d.day_name)
          .map((d: any) => d.day_name.trim().toLowerCase())
      );

      isScheduledToday = enabledDayNames.has(weekdayName.trim().toLowerCase());

      if (isScheduledToday) {
        // Check if user has already completed a workout today
        // Query workout_logs for local date
        const queryDate = `${localDate}T00:00:00.000Z`;
        const nextDayDate = new Date(`${localDate}T23:59:59.999Z`).toISOString();

        const { data: workoutLogs } = await supabase
          .from('workout_logs')
          .select('id, completed_at, start_time, workout_log_sets(id)')
          .eq('user_id', userId)
          .gte('start_time', queryDate)
          .lte('start_time', nextDayDate);

        const hasCompletedLog = (workoutLogs || []).some(
          (log: any) => log.completed_at !== null || (log.workout_log_sets && log.workout_log_sets.length > 0)
        );

        isCompletedToday = hasCompletedLog;
        workoutPending = !isCompletedToday;
      } else {
        // Today is not a scheduled workout day -> no workout notification
        workoutPending = false;
      }
    } else {
      // No workout templates exist -> never send workout notification
      workoutPending = false;
    }
  } catch (err) {
    console.warn('Error evaluating workout for notification:', err);
  }

  return {
    habitPending,
    foodPending,
    workoutPending,
    habitDetails: {
      totalHabits,
      completedHabits,
      incompleteHabits: Math.max(0, totalHabits - completedHabits),
    },
    workoutDetails: {
      isScheduledToday,
      isCompletedToday,
    },
    foodDetails: {
      isLoggedToday,
      isTargetsMet,
      currentCalories,
    },
  };
}

/**
 * Combines category pending states according to the mandatory combination rules.
 */
export function resolveCombinedNotificationState(
  habitActive: boolean,
  foodActive: boolean,
  workoutActive: boolean
): NotificationState | 'NONE' {
  if (habitActive && foodActive && workoutActive) {
    return 'HABIT_FOOD_WORKOUT';
  }
  if (habitActive && workoutActive) {
    return 'HABIT_WORKOUT';
  }
  if (habitActive && foodActive) {
    return 'HABIT_FOOD';
  }
  if (foodActive && workoutActive) {
    return 'FOOD_WORKOUT';
  }
  if (habitActive) {
    return 'HABIT';
  }
  if (foodActive) {
    return 'FOOD';
  }
  if (workoutActive) {
    return 'WORKOUT';
  }
  return 'NONE';
}

/**
 * Evaluates the full context-aware notification decision for a user.
 */
export async function evaluateNotificationDecision(
  userId: string,
  slotOverride?: EvaluationSlot | string,
  profileOverride?: Profile | null,
  recentMessageIds: string[] = []
): Promise<NotificationEvaluationResult> {
  // 1. Fetch user notification settings
  const { data: settingsRow } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const settings: UserNotificationSettings = {
    user_id: userId,
    notifications_enabled: settingsRow ? Boolean(settingsRow.notifications_enabled) : true,
    habit_notifications_enabled: settingsRow ? Boolean(settingsRow.habit_notifications_enabled) : true,
    food_notifications_enabled: settingsRow ? Boolean(settingsRow.food_notifications_enabled) : true,
    workout_notifications_enabled: settingsRow ? Boolean(settingsRow.workout_notifications_enabled) : true,
    timezone: settingsRow?.timezone || 'UTC',
  };

  // If master notifications or all 3 categories are OFF: STOP
  if (
    !settings.notifications_enabled ||
    (!settings.habit_notifications_enabled &&
      !settings.food_notifications_enabled &&
      !settings.workout_notifications_enabled)
  ) {
    return {
      shouldSend: false,
      userId,
      localDate: '',
      slot: slotOverride || '08:00',
      state: 'NONE',
      intensity: 'CALM',
      deepLinkUrl: '/?tab=home',
      reason: 'All notification categories or master switch are disabled.',
      pendingCategories: [],
    };
  }

  // 2. Resolve local timezone & candidate slot
  const timeInfo = getUserLocalTimeInfo(settings.timezone);
  const slot = slotOverride || timeInfo.currentSlot || '08:00';
  const intensity = getIntensityForSlot(slot, timeInfo.hour);

  // 3. Fetch profile if not provided
  let profile = profileOverride;
  if (!profile) {
    const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    profile = prof;
  }

  // 4. Calculate raw daily state from database
  const rawState = await calculateRawDailyState(userId, timeInfo.localDate, timeInfo.weekdayName, profile);

  // 5. Apply user preferences
  const habitActive = rawState.habitPending && settings.habit_notifications_enabled;
  const foodActive = rawState.foodPending && settings.food_notifications_enabled;
  const workoutActive = rawState.workoutPending && settings.workout_notifications_enabled;

  const pendingCategories: ('HABIT' | 'FOOD' | 'WORKOUT')[] = [];
  if (habitActive) pendingCategories.push('HABIT');
  if (foodActive) pendingCategories.push('FOOD');
  if (workoutActive) pendingCategories.push('WORKOUT');

  // 6. Resolve single combined notification state
  const state = resolveCombinedNotificationState(habitActive, foodActive, workoutActive);

  if (state === 'NONE') {
    return {
      shouldSend: false,
      userId,
      localDate: timeInfo.localDate,
      slot,
      state: 'NONE',
      intensity,
      deepLinkUrl: '/?tab=home',
      reason: 'No pending items remain or all relevant items are completed.',
      pendingCategories: [],
    };
  }

  // 7. Check server-side daily cap (Hard Maximum 5 per account per local calendar day)
  const { count: dailyCount } = await supabase
    .from('notification_logs')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('local_date', timeInfo.localDate);

  if ((dailyCount || 0) >= 5) {
    return {
      shouldSend: false,
      userId,
      localDate: timeInfo.localDate,
      slot,
      state,
      intensity,
      deepLinkUrl: getDeepLinkForState(state),
      reason: `Daily notification limit reached (${dailyCount}/5 sent today).`,
      pendingCategories,
    };
  }

  // 8. Check duplicate for same slot today
  const { data: existingSlotLog } = await supabase
    .from('notification_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('local_date', timeInfo.localDate)
    .eq('slot_time', String(slot))
    .maybeSingle();

  if (existingSlotLog) {
    return {
      shouldSend: false,
      userId,
      localDate: timeInfo.localDate,
      slot,
      state,
      intensity,
      deepLinkUrl: getDeepLinkForState(state),
      reason: `Notification already delivered for slot ${slot} on ${timeInfo.localDate}.`,
      pendingCategories,
    };
  }

  // 9. Select non-repeating message for state and intensity
  const message = selectNotificationMessage(state, intensity, recentMessageIds);
  const deepLinkUrl = getDeepLinkForState(state);

  return {
    shouldSend: true,
    userId,
    localDate: timeInfo.localDate,
    slot,
    state,
    intensity,
    message,
    deepLinkUrl,
    pendingCategories,
  };
}
