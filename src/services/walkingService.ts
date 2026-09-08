import { supabase } from './supabaseClient.ts';
import type { DailyWalkingLog, WalkingInputMode } from '../types/database.types.ts';

/**
 * Biomechanical & Exercise Physiology Constants
 * Source: ACSM Walking Energy Expenditure & Biomechanics of Gait
 */
export const WALKING_CALORIES_PER_KG_PER_KM = 0.72; // kcal/(kg * km) for typical walking speed (~4.8 km/h)
export const DEFAULT_STRIDE_LENGTH_M = 0.72; // Standard average adult stride length (meters)
const STORAGE_KEY_PREFIX = 'fitbee_daily_walking_logs_';

/**
 * Estimates individual stride length (in meters) from height and gender.
 * Biomechanical gait ratio: stride is ~0.415 of height in males, ~0.413 in females.
 */
export function calculateStrideLengthM(heightCm?: number | null, gender?: string | null): number {
  if (!heightCm || heightCm < 100 || heightCm > 250) {
    return DEFAULT_STRIDE_LENGTH_M;
  }
  const ratio = gender === 'female' ? 0.413 : 0.415;
  return (heightCm * ratio) / 100;
}

/**
 * Converts steps into distance in kilometers using user-specific stride length.
 */
export function stepsToDistanceKm(steps: number, heightCm?: number | null, gender?: string | null): number {
  if (!steps || steps <= 0) return 0;
  const strideM = calculateStrideLengthM(heightCm, gender);
  const km = (steps * strideM) / 1000;
  return Number(km.toFixed(2));
}

/**
 * Converts distance in kilometers into estimated steps using user-specific stride length.
 */
export function distanceToSteps(distanceKm: number, heightCm?: number | null, gender?: string | null): number {
  if (!distanceKm || distanceKm <= 0) return 0;
  const strideM = calculateStrideLengthM(heightCm, gender);
  return Math.round((distanceKm * 1000) / strideM);
}

/**
 * Deterministically calculates estimated walking calories from distance and bodyweight.
 * Formula: kcal = distance_km * weight_kg * 0.72 kcal/(kg·km)
 */
export function calculateWalkingCalories(distanceKm: number, weightKg?: number | null): number {
  if (!distanceKm || distanceKm <= 0) return 0;
  const validWeight = weightKg && weightKg >= 30 && weightKg <= 300 ? weightKg : 70;
  return Math.round(distanceKm * validWeight * WALKING_CALORIES_PER_KG_PER_KM);
}

function getStorageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

/**
 * Retrieves the local cache store for a given user.
 */
function getLocalStore(userId: string): Record<string, DailyWalkingLog> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(getStorageKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn('Failed to parse local walking store:', err);
    return {};
  }
}

/**
 * Saves the local cache store for a given user.
 */
function saveLocalStore(userId: string, store: Record<string, DailyWalkingLog>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(store));
  } catch (err) {
    console.warn('Failed to persist local walking store:', err);
  }
}

/**
 * Retrieves the daily walking record for a specific date.
 * Returns null if no activity was logged for that date.
 */
export async function getDailyWalkingLog(userId: string, date: string): Promise<DailyWalkingLog | null> {
  if (!userId || !date) return null;

  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from('daily_walking_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .maybeSingle();

    if (!error && data) {
      // Sync local cache
      const store = getLocalStore(userId);
      store[date] = data as DailyWalkingLog;
      saveLocalStore(userId, store);
      return data as DailyWalkingLog;
    }
  } catch (err) {
    console.warn('Supabase walking fetch error, checking local store:', err);
  }

  // 2. Fallback to LocalStorage
  const store = getLocalStore(userId);
  return store[date] || null;
}

export interface SaveWalkingPayload {
  steps: number;
  distance_km: number;
  calories_burned: number;
  input_mode: WalkingInputMode;
}

/**
 * Saves or updates a daily walking log for the user and date.
 * Persists to Supabase and syncs with local cache.
 */
export async function saveDailyWalkingLog(
  userId: string,
  date: string,
  payload: SaveWalkingPayload
): Promise<DailyWalkingLog> {
  const nowIso = new Date().toISOString();

  const record: DailyWalkingLog = {
    id: `walk_${userId}_${date}`,
    user_id: userId,
    date,
    steps: Math.max(0, Math.round(payload.steps || 0)),
    distance_km: Math.max(0, Number(payload.distance_km || 0)),
    calories_burned: Math.max(0, Math.round(payload.calories_burned || 0)),
    input_mode: payload.input_mode,
    created_at: nowIso,
    updated_at: nowIso,
  };

  // 1. Persist to local store
  const store = getLocalStore(userId);
  if (store[date]?.id) {
    record.id = store[date].id;
    record.created_at = store[date].created_at;
  }
  store[date] = record;
  saveLocalStore(userId, store);

  // 2. Upsert to Supabase
  try {
    const { data, error } = await supabase
      .from('daily_walking_logs')
      .upsert(
        {
          user_id: userId,
          date,
          steps: record.steps,
          distance_km: record.distance_km,
          calories_burned: record.calories_burned,
          input_mode: record.input_mode,
          updated_at: nowIso,
        },
        { onConflict: 'user_id,date' }
      )
      .select()
      .maybeSingle();

    if (!error && data) {
      store[date] = data as DailyWalkingLog;
      saveLocalStore(userId, store);
      notifyWalkingUpdated(data as DailyWalkingLog);
      return data as DailyWalkingLog;
    }
  } catch (err) {
    console.warn('Supabase walking upsert error, saved locally:', err);
  }

  notifyWalkingUpdated(record);
  return record;
}

/**
 * Dispatches a custom window event so that components displaying walking data
 * re-render their state reactively without requiring a page refresh.
 */
function notifyWalkingUpdated(log: DailyWalkingLog): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fitbee:walking_updated', { detail: log }));
  }
}
