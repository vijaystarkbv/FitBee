import { supabase } from './supabaseClient';
import { NutritionLog, MealEntry, Profile } from '../types/database.types';
import { getActiveTargetForDateSync } from './nutritionTargetService';

export interface UserNutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export type NutritionDayStatus = 'HIT_MOST' | 'PARTIAL' | 'MISSED' | 'NO_LOG';

export interface DayStatusDetails {
  status: NutritionDayStatus;
  label: string;
  color: string;
  bgTint: string;
  borderTint: string;
}

export interface DayMacroSummary {
  date: Date;
  dateStr: string; // YYYY-MM-DD
  dayLabel: string; // M, T, W, TH, F, S, SU
  fullDayName: string; // Monday, Tuesday...
  log: NutritionLog | null;
  statusDetails: DayStatusDetails;
}

export interface WeekSummary {
  weekIndex: number; // 1-based index in month
  label: string; // e.g. "Week 1: Sep 1 – Sep 6"
  startDate: Date;
  endDate: Date;
  days: DayMacroSummary[];
  hasLogs: boolean;
  loggedCount: number;
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  calPercent: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

export interface WeeklyAverages {
  hasLogs: boolean;
  loggedCount: number;
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  calPercent: number;
  proteinPercent: number;
  carbsPercent: number;
  fatPercent: number;
}

export type AdherenceClassification = 'HIGH_ADHERENCE' | 'PARTIAL_ADHERENCE' | 'LOW_ADHERENCE' | 'INSUFFICIENT_DATA';

export interface WeeklyAdherenceSummary {
  weekIndex: number;
  weekLabel: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysLogged: number;
  daysInWeek: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  actualAvgCalories: number;
  actualAvgProtein: number;
  actualAvgCarbs: number;
  actualAvgFat: number;
  calorieAdherenceRatio: number;
  proteinAdherenceRatio: number;
  carbsAdherenceRatio: number;
  fatAdherenceRatio: number;
  adherencePercentStr: string;
  classification: AdherenceClassification;
}

const SHORT_DAY_LABELS = ['SU', 'M', 'T', 'W', 'TH', 'F', 'S'];
const FULL_DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Formats a Date object to YYYY-MM-DD string
 */
export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Strict target resolution rule:
 * - If dateStr is provided and user has historical target versions, resolves target active on that date.
 * - If user has completed onboarding, ALWAYS use the values from profile.
 * - Only if onboarding was NOT completed, use preset onboarding defaults.
 */
export function getUserNutritionTargets(profile: Profile, dateStr?: string): UserNutritionTargets {
  if (profile?.id && dateStr) {
    const versioned = getActiveTargetForDateSync(profile.id, dateStr, profile);
    return {
      calories: versioned.calories,
      protein: versioned.protein,
      carbs: versioned.carbs,
      fat: versioned.fat,
    };
  }

  if (profile.onboarding_completed) {
    return {
      calories: Number(profile.target_calories) || 0,
      protein: Number(profile.target_protein) || 0,
      carbs: Number(profile.target_carbs) || 0,
      fat: Number(profile.target_fat) || 0,
    };
  }

  return {
    calories: Number(profile.target_calories) || 2500,
    protein: Number(profile.target_protein) || 140,
    carbs: Number(profile.target_carbs) || 320,
    fat: Number(profile.target_fat) || 65,
  };
}

/**
 * Calculates Monday 00:00:00 and Sunday 23:59:59 around referenceDate
 */
export function getWeekBoundaries(referenceDate: Date): { monday: Date; sunday: Date; days: Date[] } {
  const d = new Date(referenceDate);
  const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday, 0, 0, 0, 0);
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59, 999);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    days.push(dayDate);
  }

  return { monday, sunday, days };
}

/**
 * Threshold for a day to qualify as Nutrition Targets completed for streak and consistency purposes.
 * Centralized constant as required by system design.
 */
export const NUTRITION_TARGET_COMPLETION_THRESHOLD = 85;

/**
 * Calculates deterministic proximity score (0-100%) for a single nutrient metric.
 * Uses target proximity rather than "more is always better":
 * - If intake <= target: score = round((actual / target) * 100)
 * - If intake > target: penalize overshoot symmetrically: max(0, round((1 - (ratio - 1)) * 100))
 * Example: 90% intake -> 90%. 110% intake -> 90%. 150% intake -> 50%. 200% intake -> 0%.
 */
export function calculateMetricProximityScore(actual: number, target: number): number {
  if (target <= 0) {
    return actual === 0 ? 100 : 0;
  }
  const ratio = actual / target;
  if (ratio <= 1.0) {
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
  }
  const overshoot = ratio - 1.0;
  return Math.max(0, Math.min(100, Math.round((1.0 - overshoot) * 100)));
}

export interface NutritionTargetsScoreResult {
  caloriesScore: number;
  proteinScore: number;
  carbsScore: number;
  fatScore: number;
  overallScore: number;
  isCompleted: boolean;
}

/**
 * Calculates overall daily Nutrition Targets completion score across all 4 metrics:
 * Calories, Protein, Carbs, and Fat.
 * Returns individual proximity scores and their balanced average.
 */
export function calculateNutritionTargetsScore(
  actual: { calories: number; protein: number; carbs: number; fat: number },
  targets: UserNutritionTargets
): NutritionTargetsScoreResult {
  const targetCal = targets.calories > 0 ? targets.calories : 2000;
  const targetP = targets.protein > 0 ? targets.protein : 120;
  const targetC = targets.carbs > 0 ? targets.carbs : 250;
  const targetF = targets.fat > 0 ? targets.fat : 55;

  const caloriesScore = calculateMetricProximityScore(actual.calories || 0, targetCal);
  const proteinScore = calculateMetricProximityScore(actual.protein || 0, targetP);
  const carbsScore = calculateMetricProximityScore(actual.carbs || 0, targetC);
  const fatScore = calculateMetricProximityScore(actual.fat || 0, targetF);

  const overallScore = Math.round((caloriesScore + proteinScore + carbsScore + fatScore) / 4);
  const isCompleted = overallScore >= NUTRITION_TARGET_COMPLETION_THRESHOLD;

  return {
    caloriesScore,
    proteinScore,
    carbsScore,
    fatScore,
    overallScore,
    isCompleted,
  };
}

export type MetricClassification = 'HIT' | 'PARTIAL' | 'MISSED';

/**
 * Evaluates the relative ratio R = actual / target for a specific nutrient metric.
 * Uses product-level classification boundaries:
 * - Within target (HIT)
 * - Moderately outside target (PARTIAL)
 * - Significantly outside target (MISSED)
 */
export function classifyNutrientRatio(
  ratio: number,
  metric: 'calories' | 'protein' | 'carbs' | 'fat'
): MetricClassification {
  if (ratio <= 0) return 'MISSED';

  switch (metric) {
    case 'calories':
      if (ratio >= 0.90 && ratio <= 1.08) return 'HIT';
      if ((ratio >= 0.80 && ratio < 0.90) || (ratio > 1.08 && ratio <= 1.15)) return 'PARTIAL';
      return 'MISSED';

    case 'protein':
      if (ratio >= 0.90 && ratio <= 1.15) return 'HIT';
      if ((ratio >= 0.75 && ratio < 0.90) || (ratio > 1.15 && ratio <= 1.30)) return 'PARTIAL';
      return 'MISSED';

    case 'carbs':
      if (ratio >= 0.85 && ratio <= 1.12) return 'HIT';
      if ((ratio >= 0.70 && ratio < 0.85) || (ratio > 1.12 && ratio <= 1.22)) return 'PARTIAL';
      return 'MISSED';

    case 'fat':
      if (ratio >= 0.85 && ratio <= 1.15) return 'HIT';
      if ((ratio >= 0.70 && ratio < 0.85) || (ratio > 1.15 && ratio <= 1.25)) return 'PARTIAL';
      return 'MISSED';
  }
}

/**
 * Classifies a day's nutrition based on target proximity.
 * Target proximity measures how close the logged intake is to targets (neither severely under nor over).
 * Uses purely user-specific targets and relative ratios (R = actual / userTarget).
 */
export function classifyNutritionDayStatus(
  log: NutritionLog | null | undefined,
  targets: UserNutritionTargets
): DayStatusDetails {
  // If no log exists or all values are 0 without meals
  if (!log || (log.total_calories === 0 && log.total_protein === 0 && log.total_carbs === 0 && log.total_fat === 0)) {
    return {
      status: 'NO_LOG',
      label: 'No log',
      color: '#9CA3AF',
      bgTint: '#F3F4F6',
      borderTint: '#E5E7EB',
    };
  }

  const cals = Number(log.total_calories) || 0;
  const p = Number(log.total_protein) || 0;
  const c = Number(log.total_carbs) || 0;
  const f = Number(log.total_fat) || 0;

  const scoreResult = calculateNutritionTargetsScore(
    { calories: cals, protein: p, carbs: c, fat: f },
    targets
  );

  const targetCal = targets.calories > 0 ? targets.calories : 2000;
  const targetP = targets.protein > 0 ? targets.protein : 120;
  const targetC = targets.carbs > 0 ? targets.carbs : 250;
  const targetF = targets.fat > 0 ? targets.fat : 55;

  const rCals = cals / targetCal;
  const rP = p / targetP;
  const rC = c / targetC;
  const rF = f / targetF;

  // Relative ratio classification for each metric
  const calClass = classifyNutrientRatio(rCals, 'calories');
  const pClass = classifyNutrientRatio(rP, 'protein');
  const cClass = classifyNutrientRatio(rC, 'carbs');
  const fClass = classifyNutrientRatio(rF, 'fat');

  const calsHit = calClass === 'HIT';
  const calsPartial = calClass === 'PARTIAL';

  const macroHitCount = (pClass === 'HIT' ? 1 : 0) + (cClass === 'HIT' ? 1 : 0) + (fClass === 'HIT' ? 1 : 0);
  const metricAcceptableCount =
    (calClass !== 'MISSED' ? 1 : 0) +
    (pClass !== 'MISSED' ? 1 : 0) +
    (cClass !== 'MISSED' ? 1 : 0) +
    (fClass !== 'MISSED' ? 1 : 0);

  // 1. "Hit most targets" (Green, #5E9F76)
  // Calories MUST be in Hit Target Range (90%-108%) AND at least 2 of 3 macros in Hit Target Range (or overall score >= 85%)
  if (calsHit && (macroHitCount >= 2 || scoreResult.overallScore >= NUTRITION_TARGET_COMPLETION_THRESHOLD)) {
    return {
      status: 'HIT_MOST',
      label: 'Hit most targets',
      color: '#5E9F76',
      bgTint: '#E6F4EA',
      borderTint: '#A7F3D0',
    };
  }

  // 2. "Partially hit targets" (Yellow/Amber, #D97706)
  // Calories in Partial Range (e.g. 2600 kcal on 2300 target = 113%) OR at least 2 metrics in Target/Partial bounds (overall score >= 60%)
  if (calsPartial || scoreResult.overallScore >= 60 || metricAcceptableCount >= 2) {
    return {
      status: 'PARTIAL',
      label: 'Partially hit targets',
      color: '#D97706',
      bgTint: '#FEF3C7',
      borderTint: '#FDE68A',
    };
  }

  // 3. "Significantly missed" (Red, #C96A6A)
  return {
    status: 'MISSED',
    label: 'Significantly missed',
    color: '#C96A6A',
    bgTint: '#FDE8E8',
    borderTint: '#FCA5A5',
  };
}

/**
 * Calculates macro averages strictly over actual logged days.
 * Missing days are NOT treated as 0g.
 */
export function calculateWeeklyAverages(
  logs: (NutritionLog | null | undefined)[],
  targets: UserNutritionTargets
): WeeklyAverages {
  // Only include logs that exist and have positive macros
  const validLogs = logs.filter(
    (l): l is NutritionLog =>
      Boolean(l) &&
      ((l?.total_calories ?? 0) > 0 ||
        (l?.total_protein ?? 0) > 0 ||
        (l?.total_carbs ?? 0) > 0 ||
        (l?.total_fat ?? 0) > 0)
  );

  if (validLogs.length === 0) {
    return {
      hasLogs: false,
      loggedCount: 0,
      avgCalories: 0,
      avgProtein: 0,
      avgCarbs: 0,
      avgFat: 0,
      calPercent: 0,
      proteinPercent: 0,
      carbsPercent: 0,
      fatPercent: 0,
    };
  }

  const count = validLogs.length;
  const sumCal = validLogs.reduce((acc, l) => acc + (Number(l.total_calories) || 0), 0);
  const sumP = validLogs.reduce((acc, l) => acc + (Number(l.total_protein) || 0), 0);
  const sumC = validLogs.reduce((acc, l) => acc + (Number(l.total_carbs) || 0), 0);
  const sumF = validLogs.reduce((acc, l) => acc + (Number(l.total_fat) || 0), 0);

  const avgCalories = Math.round(sumCal / count);
  const avgProtein = Math.round(sumP / count);
  const avgCarbs = Math.round(sumC / count);
  const avgFat = Math.round(sumF / count);

  const calPercent = targets.calories > 0 ? Math.round((avgCalories / targets.calories) * 100) : 0;
  const proteinPercent = targets.protein > 0 ? Math.round((avgProtein / targets.protein) * 100) : 0;
  const carbsPercent = targets.carbs > 0 ? Math.round((avgCarbs / targets.carbs) * 100) : 0;
  const fatPercent = targets.fat > 0 ? Math.round((avgFat / targets.fat) * 100) : 0;

  return {
    hasLogs: true,
    loggedCount: count,
    avgCalories,
    avgProtein,
    avgCarbs,
    avgFat,
    calPercent,
    proteinPercent,
    carbsPercent,
    fatPercent,
  };
}

/**
 * Fetches nutrition logs between startDateStr and endDateStr (inclusive)
 */
export async function fetchNutritionLogsRange(
  userId: string,
  startDateStr: string,
  endDateStr: string
): Promise<Record<string, NutritionLog>> {
  const { data, error } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDateStr)
    .lte('date', endDateStr);

  if (error) {
    console.error('Error fetching nutrition logs range:', error);
    return {};
  }

  const map: Record<string, NutritionLog> = {};
  (data || []).forEach((log: NutritionLog) => {
    map[log.date] = log;
  });
  return map;
}

/**
 * Fetches all meal entries for a specific nutrition log
 */
export async function fetchMealEntriesForLog(nutritionLogId: string): Promise<MealEntry[]> {
  const { data, error } = await supabase
    .from('meal_entries')
    .select('*')
    .eq('nutrition_log_id', nutritionLogId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching meal entries:', error);
    return [];
  }

  return data || [];
}

/**
 * Groups a month into Monday–Sunday weeks with averages and day summaries
 */
export function buildMonthWeeklySummaries(
  year: number,
  month: number, // 0-indexed (0 = Jan, 8 = Sep)
  nutritionMap: Record<string, NutritionLog>,
  targets: UserNutritionTargets,
  profile?: Profile
): WeekSummary[] {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  const summaries: WeekSummary[] = [];
  let currentRef = new Date(firstOfMonth);
  let weekIndex = 1;

  while (currentRef <= lastOfMonth) {
    const { monday, sunday, days } = getWeekBoundaries(currentRef);

    // Build day summaries for this week
    const daySummaries: DayMacroSummary[] = days.map((d) => {
      const dateStr = formatDateKey(d);
      const log = nutritionMap[dateStr] || null;
      const dayTargets = profile ? getUserNutritionTargets(profile, dateStr) : targets;
      const statusDetails = classifyNutritionDayStatus(log, dayTargets);
      const dayOfWeek = d.getDay();

      return {
        date: d,
        dateStr,
        dayLabel: SHORT_DAY_LABELS[dayOfWeek],
        fullDayName: FULL_DAY_NAMES[dayOfWeek],
        log,
        statusDetails,
      };
    });

    const weekLogs = daySummaries.map((d) => d.log);
    const avgs = calculateWeeklyAverages(weekLogs, targets);

    // Friendly date label (e.g. "Sep 1 – Sep 6")
    const startMonthStr = monday.toLocaleDateString('en-US', { month: 'short' });
    const endMonthStr = sunday.toLocaleDateString('en-US', { month: 'short' });
    const label =
      startMonthStr === endMonthStr
        ? `Week ${weekIndex} (${startMonthStr} ${monday.getDate()} – ${sunday.getDate()})`
        : `Week ${weekIndex} (${startMonthStr} ${monday.getDate()} – ${endMonthStr} ${sunday.getDate()})`;

    summaries.push({
      weekIndex,
      label,
      startDate: monday,
      endDate: sunday,
      days: daySummaries,
      ...avgs,
    });

    weekIndex++;
    // Advance currentRef to the following Monday
    currentRef = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + 1);
  }

  return summaries;
}

/**
 * Calculates compact weekly nutrition adherence summaries for an evaluation period.
 * Strictly adheres to:
 * - Slicing period into weekly evaluation segments matching check-in interval
 * - Resolving applicable targets per week (preserving historical target adjustments)
 * - Filtering strictly for logged days (unlogged days are NOT treated as 0g)
 * - Computing uncapped adherence ratios (e.g. 114.5% if overeating)
 * - Deterministic product classification: HIGH_ADHERENCE, PARTIAL_ADHERENCE, LOW_ADHERENCE, INSUFFICIENT_DATA
 */
export async function calculateWeeklyAdherenceSummaries(
  userId: string,
  startDateStr: string,
  endDateStr: string,
  profile: Profile,
  preloadedNutritionMap?: Record<string, NutritionLog>
): Promise<WeeklyAdherenceSummary[]> {
  if (!startDateStr || !endDateStr) return [];

  // Ensure chronological order
  let startStr = startDateStr;
  let endStr = endDateStr;
  if (startStr > endStr) {
    const tmp = startStr;
    startStr = endStr;
    endStr = tmp;
  }

  // Fetch nutrition logs for range if not pre-provided
  const nutritionMap = preloadedNutritionMap || (await fetchNutritionLogsRange(userId, startStr, endStr));

  // Build daily calendar list from startStr to endStr
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);

  const curDate = new Date(sy, sm - 1, sd);
  const finalDate = new Date(ey, em - 1, ed);

  const allDateKeys: string[] = [];
  while (curDate <= finalDate) {
    allDateKeys.push(formatDateKey(curDate));
    curDate.setDate(curDate.getDate() + 1);
  }

  if (allDateKeys.length === 0) return [];

  // Chunk dates into 7-day segments
  const chunks: string[][] = [];
  for (let i = 0; i < allDateKeys.length; i += 7) {
    chunks.push(allDateKeys.slice(i, i + 7));
  }

  const summaries: WeeklyAdherenceSummary[] = [];

  chunks.forEach((chunkDates, index) => {
    const weekIndex = index + 1;
    const weekStart = chunkDates[0];
    const weekEnd = chunkDates[chunkDates.length - 1];
    const daysInWeek = chunkDates.length;

    // Collect valid logs for chunk
    const validLogs: NutritionLog[] = [];
    let targetCalSum = 0;
    let targetPSum = 0;
    let targetCSum = 0;
    let targetFSum = 0;

    chunkDates.forEach((dStr) => {
      const dayTarget = getUserNutritionTargets(profile, dStr);
      targetCalSum += dayTarget.calories || 2000;
      targetPSum += dayTarget.protein || 120;
      targetCSum += dayTarget.carbs || 250;
      targetFSum += dayTarget.fat || 55;

      const log = nutritionMap[dStr];
      if (
        log &&
        ((log.total_calories ?? 0) > 0 ||
          (log.total_protein ?? 0) > 0 ||
          (log.total_carbs ?? 0) > 0 ||
          (log.total_fat ?? 0) > 0)
      ) {
        validLogs.push(log);
      }
    });

    const daysLogged = validLogs.length;

    // Averages for target across chunk
    const targetCalories = Math.round(targetCalSum / daysInWeek);
    const targetProtein = Math.round(targetPSum / daysInWeek);
    const targetCarbs = Math.round(targetCSum / daysInWeek);
    const targetFat = Math.round(targetFSum / daysInWeek);

    // Actual averages strictly over days logged
    let actualAvgCalories = 0;
    let actualAvgProtein = 0;
    let actualAvgCarbs = 0;
    let actualAvgFat = 0;

    if (daysLogged > 0) {
      const sumCal = validLogs.reduce((acc, l) => acc + (Number(l.total_calories) || 0), 0);
      const sumP = validLogs.reduce((acc, l) => acc + (Number(l.total_protein) || 0), 0);
      const sumC = validLogs.reduce((acc, l) => acc + (Number(l.total_carbs) || 0), 0);
      const sumF = validLogs.reduce((acc, l) => acc + (Number(l.total_fat) || 0), 0);

      actualAvgCalories = Math.round(sumCal / daysLogged);
      actualAvgProtein = Math.round(sumP / daysLogged);
      actualAvgCarbs = Math.round(sumC / daysLogged);
      actualAvgFat = Math.round(sumF / daysLogged);
    }

    // Adherence ratios (uncapped)
    const calorieAdherenceRatio = targetCalories > 0 ? actualAvgCalories / targetCalories : 1;
    const proteinAdherenceRatio = targetProtein > 0 ? actualAvgProtein / targetProtein : 1;
    const carbsAdherenceRatio = targetCarbs > 0 ? actualAvgCarbs / targetCarbs : 1;
    const fatAdherenceRatio = targetFat > 0 ? actualAvgFat / targetFat : 1;

    const adherencePercentStr = `${(calorieAdherenceRatio * 100).toFixed(1)}%`;

    // Classification
    // Insufficient if 0 days logged or fewer than half the days in segment (minimum 4 for full week)
    const minRequiredDays = Math.min(4, Math.ceil(daysInWeek / 2));
    let classification: AdherenceClassification = 'INSUFFICIENT_DATA';

    if (daysLogged === 0 || daysLogged < minRequiredDays) {
      classification = 'INSUFFICIENT_DATA';
    } else if (calorieAdherenceRatio >= 0.90 && calorieAdherenceRatio <= 1.10) {
      classification = 'HIGH_ADHERENCE';
    } else if (
      (calorieAdherenceRatio >= 0.80 && calorieAdherenceRatio < 0.90) ||
      (calorieAdherenceRatio > 1.10 && calorieAdherenceRatio <= 1.25)
    ) {
      classification = 'PARTIAL_ADHERENCE';
    } else {
      classification = 'LOW_ADHERENCE';
    }

    const weekLabel = `Week ${weekIndex} (${weekStart} to ${weekEnd})`;

    summaries.push({
      weekIndex,
      weekLabel,
      startDate: weekStart,
      endDate: weekEnd,
      daysLogged,
      daysInWeek,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFat,
      actualAvgCalories,
      actualAvgProtein,
      actualAvgCarbs,
      actualAvgFat,
      calorieAdherenceRatio: Number(calorieAdherenceRatio.toFixed(3)),
      proteinAdherenceRatio: Number(proteinAdherenceRatio.toFixed(3)),
      carbsAdherenceRatio: Number(carbsAdherenceRatio.toFixed(3)),
      fatAdherenceRatio: Number(fatAdherenceRatio.toFixed(3)),
      adherencePercentStr,
      classification,
    });
  });

  return summaries;
}
