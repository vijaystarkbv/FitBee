import { supabase } from './supabaseClient';
import { clock } from './clock';
import {
  Profile,
  NutritionTargetVersion,
  NutritionProgressUpdate,
  TargetVersionSource,
  ProgressUpdateAction,
} from '../types/database.types';
import {
  ACTIVITY_MULTIPLIERS,
  KCAL_PER_KG_WEIGHT,
  resolveGoalDirection,
  calculateDeterministicTargets,
} from './geminiService';

// Local storage keys for resilient offline/local state
const TARGET_VERSIONS_KEY = 'fitbee_target_versions_';
const PROGRESS_UPDATES_KEY = 'fitbee_progress_updates_';

function getLocalTargetVersions(userId: string): NutritionTargetVersion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${TARGET_VERSIONS_KEY}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveLocalTargetVersions(userId: string, versions: NutritionTargetVersion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${TARGET_VERSIONS_KEY}${userId}`, JSON.stringify(versions));
  } catch (_) {}
}

function getLocalProgressUpdates(userId: string): NutritionProgressUpdate[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${PROGRESS_UPDATES_KEY}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveLocalProgressUpdates(userId: string, updates: NutritionProgressUpdate[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${PROGRESS_UPDATES_KEY}${userId}`, JSON.stringify(updates));
  } catch (_) {}
}

/**
 * Synchronously resolves the nutrition target version active on a specific date from local cache.
 * Falls back to profile target_* if no versioned record is found in cache.
 */
export function getActiveTargetForDateSync(
  userId: string,
  targetDate?: Date | string,
  fallbackProfile?: Profile | null
): { calories: number; protein: number; carbs: number; fat: number; versionId?: string } {
  if (targetDate && userId) {
    const dateObj = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    const localVersions = getLocalTargetVersions(userId);
    const matchingLocal = localVersions.find((v) => {
      const fromTime = new Date(v.effective_from).getTime();
      const toTime = v.effective_to ? new Date(v.effective_to).getTime() : Infinity;
      const checkTime = dateObj.getTime();
      return checkTime >= fromTime && checkTime <= toTime;
    });

    if (matchingLocal) {
      return {
        calories: matchingLocal.calories,
        protein: matchingLocal.protein,
        carbs: matchingLocal.carbs,
        fat: matchingLocal.fat,
        versionId: matchingLocal.id,
      };
    }
  }

  if (fallbackProfile && fallbackProfile.target_calories) {
    return {
      calories: Number(fallbackProfile.target_calories) || (fallbackProfile.onboarding_completed ? 0 : 2500),
      protein: Number(fallbackProfile.target_protein) || (fallbackProfile.onboarding_completed ? 0 : 140),
      carbs: Number(fallbackProfile.target_carbs) || (fallbackProfile.onboarding_completed ? 0 : 320),
      fat: Number(fallbackProfile.target_fat) || (fallbackProfile.onboarding_completed ? 0 : 65),
    };
  }

  return { calories: 2500, protein: 140, carbs: 320, fat: 65 };
}

/**
 * Resolves the nutrition target version active on any specific date.
 * If multiple versions exist, finds the one where effective_from <= date and (effective_to == null or effective_to >= date).
 * Falls back to profile target_* if no versioned record is found.
 */
export async function getActiveTargetForDate(
  userId: string,
  targetDate: Date | string,
  fallbackProfile?: Profile | null
): Promise<{ calories: number; protein: number; carbs: number; fat: number; versionId?: string }> {
  const dateObj = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const isoDate = dateObj.toISOString();

  // 1. Try local cache first for instant resolution
  const localVersions = getLocalTargetVersions(userId);
  const matchingLocal = localVersions.find((v) => {
    const fromTime = new Date(v.effective_from).getTime();
    const toTime = v.effective_to ? new Date(v.effective_to).getTime() : Infinity;
    const checkTime = dateObj.getTime();
    return checkTime >= fromTime && checkTime <= toTime;
  });

  if (matchingLocal) {
    return {
      calories: matchingLocal.calories,
      protein: matchingLocal.protein,
      carbs: matchingLocal.carbs,
      fat: matchingLocal.fat,
      versionId: matchingLocal.id,
    };
  }

  // 2. Query Supabase
  try {
    const { data, error } = await supabase
      .from('nutrition_target_versions')
      .select('*')
      .eq('user_id', userId)
      .lte('effective_from', isoDate)
      .or(`effective_to.is.null,effective_to.gte.${isoDate}`)
      .order('effective_from', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      return {
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat,
        versionId: data.id,
      };
    }
  } catch (_) {
    // Supabase unavailable or table not created yet
  }

  // 3. Fallback to profile
  if (fallbackProfile && fallbackProfile.target_calories) {
    return {
      calories: Number(fallbackProfile.target_calories) || 2000,
      protein: Number(fallbackProfile.target_protein) || 120,
      carbs: Number(fallbackProfile.target_carbs) || 250,
      fat: Number(fallbackProfile.target_fat) || 55,
    };
  }

  return { calories: 2000, protein: 120, carbs: 250, fat: 55 };
}

/**
 * Creates a new target version, closing the currently active target version.
 * Updates Supabase, syncs profiles table, and caches locally.
 */
export async function createTargetVersion(
  userId: string,
  targets: { calories: number; protein: number; carbs: number; fat: number },
  source: TargetVersionSource,
  effectiveDate?: Date
): Promise<NutritionTargetVersion> {
  const now = effectiveDate || clock.now();
  const nowIso = now.toISOString();

  const newVersion: NutritionTargetVersion = {
    id: `tgt_${userId}_${Date.now()}`,
    user_id: userId,
    effective_from: nowIso,
    effective_to: null,
    calories: Math.max(800, Math.round(targets.calories)),
    protein: Math.max(20, Math.round(targets.protein)),
    carbs: Math.max(20, Math.round(targets.carbs)),
    fat: Math.max(10, Math.round(targets.fat)),
    source,
    created_at: nowIso,
  };

  // 1. Update local cache
  const local = getLocalTargetVersions(userId);
  // Close any active versions
  local.forEach((v) => {
    if (!v.effective_to) {
      v.effective_to = nowIso;
    }
  });
  local.unshift(newVersion);
  saveLocalTargetVersions(userId, local);

  // 2. Update Supabase
  try {
    // Close existing open target versions
    await supabase
      .from('nutrition_target_versions')
      .update({ effective_to: nowIso })
      .eq('user_id', userId)
      .is('effective_to', null);

    // Insert new version
    const { data, error } = await supabase
      .from('nutrition_target_versions')
      .insert({
        user_id: userId,
        effective_from: newVersion.effective_from,
        effective_to: null,
        calories: newVersion.calories,
        protein: newVersion.protein,
        carbs: newVersion.carbs,
        fat: newVersion.fat,
        source: newVersion.source,
      })
      .select('*')
      .maybeSingle();

    if (!error && data) {
      newVersion.id = data.id;
    }

    // 3. Keep profiles table synchronized
    await supabase
      .from('profiles')
      .update({
        target_calories: newVersion.calories,
        target_protein: newVersion.protein,
        target_carbs: newVersion.carbs,
        target_fat: newVersion.fat,
        updated_at: nowIso,
      })
      .eq('id', userId);
  } catch (err) {
    console.warn('Supabase target version save failed, stored locally:', err);
  }

  // Dispatch event for UI reactivity
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fitbee:targets_updated', { detail: newVersion }));
  }

  return newVersion;
}

/**
 * Records a new longitudinal nutrition progress update.
 */
export async function recordProgressUpdate(
  arg1: string | any,
  arg2?: any
): Promise<NutritionProgressUpdate> {
  const nowIso = clock.now().toISOString();
  const userId = typeof arg1 === 'string' ? arg1 : (arg1?.user_id || '');
  const updateData = typeof arg1 === 'string' ? (arg2 || {}) : arg1;

  const record: NutritionProgressUpdate = {
    id: `prog_${userId}_${Date.now()}`,
    user_id: userId,
    recorded_at: updateData.recorded_at || nowIso,
    weight_kg: Number(updateData.weight_kg || updateData.weight || 70),
    previous_weight_kg: updateData.previous_weight_kg ?? updateData.previous_weight ?? null,
    weight_change_kg: updateData.weight_change_kg ?? null,
    days_since_last_update: updateData.days_since_last_update ?? null,
    active_target_calories: Number(updateData.active_target_calories || updateData.target_calories_at_time || 2000),
    active_target_protein: Number(updateData.active_target_protein || updateData.target_protein_at_time || 120),
    active_target_carbs: Number(updateData.active_target_carbs || updateData.target_carbs_at_time || 250),
    active_target_fat: Number(updateData.active_target_fat || updateData.target_fat_at_time || 55),
    goal: updateData.goal || 'maintain_weight',
    expected_trend: updateData.expected_trend || '',
    actual_trend: updateData.actual_trend || '',
    fitbee_recommended_calories: updateData.fitbee_recommended_calories ?? null,
    fitbee_recommended_protein: updateData.fitbee_recommended_protein ?? null,
    fitbee_recommended_carbs: updateData.fitbee_recommended_carbs ?? null,
    fitbee_recommended_fat: updateData.fitbee_recommended_fat ?? null,
    statement_ids: updateData.statement_ids ?? null,
    user_action: updateData.user_action || 'pending',
    user_selected_calories: updateData.user_selected_calories ?? null,
    user_selected_protein: updateData.user_selected_protein ?? null,
    user_selected_carbs: updateData.user_selected_carbs ?? null,
    user_selected_fat: updateData.user_selected_fat ?? null,
    created_at: nowIso,
    date: nowIso.split('T')[0],
    weight: Number(updateData.weight_kg || updateData.weight || 70),
    previous_weight: updateData.previous_weight_kg ?? updateData.previous_weight ?? undefined,
    target_calories_at_time: Number(updateData.active_target_calories || updateData.target_calories_at_time || 2000),
    target_protein_at_time: Number(updateData.active_target_protein || updateData.target_protein_at_time || 120),
    target_carbs_at_time: Number(updateData.active_target_carbs || updateData.target_carbs_at_time || 250),
    target_fat_at_time: Number(updateData.active_target_fat || updateData.target_fat_at_time || 55),
    target_source_at_time: updateData.target_source_at_time || 'gemini_recommendation',
  };

  // 1. Cache locally
  const local = getLocalProgressUpdates(userId);
  local.unshift(record);
  saveLocalProgressUpdates(userId, local);

  // 2. Save to Supabase
  try {
    const { data, error } = await supabase
      .from('nutrition_progress_updates')
      .insert({
        user_id: userId,
        recorded_at: record.recorded_at,
        weight_kg: record.weight_kg,
        previous_weight_kg: record.previous_weight_kg,
        weight_change_kg: record.weight_change_kg,
        days_since_last_update: record.days_since_last_update,
        active_target_calories: record.active_target_calories,
        active_target_protein: record.active_target_protein,
        active_target_carbs: record.active_target_carbs,
        active_target_fat: record.active_target_fat,
        goal: record.goal,
        expected_trend: record.expected_trend,
        actual_trend: record.actual_trend,
        fitbee_recommended_calories: record.fitbee_recommended_calories,
        fitbee_recommended_protein: record.fitbee_recommended_protein,
        fitbee_recommended_carbs: record.fitbee_recommended_carbs,
        fitbee_recommended_fat: record.fitbee_recommended_fat,
        statement_ids: record.statement_ids,
        user_action: record.user_action,
        user_selected_calories: record.user_selected_calories,
        user_selected_protein: record.user_selected_protein,
        user_selected_carbs: record.user_selected_carbs,
        user_selected_fat: record.user_selected_fat,
      })
      .select('*')
      .maybeSingle();

    if (!error && data) {
      record.id = data.id;
    }
  } catch (err) {
    console.warn('Supabase progress update save failed, stored locally:', err);
  }

  return record;
}

/**
 * Fetches recent progress updates for a user, limited to `limit` records (default 6).
 * Returns chronologically ordered list (`oldest -> newest`) for Gemini longitudinal context!
 */
export async function getRecentProgressUpdates(
  userId: string,
  limit = 6
): Promise<NutritionProgressUpdate[]> {
  // 1. Check local cache
  const local = getLocalProgressUpdates(userId);
  if (local.length > 0) {
    // Sort descending by recorded_at, take limit, then reverse to chronological
    const sorted = [...local].sort(
      (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
    );
    const sliced = sorted.slice(0, limit);
    return sliced.reverse(); // oldest -> newest
  }

  // 2. Query Supabase
  try {
    const { data, error } = await supabase
      .from('nutrition_progress_updates')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) {
      const records = (data as NutritionProgressUpdate[]).reverse(); // oldest -> newest
      saveLocalProgressUpdates(userId, data);
      return records;
    }
  } catch (_) {}

  return [];
}

/**
 * Updates a progress update record with the user's action (accepted, rejected, manual_override).
 */
export async function updateProgressAction(
  arg1: string,
  arg2: string,
  arg3?: ProgressUpdateAction,
  arg4?: { calories: number; protein: number; carbs: number; fat: number }
): Promise<void> {
  const userId = arg3 ? arg1 : '';
  const progressId = arg3 ? arg2 : arg1;
  const action = (arg3 ? arg3 : arg2) as ProgressUpdateAction;
  const userSelected = arg3 ? arg4 : undefined;

  // 1. Update local cache
  if (userId) {
    const local = getLocalProgressUpdates(userId);
    const target = local.find((p) => p.id === progressId);
    if (target) {
      target.user_action = action;
      if (userSelected) {
        target.user_selected_calories = userSelected.calories;
        target.user_selected_protein = userSelected.protein;
        target.user_selected_carbs = userSelected.carbs;
        target.user_selected_fat = userSelected.fat;
      }
      saveLocalProgressUpdates(userId, local);
    }
  }

  // 2. Update Supabase
  try {
    await supabase
      .from('nutrition_progress_updates')
      .update({
        user_action: action,
        user_selected_calories: userSelected?.calories || null,
        user_selected_protein: userSelected?.protein || null,
        user_selected_carbs: userSelected?.carbs || null,
        user_selected_fat: userSelected?.fat || null,
      })
      .eq('id', progressId);
  } catch (_) {}
}

/**
 * Calculates days elapsed since the user's last weight update using `clock.now()`.
 * Returns the integer number of days elapsed.
 */
export async function getDaysSinceLastWeightUpdate(
  userId: string,
  profileOrDate?: Profile | string | null
): Promise<number> {
  const currentNow = clock.now();

  // Check progress updates first
  const updates = getLocalProgressUpdates(userId);
  let lastTimestamp: number | null = null;

  if (updates.length > 0) {
    lastTimestamp = new Date(updates[0].recorded_at).getTime();
  } else if (typeof profileOrDate === 'string') {
    lastTimestamp = new Date(profileOrDate).getTime();
  } else if (profileOrDate && typeof profileOrDate === 'object' && profileOrDate.updated_at) {
    lastTimestamp = new Date(profileOrDate.updated_at).getTime();
  }

  if (!lastTimestamp || isNaN(lastTimestamp)) {
    return 0;
  }

  const diffMs = currentNow.getTime() - lastTimestamp;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export interface LiveCaloriePreviewResult {
  tdee: number;
  dailySurplusDeficit: number;
  estimatedMonthlyChangeKg: number;
  paceLabel: string;
  direction: 'deficit' | 'surplus' | 'maintenance';
  message: string;
  isMismatch?: boolean;
}

/**
 * Deterministically calculates a live preview of estimated monthly weight change.
 * Compares selected calories against estimated maintenance TDEE.
 */
export function calculateLiveCaloriePreview(
  calories: number,
  arg2?: any,
  heightCm?: number,
  age?: number,
  sex?: string,
  activityLevel?: string,
  goal?: string
): LiveCaloriePreviewResult {
  let weight = 70;
  let height = 170;
  let userAge = 25;
  let gender = 'male';
  let activity = 'moderate';
  let userGoal = 'maintain_weight';

  if (typeof arg2 === 'object' && arg2 !== null) {
    weight = Number(arg2.weight_kg) || 70;
    height = Number(arg2.height_cm) || 170;
    userAge = Number(arg2.age) || 25;
    gender = String(arg2.gender || arg2.sex || 'male').toLowerCase();
    activity = String(arg2.activity_level || 'moderate');
    userGoal = String(arg2.goal || 'maintain_weight');
  } else if (typeof arg2 === 'number') {
    weight = arg2 || 70;
    height = heightCm || 170;
    userAge = age || 25;
    gender = String(sex || 'male').toLowerCase();
    activity = String(activityLevel || 'moderate');
    userGoal = String(goal || 'maintain_weight');
  }

  // Mifflin-St Jeor BMR
  let bmr: number;
  if (gender === 'female') {
    bmr = 10 * weight + 6.25 * height - 5 * userAge - 161;
  } else if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * userAge + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * userAge - 78;
  }

  const mult = ACTIVITY_MULTIPLIERS[activity] || 1.55;
  const tdee = Math.round(bmr * mult);
  const diff = calories - tdee;

  // Monthly bodyweight delta: 7700 kcal ≈ 1 kg bodyweight
  const monthlyWeightChangeKg = Math.round(((diff * 30) / KCAL_PER_KG_WEIGHT) * 10) / 10;

  const goalDir = resolveGoalDirection(userGoal);
  let direction: 'deficit' | 'surplus' | 'maintenance' = 'maintenance';
  let paceLabel = 'Maintenance';
  let message = 'Target roughly matches your maintenance energy needs (TDEE).';

  if (diff <= -600) {
    direction = 'deficit';
    paceLabel = goalDir === 'WEIGHT_GAIN' ? 'Deficit (Opposite of Goal)' : 'Aggressive Deficit';
    message = 'Calorie deficit is high (~0.7+ kg/week loss). Watch for energy depletion or lean tissue loss.';
  } else if (diff <= -250) {
    direction = 'deficit';
    paceLabel = goalDir === 'WEIGHT_GAIN' ? 'Deficit (Opposite of Goal)' : 'Sustainable Deficit';
    message = 'Optimal fat loss deficit (~0.3–0.6 kg/week loss) to preserve muscle mass.';
  } else if (diff < -50) {
    direction = 'deficit';
    paceLabel = goalDir === 'WEIGHT_GAIN' ? 'Deficit (Opposite of Goal)' : 'Mild Deficit';
    message = 'Gentle deficit suitable for gradual fat loss or recomposition.';
  } else if (diff >= 500) {
    direction = 'surplus';
    paceLabel = goalDir === 'WEIGHT_LOSS' ? 'Surplus (Opposite of Goal)' : 'High Surplus';
    message = 'Large surplus (>500 kcal/day). May lead to higher rate of body fat accumulation.';
  } else if (diff >= 200) {
    direction = 'surplus';
    paceLabel = goalDir === 'WEIGHT_LOSS' ? 'Surplus (Opposite of Goal)' : 'Lean Muscle Surplus';
    message = 'Optimal energy surplus for progressive resistance training and muscle protein synthesis.';
  } else if (diff > 50) {
    direction = 'surplus';
    paceLabel = goalDir === 'WEIGHT_LOSS' ? 'Surplus (Opposite of Goal)' : 'Mild Surplus';
    message = 'Gentle surplus to support recovery and slow athletic development.';
  } else {
    direction = 'maintenance';
    paceLabel = 'Maintenance';
    message = 'Target roughly matches your maintenance energy needs (TDEE).';
  }

  if (goalDir === 'WEIGHT_LOSS' && direction === 'surplus') {
    message += ' Warning: You are in a surplus while your goal is fat loss.';
  } else if (goalDir === 'WEIGHT_GAIN' && direction === 'deficit') {
    message += ' Warning: You are in a deficit while your goal is muscle gain. FitBee recommends a caloric surplus.';
  }

  const isMismatch = (goalDir === 'WEIGHT_LOSS' && direction === 'surplus') ||
                     (goalDir === 'WEIGHT_GAIN' && direction === 'deficit');

  return {
    tdee,
    dailySurplusDeficit: diff,
    estimatedMonthlyChangeKg: monthlyWeightChangeKg,
    paceLabel,
    direction,
    message,
    isMismatch,
  };
}

/**
 * Authoritative validator ensuring active targets adhere to goal direction invariants.
 * If active target calories violate the goal direction, regenerates deterministic targets for that goal.
 */
export function ensureTargetMatchesGoalInvariants(
  currentTarget: { calories: number; protein: number; carbs: number; fat: number },
  profile: {
    goal: string;
    gender?: string;
    sex?: string;
    age?: number;
    height_cm?: number;
    weight_kg?: number;
    target_weight_kg?: number;
    activity_level?: string;
  }
): { calories: number; protein: number; carbs: number; fat: number; wasRepaired: boolean } {
  const goalDir = resolveGoalDirection(profile.goal);
  const baseline = calculateDeterministicTargets({
    gender: (profile.gender || profile.sex || 'male').toLowerCase() as any,
    age: profile.age || 25,
    height_cm: profile.height_cm || 170,
    weight_kg: profile.weight_kg || 70,
    target_weight_kg: profile.target_weight_kg,
    goal: profile.goal as any,
    activity_level: (profile.activity_level as any) || 'moderate',
  });

  const tdee = baseline.tdee || 2200;
  const isGainViolation = goalDir === 'WEIGHT_GAIN' && currentTarget.calories < tdee;
  const isLossViolation = goalDir === 'WEIGHT_LOSS' && currentTarget.calories > tdee;
  const isMaintenanceViolation = goalDir === 'MAINTENANCE' && Math.abs(currentTarget.calories - tdee) > 250;

  if (isGainViolation || isLossViolation || isMaintenanceViolation) {
    console.warn(
      `FitBee Invariant Enforcement: Current target calories (${currentTarget.calories}) violates goal direction ${goalDir} vs TDEE (${tdee}). Repairing to baseline targets.`
    );
    return {
      calories: baseline.calories,
      protein: baseline.protein,
      carbs: baseline.carbs,
      fat: baseline.fat,
      wasRepaired: true,
    };
  }

  return {
    ...currentTarget,
    wasRepaired: false,
  };
}

export interface MacroSuitabilityResult {
  protein: { status: 'low' | 'good' | 'high'; isOptimal: boolean; gPerKg: string; label: string; message: string };
  fat: { status: 'low' | 'good' | 'high'; isOptimal: boolean; percentage: number; label: string; message: string };
  carbs: { status: 'low' | 'good' | 'high'; isOptimal: boolean; label: string; message: string };
}

/**
 * Dynamically evaluates macronutrient suitability against bodyweight and goal.
 */
export function evaluateLiveMacroSuitability(
  arg1: any,
  arg2?: any,
  arg3?: any,
  arg4?: any,
  arg5?: any,
  arg6?: any
): MacroSuitabilityResult {
  let protein = 120;
  let carbs = 250;
  let fat = 55;
  let weight = 70;
  let calories = 2000;
  let goal = 'maintain_weight';

  if (typeof arg1 === 'object' && arg1 !== null) {
    protein = Number(arg1.protein) || 120;
    carbs = Number(arg1.carbs) || 250;
    fat = Number(arg1.fat) || 55;
    calories = Number(arg2) || 2000;
    weight = Number(arg3?.weight_kg) || 70;
    goal = String(arg3?.goal || 'maintain_weight');
  } else {
    protein = Number(arg1) || 120;
    carbs = Number(arg2) || 250;
    fat = Number(arg3) || 55;
    weight = Number(arg4) || 70;
    calories = Number(arg5) || 2000;
    goal = String(arg6 || 'maintain_weight');
  }

  const safeCalories = Math.max(1, calories);
  const pRatio = weight > 0 ? protein / weight : 1.8;
  const pPerKg = pRatio.toFixed(1);
  const targetProteinFloor = (goal.includes('gain') || goal.includes('lose')) ? 1.6 : 1.4;
  const pOptimal = pRatio >= targetProteinFloor && pRatio <= 2.4;
  const pLabel = pOptimal ? 'Optimal' : pRatio < targetProteinFloor ? 'Low' : 'High';

  const fatPct = Math.round(((fat * 9) / safeCalories) * 100);
  const fOptimal = fat >= 30 && fatPct >= 20 && fatPct <= 35;
  const fLabel = fOptimal ? 'Healthy Range' : fat < 30 || fatPct < 20 ? 'Below Floor' : 'High Share';

  const cPct = Math.round(((carbs * 4) / safeCalories) * 100);
  const cOptimal = carbs >= 50 && cPct >= 30;
  const cLabel = cOptimal ? 'Training Fuel' : carbs < 50 ? 'Low Energy' : 'Balanced';

  return {
    protein: {
      status: pOptimal ? 'good' : pRatio < 1.6 ? 'low' : 'high',
      isOptimal: pOptimal,
      gPerKg: pPerKg,
      label: pLabel,
      message: `Protein is ${pPerKg} g/kg (${pLabel}).`,
    },
    fat: {
      status: fOptimal ? 'good' : fat < 30 || fatPct < 20 ? 'low' : 'high',
      isOptimal: fOptimal,
      percentage: fatPct,
      label: fLabel,
      message: `Fat is ${fatPct}% of calories (${fLabel}).`,
    },
    carbs: {
      status: cOptimal ? 'good' : 'low',
      isOptimal: cOptimal,
      label: cLabel,
      message: `Carbohydrates are ${cPct}% of calories (${cLabel}).`,
    },
  };
}

export interface MacroConsistencyResult {
  isValid: boolean;
  difference: number;
  macroCalories: number;
  targetCalories: number;
  message: string;
}

/**
 * Validates mathematical consistency between macro gram contributions and target calories.
 * P*4 + C*4 + F*9 vs target calories.
 */
export function validateMacroCalorieConsistency(
  calories: number,
  arg2: any,
  carbsArg?: number,
  fatArg?: number
): MacroConsistencyResult {
  let protein = 120;
  let carbs = 250;
  let fat = 55;

  if (typeof arg2 === 'object' && arg2 !== null) {
    protein = Number(arg2.protein) || 0;
    carbs = Number(arg2.carbs) || 0;
    fat = Number(arg2.fat) || 0;
  } else {
    protein = Number(arg2) || 0;
    carbs = Number(carbsArg) || 0;
    fat = Number(fatArg) || 0;
  }

  const macroCalories = protein * 4 + carbs * 4 + fat * 9;
  const difference = Math.abs(macroCalories - calories);
  const isValid = difference <= 100;

  return {
    isValid,
    difference,
    macroCalories,
    targetCalories: calories,
    message: isValid
      ? `✓ Macros match daily calorie target (${macroCalories} kcal sum)`
      : `Macro sum (${macroCalories} kcal) differs from calorie target (${calories} kcal) by ${difference} kcal`,
  };
}

