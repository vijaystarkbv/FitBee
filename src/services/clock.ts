/**
 * Centralized Application Clock Service
 * 
 * Provides application code with a controllable concept of "now".
 * In production mode, always returns actual system date/time.
 * In development mode (import.meta.env.DEV), allows setting and shifting simulated dates.
 * 
 * Manages the application-wide "current local day" lifecycle:
 * - Detects calendar midnight crossing (23:59 -> 00:00)
 * - Detects wake-from-sleep / background tab resume via visibilitychange & focus
 * - Dispatches 'fitbee:date_changed' window event on rollover
 * - Notifies React useSyncExternalStore subscribers via dynamic snapshots
 */

const STORAGE_KEY = 'FITBEE_DEV_SIMULATED_TIME';
const isDev = Boolean(
  (typeof import.meta !== 'undefined' && import.meta.env?.DEV) ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production')
);

export function calcLocalDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

class ClockService {
  private simulatedDateStr: string | null = null;
  private currentDateKey: string = '';
  private version: number = 0;
  private listeners: Set<() => void> = new Set();
  private midnightTimeoutId: any = null;
  private heartbeatIntervalId: any = null;

  constructor() {
    if (isDev && typeof sessionStorage !== 'undefined') {
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = new Date(saved);
          if (!isNaN(parsed.getTime())) {
            this.simulatedDateStr = saved;
          }
        }
      } catch (_) {
        // Fallback if sessionStorage is disabled
      }
    }

    this.currentDateKey = calcLocalDateKey(this.now());
    this.initLifecycleWatchers();
    this.scheduleMidnightTimer();
  }

  /**
   * Initializes browser visibility, focus, online, and interval heartbeat watchers.
   * Catches date rollover even when browsers throttle background timers or laptop wakes from sleep.
   */
  private initLifecycleWatchers(): void {
    if (typeof window === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkDateRollover();
      }
    });

    window.addEventListener('focus', () => {
      this.checkDateRollover();
    });

    window.addEventListener('online', () => {
      this.checkDateRollover();
    });

    // 15-second heartbeat: zero noticeable CPU, but ensures tab never lags behind midnight
    this.heartbeatIntervalId = setInterval(() => {
      this.checkDateRollover();
    }, 15000);
  }

  /**
   * Schedules a precise timer targeting 1 second past the next local midnight.
   */
  private scheduleMidnightTimer(): void {
    if (typeof window === 'undefined') return;

    if (this.midnightTimeoutId) {
      clearTimeout(this.midnightTimeoutId);
      this.midnightTimeoutId = null;
    }

    const now = this.now();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 1
    );

    const msUntilMidnight = Math.max(1000, nextMidnight.getTime() - now.getTime());

    this.midnightTimeoutId = setTimeout(() => {
      this.checkDateRollover();
      this.scheduleMidnightTimer();
    }, msUntilMidnight);
  }

  /**
   * Evaluates if the current local calendar date has rolled over.
   * If changed, updates internal state, bumps snapshot version, notifies React subscribers,
   * and dispatches 'fitbee:date_changed' custom event.
   */
  checkDateRollover(): boolean {
    const newKey = calcLocalDateKey(this.now());
    if (newKey !== this.currentDateKey) {
      const oldKey = this.currentDateKey;
      this.currentDateKey = newKey;
      this.version++;
      this.notify();

      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('fitbee:date_changed', {
            detail: { oldDate: oldKey, newDate: newKey },
          })
        );
      }

      this.scheduleMidnightTimer();
      return true;
    }
    return false;
  }

  /**
   * Returns a stable snapshot string for useSyncExternalStore.
   * Remains constant within a single calendar day (preventing React re-render loops),
   * but changes immediately when date rolls over or version increments.
   */
  getSnapshot(): string {
    return this.simulatedDateStr
      ? `SIM_${this.simulatedDateStr}_${this.version}`
      : `REAL_${this.currentDateKey}_${this.version}`;
  }

  getVersion(): number {
    return this.version;
  }

  /**
   * Returns current application Date (simulated in DEV if active, real system time otherwise)
   */
  now(): Date {
    if (isDev && this.simulatedDateStr) {
      const parsed = new Date(this.simulatedDateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    return new Date();
  }

  /**
   * Returns current user local calendar date key (YYYY-MM-DD)
   */
  getTodayDateKey(): string {
    this.checkDateRollover();
    return this.currentDateKey;
  }

  /**
   * Checks if simulated time is currently active
   */
  isSimulated(): boolean {
    return Boolean(isDev && this.simulatedDateStr);
  }

  /**
   * Gets the active simulated Date object (or null if real time)
   */
  getSimulatedDate(): Date | null {
    if (isDev && this.simulatedDateStr) {
      const d = new Date(this.simulatedDateStr);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  }

  /**
   * Sets simulated date in development mode
   */
  setSimulatedDate(date: Date | string | null): void {
    if (!isDev) return;

    if (!date) {
      this.simulatedDateStr = null;
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    } else {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(d.getTime())) return;

      this.simulatedDateStr = d.toISOString();
      try {
        sessionStorage.setItem(STORAGE_KEY, this.simulatedDateStr);
      } catch (_) {}
    }

    this.checkDateRollover();
    this.version++;
    this.notify();
  }

  /**
   * Advances or rewinds the simulated date by N calendar days using JS Date math
   */
  advanceDays(days: number): void {
    if (!isDev) return;

    const current = this.now();
    const nextDate = new Date(current);
    nextDate.setDate(nextDate.getDate() + days);
    this.setSimulatedDate(nextDate);
  }

  /**
   * Resets simulated clock to real system time
   */
  reset(): void {
    this.setSimulatedDate(null);
  }

  /**
   * React component subscription handler
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('Error in clock listener:', err);
      }
    });
  }

  /**
   * Teardown method for unit tests and clean unmounts
   */
  destroy(): void {
    if (this.midnightTimeoutId) clearTimeout(this.midnightTimeoutId);
    if (this.heartbeatIntervalId) clearInterval(this.heartbeatIntervalId);
    this.listeners.clear();
  }
}

export const clock = new ClockService();
if (isDev && typeof window !== 'undefined') {
  (window as any).fitbeeClock = clock;
}
export const getNow = (): Date => clock.now();

