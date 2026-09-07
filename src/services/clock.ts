/**
 * Centralized Application Clock Service
 * 
 * Provides application code with a controllable concept of "now".
 * In production mode, always returns actual system date/time.
 * In development mode (import.meta.env.DEV), allows setting and shifting simulated dates.
 */

const STORAGE_KEY = 'FITBEE_DEV_SIMULATED_TIME';
const isDev = Boolean(import.meta.env?.DEV);

class ClockService {
  private simulatedDateStr: string | null = null;
  private version: number = 0;
  private listeners: Set<() => void> = new Set();

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
  }

  /**
   * Returns a stable snapshot string for useSyncExternalStore.
   * Guarantees that in real-time mode the value is constant, avoiding React 18 infinite loops.
   */
  getSnapshot(): string {
    return this.simulatedDateStr || 'REAL_TIME';
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
    this.listeners.forEach((listener) => listener());
  }
}

export const clock = new ClockService();
if (isDev && typeof window !== 'undefined') {
  (window as any).fitbeeClock = clock;
}
export const getNow = (): Date => clock.now();
