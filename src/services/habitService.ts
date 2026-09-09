import { supabase } from './supabaseClient';
import { Habit, HabitType, HabitSession, HabitLog } from '../types/database.types';
import { formatDateKey } from './streakService';

const LOCAL_STORAGE_PREFIX = 'FITBEE_HABIT_STORE_';

interface LocalHabitStore {
  habits: Habit[];
  sessions: HabitSession[];
  logs: HabitLog[];
}

const memoryStore: Record<string, LocalHabitStore> = {};

function getLocalStore(userId: string): LocalHabitStore {
  if (typeof localStorage === 'undefined') {
    if (!memoryStore[userId]) {
      memoryStore[userId] = { habits: [], sessions: [], logs: [] };
    }
    return memoryStore[userId];
  }
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Could not read habit store from localStorage:', err);
  }
  return { habits: [], sessions: [], logs: [] };
}

function saveLocalStore(userId: string, store: LocalHabitStore): void {
  if (typeof localStorage === 'undefined') {
    memoryStore[userId] = store;
    return;
  }
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${userId}`, JSON.stringify(store));
  } catch (err) {
    console.warn('Could not save habit store to localStorage:', err);
  }
}


// ─────────────────────────────────────────────────────────────
// Format Helpers
// ─────────────────────────────────────────────────────────────

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0h 00m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const padM = m < 10 ? `0${m}` : `${m}`;
  return `${h}h ${padM}m`;
}

export function formatDurationShort(seconds: number): string {
  if (!seconds || seconds <= 0) return '0m';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

export function formatTimeAmPm(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (_) {
    return '';
  }
}

// ─────────────────────────────────────────────────────────────
// Habit CRUD
// ─────────────────────────────────────────────────────────────

export async function fetchUserHabits(userId: string): Promise<Habit[]> {
  const local = getLocalStore(userId);
  try {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (!error && data) {
      // Sync local store
      local.habits = data;
      saveLocalStore(userId, local);
      return data;
    }
  } catch (err) {
    console.warn('Using local store for habits:', err);
  }

  return local.habits.filter((h) => h.is_active);
}

export async function createHabit(
  userId: string,
  data: {
    name: string;
    type: HabitType;
    targetHours?: number;
    targetMinutes?: number;
    notifications_enabled?: boolean;
  }
): Promise<Habit> {
  const targetSeconds =
    data.type === 'DURATION'
      ? Math.max(0, Number(data.targetHours || 0) * 3600 + Number(data.targetMinutes || 0) * 60)
      : null;

  const newHabit: Habit = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `habit_${Date.now()}`,
    user_id: userId,
    name: data.name.trim(),
    type: data.type,
    target_duration_seconds: targetSeconds,
    notifications_enabled: Boolean(data.notifications_enabled),
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Persist locally
  const local = getLocalStore(userId);
  local.habits.push(newHabit);
  saveLocalStore(userId, local);

  // Attempt Supabase insert
  try {
    const { data: dbData, error } = await supabase
      .from('habits')
      .insert({
        id: newHabit.id,
        user_id: newHabit.user_id,
        name: newHabit.name,
        type: newHabit.type,
        target_duration_seconds: newHabit.target_duration_seconds,
        notifications_enabled: newHabit.notifications_enabled,
        is_active: newHabit.is_active,
        created_at: newHabit.created_at,
        updated_at: newHabit.updated_at,
      })
      .select()
      .single();

    if (!error && dbData) {
      return dbData;
    }
  } catch (err) {
    console.warn('Could not insert habit into Supabase, using local:', err);
  }

  return newHabit;
}

export async function updateHabit(
  userId: string,
  habitId: string,
  data: {
    name?: string;
    targetHours?: number;
    targetMinutes?: number;
    notifications_enabled?: boolean;
  }
): Promise<Habit | null> {
  const local = getLocalStore(userId);
  const idx = local.habits.findIndex((h) => h.id === habitId);
  if (idx === -1) return null;

  const targetSeconds =
    data.targetHours !== undefined || data.targetMinutes !== undefined
      ? Math.max(0, Number(data.targetHours || 0) * 3600 + Number(data.targetMinutes || 0) * 60)
      : local.habits[idx].target_duration_seconds;

  const updated: Habit = {
    ...local.habits[idx],
    ...(data.name !== undefined && { name: data.name.trim() }),
    ...(targetSeconds !== undefined && { target_duration_seconds: targetSeconds }),
    ...(data.notifications_enabled !== undefined && { notifications_enabled: data.notifications_enabled }),
    updated_at: new Date().toISOString(),
  };

  local.habits[idx] = updated;
  saveLocalStore(userId, local);

  try {
    await supabase
      .from('habits')
      .update({
        name: updated.name,
        target_duration_seconds: updated.target_duration_seconds,
        notifications_enabled: updated.notifications_enabled,
        updated_at: updated.updated_at,
      })
      .eq('id', habitId);
  } catch (err) {
    console.warn('Could not update habit in Supabase, using local:', err);
  }

  return updated;
}

export async function deleteHabit(userId: string, habitId: string): Promise<void> {
  // Soft delete to preserve historical sessions & streak integrity
  const local = getLocalStore(userId);
  const idx = local.habits.findIndex((h) => h.id === habitId);
  if (idx !== -1) {
    local.habits[idx].is_active = false;
    saveLocalStore(userId, local);
  }

  try {
    await supabase.from('habits').update({ is_active: false, updated_at: new Date().toISOString() }).eq('id', habitId);
  } catch (err) {
    console.warn('Could not deactivate habit in Supabase:', err);
  }
}

// ─────────────────────────────────────────────────────────────
// Daily Progress & Sessions
// ─────────────────────────────────────────────────────────────

export interface DailyHabitData {
  logs: Record<string, HabitLog>; // habitId -> HabitLog
  sessions: Record<string, HabitSession[]>; // habitId -> HabitSession[]
}

export async function fetchHabitDataForDate(userId: string, dateStr: string): Promise<DailyHabitData> {
  const local = getLocalStore(userId);
  const result: DailyHabitData = { logs: {}, sessions: {} };

  try {
    const [logsRes, sessionsRes] = await Promise.all([
      supabase.from('habit_logs').select('*').eq('user_id', userId).eq('date', dateStr),
      supabase.from('habit_sessions').select('*').eq('user_id', userId).eq('date', dateStr).order('session_index', { ascending: true }),
    ]);

    if (!logsRes.error && logsRes.data) {
      logsRes.data.forEach((log) => {
        result.logs[log.habit_id] = log;
      });
    } else {
      local.logs.filter((l) => l.date === dateStr).forEach((log) => {
        result.logs[log.habit_id] = log;
      });
    }

    if (!sessionsRes.error && sessionsRes.data) {
      sessionsRes.data.forEach((s) => {
        if (!result.sessions[s.habit_id]) result.sessions[s.habit_id] = [];
        result.sessions[s.habit_id].push(s);
      });
    } else {
      local.sessions.filter((s) => s.date === dateStr).forEach((s) => {
        if (!result.sessions[s.habit_id]) result.sessions[s.habit_id] = [];
        result.sessions[s.habit_id].push(s);
      });
    }
  } catch (err) {
    console.warn('Error fetching habit date data, using local:', err);
    local.logs.filter((l) => l.date === dateStr).forEach((log) => {
      result.logs[log.habit_id] = log;
    });
    local.sessions.filter((s) => s.date === dateStr).forEach((s) => {
      if (!result.sessions[s.habit_id]) result.sessions[s.habit_id] = [];
      result.sessions[s.habit_id].push(s);
    });
  }

  return result;
}

export async function toggleChecklistHabit(
  userId: string,
  habitId: string,
  dateStr: string,
  isCompleted: boolean
): Promise<HabitLog> {
  const local = getLocalStore(userId);
  const existingIdx = local.logs.findIndex((l) => l.habit_id === habitId && l.date === dateStr);

  const habit = local.habits.find((h) => h.id === habitId);
  const targetSnapshot = habit ? habit.target_duration_seconds : null;

  const updatedLog: HabitLog = {
    id: existingIdx !== -1 ? local.logs[existingIdx].id : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}`),
    user_id: userId,
    habit_id: habitId,
    date: dateStr,
    is_completed: isCompleted,
    target_duration_seconds: targetSnapshot,
    actual_duration_seconds: 0,
    completed_at: isCompleted ? new Date().toISOString() : null,
    created_at: existingIdx !== -1 ? local.logs[existingIdx].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingIdx !== -1) {
    local.logs[existingIdx] = updatedLog;
  } else {
    local.logs.push(updatedLog);
  }
  saveLocalStore(userId, local);

  try {
    await supabase.from('habit_logs').upsert(
      {
        id: updatedLog.id,
        user_id: userId,
        habit_id: habitId,
        date: dateStr,
        is_completed: isCompleted,
        target_duration_seconds: targetSnapshot,
        actual_duration_seconds: 0,
        completed_at: updatedLog.completed_at,
        updated_at: updatedLog.updated_at,
      },
      { onConflict: 'habit_id,date' }
    );
  } catch (err) {
    console.warn('Could not upsert checklist log to Supabase:', err);
  }

  return updatedLog;
}

const PENDING_SESSIONS_PREFIX = 'fitbee_pending_habit_sessions_';

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (_) {}
  }
  // RFC4122 v4 UUID fallback (ensures valid Postgres UUID)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface PendingHabitSessionItem {
  session: HabitSession;
  log: HabitLog;
}

export function getPendingHabitSessions(userId: string): PendingHabitSessionItem[] {
  if (typeof window === 'undefined' || !userId) return [];
  try {
    const raw = localStorage.getItem(`${PENDING_SESSIONS_PREFIX}${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

export function stashPendingHabitSession(userId: string, session: HabitSession, log: HabitLog): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    const pending = getPendingHabitSessions(userId);
    if (!pending.some((p) => p.session.id === session.id)) {
      pending.push({ session, log });
      localStorage.setItem(`${PENDING_SESSIONS_PREFIX}${userId}`, JSON.stringify(pending));
    }
  } catch (_) {}
}

export function removePendingHabitSession(userId: string, sessionId: string): void {
  if (typeof window === 'undefined' || !userId) return;
  try {
    const pending = getPendingHabitSessions(userId).filter((p) => p.session.id !== sessionId);
    localStorage.setItem(`${PENDING_SESSIONS_PREFIX}${userId}`, JSON.stringify(pending));
  } catch (_) {}
}

export async function flushPendingHabitSessions(userId: string): Promise<void> {
  if (typeof window === 'undefined' || !userId) return;
  const pending = getPendingHabitSessions(userId);
  if (pending.length === 0) return;

  for (const item of pending) {
    try {
      const [sessRes, logRes] = await Promise.all([
        supabase.from('habit_sessions').upsert({
          id: item.session.id,
          user_id: item.session.user_id,
          habit_id: item.session.habit_id,
          date: item.session.date,
          session_index: item.session.session_index,
          started_at: item.session.started_at,
          ended_at: item.session.ended_at,
          duration_seconds: item.session.duration_seconds,
          created_at: item.session.created_at,
        }),
        supabase.from('habit_logs').upsert(
          {
            id: item.log.id,
            user_id: item.log.user_id,
            habit_id: item.log.habit_id,
            date: item.log.date,
            is_completed: item.log.is_completed,
            target_duration_seconds: item.log.target_duration_seconds,
            actual_duration_seconds: item.log.actual_duration_seconds,
            completed_at: item.log.completed_at,
            updated_at: item.log.updated_at,
          },
          { onConflict: 'habit_id,date' }
        ),
      ]);

      if (!sessRes.error && !logRes.error) {
        removePendingHabitSession(userId, item.session.id);
      }
    } catch (e) {
      console.warn('Flush attempt failed for session:', item.session.id, e);
    }
  }
}

export async function recordHabitSession(
  userId: string,
  habitId: string,
  dateStr: string,
  startedAt: string,
  endedAt: string,
  durationSeconds: number,
  habitTargetSeconds: number | null
): Promise<{ session: HabitSession; log: HabitLog }> {
  const local = getLocalStore(userId);

  // Existing sessions for this habit and date
  const existingSessions = local.sessions.filter((s) => s.habit_id === habitId && s.date === dateStr);
  const sessionIndex = existingSessions.length + 1;

  const newSession: HabitSession = {
    id: generateUUID(),
    user_id: userId,
    habit_id: habitId,
    date: dateStr,
    session_index: sessionIndex,
    started_at: startedAt,
    ended_at: endedAt,
    duration_seconds: durationSeconds,
    created_at: new Date().toISOString(),
  };

  local.sessions.push(newSession);

  // Calculate cumulative actual duration for this habit today (all sessions)
  const totalDurationToday =
    existingSessions.reduce((acc, s) => acc + s.duration_seconds, 0) + durationSeconds;

  // Strict binary completion: actual >= target
  const isCompleted = habitTargetSeconds !== null && habitTargetSeconds > 0 && totalDurationToday >= habitTargetSeconds;

  const existingLogIdx = local.logs.findIndex((l) => l.habit_id === habitId && l.date === dateStr);
  const updatedLog: HabitLog = {
    id: existingLogIdx !== -1 ? local.logs[existingLogIdx].id : generateUUID(),
    user_id: userId,
    habit_id: habitId,
    date: dateStr,
    is_completed: isCompleted,
    target_duration_seconds: habitTargetSeconds,
    actual_duration_seconds: totalDurationToday,
    completed_at: isCompleted ? new Date().toISOString() : null,
    created_at: existingLogIdx !== -1 ? local.logs[existingLogIdx].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingLogIdx !== -1) {
    local.logs[existingLogIdx] = updatedLog;
  } else {
    local.logs.push(updatedLog);
  }

  saveLocalStore(userId, local);

  // Stash in durable pending queue before remote write
  stashPendingHabitSession(userId, newSession, updatedLog);

  try {
    const [sessRes, logRes] = await Promise.all([
      supabase.from('habit_sessions').insert({
        id: newSession.id,
        user_id: userId,
        habit_id: habitId,
        date: dateStr,
        session_index: sessionIndex,
        started_at: startedAt,
        ended_at: endedAt,
        duration_seconds: durationSeconds,
        created_at: newSession.created_at,
      }),
      supabase.from('habit_logs').upsert(
        {
          id: updatedLog.id,
          user_id: userId,
          habit_id: habitId,
          date: dateStr,
          is_completed: isCompleted,
          target_duration_seconds: habitTargetSeconds,
          actual_duration_seconds: totalDurationToday,
          completed_at: updatedLog.completed_at,
          updated_at: updatedLog.updated_at,
        },
        { onConflict: 'habit_id,date' }
      ),
    ]);

    if (sessRes.error) {
      console.error('Supabase habit_sessions insert error:', sessRes.error);
      throw sessRes.error;
    }
    if (logRes.error) {
      console.error('Supabase habit_logs upsert error:', logRes.error);
      throw logRes.error;
    }

    // Remote persistence confirmed -> remove from pending stash
    removePendingHabitSession(userId, newSession.id);
  } catch (err) {
    console.warn('Could not record habit session to Supabase, kept in durable pending stash:', err);
    // Do not swallow if caller wants to know, but session remains safely stored locally
  }

  return { session: newSession, log: updatedLog };
}

// ─────────────────────────────────────────────────────────────
// Streak Calculation (Per Habit, Binary, Strict Target)
// ─────────────────────────────────────────────────────────────

export async function calculateHabitStreak(
  habit: Habit,
  userId: string,
  currentDate: Date
): Promise<{ currentStreak: number; bestStreak: number }> {
  const local = getLocalStore(userId);
  let allLogs: HabitLog[] = [];

  try {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('habit_id', habit.id)
      .eq('user_id', userId);

    if (!error && data) {
      allLogs = data;
    } else {
      allLogs = local.logs.filter((l) => l.habit_id === habit.id);
    }
  } catch (_) {
    allLogs = local.logs.filter((l) => l.habit_id === habit.id);
  }

  const completionMap = new Map<string, boolean>();
  allLogs.forEach((l) => {
    completionMap.set(l.date, l.is_completed);
  });

  const todayStr = formatDateKey(currentDate);
  const todayCompleted = Boolean(completionMap.get(todayStr));

  // Determine starting point for current streak check
  let currentStreak = 0;
  let checkDate = new Date(currentDate);

  if (todayCompleted) {
    currentStreak = 1;
    // Step back to yesterday
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    // Today is not completed yet, check if yesterday was completed to keep streak alive
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = formatDateKey(checkDate);
    if (!completionMap.get(yesterdayStr)) {
      return { currentStreak: 0, bestStreak: 0 };
    }
  }

  // Walk backwards day by day as long as completed
  while (true) {
    const dStr = formatDateKey(checkDate);
    if (completionMap.get(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Calculate best streak historically
  let bestStreak = currentStreak;
  const sortedDates = Array.from(completionMap.keys()).sort();
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dStr of sortedDates) {
    const isComp = completionMap.get(dStr);
    const d = new Date(dStr);
    if (isComp) {
      if (prevDate) {
        const diffDays = Math.round((d.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      prevDate = d;
      if (tempStreak > bestStreak) bestStreak = tempStreak;
    } else {
      tempStreak = 0;
      prevDate = null;
    }
  }

  return { currentStreak, bestStreak };
}

// ─────────────────────────────────────────────────────────────
// Monthly Calendar History
// ─────────────────────────────────────────────────────────────

export interface HabitMonthDayDetail {
  dateStr: string;
  date: Date;
  isStreakDay: boolean;
  log: HabitLog | null;
  sessions: HabitSession[];
}

export async function fetchHabitMonthHistory(
  userId: string,
  habitId: string,
  year: number,
  month: number // 0-indexed (0 = Jan, 8 = Sep)
): Promise<Record<string, HabitMonthDayDetail>> {
  const local = getLocalStore(userId);
  const result: Record<string, HabitMonthDayDetail> = {};

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Initialize all days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day);
    const dateStr = formatDateKey(d);
    result[dateStr] = {
      dateStr,
      date: d,
      isStreakDay: false,
      log: null,
      sessions: [],
    };
  }

  const startDateStr = formatDateKey(new Date(year, month, 1));
  const endDateStr = formatDateKey(new Date(year, month, daysInMonth));

  let monthLogs: HabitLog[] = [];
  let monthSessions: HabitSession[] = [];

  try {
    const [lRes, sRes] = await Promise.all([
      supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('date', startDateStr)
        .lte('date', endDateStr),
      supabase
        .from('habit_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('date', startDateStr)
        .lte('date', endDateStr)
        .order('session_index', { ascending: true }),
    ]);

    if (!lRes.error && lRes.data) {
      monthLogs = lRes.data;
    } else {
      monthLogs = local.logs.filter(
        (l) => l.habit_id === habitId && l.date >= startDateStr && l.date <= endDateStr
      );
    }

    if (!sRes.error && sRes.data) {
      monthSessions = sRes.data;
    } else {
      monthSessions = local.sessions.filter(
        (s) => s.habit_id === habitId && s.date >= startDateStr && s.date <= endDateStr
      );
    }
  } catch (_) {
    monthLogs = local.logs.filter(
      (l) => l.habit_id === habitId && l.date >= startDateStr && l.date <= endDateStr
    );
    monthSessions = local.sessions.filter(
      (s) => s.habit_id === habitId && s.date >= startDateStr && s.date <= endDateStr
    );
  }

  monthLogs.forEach((l) => {
    if (result[l.date]) {
      result[l.date].log = l;
      result[l.date].isStreakDay = l.is_completed;
    }
  });

  monthSessions.forEach((s) => {
    if (result[s.date]) {
      result[s.date].sessions.push(s);
    }
  });

  return result;
}

// ─────────────────────────────────────────────────────────────
// 4-Week Progress History (M-SU line graphs, weekly totals)
// ─────────────────────────────────────────────────────────────

export interface HabitWeekDayPoint {
  dateStr: string;
  dayLabel: string; // M, T, W, TH, F, S, SU
  fullDayName: string;
  hours: number; // e.g. 3.5 for 3h 30m
  seconds: number;
  isFuture: boolean;
  isToday: boolean;
  isCompleted: boolean;
}

export interface HabitWeekData {
  weekIndex: number; // 1, 2, 3, 4
  weekLabel: string; // e.g. "Aug 17 – Aug 23, 2026"
  startDate: string;
  endDate: string;
  isCurrentWeek: boolean;
  days: HabitWeekDayPoint[];
  totalSeconds: number;
  totalHours: number;
  totalMinutes: number;
}

const DAY_LABELS = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
const FULL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export async function fetchHabitFourWeekHistory(
  userId: string,
  habitId: string,
  referenceDate: Date
): Promise<HabitWeekData[]> {
  const local = getLocalStore(userId);
  const todayStr = formatDateKey(referenceDate);

  // Find Monday of the current week
  // In JS getDay(): 0 is Sunday, 1 is Monday... 6 is Saturday
  const currentDayOfWeek = referenceDate.getDay();
  // Monday distance: 0 (Sun) -> 6 days back, 1 (Mon) -> 0 days, 2 (Tue) -> 1 day...
  const distanceToMonday = (currentDayOfWeek + 6) % 7;

  const currentMonday = new Date(referenceDate);
  currentMonday.setDate(currentMonday.getDate() - distanceToMonday);
  currentMonday.setHours(0, 0, 0, 0);

  // We want 4 weeks:
  // Week 1: Monday 3 weeks ago
  // Week 2: Monday 2 weeks ago
  // Week 3: Monday 1 week ago
  // Week 4: Current Monday
  const weekStartMondays: Date[] = [];
  for (let i = 3; i >= 0; i--) {
    const m = new Date(currentMonday);
    m.setDate(m.getDate() - i * 7);
    weekStartMondays.push(m);
  }

  const earliestDateStr = formatDateKey(weekStartMondays[0]);
  const latestSunday = new Date(currentMonday);
  latestSunday.setDate(latestSunday.getDate() + 6);
  const latestDateStr = formatDateKey(latestSunday);

  // Fetch all sessions and logs in range
  let allSessions: HabitSession[] = [];
  let allLogs: HabitLog[] = [];

  try {
    const [sRes, lRes] = await Promise.all([
      supabase
        .from('habit_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('date', earliestDateStr)
        .lte('date', latestDateStr),
      supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('date', earliestDateStr)
        .lte('date', latestDateStr),
    ]);

    if (!sRes.error && sRes.data) {
      allSessions = sRes.data;
    } else {
      allSessions = local.sessions.filter(
        (s) => s.habit_id === habitId && s.date >= earliestDateStr && s.date <= latestDateStr
      );
    }

    if (!lRes.error && lRes.data) {
      allLogs = lRes.data;
    } else {
      allLogs = local.logs.filter(
        (l) => l.habit_id === habitId && l.date >= earliestDateStr && l.date <= latestDateStr
      );
    }
  } catch (_) {
    allSessions = local.sessions.filter(
      (s) => s.habit_id === habitId && s.date >= earliestDateStr && s.date <= latestDateStr
    );
    allLogs = local.logs.filter(
      (l) => l.habit_id === habitId && l.date >= earliestDateStr && l.date <= latestDateStr
    );
  }

  // Map duration per date
  const durationMap = new Map<string, number>();
  allSessions.forEach((s) => {
    durationMap.set(s.date, (durationMap.get(s.date) || 0) + s.duration_seconds);
  });

  const completionMap = new Map<string, boolean>();
  allLogs.forEach((l) => {
    completionMap.set(l.date, l.is_completed);
  });

  const weeks: HabitWeekData[] = [];

  weekStartMondays.forEach((monday, idx) => {
    const weekIndex = idx + 1;
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);

    const isCurrentWeek = idx === 3;
    const days: HabitWeekDayPoint[] = [];
    let totalSeconds = 0;

    for (let d = 0; d < 7; d++) {
      const dayDate = new Date(monday);
      dayDate.setDate(dayDate.getDate() + d);
      const dStr = formatDateKey(dayDate);
      const isToday = dStr === todayStr;
      const isFuture = isCurrentWeek && dayDate > referenceDate && !isToday;

      // Actual accumulated seconds
      const seconds = isFuture ? 0 : durationMap.get(dStr) || 0;
      const hours = Math.round((seconds / 3600) * 100) / 100; // 2 decimal precision

      if (!isFuture) {
        totalSeconds += seconds;
      }

      days.push({
        dateStr: dStr,
        dayLabel: DAY_LABELS[d],
        fullDayName: FULL_DAYS[d],
        hours,
        seconds,
        isFuture,
        isToday,
        isCompleted: Boolean(completionMap.get(dStr)),
      });
    }

    const startMonthStr = monday.toLocaleDateString('en-US', { month: 'short' });
    const endMonthStr = sunday.toLocaleDateString('en-US', { month: 'short' });
    const yearStr = sunday.getFullYear();
    const weekLabel =
      startMonthStr === endMonthStr
        ? `${startMonthStr} ${monday.getDate()} – ${sunday.getDate()}, ${yearStr}`
        : `${startMonthStr} ${monday.getDate()} – ${endMonthStr} ${sunday.getDate()}, ${yearStr}`;

    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

    weeks.push({
      weekIndex,
      weekLabel,
      startDate: formatDateKey(monday),
      endDate: formatDateKey(sunday),
      isCurrentWeek,
      days,
      totalSeconds,
      totalHours,
      totalMinutes,
    });
  });

  return weeks;
}

export interface HabitMonthWeeklyData extends HabitWeekData {
  hasData: boolean;
  loggedCount: number;
}

/**
 * Fetches month-based weekly history for a habit (aligned with Nutrition & Workout History)
 */
export async function fetchHabitMonthWeeklyHistory(
  userId: string,
  habitId: string,
  year: number,
  month: number, // 0-indexed
  referenceDate: Date
): Promise<HabitMonthWeeklyData[]> {
  const local = getLocalStore(userId);
  const todayStr = formatDateKey(referenceDate);

  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  // Generate weeks touching this month (identical to buildMonthWeeklySummaries in nutritionHistoryService)
  let currentRef = new Date(firstOfMonth);
  const weekBoundariesList: { monday: Date; sunday: Date }[] = [];

  while (currentRef <= lastOfMonth) {
    const d = new Date(currentRef);
    const dayOfWeek = d.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday, 0, 0, 0, 0);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59, 999);

    weekBoundariesList.push({ monday, sunday });
    currentRef = new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + 1);
  }

  if (weekBoundariesList.length === 0) return [];

  const earliestDateStr = formatDateKey(weekBoundariesList[0].monday);
  const latestDateStr = formatDateKey(weekBoundariesList[weekBoundariesList.length - 1].sunday);

  // Fetch all sessions and logs in range
  let allSessions: HabitSession[] = [];
  let allLogs: HabitLog[] = [];

  try {
    const [sRes, lRes] = await Promise.all([
      supabase
        .from('habit_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('date', earliestDateStr)
        .lte('date', latestDateStr),
      supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('habit_id', habitId)
        .gte('date', earliestDateStr)
        .lte('date', latestDateStr),
    ]);

    if (!sRes.error && sRes.data) {
      allSessions = sRes.data;
    } else {
      allSessions = local.sessions.filter(
        (s) => s.habit_id === habitId && s.date >= earliestDateStr && s.date <= latestDateStr
      );
    }

    if (!lRes.error && lRes.data) {
      allLogs = lRes.data;
    } else {
      allLogs = local.logs.filter(
        (l) => l.habit_id === habitId && l.date >= earliestDateStr && l.date <= latestDateStr
      );
    }
  } catch (_) {
    allSessions = local.sessions.filter(
      (s) => s.habit_id === habitId && s.date >= earliestDateStr && s.date <= latestDateStr
    );
    allLogs = local.logs.filter(
      (l) => l.habit_id === habitId && l.date >= earliestDateStr && l.date <= latestDateStr
    );
  }

  const durationMap = new Map<string, number>();
  allSessions.forEach((s) => {
    durationMap.set(s.date, (durationMap.get(s.date) || 0) + s.duration_seconds);
  });

  const completionMap = new Map<string, boolean>();
  allLogs.forEach((l) => {
    completionMap.set(l.date, l.is_completed);
  });

  const weeks: HabitMonthWeeklyData[] = [];

  weekBoundariesList.forEach(({ monday, sunday }, idx) => {
    const weekIndex = idx + 1;
    const startStr = formatDateKey(monday);
    const endStr = formatDateKey(sunday);
    const isCurrentWeek = todayStr >= startStr && todayStr <= endStr;

    const days: HabitWeekDayPoint[] = [];
    let totalSeconds = 0;
    let loggedCount = 0;

    for (let d = 0; d < 7; d++) {
      const dayDate = new Date(monday);
      dayDate.setDate(dayDate.getDate() + d);
      const dStr = formatDateKey(dayDate);
      const isToday = dStr === todayStr;
      const isFuture = dayDate > referenceDate && !isToday;

      const seconds = isFuture ? 0 : durationMap.get(dStr) || 0;
      const hours = Math.round((seconds / 3600) * 100) / 100;
      const isCompleted = Boolean(completionMap.get(dStr));

      if (!isFuture) {
        totalSeconds += seconds;
      }

      // Check if this day has habit activity: either duration recorded or habit completed / logged
      const hasDayData = (!isFuture && seconds > 0) || isCompleted;
      if (hasDayData) {
        loggedCount++;
      }

      days.push({
        dateStr: dStr,
        dayLabel: DAY_LABELS[d],
        fullDayName: FULL_DAYS[d],
        hours,
        seconds,
        isFuture,
        isToday,
        isCompleted,
      });
    }

    const startMonthStr = monday.toLocaleDateString('en-US', { month: 'short' });
    const endMonthStr = sunday.toLocaleDateString('en-US', { month: 'short' });
    const weekLabel =
      startMonthStr === endMonthStr
        ? `Week ${weekIndex} (${startMonthStr} ${monday.getDate()} – ${sunday.getDate()})`
        : `Week ${weekIndex} (${startMonthStr} ${monday.getDate()} – ${endMonthStr} ${sunday.getDate()})`;

    const totalHours = Math.floor(totalSeconds / 3600);
    const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

    weeks.push({
      weekIndex,
      weekLabel,
      startDate: startStr,
      endDate: endStr,
      isCurrentWeek,
      days,
      totalSeconds,
      totalHours,
      totalMinutes,
      loggedCount,
      hasData: loggedCount > 0,
    });
  });

  return weeks;
}

