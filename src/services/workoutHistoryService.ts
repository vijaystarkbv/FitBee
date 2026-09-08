import { supabase } from './supabaseClient';
import { MasterExercise } from '../types/database.types';
import {
  getUserTemplateVersions,
  getActiveTemplateVersionForDateSync,
  getEffectiveScheduleForDateSync,
} from './workoutTemplateVersionService';

export type WorkoutDayStatus = 'COMPLETED' | 'MISSED' | 'REST' | 'EXTRA' | 'NONE';

export interface SetDataItem {
  setNumber: number;
  weight?: number;
  reps?: number;
  seconds?: number;
}

export interface ExercisePerformanceComparison {
  exerciseId: string;
  exerciseName: string;
  category: string;
  trackingType: 'reps' | 'timer';
  isWeighted: boolean;
  previousScore: number;
  currentScore: number;
  performancePct: number;
  classification: 'improved' | 'neutral' | 'decreased';
  displayText: string;
  currentSummary: string;
  previousSummary: string;
  changeExplanation: string;
  prevSetsList: SetDataItem[];
  currSetsList: SetDataItem[];
  historicalTrend?: number[];
}


export interface DayPerformancePoint {
  dateStr: string;
  dayName: string;
  dayOfWeek: number; // 0=Sun, 1=Mon...
  dayLabel: string; // 'M', 'T', 'W', etc.
  performancePct: number;
  comparableExerciseCount: number;
  isComparable: boolean;
  exerciseNames: string[];
}

export interface DayWorkoutSummary {
  date: Date;
  dateStr: string;
  dayLabel: string; // M, T, W, TH, F, S, SU
  fullDayName: string;
  isPlanned: boolean;
  isCompleted: boolean;
  isExtra: boolean;
  isPastOrToday: boolean;
  status: WorkoutDayStatus;
  log: any | null;
}

export interface WorkoutWeekAnalysis {
  monday: Date;
  sunday: Date;
  dateRangeLabel: string;
  days: DayWorkoutSummary[];
  plannedDaysCount: number;
  completedPlannedCount: number;
  extraWorkoutsCount: number;
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  dayPoints: DayPerformancePoint[];
  hasComparableData: boolean;
  isBaselineOnly: boolean;
  improvedCount: number;
  neutralCount: number;
  decreasedCount: number;
  exerciseComparisons: ExercisePerformanceComparison[];
}

export interface MonthlyWorkoutSummary {
  year: number;
  month: number;
  monthLabel: string;
  workoutsCompleted: number;
  plannedWorkouts: number;
  completionRate: number;
  exercisesPerformed: number;
  setsCompleted: number;
  dailyMap: Record<string, { status: WorkoutDayStatus; log: any | null; isPlanned: boolean }>;
}

const SHORT_WEEKDAY_LABELS = ['SU', 'M', 'T', 'W', 'TH', 'F', 'S'];
const FULL_WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Format a Date object to 'YYYY-MM-DD'
 */
export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets Monday-to-Sunday boundaries for any date.
 */
export function getWeekBoundaries(centerDate: Date): { monday: Date; sunday: Date; days: Date[] } {
  const d = new Date(centerDate.getFullYear(), centerDate.getMonth(), centerDate.getDate());
  const dayOfWeek = d.getDay();
  // Monday is 1; if Sunday (0), diff is -6
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(d);
  monday.setDate(d.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    day.setHours(0, 0, 0, 0);
    days.push(day);
  }

  const sunday = new Date(days[6]);
  sunday.setHours(23, 59, 59, 999);

  return { monday, sunday, days };
}

/**
 * Format date range label: "Sep 1 – Sep 7" or "Aug 31 – Sep 6, 2026"
 */
export function formatWeekDateRange(monday: Date, sunday: Date, includeYear = false): string {
  const startMonth = monday.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = sunday.toLocaleDateString('en-US', { month: 'short' });
  const yearStr = sunday.getFullYear();

  if (startMonth === endMonth) {
    return includeYear
      ? `${startMonth} ${monday.getDate()} – ${sunday.getDate()}, ${yearStr}`
      : `${startMonth} ${monday.getDate()} – ${sunday.getDate()}`;
  }
  return includeYear
    ? `${startMonth} ${monday.getDate()} – ${endMonth} ${sunday.getDate()}, ${yearStr}`
    : `${startMonth} ${monday.getDate()} – ${endMonth} ${sunday.getDate()}`;
}

/**
 * Fetch the user's current planned template schedule (enabled weekday names like ['Monday', 'Wednesday', 'Friday']).
 * Returns empty array [] if user has not created any workout templates.
 */
export async function fetchUserPlannedSchedule(userId: string): Promise<string[]> {
  if (!userId) return [];
  try {
    const { data: templates, error } = await supabase
      .from('workout_templates')
      .select('id, name, workout_template_days(id, day_name, is_enabled)')
      .eq('user_id', userId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error || !templates || templates.length === 0) {
      return []; // NO TEMPLATE = NO WORKOUT SCHEDULE = NO PLANNED DAYS
    }

    const activeTemplate = templates[0];
    const enabledDays: string[] = [];
    (activeTemplate.workout_template_days || []).forEach((d: any) => {
      if (d.is_enabled && d.day_name) {
        enabledDays.push(d.day_name.trim());
      }
    });

    return enabledDays;
  } catch (err) {
    console.error('Failed to fetch user planned schedule:', err);
    return [];
  }
}

/**
 * Fetch the user's historical planned template schedule effective on a specific date.
 * Returns empty array [] if no template was effective on that date.
 */
export async function fetchUserPlannedScheduleForDate(
  userId: string,
  targetDate: Date | string
): Promise<string[]> {
  if (!userId || !targetDate) return [];
  const versions = await getUserTemplateVersions(userId);
  return getEffectiveScheduleForDateSync(userId, targetDate, versions);
}

/**
 * Fetch workout logs with all sets for a given date range.
 */
export async function fetchWorkoutLogsForRange(
  userId: string,
  startDateStr: string,
  endDateStr: string
): Promise<any[]> {
  try {
    // Buffer query range by 1 day on either side to safely encompass all timezones
    const [sYear, sMonth, sDay] = startDateStr.split('-').map(Number);
    const paddedStart = new Date(sYear, sMonth - 1, sDay - 1);
    const paddedStartStr = formatDateKey(paddedStart);

    const [eYear, eMonth, eDay] = endDateStr.split('-').map(Number);
    const paddedEnd = new Date(eYear, eMonth - 1, eDay + 1);
    const paddedEndStr = formatDateKey(paddedEnd);

    const { data, error } = await supabase
      .from('workout_logs')
      .select(`
        *,
        workout_log_sets (
          id,
          exercise_id,
          exercise_name,
          set_number,
          weight_kg,
          reps_completed,
          duration_seconds
        )
      `)
      .eq('user_id', userId)
      .gte('start_time', `${paddedStartStr}T00:00:00.000Z`)
      .lte('start_time', `${paddedEndStr}T23:59:59.999Z`)
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching workout logs range:', error);
      return [];
    }

    // Filter in memory using local calendar date so timezone offsets never clip records
    return (data || []).filter((log) => {
      if (!log.start_time) return false;
      const logLocalDate = formatDateKey(new Date(log.start_time));
      return logLocalDate >= startDateStr && logLocalDate <= endDateStr;
    });
  } catch (err) {
    console.error('Failed to fetch workout logs range:', err);
    return [];
  }
}

/**
 * Fetch all master exercises for tracking_type lookup
 */
export async function fetchMasterExercisesMap(): Promise<Record<string, MasterExercise>> {
  try {
    const { data } = await supabase.from('master_exercises').select('*');
    const map: Record<string, MasterExercise> = {};
    (data || []).forEach((ex: any) => {
      map[ex.id] = ex;
      if (ex.exercise_name) {
        map[ex.exercise_name.toLowerCase().trim()] = ex;
      }
    });
    return map;
  } catch (err) {
    console.error('Failed to load master exercises map:', err);
    return {};
  }
}

/**
 * Weighted exercise performance score:
 * Sum of Epley estimated 1RM across valid sets:
 * Performance Score = Σ weight × (1 + reps / 30)
 */
export function calculateWeightedExerciseScore(sets: any[]): number {
  let score = 0;
  for (const s of sets) {
    const weight = Number(s.weight_kg) || 0;
    const reps = Number(s.reps_completed) || 0;
    if (weight > 0 && reps > 0) {
      score += weight * (1 + reps / 30);
    }
  }
  return score;
}

/**
 * Rep-based exercise performance score:
 * Sum of total reps across valid sets.
 */
export function calculateRepExerciseScore(sets: any[]): number {
  let totalReps = 0;
  for (const s of sets) {
    const reps = Number(s.reps_completed) || 0;
    if (reps > 0) {
      totalReps += reps;
    }
  }
  return totalReps;
}

/**
 * Timed exercise performance score:
 * Sum of total duration seconds across valid sets.
 */
export function calculateTimedExerciseScore(sets: any[]): number {
  let totalSec = 0;
  for (const s of sets) {
    const sec = Number(s.duration_seconds) || 0;
    if (sec > 0) {
      totalSec += sec;
    }
  }
  return totalSec;
}

/**
 * Compute performance score for an exercise's completed sets.
 */
export function calculateExercisePerformanceScore(
  sets: any[],
  trackingType: 'reps' | 'timer',
  isWeighted: boolean
): number {
  if (!sets || sets.length === 0) return 0;
  if (trackingType === 'timer') {
    return calculateTimedExerciseScore(sets);
  }
  if (isWeighted) {
    const weightedScore = calculateWeightedExerciseScore(sets);
    if (weightedScore > 0) return weightedScore;
  }
  return calculateRepExerciseScore(sets);
}

/**
 * Generate human-readable summary string for sets (e.g. "3 sets · 54 reps" or "12 kg · 3 sets · 10 reps")
 */
export function formatSetsSummary(
  sets: any[],
  trackingType: 'reps' | 'timer',
  isWeighted: boolean
): string {
  if (!sets || sets.length === 0) return '0 sets';
  const setCount = sets.length;

  if (trackingType === 'timer') {
    const totalSec = calculateTimedExerciseScore(sets);
    if (totalSec >= 60) {
      const mins = Math.floor(totalSec / 60);
      const remSec = totalSec % 60;
      return remSec > 0 ? `${setCount} sets · ${mins}m ${remSec}s` : `${setCount} sets · ${mins} min`;
    }
    return `${setCount} sets · ${totalSec} sec`;
  }

  if (isWeighted) {
    const weights = sets.map((s) => Number(s.weight_kg) || 0).filter((w) => w > 0);
    const avgWeight = weights.length > 0 ? Math.round((weights.reduce((a, b) => a + b, 0) / weights.length) * 10) / 10 : 0;
    const reps = sets.map((s) => Number(s.reps_completed) || 0).filter((r) => r > 0);
    const avgReps = reps.length > 0 ? Math.round(reps.reduce((a, b) => a + b, 0) / reps.length) : 0;
    if (avgWeight > 0) {
      return `${avgWeight} kg · ${setCount} sets · ${avgReps} reps`;
    }
  }

  const totalReps = calculateRepExerciseScore(sets);
  return `${setCount} sets · ${totalReps} reps`;
}

/**
 * Generate human-readable explanation of actual performance change (reps, weight, timer, sets)
 */
export function generateExerciseChangeExplanation(
  prevSets: any[],
  currSets: any[],
  trackingType: 'reps' | 'timer',
  isWeighted: boolean,
  classification: 'improved' | 'neutral' | 'decreased'
): string {
  if (classification === 'neutral') {
    return '→ Essentially unchanged';
  }

  // 1. Timer-based
  if (trackingType === 'timer') {
    const prevTotal = calculateTimedExerciseScore(prevSets);
    const currTotal = calculateTimedExerciseScore(currSets);
    const deltaSec = currTotal - prevTotal;
    const deltaSets = currSets.length - prevSets.length;
    let prefix = '';
    if (deltaSets !== 0) {
      prefix = `${deltaSets > 0 ? '↑ +' : '↓ '}${deltaSets} ${Math.abs(deltaSets) === 1 ? 'set' : 'sets'} · `;
    }
    if (deltaSec > 0) {
      return `${prefix}↑ +${deltaSec} total seconds vs previous week`;
    } else if (deltaSec < 0) {
      return `${prefix}↓ -${Math.abs(deltaSec)} total seconds vs previous week`;
    }
    return prefix ? prefix.replace(/ · $/, '') : '→ Essentially unchanged';
  }

  // 2. Weighted exercises
  if (isWeighted) {
    const prevWeights = prevSets.map((s) => Number(s.weight_kg) || 0).filter((w) => w > 0);
    const currWeights = currSets.map((s) => Number(s.weight_kg) || 0).filter((w) => w > 0);
    const prevAvgWeight = prevWeights.length > 0 ? prevWeights.reduce((a, b) => a + b, 0) / prevWeights.length : 0;
    const currAvgWeight = currWeights.length > 0 ? currWeights.reduce((a, b) => a + b, 0) / currWeights.length : 0;
    const deltaWeight = Math.round((currAvgWeight - prevAvgWeight) * 10) / 10;

    const prevReps = calculateRepExerciseScore(prevSets);
    const currReps = calculateRepExerciseScore(currSets);
    const deltaReps = currReps - prevReps;
    const deltaSets = currSets.length - prevSets.length;

    if (deltaWeight > 0 && deltaReps > 0) {
      return `↑ +${deltaWeight} kg · +${deltaReps} total reps`;
    }
    if (deltaWeight > 0 && deltaReps === 0) {
      return `↑ +${deltaWeight} kg at the same reps`;
    }
    if (deltaWeight > 0 && deltaReps < 0) {
      return `↑ Higher working weight: +${deltaWeight} kg · ↓ -${Math.abs(deltaReps)} reps`;
    }
    if (deltaWeight === 0 && deltaReps > 0) {
      if (currSets.length === prevSets.length && deltaReps % currSets.length === 0) {
        return `↑ +${deltaReps / currSets.length} reps per set at the same weight`;
      }
      return `↑ +${deltaReps} total reps at the same weight`;
    }
    if (deltaWeight < 0 && deltaReps < 0) {
      return `↓ -${Math.abs(deltaWeight)} kg · -${Math.abs(deltaReps)} reps`;
    }
    if (deltaWeight < 0 && deltaReps >= 0) {
      return `↓ -${Math.abs(deltaWeight)} kg${deltaReps > 0 ? ` · +${deltaReps} reps` : ' at same reps'}`;
    }
    if (deltaWeight === 0 && deltaReps < 0) {
      if (currSets.length === prevSets.length && Math.abs(deltaReps) % currSets.length === 0) {
        return `↓ -${Math.abs(deltaReps) / currSets.length} reps per set vs previous week`;
      }
      return `↓ -${Math.abs(deltaReps)} total reps vs previous week`;
    }
    if (deltaSets !== 0) {
      return `${deltaSets > 0 ? '↑ +' : '↓ '}${deltaSets} ${Math.abs(deltaSets) === 1 ? 'set' : 'sets'}`;
    }
    return '→ Essentially unchanged';
  }

  // 3. Bodyweight / Rep-based
  const prevReps = calculateRepExerciseScore(prevSets);
  const currReps = calculateRepExerciseScore(currSets);
  const deltaReps = currReps - prevReps;
  const deltaSets = currSets.length - prevSets.length;

  if (deltaSets !== 0) {
    const setWord = Math.abs(deltaSets) === 1 ? 'set' : 'sets';
    const setPart = `${deltaSets > 0 ? '↑ +' : '↓ '}${deltaSets} ${setWord}`;
    if (deltaReps !== 0) {
      return `${setPart} · ${deltaReps > 0 ? '+' : '-'}${Math.abs(deltaReps)} total reps`;
    }
    return setPart;
  }

  if (deltaReps > 0) {
    if (currSets.length === prevSets.length && deltaReps % currSets.length === 0) {
      return `↑ +${deltaReps / currSets.length} reps per set vs previous week`;
    }
    return `↑ +${deltaReps} total reps vs previous week`;
  } else if (deltaReps < 0) {
    if (currSets.length === prevSets.length && Math.abs(deltaReps) % currSets.length === 0) {
      return `↓ -${Math.abs(deltaReps) / currSets.length} reps per set vs previous week`;
    }
    return `↓ -${Math.abs(deltaReps)} total reps vs previous week`;
  }

  return '→ Essentially unchanged';
}

/**
 * Compare two sets of exercise logs between weeks.
 * Returns relative percentage: (currentScore / previousScore) * 100
 */
export function compareExercisePerformance(
  prevSets: any[],
  currSets: any[],
  exerciseName: string,
  exerciseId: string,
  category: string,
  trackingType: 'reps' | 'timer'
): ExercisePerformanceComparison | null {
  if (!prevSets || prevSets.length === 0 || !currSets || currSets.length === 0) {
    return null; // No valid comparison possible
  }

  const hasWeight =
    currSets.some((s) => Number(s.weight_kg) > 0) || prevSets.some((s) => Number(s.weight_kg) > 0);
  const isWeighted = trackingType === 'reps' && hasWeight;

  const prevScore = calculateExercisePerformanceScore(prevSets, trackingType, isWeighted);
  const currScore = calculateExercisePerformanceScore(currSets, trackingType, isWeighted);

  if (prevScore <= 0 || currScore <= 0) {
    return null;
  }

  const performancePct = Math.round((currScore / prevScore) * 100);
  const diffPct = performancePct - 100;

  let classification: 'improved' | 'neutral' | 'decreased' = 'neutral';
  let displayText = '→ No significant change';

  if (diffPct >= 3) {
    classification = 'improved';
    displayText = isWeighted ? `↑ ${diffPct}% performance` : `↑ ${diffPct}% vs previous week`;
  } else if (diffPct <= -3) {
    classification = 'decreased';
    displayText = isWeighted ? `↓ ${Math.abs(diffPct)}% performance` : `↓ ${Math.abs(diffPct)}% vs previous week`;
  }

  const changeExplanation = generateExerciseChangeExplanation(
    prevSets,
    currSets,
    trackingType,
    isWeighted,
    classification
  );

  const prevSetsList: SetDataItem[] = (prevSets || []).map((s, idx) => ({
    setNumber: s.set_number || idx + 1,
    weight: Number(s.weight_kg) > 0 ? Number(s.weight_kg) : undefined,
    reps: Number(s.reps_completed) > 0 ? Number(s.reps_completed) : undefined,
    seconds: Number(s.duration_seconds) > 0 ? Number(s.duration_seconds) : undefined,
  }));

  const currSetsList: SetDataItem[] = (currSets || []).map((s, idx) => ({
    setNumber: s.set_number || idx + 1,
    weight: Number(s.weight_kg) > 0 ? Number(s.weight_kg) : undefined,
    reps: Number(s.reps_completed) > 0 ? Number(s.reps_completed) : undefined,
    seconds: Number(s.duration_seconds) > 0 ? Number(s.duration_seconds) : undefined,
  }));

  return {
    exerciseId,
    exerciseName,
    category,
    trackingType,
    isWeighted,
    previousScore: Math.round(prevScore * 10) / 10,
    currentScore: Math.round(currScore * 10) / 10,
    performancePct,
    classification,
    displayText,
    changeExplanation,
    prevSetsList,
    currSetsList,
    currentSummary: formatSetsSummary(currSets, trackingType, isWeighted),
    previousSummary: formatSetsSummary(prevSets, trackingType, isWeighted),
  };
}


/**
 * Main weekly workout analysis generator.
 * Respects relative weekly baseline (Week 1 = 100%, Week 2 vs Week 1, Week 3 vs Week 2).
 */
export function calculateWeeklyWorkoutAnalysis(
  currentWeekDays: Date[],
  currentWeekLogs: any[],
  previousWeekLogs: any[],
  plannedWeekdays: string[],
  clockNow: Date,
  masterMap: Record<string, MasterExercise> = {}
): WorkoutWeekAnalysis {
  const monday = currentWeekDays[0];
  const sunday = currentWeekDays[6];
  const dateRangeLabel = formatWeekDateRange(monday, sunday, false);

  const clockDateStr = formatDateKey(clockNow);

  // Filter logs to valid workout sessions that actually recorded completed sets
  const validCurrentLogs = currentWeekLogs.filter(
    (l) => l.workout_log_sets && l.workout_log_sets.length > 0
  );
  const validPreviousLogs = previousWeekLogs.filter(
    (l) => l.workout_log_sets && l.workout_log_sets.length > 0
  );

  // Group current valid logs by date string
  const currLogsByDate: Record<string, any[]> = {};
  validCurrentLogs.forEach((log) => {
    if (log.start_time) {
      const key = formatDateKey(new Date(log.start_time));
      if (!currLogsByDate[key]) currLogsByDate[key] = [];
      currLogsByDate[key].push(log);
    }
  });

  // Build daily summaries for Monday to Sunday
  let plannedCount = 0;
  let completedPlannedCount = 0;
  let extraWorkoutsCount = 0;
  let totalWorkouts = 0;

  const daySummaries: DayWorkoutSummary[] = currentWeekDays.map((d) => {
    const dateStr = formatDateKey(d);
    const dayOfWeek = d.getDay();
    const fullDayName = FULL_WEEKDAY_NAMES[dayOfWeek];
    const dayLabel = SHORT_WEEKDAY_LABELS[dayOfWeek];

    const isPlanned = plannedWeekdays.includes(fullDayName);
    if (isPlanned) plannedCount++;

    const logsForDay = currLogsByDate[dateStr] || [];
    const hasWorkout = logsForDay.length > 0;
    const isPastOrToday = dateStr <= clockDateStr;

    let isCompleted = false;
    let isExtra = false;
    let status: WorkoutDayStatus = 'REST';

    if (hasWorkout) {
      totalWorkouts += logsForDay.length;
      // Check if any log is an extra workout
      const isMarkedExtra = logsForDay.some(
        (l) => l.day_name === 'Extra Workout' || (!l.template_day_id && !isPlanned)
      );

      if (isMarkedExtra || !isPlanned) {
        isExtra = true;
        status = 'EXTRA';
        extraWorkoutsCount++;
      } else {
        isCompleted = true;
        status = 'COMPLETED';
        completedPlannedCount++;
      }
    } else {
      if (isPlanned && isPastOrToday) {
        status = 'MISSED';
      } else {
        status = 'REST';
      }
    }

    return {
      date: d,
      dateStr,
      dayLabel,
      fullDayName,
      isPlanned,
      isCompleted,
      isExtra,
      isPastOrToday,
      status,
      log:
        logsForDay.length > 0
          ? {
              ...(logsForDay.find((l) => l.workout_log_sets && l.workout_log_sets.length > 0) || logsForDay[0]),
              workout_log_sets: logsForDay.flatMap((l) => l.workout_log_sets || []),
            }
          : null,
    };
  });

  // Group all sets by exercise for current week
  const currSetsByEx: Record<string, { exerciseName: string; sets: any[] }> = {};
  let totalExercisesSet = new Set<string>();
  let totalSetsCount = 0;

  validCurrentLogs.forEach((l) => {
    (l.workout_log_sets || []).forEach((s: any) => {
      totalSetsCount++;
      const exName = s.exercise_name || 'Exercise';
      totalExercisesSet.add(exName);
      if (!currSetsByEx[exName]) {
        currSetsByEx[exName] = { exerciseName: exName, sets: [] };
      }
      currSetsByEx[exName].sets.push(s);
    });
  });

  // Group all sets by exercise for previous week
  const prevSetsByEx: Record<string, { exerciseName: string; sets: any[] }> = {};
  validPreviousLogs.forEach((l) => {
    (l.workout_log_sets || []).forEach((s: any) => {
      const exName = s.exercise_name || 'Exercise';
      if (!prevSetsByEx[exName]) {
        prevSetsByEx[exName] = { exerciseName: exName, sets: [] };
      }
      prevSetsByEx[exName].sets.push(s);
    });
  });

  // Compare each exercise between previous and current week
  const exerciseComparisons: ExercisePerformanceComparison[] = [];
  let improvedCount = 0;
  let neutralCount = 0;
  let decreasedCount = 0;

  Object.keys(currSetsByEx).forEach((exName) => {
    const currData = currSetsByEx[exName];
    const prevData = prevSetsByEx[exName];

    if (!prevData || prevData.sets.length === 0) {
      // New exercise or no prior comparison: exclude from comparison, NEVER 0%!
      return;
    }

    // Resolve master exercise metadata
    const lowerName = exName.toLowerCase().trim();
    const masterEx = masterMap[lowerName];
    const trackingType = masterEx?.tracking_type || 'reps';
    const category = masterEx?.exercise_category || 'Training';
    const exId = masterEx?.id || exName;

    const comp = compareExercisePerformance(
      prevData.sets,
      currData.sets,
      exName,
      exId,
      category,
      trackingType
    );

    if (comp) {
      exerciseComparisons.push(comp);
      if (comp.classification === 'improved') improvedCount++;
      else if (comp.classification === 'neutral') neutralCount++;
      else if (comp.classification === 'decreased') decreasedCount++;
    }
  });

  // Calculate day performance points:
  // "one point per comparable workout day"
  // Each workout day gets ONE point by averaging comparable exercises on that day.
  const isBaselineOnly = validPreviousLogs.length === 0;
  const dayPoints: DayPerformancePoint[] = [];

  currentWeekDays.forEach((d) => {
    const dateStr = formatDateKey(d);
    const dayOfWeek = d.getDay();
    const dayLabel = SHORT_WEEKDAY_LABELS[dayOfWeek];
    const logsForDay = currLogsByDate[dateStr] || [];


    if (logsForDay.length === 0) {
      // Rest or non-workout day: no point generated
      return;
    }

    // Collect all sets for this specific day
    const daySetsByEx: Record<string, any[]> = {};
    logsForDay.forEach((l) => {
      (l.workout_log_sets || []).forEach((s: any) => {
        const name = s.exercise_name || 'Exercise';
        if (!daySetsByEx[name]) daySetsByEx[name] = [];
        daySetsByEx[name].push(s);
      });
    });

    const dayExNames = Object.keys(daySetsByEx);
    if (dayExNames.length === 0) return;

    if (isBaselineOnly) {
      // Week 1 (no prior week): establishes 100% baseline
      dayPoints.push({
        dateStr,
        dayName: FULL_WEEKDAY_NAMES[dayOfWeek],
        dayOfWeek,
        dayLabel,
        performancePct: 100,
        comparableExerciseCount: dayExNames.length,
        isComparable: true,
        exerciseNames: dayExNames,
      });
      return;
    }

    // Calculate performance for each comparable exercise performed today
    const dayPcts: number[] = [];
    dayExNames.forEach((name) => {
      const prev = prevSetsByEx[name];
      if (prev && prev.sets.length > 0) {
        const lowerName = name.toLowerCase().trim();
        const masterEx = masterMap[lowerName];
        const trackingType = masterEx?.tracking_type || 'reps';
        const hasWeight =
          daySetsByEx[name].some((s) => Number(s.weight_kg) > 0) ||
          prev.sets.some((s) => Number(s.weight_kg) > 0);
        const isWeighted = trackingType === 'reps' && hasWeight;

        const prevScore = calculateExercisePerformanceScore(prev.sets, trackingType, isWeighted);
        const currScore = calculateExercisePerformanceScore(daySetsByEx[name], trackingType, isWeighted);

        if (prevScore > 0 && currScore > 0) {
          const pct = Math.round((currScore / prevScore) * 100);
          dayPcts.push(pct);
        }
      }
    });

    // If there is at least one comparable exercise, plot the day's average point
    if (dayPcts.length > 0) {
      const avgDayPct = Math.round(dayPcts.reduce((a, b) => a + b, 0) / dayPcts.length);
      dayPoints.push({
        dateStr,
        dayName: FULL_WEEKDAY_NAMES[dayOfWeek],
        dayOfWeek,
        dayLabel,
        performancePct: avgDayPct,
        comparableExerciseCount: dayPcts.length,
        isComparable: true,
        exerciseNames: dayExNames,
      });
    }
  });

  const hasComparableData = dayPoints.length > 0;

  return {
    monday,
    sunday,
    dateRangeLabel,
    days: daySummaries,
    plannedDaysCount: plannedCount,
    completedPlannedCount,
    extraWorkoutsCount,
    totalWorkouts,
    totalExercises: totalExercisesSet.size,
    totalSets: totalSetsCount,
    dayPoints,
    hasComparableData,
    isBaselineOnly,
    improvedCount,
    neutralCount,
    decreasedCount,
    exerciseComparisons,
  };
}

/**
 * Fetch monthly workout summary and day-by-day calendar data.
 */
export async function fetchMonthlyWorkoutHistory(
  userId: string,
  year: number,
  month: number, // 0-based
  _plannedWeekdays: string[],
  clockNow: Date
): Promise<MonthlyWorkoutSummary> {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startStr = formatDateKey(firstDay);
  const endStr = formatDateKey(lastDay);
  const clockDateStr = formatDateKey(clockNow);

  const monthLabel = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const [logs, versions] = await Promise.all([
    fetchWorkoutLogsForRange(userId, startStr, endStr),
    getUserTemplateVersions(userId),
  ]);

  const logsByDate: Record<string, any[]> = {};
  let totalSetsCount = 0;
  const uniqueExercises = new Set<string>();

  logs.forEach((log) => {
    if (log.start_time) {
      const dateKey = formatDateKey(new Date(log.start_time));
      if (!logsByDate[dateKey]) logsByDate[dateKey] = [];
      logsByDate[dateKey].push(log);
    }
    (log.workout_log_sets || []).forEach((s: any) => {
      totalSetsCount++;
      if (s.exercise_name) uniqueExercises.add(s.exercise_name);
    });
  });

  const daysInMonth = lastDay.getDate();
  let workoutsCompleted = 0;
  let plannedWorkouts = 0;
  const dailyMap: Record<string, { status: WorkoutDayStatus; log: any | null; isPlanned: boolean }> = {};

  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const dateStr = formatDateKey(curDate);
    const dayOfWeek = curDate.getDay();
    const fullDayName = FULL_WEEKDAY_NAMES[dayOfWeek];

    // Determine the template version active on THIS specific calendar date
    const activeVersion = getActiveTemplateVersionForDateSync(userId, curDate, versions);
    const hasActiveTemplate = activeVersion !== null;
    const effectiveSchedule = activeVersion?.scheduled_days || [];

    const isPlanned = hasActiveTemplate && effectiveSchedule.includes(fullDayName);
    const isPastOrToday = dateStr <= clockDateStr;

    if (isPlanned && isPastOrToday) {
      plannedWorkouts++;
    }

    const dayLogs = logsByDate[dateStr] || [];
    const hasWorkout = dayLogs.length > 0;

    let status: WorkoutDayStatus = 'REST';
    if (hasWorkout) {
      workoutsCompleted++;
      const isExtra = dayLogs.some(
        (l) => l.day_name === 'Extra Workout' || (!l.template_day_id && !isPlanned)
      );
      status = isExtra ? 'EXTRA' : 'COMPLETED';
    } else {
      if (!hasActiveTemplate) {
        // A) NO TEMPLATE ACTIVE ON THIS DATE -> BLANK / NEUTRAL (Never missed)
        status = 'NONE';
      } else if (isPlanned && isPastOrToday) {
        // D) TEMPLATE ACTIVE + SCHEDULED + WORKOUT NOT COMPLETED -> MISSED
        status = 'MISSED';
      } else {
        // B) TEMPLATE ACTIVE + NOT A SCHEDULED DAY -> REST
        status = 'REST';
      }
    }

    dailyMap[dateStr] = {
      status,
      log:
        dayLogs.length > 0
          ? {
              ...(dayLogs.find((l) => l.workout_log_sets && l.workout_log_sets.length > 0) || dayLogs[0]),
              workout_log_sets: dayLogs.flatMap((l) => l.workout_log_sets || []),
            }
          : null,
      isPlanned,
    };
  }

  const completionRate =
    plannedWorkouts > 0 ? Math.min(100, Math.round((workoutsCompleted / plannedWorkouts) * 100)) : 100;

  return {
    year,
    month,
    monthLabel,
    workoutsCompleted,
    plannedWorkouts,
    completionRate,
    exercisesPerformed: uniqueExercises.size,
    setsCompleted: totalSetsCount,
    dailyMap,
  };
}

/**
 * Save an Extra Workout session without touching user templates.
 */
export async function saveExtraWorkoutSession(
  userId: string,
  workoutDate: Date,
  durationSeconds: number,
  notes: string | null,
  exerciseSets: Array<{
    exerciseId: string;
    exerciseName: string;
    setNumber: number;
    weightKg: number;
    repsCompleted: number | null;
    durationSeconds: number | null;
  }>
): Promise<any> {
  const startTime = new Date(workoutDate);
  const endTime = new Date(startTime.getTime() + durationSeconds * 1000);

  const { data: newLog, error: logErr } = await supabase
    .from('workout_logs')
    .insert({
      user_id: userId,
      template_id: null,
      template_day_id: null,
      template_name: 'Extra Workout',
      day_name: 'Extra Workout',
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_seconds: durationSeconds,
      status: 'completed',
      notes: notes || 'Extra workout completed',
    })
    .select()
    .single();

  if (logErr) throw logErr;

  if (exerciseSets.length > 0) {
    const rows = exerciseSets.map((s) => ({
      workout_log_id: newLog.id,
      exercise_id: s.exerciseId,
      exercise_name: s.exerciseName,
      set_number: s.setNumber,
      weight_kg: s.weightKg,
      reps_completed: s.repsCompleted,
      duration_seconds: s.durationSeconds,
    }));

    const { error: setsErr } = await supabase.from('workout_log_sets').insert(rows);
    if (setsErr) throw setsErr;
  }

  return newLog;
}
