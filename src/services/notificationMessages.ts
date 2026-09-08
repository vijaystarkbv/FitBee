/**
 * FitBee Notification Message Library & Selector
 *
 * NOTE FOR PART 2:
 * This registry contains a SMALL, disposable set of temporary test messages
 * to test the notification engine, routing, intensity scaling, and rotation.
 * The complete 140-message library will be integrated in PART 3.
 */

export type NotificationState =
  | 'HABIT'
  | 'FOOD'
  | 'WORKOUT'
  | 'HABIT_FOOD'
  | 'HABIT_WORKOUT'
  | 'FOOD_WORKOUT'
  | 'HABIT_FOOD_WORKOUT';

export type NotificationIntensity = 'CALM' | 'NUDGE' | 'CHAOS';

export interface NotificationMessageItem {
  id: string;
  state: NotificationState;
  intensity: NotificationIntensity;
  title: string;
  body: string;
}

/**
 * Temporary message pool for PART 2 end-to-end testing.
 * Structured by [State][Intensity] so that Part 3 can drop in all 140 messages seamlessly.
 */
export const TEMPORARY_NOTIFICATION_MESSAGES: Record<
  NotificationState,
  Record<NotificationIntensity, NotificationMessageItem[]>
> = {
  HABIT: {
    CALM: [
      {
        id: 'test_habit_calm_01',
        state: 'HABIT',
        intensity: 'CALM',
        title: 'A fresh start 🐝',
        body: 'A few habits are waiting for you today.',
      },
      {
        id: 'test_habit_calm_02',
        state: 'HABIT',
        intensity: 'CALM',
        title: 'Morning check-in 🌱',
        body: 'Take a moment to check off your daily habits whenever you are ready.',
      },
    ],
    NUDGE: [
      {
        id: 'test_habit_nudge_01',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'Your habits are waiting ⏳',
        body: 'You still have a few habits left today.',
      },
      {
        id: 'test_habit_nudge_02',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'Midday habit reminder 📝',
        body: 'Keep your streak going by completing your scheduled habits.',
      },
    ],
    CHAOS: [
      {
        id: 'test_habit_chaos_01',
        state: 'HABIT',
        intensity: 'CHAOS',
        title: 'The clock is ticking 😱',
        body: 'Your habits are still unfinished tonight!',
      },
      {
        id: 'test_habit_chaos_02',
        state: 'HABIT',
        intensity: 'CHAOS',
        title: 'Habits alert! 🚨',
        body: 'Do not let midnight reset your habit progress.',
      },
    ],
  },

  FOOD: {
    CALM: [
      {
        id: 'test_food_calm_01',
        state: 'FOOD',
        intensity: 'CALM',
        title: 'Food log check-in 🍎',
        body: 'Your nutrition log is ready whenever you are.',
      },
      {
        id: 'test_food_calm_02',
        state: 'FOOD',
        intensity: 'CALM',
        title: 'Fuel your day 🥑',
        body: 'Track your meals when convenient to keep your nutrition targets on point.',
      },
    ],
    NUDGE: [
      {
        id: 'test_food_nudge_01',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: 'Lunchtime logging 🥗',
        body: 'Did you eat recently? Do not forget to log your food in FitBee.',
      },
      {
        id: 'test_food_nudge_02',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: 'Nutrition check 🍳',
        body: 'Your macros are waiting for today’s meal entries.',
      },
    ],
    CHAOS: [
      {
        id: 'test_food_chaos_01',
        state: 'FOOD',
        intensity: 'CHAOS',
        title: 'Empty food log detected 🍽️',
        body: 'Today’s nutrition is looking awfully quiet. Log your meals before bed!',
      },
      {
        id: 'test_food_chaos_02',
        state: 'FOOD',
        intensity: 'CHAOS',
        title: 'Dinner bell ringing! 🔔',
        body: 'Your nutrition score needs your meal logs before the day closes.',
      },
    ],
  },

  WORKOUT: {
    CALM: [
      {
        id: 'test_workout_calm_01',
        state: 'WORKOUT',
        intensity: 'CALM',
        title: 'Today’s workout 🏋️',
        body: 'Your scheduled workout is waiting for you.',
      },
      {
        id: 'test_workout_calm_02',
        state: 'WORKOUT',
        intensity: 'CALM',
        title: 'Ready to train? 💪',
        body: 'You have a workout scheduled today. Warm up whenever you are ready.',
      },
    ],
    NUDGE: [
      {
        id: 'test_workout_nudge_01',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'Workout window is open ⏱️',
        body: 'Your scheduled workout has not been started yet. Time to get moving!',
      },
      {
        id: 'test_workout_nudge_02',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'Time to crush it 🔥',
        body: 'Get those sets logged and keep your training momentum alive.',
      },
    ],
    CHAOS: [
      {
        id: 'test_workout_chaos_01',
        state: 'WORKOUT',
        intensity: 'CHAOS',
        title: 'Workout emergency! ⚡',
        body: 'Your scheduled workout is still waiting! Do not let the day slip by.',
      },
      {
        id: 'test_workout_chaos_02',
        state: 'WORKOUT',
        intensity: 'CHAOS',
        title: 'The iron is calling 🔔',
        body: 'Today was a scheduled workout day. Get in there before it is too late!',
      },
    ],
  },

  HABIT_FOOD: {
    CALM: [
      {
        id: 'test_habit_food_calm_01',
        state: 'HABIT_FOOD',
        intensity: 'CALM',
        title: 'Habits and meals 🍯',
        body: 'Your morning habits and food log are ready for you.',
      },
    ],
    NUDGE: [
      {
        id: 'test_habit_food_nudge_01',
        state: 'HABIT_FOOD',
        intensity: 'NUDGE',
        title: 'Two things left 📝',
        body: 'Your habits and food log are waiting for an update.',
      },
    ],
    CHAOS: [
      {
        id: 'test_habit_food_chaos_01',
        state: 'HABIT_FOOD',
        intensity: 'CHAOS',
        title: 'Habits and nutrition alert 🚨',
        body: 'Neither your habits nor your meals have been finished today!',
      },
    ],
  },

  HABIT_WORKOUT: {
    CALM: [
      {
        id: 'test_habit_workout_calm_01',
        state: 'HABIT_WORKOUT',
        intensity: 'CALM',
        title: 'Training and habits 🐝',
        body: 'You have a workout scheduled and daily habits waiting.',
      },
    ],
    NUDGE: [
      {
        id: 'test_habit_workout_nudge_01',
        state: 'HABIT_WORKOUT',
        intensity: 'NUDGE',
        title: 'Workout and habits waiting ⏳',
        body: 'Your scheduled workout and daily habits are still waiting.',
      },
    ],
    CHAOS: [
      {
        id: 'test_habit_workout_chaos_01',
        state: 'HABIT_WORKOUT',
        intensity: 'CHAOS',
        title: 'Workout and habits unfinished! 💥',
        body: 'Both your workout and your daily habits need attention tonight.',
      },
    ],
  },

  FOOD_WORKOUT: {
    CALM: [
      {
        id: 'test_food_workout_calm_01',
        state: 'FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Fuel and fitness 🥑',
        body: 'Your scheduled workout and food log are ready when you are.',
      },
    ],
    NUDGE: [
      {
        id: 'test_food_workout_nudge_01',
        state: 'FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Workout and food check-in 🏋️',
        body: 'Do not forget your scheduled training and daily food logging.',
      },
    ],
    CHAOS: [
      {
        id: 'test_food_workout_chaos_01',
        state: 'FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: 'Nutrition and workout alert! ⚡',
        body: 'Your workout and nutrition log are both still unfinished today.',
      },
    ],
  },

  HABIT_FOOD_WORKOUT: {
    CALM: [
      {
        id: 'test_all_calm_01',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Good morning! 🐝',
        body: 'Your day is just getting started. Habits, training, and food log are ready.',
      },
    ],
    NUDGE: [
      {
        id: 'test_all_nudge_01',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Daily check-in 📋',
        body: 'Your workout, habits, and nutrition log are all waiting.',
      },
    ],
    CHAOS: [
      {
        id: 'test_all_chaos_01',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: 'Everything is still here 😱',
        body: 'Habits, workout, and nutrition are all still unfinished tonight!',
      },
    ],
  },
};

/**
 * Selects a message for the given state and intensity, rotating to avoid recently sent messages.
 */
export function selectNotificationMessage(
  state: NotificationState,
  intensity: NotificationIntensity,
  recentMessageIds: string[] = []
): NotificationMessageItem {
  const pool = TEMPORARY_NOTIFICATION_MESSAGES[state]?.[intensity] || [];
  if (pool.length === 0) {
    // Fallback if pool is empty
    return {
      id: `fallback_${state.toLowerCase()}_${intensity.toLowerCase()}`,
      state,
      intensity,
      title: 'FitBee Reminder',
      body: 'You have unfinished activities waiting for you in FitBee.',
    };
  }

  // Filter out recently used messages
  const recentSet = new Set(recentMessageIds);
  const unreadPool = pool.filter((msg) => !recentSet.has(msg.id));

  if (unreadPool.length > 0) {
    const randomIndex = Math.floor(Math.random() * unreadPool.length);
    return unreadPool[randomIndex];
  }

  // If all messages in this bucket were recently used, pick the least recently used or random from pool
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
