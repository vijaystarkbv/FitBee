import { supabase } from './supabaseClient';
import { WorkoutTemplateVersion, WorkoutTemplateVersionDayConfig } from '../types/database.types';

const WORKOUT_VERSIONS_KEY = 'fitbee_workout_versions_';

function getLocalTemplateVersions(userId: string): WorkoutTemplateVersion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${WORKOUT_VERSIONS_KEY}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function saveLocalTemplateVersions(userId: string, versions: WorkoutTemplateVersion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${WORKOUT_VERSIONS_KEY}${userId}`, JSON.stringify(versions));
  } catch (_) {}
}

/**
 * Fetch all historical workout template versions for a user.
 */
export async function getUserTemplateVersions(userId: string): Promise<WorkoutTemplateVersion[]> {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('workout_template_versions')
      .select('*')
      .eq('user_id', userId)
      .order('effective_from', { ascending: true });

    if (error) {
      console.warn('Failed to fetch workout template versions:', error);
      return getLocalTemplateVersions(userId);
    }

    const versions = (data || []).map((row: any) => ({
      ...row,
      scheduled_days: Array.isArray(row.scheduled_days) ? row.scheduled_days : [],
      days_config: Array.isArray(row.days_config) ? row.days_config : [],
    }));

    saveLocalTemplateVersions(userId, versions);
    return versions;
  } catch (err) {
    console.warn('Error in getUserTemplateVersions:', err);
    return getLocalTemplateVersions(userId);
  }
}

/**
 * Record a new effective-dated template version when a template is created or modified.
 * Closes the previously active version by setting effective_to = effectiveFrom.
 */
export async function recordTemplateVersion(
  templateId: string,
  userId: string,
  effectiveFrom: Date | string,
  scheduledDays: string[],
  daysConfig: WorkoutTemplateVersionDayConfig[]
): Promise<WorkoutTemplateVersion | null> {
  if (!templateId || !userId) return null;

  const effectiveFromIso =
    typeof effectiveFrom === 'string' ? effectiveFrom : effectiveFrom.toISOString();

  try {
    // 1. Close any currently open version for this template
    await supabase
      .from('workout_template_versions')
      .update({ effective_to: effectiveFromIso })
      .eq('template_id', templateId)
      .is('effective_to', null);

    // 2. Insert new version
    const { data: newVersion, error: insertError } = await supabase
      .from('workout_template_versions')
      .insert({
        user_id: userId,
        template_id: templateId,
        effective_from: effectiveFromIso,
        effective_to: null,
        scheduled_days: scheduledDays,
        days_config: daysConfig,
        created_at: effectiveFromIso,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to insert workout template version:', insertError);
      return null;
    }

    // 3. Update local cache
    const existing = getLocalTemplateVersions(userId).map((v) =>
      v.template_id === templateId && !v.effective_to ? { ...v, effective_to: effectiveFromIso } : v
    );
    existing.push(newVersion);
    saveLocalTemplateVersions(userId, existing);

    return newVersion;
  } catch (err) {
    console.error('Error recording template version:', err);
    return null;
  }
}

/**
 * Synchronously resolves the workout template version effective on a given date from cache.
 * Returns null if no template version existed on that date.
 */
export function getActiveTemplateVersionForDateSync(
  userId: string,
  targetDate: Date | string,
  versionsList?: WorkoutTemplateVersion[]
): WorkoutTemplateVersion | null {
  if (!userId || !targetDate) return null;

  const dateObj = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const checkTime = dateObj.getTime();

  const versions = versionsList || getLocalTemplateVersions(userId);
  if (!versions || versions.length === 0) return null;

  // Find version where effective_from <= checkTime and (effective_to is null or effective_to > checkTime)
  const active = versions.find((v) => {
    const fromTime = new Date(v.effective_from).getTime();
    const toTime = v.effective_to ? new Date(v.effective_to).getTime() : Infinity;
    return checkTime >= fromTime && checkTime < toTime;
  });

  return active || null;
}

/**
 * Asynchronously resolves the workout template version effective on a given date.
 * Queries Supabase if versions are not passed in.
 */
export async function getActiveTemplateVersionForDate(
  userId: string,
  targetDate: Date | string,
  versionsList?: WorkoutTemplateVersion[]
): Promise<WorkoutTemplateVersion | null> {
  const versions = versionsList || (await getUserTemplateVersions(userId));
  return getActiveTemplateVersionForDateSync(userId, targetDate, versions);
}

/**
 * Returns the planned scheduled weekday names (e.g. ['Monday', 'Friday']) effective on a specific date.
 * If NO template was active on that date, returns [] (empty array).
 */
export function getEffectiveScheduleForDateSync(
  userId: string,
  targetDate: Date | string,
  versionsList?: WorkoutTemplateVersion[]
): string[] {
  const version = getActiveTemplateVersionForDateSync(userId, targetDate, versionsList);
  return version?.scheduled_days ? [...version.scheduled_days] : [];
}
