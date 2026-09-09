import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Profile, Habit, HabitLog, HabitSession } from '../../types/database.types';
import {
  fetchUserHabits,
  fetchHabitDataForDate,
  toggleChecklistHabit,
  recordHabitSession,
  calculateHabitStreak,
  formatDuration,
  flushPendingHabitSessions,
  stashPendingHabitSession,
  generateUUID,
} from '../../services/habitService';
import { formatDateKey } from '../../services/streakService';
import { useClock } from '../../hooks/useClock';
import { CreateHabitModal } from './CreateHabitModal';
import { EditHabitModal } from './EditHabitModal';
import { HabitStreakCalendar } from './HabitStreakCalendar';
import { HabitFourWeekChart } from './HabitFourWeekChart';
import { REALTIME_EVENTS } from '../../services/realtimeService';
import '../Home/home.css';

interface DailyHitlistPageProps {
  profile: Profile;
  onBack: () => void;
}

interface ActiveTimerState {
  habitId: string;
  status: 'running' | 'paused';
  startedAt: string; // ISO string
  accumulatedSeconds: number; // Seconds prior to current unpaused interval
  lastTickTimestamp: number; // ms timestamp of last resume
  dateKey: string; // YYYY-MM-DD
}

const TIMER_STORAGE_KEY_PREFIX = 'fitbee_active_habit_timer_';

function getStoredTimer(userId: string, _todayKey?: string): ActiveTimerState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${TIMER_STORAGE_KEY_PREFIX}${userId}`);
    if (raw) {
      const parsed: ActiveTimerState = JSON.parse(raw);
      if (parsed.habitId) {
        return parsed;
      }
    }
  } catch (_) {}
  return null;
}

function saveStoredTimer(userId: string, timer: ActiveTimerState | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!timer) {
      localStorage.removeItem(`${TIMER_STORAGE_KEY_PREFIX}${userId}`);
    } else {
      localStorage.setItem(`${TIMER_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(timer));
    }
  } catch (_) {}
}

function calculateCurrentElapsed(timer: ActiveTimerState | null): number {
  if (!timer) return 0;
  if (timer.status === 'paused') return timer.accumulatedSeconds;
  const nowMs = Date.now();
  const delta = Math.max(0, Math.floor((nowMs - timer.lastTickTimestamp) / 1000));
  return timer.accumulatedSeconds + delta;
}

export const DailyHitlistPage: React.FC<DailyHitlistPageProps> = ({ profile, onBack }) => {
  const { now } = useClock();
  const todayKey = formatDateKey(now);

  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayLogs, setTodayLogs] = useState<Record<string, HabitLog>>({});
  const [todaySessions, setTodaySessions] = useState<Record<string, HabitSession[]>>({});
  const [streaksMap, setStreaksMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);

  // Accordion: which habit's streak history is expanded
  const [expandedHabitId, setExpandedHabitId] = useState<string | null>(null);
  const [habitMonthViews, setHabitMonthViews] = useState<Record<string, { year: number; month: number }>>({});

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Active Live Timer State (Persisted in localStorage with timestamp deltas)
  const [activeTimer, setActiveTimerState] = useState<ActiveTimerState | null>(() =>
    getStoredTimer(profile.id, todayKey)
  );
  const [liveElapsedSeconds, setLiveElapsedSeconds] = useState<number>(() =>
    calculateCurrentElapsed(getStoredTimer(profile.id, todayKey))
  );

  const setActiveTimer = (timer: ActiveTimerState | null) => {
    setActiveTimerState(timer);
    saveStoredTimer(profile.id, timer);
  };

  const timerIntervalRef = useRef<any>(null);

  // Track previous dateKey to detect midnight reset
  const prevDateKeyRef = useRef<string>(todayKey);

  // ─────────────────────────────────────────────────────────────
  // Load Habits & Today's Data
  // ─────────────────────────────────────────────────────────────
  const loadAllData = useCallback(async () => {
    try {
      const userHabits = await fetchUserHabits(profile.id);
      setHabits(userHabits);

      const todayData = await fetchHabitDataForDate(profile.id, todayKey);
      setTodayLogs(todayData.logs);
      setTodaySessions(todayData.sessions);

      // Compute streaks for each habit
      const streaks: Record<string, number> = {};
      await Promise.all(
        userHabits.map(async (h) => {
          const { currentStreak } = await calculateHabitStreak(h, profile.id, now);
          streaks[h.id] = currentStreak;
        })
      );
      setStreaksMap(streaks);
    } catch (err) {
      console.error('Failed to load Daily Hitlist data:', err);
    } finally {
      setLoading(false);
    }
  }, [profile.id, todayKey, now]);

  useEffect(() => {
    loadAllData();
    flushPendingHabitSessions(profile.id);
  }, [loadAllData, profile.id]);

  // Listen for cross-device Realtime updates to habits, logs, and timer sessions
  useEffect(() => {
    const handleHabitsSync = () => {
      loadAllData();
      flushPendingHabitSessions(profile.id);
    };

    window.addEventListener(REALTIME_EVENTS.HABIT_SESSIONS_UPDATED, handleHabitsSync);
    window.addEventListener(REALTIME_EVENTS.HABIT_LOGS_UPDATED, handleHabitsSync);
    window.addEventListener(REALTIME_EVENTS.HABITS_UPDATED, handleHabitsSync);

    return () => {
      window.removeEventListener(REALTIME_EVENTS.HABIT_SESSIONS_UPDATED, handleHabitsSync);
      window.removeEventListener(REALTIME_EVENTS.HABIT_LOGS_UPDATED, handleHabitsSync);
      window.removeEventListener(REALTIME_EVENTS.HABITS_UPDATED, handleHabitsSync);
    };
  }, [loadAllData, profile.id]);

  // ─────────────────────────────────────────────────────────────
  // Midnight Reset Handling: Reload fresh data without killing active timer
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (prevDateKeyRef.current !== todayKey) {
      // Date changed (crossed 12:00 AM midnight or time machine shifted)
      prevDateKeyRef.current = todayKey;
      // Reload fresh data for the new day and flush any pending sessions
      loadAllData();
      flushPendingHabitSessions(profile.id);
    }
  }, [todayKey, loadAllData, profile.id]);

  // ─────────────────────────────────────────────────────────────
  // Live Timer Interval & Background/Visibility Sync
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const syncTime = () => {
      if (activeTimer) {
        setLiveElapsedSeconds(calculateCurrentElapsed(activeTimer));
      }
    };

    syncTime();

    if (activeTimer && activeTimer.status === 'running') {
      timerIntervalRef.current = setInterval(syncTime, 500);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    // Immediately recalculate on returning from background or focusing window
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', syncTime);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', syncTime);
    };
  }, [activeTimer]);

  // ─────────────────────────────────────────────────────────────
  // Timer Actions: Start, Pause, Resume, Stop
  // ─────────────────────────────────────────────────────────────
  const handleStartTimer = (habitId: string) => {
    const startedIso = now.toISOString();
    const newTimer: ActiveTimerState = {
      habitId,
      status: 'running',
      startedAt: startedIso,
      accumulatedSeconds: 0,
      lastTickTimestamp: Date.now(),
      dateKey: todayKey,
    };
    setActiveTimer(newTimer);
    setLiveElapsedSeconds(0);
  };

  const handlePauseTimer = () => {
    if (!activeTimer || activeTimer.status !== 'running') return;
    const nowMs = Date.now();
    const delta = Math.max(0, Math.floor((nowMs - activeTimer.lastTickTimestamp) / 1000));
    const newAccum = activeTimer.accumulatedSeconds + delta;

    const pausedTimer: ActiveTimerState = {
      ...activeTimer,
      status: 'paused',
      accumulatedSeconds: newAccum,
      lastTickTimestamp: nowMs,
    };
    setActiveTimer(pausedTimer);
    setLiveElapsedSeconds(newAccum);
  };

  const handleResumeTimer = () => {
    if (!activeTimer || activeTimer.status !== 'paused') return;
    const resumedTimer: ActiveTimerState = {
      ...activeTimer,
      status: 'running',
      lastTickTimestamp: Date.now(),
    };
    setActiveTimer(resumedTimer);
    setLiveElapsedSeconds(resumedTimer.accumulatedSeconds);
  };

  const handleStopTimer = () => {
    if (!activeTimer) return;

    let finalSeconds = activeTimer.accumulatedSeconds;
    if (activeTimer.status === 'running') {
      const nowMs = Date.now();
      const delta = Math.max(0, Math.floor((nowMs - activeTimer.lastTickTimestamp) / 1000));
      finalSeconds += delta;
    }

    const endedIso = new Date().toISOString();
    const habit = habits.find((h) => h.id === activeTimer.habitId);
    const targetSeconds = habit?.target_duration_seconds ?? 0;
    const timerToSave = activeTimer;
    const habitId = habit ? habit.id : timerToSave.habitId;
    const activeDateKey = timerToSave.dateKey || formatDateKey(now);

    // If duration > 0, optimistically update UI and stash session
    if (finalSeconds > 0) {
      const currentSessions = todaySessions[habitId] || [];
      const sessionIndex = currentSessions.length + 1;
      const optimisticSession: HabitSession = {
        id: generateUUID(),
        user_id: profile.id,
        habit_id: habitId,
        date: activeDateKey,
        session_index: sessionIndex,
        started_at: timerToSave.startedAt,
        ended_at: endedIso,
        duration_seconds: finalSeconds,
        created_at: endedIso,
      };

      const existingLog = todayLogs[habitId];
      const newTotalDuration =
        currentSessions.reduce((acc, s) => acc + s.duration_seconds, 0) + finalSeconds;
      const isCompleted = targetSeconds > 0 && newTotalDuration >= targetSeconds;

      const optimisticLog: HabitLog = {
        id: existingLog?.id || generateUUID(),
        user_id: profile.id,
        habit_id: habitId,
        date: activeDateKey,
        is_completed: isCompleted,
        target_duration_seconds: targetSeconds,
        actual_duration_seconds: newTotalDuration,
        completed_at: isCompleted ? (existingLog?.completed_at || endedIso) : null,
        created_at: existingLog?.created_at || endedIso,
        updated_at: endedIso,
      };

      // 1. Instant 0ms Optimistic UI update
      setTodaySessions((prev) => ({
        ...prev,
        [habitId]: [...(prev[habitId] || []), optimisticSession],
      }));
      setTodayLogs((prev) => ({
        ...prev,
        [habitId]: optimisticLog,
      }));

      // 2. Durable stash in localStorage
      stashPendingHabitSession(profile.id, optimisticSession, optimisticLog);

      // 3. Clear active live timer state
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setActiveTimer(null);
      setLiveElapsedSeconds(0);

      // 4. Background remote persistence to Supabase
      recordHabitSession(
        profile.id,
        habitId,
        activeDateKey,
        timerToSave.startedAt,
        endedIso,
        finalSeconds,
        targetSeconds
      )
        .then(() => {
          // Refresh streaks in background
          const currentHabit = habits.find((h) => h.id === habitId);
          if (currentHabit) {
            calculateHabitStreak(currentHabit, profile.id, now).then(({ currentStreak }) => {
              setStreaksMap((prev) => ({ ...prev, [habitId]: currentStreak }));
            });
          }
        })
        .catch((err) => {
          console.error('Failed to log habit session to Supabase, safely kept in pending queue:', err);
        });
    } else {
      // 0 seconds elapsed: just reset timer
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setActiveTimer(null);
      setLiveElapsedSeconds(0);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Checklist Toggle
  // ─────────────────────────────────────────────────────────────
  const handleToggleChecklist = async (habitId: string) => {
    const currentLog = todayLogs[habitId];
    const newStatus = !currentLog?.is_completed;
    const activeDateKey = formatDateKey(now);

    // Optimistic UI update
    setTodayLogs((prev) => ({
      ...prev,
      [habitId]: {
        ...(prev[habitId] || {
          id: `tmp_${Date.now()}`,
          user_id: profile.id,
          habit_id: habitId,
          date: activeDateKey,
          target_duration_seconds: null,
          actual_duration_seconds: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
        is_completed: newStatus,
        completed_at: newStatus ? new Date().toISOString() : null,
      },
    }));

    try {
      await toggleChecklistHabit(profile.id, habitId, activeDateKey, newStatus);
      await loadAllData();
    } catch (err) {
      console.error('Failed to toggle checklist habit:', err);
    }
  };

  const formattedToday = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (loading) {
    return (
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '40px 24px', textAlign: 'center', color: '#6B7280', fontFamily: "'Inter', sans-serif" }}>
        Loading Your Daily Hitlist...
      </div>
    );
  }

  return (
    <div
      className="habits-container-responsive"
      style={{ maxWidth: 520, margin: '0 auto', padding: '20px 24px 100px', fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Back to Habit Tab Button ── */}
      <button
        type="button"
        onClick={onBack}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'inherit',
          fontSize: 14,
          fontWeight: 500,
          color: '#6B7280',
          padding: 0,
          marginBottom: 20,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Habits
      </button>

      {/* ── Header with + Button ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 750, color: '#1F2937', margin: 0 }}>
            Your Daily Hitlist
          </h1>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '4px 0 0' }}>
            {formattedToday}
          </p>
        </div>

        <button
          id="add-habit-plus-btn"
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          title="Create Daily Habit"
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#5C8D89',
            color: '#FFFFFF',
            fontSize: 22,
            fontWeight: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(92, 141, 137, 0.25)',
            transition: 'all 120ms ease',
          }}
        >
          +
        </button>
      </div>

      {/* ── Empty State (Section 2) ── */}
      {habits.length === 0 ? (
        <div
          className="hd-card"
          style={{
            padding: '36px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: '50%',
              backgroundColor: 'rgba(92, 141, 137, 0.12)',
              color: '#5C8D89',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
            }}
          >
            📋
          </div>

          <div>
            <h3 style={{ fontSize: 17, fontWeight: 700, color: '#1F2937', margin: 0 }}>
              Create daily checklist habit
            </h3>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '6px 0 0', maxWidth: 300 }}>
              Build daily consistency with personal checklist tasks or cumulative timed goals.
            </p>
          </div>

          <button
            id="create-first-habit-btn"
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            style={{
              marginTop: 4,
              padding: '12px 24px',
              borderRadius: 14,
              border: 'none',
              backgroundColor: '#5C8D89',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 4px 14px rgba(92, 141, 137, 0.25)',
              transition: 'all 150ms ease',
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
            <span>Create First Habit</span>
          </button>
        </div>
      ) : (
        /* ── Active Hitlist Tasks (Section 3, 10, 11, 12, 13) ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {habits.map((habit) => {
            const isTimed = habit.type === 'DURATION';
            const log = todayLogs[habit.id];
            const sessions = todaySessions[habit.id] || [];

            // Cumulative duration logged today
            const loggedDuration = sessions.reduce((acc, s) => acc + s.duration_seconds, 0);
            const targetDuration = habit.target_duration_seconds || 0;

            const isThisTimerActive = activeTimer?.habitId === habit.id;
            const currentLiveSessionSeconds = isThisTimerActive ? liveElapsedSeconds : 0;
            const displayedActualDuration = loggedDuration + currentLiveSessionSeconds;

            // Strict target completion: actual >= target
            const isTargetReached = isTimed
              ? (targetDuration > 0 && displayedActualDuration >= targetDuration)
              : Boolean(log?.is_completed);

            return (
              <div
                key={habit.id}
                className="hd-card"
                style={{
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  border: isTargetReached ? '1.5px solid #A7F3D0' : '1px solid #E8E8E6',
                  backgroundColor: isTargetReached ? '#F8FDF9' : '#FFFFFF',
                  transition: 'border-color 200ms ease',
                }}
              >
                {/* Top Row: Habit Name & Edit Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{isTimed ? '⏱️' : '✓'}</span>
                    <div>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                        {habit.name}
                      </h3>
                      <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
                        {isTimed ? `Daily target: ${formatDuration(targetDuration)}` : 'Checklist task'}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isTargetReached && (
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: 12,
                          backgroundColor: '#EAF5EE',
                          color: '#2D6A4F',
                          fontSize: 11,
                          fontWeight: 750,
                          border: '1px solid #B7E4C7',
                        }}
                      >
                        ✓ {isTimed ? 'Daily target completed' : 'Completed'}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingHabit(habit)}
                      title="Edit Habit"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        color: '#9CA3AF',
                        fontSize: 14,
                      }}
                    >
                      ✏️
                    </button>
                  </div>
                </div>

                {/* Body: Checklist or Timed Controls */}
                {!isTimed ? (
                  /* ── Checklist Task UI ── */
                  <div
                    onClick={() => handleToggleChecklist(habit.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      backgroundColor: isTargetReached ? '#EAF5EE' : '#FAFAF8',
                      borderRadius: 12,
                      cursor: 'pointer',
                      userSelect: 'none',
                      border: isTargetReached ? '1px solid #B7E4C7' : '1px solid #E5E7EB',
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 6,
                        border: isTargetReached ? '2px solid #2D6A4F' : '2px solid #D1D5DB',
                        backgroundColor: isTargetReached ? '#2D6A4F' : '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                        fontSize: 14,
                        fontWeight: 800,
                        transition: 'all 150ms ease',
                      }}
                    >
                      {isTargetReached ? '✓' : ''}
                    </div>
                    <span
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: isTargetReached ? '#2D6A4F' : '#4B5563',
                        textDecoration: isTargetReached ? 'line-through' : 'none',
                      }}
                    >
                      {isTargetReached ? 'Completed today' : 'Tap to mark as completed'}
                    </span>
                  </div>
                ) : (
                  /* ── Timed Task UI with Start / Pause / Stop ── */
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {/* Duration Progress Readout */}
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: isTargetReached ? '#2D6A4F' : '#1F2937' }}>
                          {formatDuration(displayedActualDuration)}
                        </span>
                        <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 600 }}>
                          / {formatDuration(targetDuration)}
                        </span>
                      </div>

                      {sessions.length > 0 && (
                        <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
                          {sessions.length} session{sessions.length > 1 ? 's' : ''} logged
                        </span>
                      )}
                    </div>

                    {/* Progress Fill Bar */}
                    <div style={{ height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${Math.min(100, targetDuration > 0 ? (displayedActualDuration / targetDuration) * 100 : 0)}%`,
                          backgroundColor: isTargetReached ? '#2D6A4F' : '#5C8D89',
                          borderRadius: 3,
                          transition: 'width 250ms ease',
                        }}
                      />
                    </div>

                    {/* Timer Controls (Section 11) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      {!isThisTimerActive ? (
                        /* Idle State: Start Button */
                        <button
                          type="button"
                          onClick={() => handleStartTimer(habit.id)}
                          style={{
                            flex: 1,
                            padding: '11px 16px',
                            borderRadius: 14,
                            border: 'none',
                            backgroundColor: '#5C8D89',
                            color: '#FFFFFF',
                            fontSize: 13,
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                            boxShadow: '0 4px 14px rgba(92, 141, 137, 0.25)',
                            transition: 'all 150ms ease',
                          }}
                        >
                          <span>▶</span>
                          <span>Start Timer</span>
                        </button>
                      ) : (
                        /* Active State: Pause/Resume + Red Stop Button */
                        <>
                          {activeTimer.status === 'running' ? (
                            <button
                              type="button"
                              onClick={handlePauseTimer}
                              style={{
                                flex: 1,
                                padding: '11px 14px',
                                borderRadius: 14,
                                border: '1.5px solid #D1D5DB',
                                backgroundColor: '#FFFFFF',
                                color: '#1F2937',
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                              }}
                            >
                              <span>⏸</span>
                              <span>Pause ({formatDuration(currentLiveSessionSeconds)})</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleResumeTimer}
                              style={{
                                flex: 1,
                                padding: '11px 14px',
                                borderRadius: 14,
                                border: 'none',
                                backgroundColor: '#5C8D89',
                                color: '#FFFFFF',
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                boxShadow: '0 4px 14px rgba(92, 141, 137, 0.25)',
                              }}
                            >
                              <span>▶</span>
                              <span>Resume ({formatDuration(currentLiveSessionSeconds)})</span>
                            </button>
                          )}

                          {/* Separate Red Stop Button */}
                          <button
                            type="button"
                            onClick={handleStopTimer}
                            style={{
                              padding: '10px 18px',
                              borderRadius: 12,
                              border: 'none',
                              backgroundColor: '#DC2626',
                              color: '#FFFFFF',
                              fontSize: 13,
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 6,
                              boxShadow: '0 2px 4px rgba(220, 38, 38, 0.25)',
                            }}
                          >
                            <span>⏹</span>
                            <span>Stop</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Streaks Section (Section 18, 19, 20) ── */}
      {habits.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <div style={{ marginBottom: 14 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 750,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: '#5C8D89',
              }}
            >
              Personal Habit Streaks
            </span>
            <h2 style={{ fontSize: 20, fontWeight: 750, color: '#1F2937', margin: '2px 0 0' }}>
              Streaks
            </h2>
            <p style={{ fontSize: 13, color: '#6B7280', margin: '2px 0 0' }}>
              Requires 100% daily target completion. Tap a habit to inspect its calendar & 4-week progress.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {habits.map((habit) => {
              const streakDays = streaksMap[habit.id] || 0;
              const isExpanded = expandedHabitId === habit.id;

              return (
                <div
                  key={habit.id}
                  id={`habit-streak-card-${habit.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hd-card"
                  style={{
                    padding: '16px 18px',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    border: isExpanded ? '1.5px solid #5C8D89' : '1px solid #E8E8E6',
                  }}
                  onClick={() => setExpandedHabitId(isExpanded ? null : habit.id)}
                >
                  {/* Streak Card Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 18 }}>{habit.type === 'DURATION' ? '⏱️' : '✓'}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>
                        {habit.name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '4px 10px',
                          borderRadius: 12,
                          backgroundColor: streakDays > 0 ? '#FFF7ED' : '#F3F4F6',
                          color: streakDays > 0 ? '#C2410C' : '#9CA3AF',
                          fontSize: 13,
                          fontWeight: 750,
                          border: streakDays > 0 ? '1px solid #FFEDD5' : '1px solid #E5E7EB',
                        }}
                      >
                        <span>🔥</span>
                        <span>{streakDays} day{streakDays !== 1 ? 's' : ''}</span>
                      </div>

                      <span style={{ fontSize: 14, color: '#9CA3AF', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* ── Expanded Section: Month Calendar & Weekly Progress ── */}
                  {isExpanded && (() => {
                    const habitMonth = habitMonthViews[habit.id] || {
                      year: now.getFullYear(),
                      month: now.getMonth(),
                    };

                    return (
                      <div
                        style={{
                          marginTop: 18,
                          paddingTop: 16,
                          borderTop: '1px solid #F3F4F6',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 20,
                          animation: 'fadeInUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* 1. Monthly Calendar */}
                        <div>
                          <HabitStreakCalendar
                            habit={habit}
                            userId={profile.id}
                            currentDate={now}
                            viewYear={habitMonth.year}
                            viewMonth={habitMonth.month}
                            onMonthChange={(year, month) => {
                              setHabitMonthViews((prev) => ({
                                ...prev,
                                [habit.id]: { year, month },
                              }));
                            }}
                          />
                        </div>

                        {/* 2. Month-Based Weekly Progress */}
                        <div>
                          <HabitFourWeekChart
                            habit={habit}
                            userId={profile.id}
                            currentDate={now}
                            year={habitMonth.year}
                            month={habitMonth.month}
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Create Habit Modal ── */}
      {isCreateModalOpen && (
        <CreateHabitModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          userId={profile.id}
          onHabitCreated={(newHabit) => {
            setHabits((prev) => [...prev, newHabit]);
            loadAllData();
          }}
        />
      )}

      {/* ── Edit Habit Modal ── */}
      {editingHabit && (
        <EditHabitModal
          isOpen={Boolean(editingHabit)}
          onClose={() => setEditingHabit(null)}
          habit={editingHabit}
          userId={profile.id}
          onHabitUpdated={(updated) => {
            setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
            loadAllData();
          }}
          onHabitDeleted={(habitId) => {
            setHabits((prev) => prev.filter((h) => h.id !== habitId));
            if (expandedHabitId === habitId) setExpandedHabitId(null);
            loadAllData();
          }}
        />
      )}
    </div>
  );
};
