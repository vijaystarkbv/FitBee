import { supabase } from './supabaseClient';
import { clock } from './clock';
import { Profile } from '../types/database.types';
import {
  getUserNutritionTargets,
  calculateNutritionTargetsScore,
} from './nutritionHistoryService';
import {
  getUserTemplateVersions,
  getActiveTemplateVersionForDateSync,
} from './workoutTemplateVersionService';

export type StreakDayStatus = 'FULL' | 'PARTIAL' | 'MISSED' | 'FROZEN';

export interface DayStreakInfo {
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // M, T, W, TH, F, S, SU
  isToday: boolean;
  isFuture: boolean;
  isStreak: boolean;
  status: StreakDayStatus;
  workoutComplete: boolean;
  nutritionComplete: boolean;
  nutritionScore: number;
  isRestDay: boolean;
  isFrozen: boolean;
}

export interface StreakSummary {
  currentStreak: number;
  longestStreak: number;
  todayIsStreak: boolean;
  todayStatus: StreakDayStatus;
  todayWorkoutComplete: boolean;
  todayNutritionComplete: boolean;
  todayNutritionScore: number;
  todayIsRestDay: boolean;
  weeklyDays: DayStreakInfo[];
  streakMap: Record<string, DayStreakInfo>;
  freezeCount: number;
  frozenDates: string[];
  missedDayEligibleForFreeze: string | null; // Date string of missed day that can be saved by freeze
  consecutivePartialDays: number;
}

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAY_LABELS = ['SU', 'M', 'T', 'W', 'TH', 'F', 'S'];

// Format Date object to YYYY-MM-DD
export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Storage helpers for streak freeze persistence
function getLocalFreezeData(userId: string): {
  freezeCount: number;
  frozenDates: string[];
  milestonesAwarded: number;
  declinedDates: string[];
} {
  try {
    const raw = localStorage.getItem(`fitbee_freeze_data_${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        freezeCount: Number(parsed.freezeCount) || 0,
        frozenDates: Array.isArray(parsed.frozenDates) ? parsed.frozenDates : [],
        milestonesAwarded: Number(parsed.milestonesAwarded) || 0,
        declinedDates: Array.isArray(parsed.declinedDates) ? parsed.declinedDates : [],
      };
    }
  } catch (e) {
    console.warn('Could not parse local freeze data:', e);
  }
  return { freezeCount: 0, frozenDates: [], milestonesAwarded: 0, declinedDates: [] };
}

function saveLocalFreezeData(
  userId: string,
  data: {
    freezeCount: number;
    frozenDates: string[];
    milestonesAwarded: number;
    declinedDates: string[];
  }
) {
  try {
    localStorage.setItem(`fitbee_freeze_data_${userId}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Could not save local freeze data:', e);
  }
}

/**
 * Consumes 1 streak freeze to preserve streak on a missed day
 */
export async function consumeStreakFreeze(
  profile: Profile,
  missedDateStr: string
): Promise<{ success: boolean; newFreezeCount: number }> {
  const userId = profile.id;
  const local = getLocalFreezeData(userId);

  const dbFreezeCount = profile.streak_freeze_count ?? local.freezeCount;
  const dbFrozenDates = profile.frozen_dates ?? local.frozenDates;
  const milestonesAwarded = profile.streak_milestones_awarded ?? local.milestonesAwarded;

  if (dbFreezeCount <= 0) {
    return { success: false, newFreezeCount: 0 };
  }

  const newCount = dbFreezeCount - 1;
  const newFrozenDates = Array.from(new Set([...dbFrozenDates, missedDateStr]));

  // Update local storage
  saveLocalFreezeData(userId, {
    freezeCount: newCount,
    frozenDates: newFrozenDates,
    milestonesAwarded,
    declinedDates: local.declinedDates.filter((d) => d !== missedDateStr),
  });

  // Attempt to update Supabase profiles
  try {
    await supabase
      .from('profiles')
      .update({
        streak_freeze_count: newCount,
        frozen_dates: newFrozenDates,
      })
      .eq('id', userId);
  } catch (err) {
    console.warn('Could not update profile freeze count in Supabase (will use local fallback):', err);
  }

  return { success: true, newFreezeCount: newCount };
}

/**
 * Declines using a streak freeze for a missed day
 */
export async function declineStreakFreeze(profile: Profile, missedDateStr: string): Promise<void> {
  const userId = profile.id;
  const local = getLocalFreezeData(userId);
  const newDeclined = Array.from(new Set([...local.declinedDates, missedDateStr]));

  saveLocalFreezeData(userId, {
    ...local,
    declinedDates: newDeclined,
  });
}

/**
 * Sets workout completion override for testing purposes
 */
export function setWorkoutCompletionForTesting(dateStr: string, complete: boolean | null): void {
  try {
    if (complete === null) {
      localStorage.removeItem(`fitbee_test_workout_${dateStr}`);
    } else {
      localStorage.setItem(`fitbee_test_workout_${dateStr}`, complete ? 'true' : 'false');
    }
  } catch (e) {
    console.warn('Could not set test workout completion:', e);
  }
}

/**
 * Calculates user streak data derived from real Supabase historical logs and application clock.
 * Incorporates target proximity scoring, 4-day partial grace period, and streak freeze rules.
 */
export async function getStreakSummary(profile: Profile): Promise<StreakSummary> {
  const userId = profile.id;
  const now = clock.now();
  const todayStr = formatDateKey(now);

  // Freeze state resolution (Supabase + Local fallback)
  const local = getLocalFreezeData(userId);
  let freezeCount = profile.streak_freeze_count ?? local.freezeCount;
  let frozenDates = profile.frozen_dates ?? local.frozenDates;
  let milestonesAwarded = profile.streak_milestones_awarded ?? local.milestonesAwarded;
  const declinedDates = new Set<string>(local.declinedDates);

  // 1. Fetch user's template versions for historical schedule accuracy
  const templateVersions = await getUserTemplateVersions(userId);

  // 2. Fetch past 60 days of nutrition logs
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - 60);
  const startDateStr = formatDateKey(startDate);

  const { data: nutritionLogs } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDateStr)
    .lte('date', todayStr);

  const nutritionMap: Record<string, any> = {};
  (nutritionLogs || []).forEach((log: any) => {
    nutritionMap[log.date] = log;
  });

  // 3. Fetch past 60 days of workout logs & sets (with 1-day timezone buffer)
  const queryStartDate = new Date(startDate);
  queryStartDate.setDate(queryStartDate.getDate() - 1);
  const queryStartStr = formatDateKey(queryStartDate);

  const { data: workoutLogs } = await supabase
    .from('workout_logs')
    .select('*, workout_log_sets(*)')
    .eq('user_id', userId)
    .gte('start_time', `${queryStartStr}T00:00:00.000Z`)
    .order('start_time', { ascending: true });

  const workoutMap: Record<string, boolean> = {};
  (workoutLogs || []).forEach((log: any) => {
    if (log.start_time) {
      const logDate = formatDateKey(new Date(log.start_time));
      const hasSets = log.workout_log_sets && log.workout_log_sets.length > 0;
      if (hasSets) {
        workoutMap[logDate] = true;
      }
    }
  });

  // Target nutrition values from profile
  const targets = getUserNutritionTargets(profile);

  // 4. Build daily info for past 60 days up to today
  const dailyRawList: {
    date: Date;
    dateStr: string;
    dayLabel: string;
    isToday: boolean;
    isFuture: boolean;
    restDay: boolean;
    workoutComplete: boolean;
    nutritionComplete: boolean;
    nutritionScore: number;
    isFrozen: boolean;
    rawStatus: StreakDayStatus;
  }[] = [];

  for (let i = 60; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateKey(d);
    const isToday = dateStr === todayStr;
    const isFuture = d > now && !isToday;

    // Resolve template version effective on this date
    const activeVersion = getActiveTemplateVersionForDateSync(userId, d, templateVersions);
    const hasActiveTemplate = activeVersion !== null;
    const weekdayName = WEEKDAY_NAMES[d.getDay()].toLowerCase();
    const scheduledDays = (activeVersion?.scheduled_days || []).map((x) => x.toLowerCase());
    const isScheduledWorkoutDay = hasActiveTemplate && scheduledDays.includes(weekdayName);
    const restDay = hasActiveTemplate && !isScheduledWorkoutDay;

    const hasLoggedWorkout = Boolean(workoutMap[dateStr]);

    // Nutrition requirement: overall Nutrition Targets score >= 85%
    const nutLog = nutritionMap[dateStr];
    let nutritionScore = 0;
    let nutritionComplete = false;

    if (nutLog) {
      const scoreResult = calculateNutritionTargetsScore(
        {
          calories: Number(nutLog.total_calories) || 0,
          protein: Number(nutLog.total_protein) || 0,
          carbs: Number(nutLog.total_carbs) || 0,
          fat: Number(nutLog.total_fat) || 0,
        },
        targets
      );
      nutritionScore = scoreResult.overallScore;
      nutritionComplete = scoreResult.isCompleted;
    }

    const isFrozen = frozenDates.includes(dateStr);
    const dayIndex = d.getDay();
    const dayLabel = SHORT_DAY_LABELS[dayIndex];

    // Determine initial daily status
    let status: StreakDayStatus = 'MISSED';

    if (isFrozen) {
      status = 'FROZEN';
    } else if (hasActiveTemplate) {
      if (isScheduledWorkoutDay) {
        // Scheduled workout day: both needed for FULL, either for PARTIAL
        if (hasLoggedWorkout && nutritionComplete) {
          status = 'FULL';
        } else if (hasLoggedWorkout || nutritionComplete) {
          status = 'PARTIAL';
        } else {
          status = 'MISSED';
        }
      } else {
        // Scheduled rest day: completing nutrition satisfies the day (FULL).
        // Extra workout with missed nutrition is PARTIAL.
        // Neither completed is MISSED (no free streak for doing nothing).
        if (nutritionComplete) {
          status = 'FULL';
        } else if (hasLoggedWorkout) {
          status = 'PARTIAL';
        } else {
          status = 'MISSED';
        }
      }
    } else {
      // Prior to template creation: real logged activity counts, no free passes
      if (nutritionComplete) {
        status = 'FULL';
      } else if (hasLoggedWorkout) {
        status = 'PARTIAL';
      } else {
        status = 'MISSED';
      }
    }

    dailyRawList.push({
      date: d,
      dateStr,
      dayLabel,
      isToday,
      isFuture,
      restDay,
      workoutComplete: hasLoggedWorkout || restDay,
      nutritionComplete,
      nutritionScore,
      isFrozen,
      rawStatus: status,
    });
  }

  // 5. Evaluate Chronological Streak & 4-Day Partial Grace
  const streakMap: Record<string, DayStreakInfo> = {};
  let runningStreak = 0;
  let consecutivePartial = 0;
  let longestStreak = 0;
  let missedDayEligibleForFreeze: string | null = null;

  for (let i = 0; i < dailyRawList.length; i++) {
    const item = dailyRawList[i];
    const {
      dateStr,
      dayLabel,
      isToday,
      isFuture,
      restDay,
      workoutComplete,
      nutritionComplete,
      nutritionScore,
      isFrozen,
      rawStatus,
    } = item;

    let status: StreakDayStatus = rawStatus;
    let countsTowardStreak = false;

    if (status === 'FROZEN') {
      countsTowardStreak = true;
      runningStreak++;
      consecutivePartial = 0; // Freeze saves streak and resets partial count
    } else if (status === 'FULL') {
      countsTowardStreak = true;
      runningStreak++;
      consecutivePartial = 0; // Full day resets partial grace counter
    } else if (status === 'PARTIAL') {
      consecutivePartial++;
      if (consecutivePartial <= 4) {
        countsTowardStreak = true;
        runningStreak++;
      } else {
        // 5th consecutive partial day breaks the streak!
        countsTowardStreak = false;
        runningStreak = 0;
        consecutivePartial = 0;
        status = 'MISSED';
      }
    } else {
      // Neither completed -> MISSED
      countsTowardStreak = false;

      // If this was a past day (or yesterday) that broke an active streak, check freeze eligibility
      if (!isToday && runningStreak > 0 && !declinedDates.has(dateStr)) {
        missedDayEligibleForFreeze = dateStr;
      }

      runningStreak = 0;
      consecutivePartial = 0;
    }

    if (runningStreak > longestStreak) {
      longestStreak = runningStreak;
    }

    streakMap[dateStr] = {
      dateStr,
      dayLabel,
      isToday,
      isFuture,
      isStreak: !isFuture && countsTowardStreak,
      status,
      workoutComplete,
      nutritionComplete,
      nutritionScore,
      isRestDay: restDay,
      isFrozen,
    };
  }

  // 6. Current active streak determination
  const todayInfo = streakMap[todayStr];
  let currentStreak = 0;

  // If today is completed (FULL, PARTIAL <= 4, or FROZEN), currentStreak is runningStreak
  // If today is not completed yet (MISSED so far today), check streak up to yesterday!
  if (todayInfo?.isStreak) {
    currentStreak = runningStreak;
  } else {
    // Re-evaluate streak ending at yesterday
    let testStreak = 0;
    for (let i = 0; i < dailyRawList.length - 1; i++) {
      const item = dailyRawList[i];
      const info = streakMap[item.dateStr];
      if (info.isStreak) {
        testStreak++;
      } else {
        testStreak = 0;
      }
    }
    currentStreak = testStreak;
  }

  // 7. Milestone Award System: 1 freeze per 25 completed streak days
  const effectiveMaxStreak = Math.max(currentStreak, longestStreak);
  const totalMilestonesEarned = Math.floor(effectiveMaxStreak / 25);
  if (totalMilestonesEarned > milestonesAwarded) {
    const newAwarded = totalMilestonesEarned - milestonesAwarded;
    freezeCount += newAwarded;
    milestonesAwarded = totalMilestonesEarned;

    // Persist new freeze counts
    saveLocalFreezeData(userId, {
      freezeCount,
      frozenDates,
      milestonesAwarded,
      declinedDates: Array.from(declinedDates),
    });

    try {
      supabase
        .from('profiles')
        .update({
          streak_freeze_count: freezeCount,
          streak_milestones_awarded: milestonesAwarded,
        })
        .eq('id', userId)
        .then();
    } catch (e) {
      // Ignored if column missing
    }
  }

  // Determine if missed day should trigger freeze prompt modal
  // Eligible if: freezeCount > 0, missedDay is identified, and wasn't declined
  const eligiblePrompt =
    freezeCount > 0 &&
    missedDayEligibleForFreeze !== null &&
    !declinedDates.has(missedDayEligibleForFreeze)
      ? missedDayEligibleForFreeze
      : null;

  // 8. Build current week's 7 days (Monday to Sunday)
  const currentDayOfWeek = now.getDay();
  const distanceToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
  const mondayDate = new Date(now);
  mondayDate.setDate(mondayDate.getDate() - distanceToMonday);

  const weeklyDays: DayStreakInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const wDate = new Date(mondayDate);
    wDate.setDate(wDate.getDate() + i);
    const dateStr = formatDateKey(wDate);
    const dayIndex = wDate.getDay();
    const dayLabel = SHORT_DAY_LABELS[dayIndex];
    const isToday = dateStr === todayStr;
    const isFuture = wDate > now && !isToday;

    const existing = streakMap[dateStr];
    if (existing) {
      weeklyDays.push(existing);
    } else {
      const wVersion = getActiveTemplateVersionForDateSync(userId, wDate, templateVersions);
      const hasWTemplate = wVersion !== null;
      const wWeekday = WEEKDAY_NAMES[wDate.getDay()].toLowerCase();
      const wIsScheduled = hasWTemplate && (wVersion.scheduled_days || []).map(x => x.toLowerCase()).includes(wWeekday);
      const restDay = hasWTemplate && !wIsScheduled;
      weeklyDays.push({
        dateStr,
        dayLabel,
        isToday,
        isFuture,
        isStreak: false,
        status: 'MISSED',
        workoutComplete: restDay,
        nutritionComplete: false,
        nutritionScore: 0,
        isRestDay: restDay,
        isFrozen: false,
      });
    }
  }

  return {
    currentStreak,
    longestStreak,
    todayIsStreak: Boolean(todayInfo?.isStreak),
    todayStatus: todayInfo?.status || 'MISSED',
    todayWorkoutComplete: Boolean(todayInfo?.workoutComplete),
    todayNutritionComplete: Boolean(todayInfo?.nutritionComplete),
    todayNutritionScore: todayInfo?.nutritionScore || 0,
    todayIsRestDay: Boolean(todayInfo?.isRestDay),
    weeklyDays,
    streakMap,
    freezeCount,
    frozenDates,
    missedDayEligibleForFreeze: eligiblePrompt,
    consecutivePartialDays: consecutivePartial,
  };
}
