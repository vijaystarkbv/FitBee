import { useSyncExternalStore, useCallback, useMemo } from 'react';
import { clock } from '../services/clock';

export function useClock() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    return clock.subscribe(onStoreChange);
  }, []);

  const getSnapshot = useCallback(() => {
    return clock.getSnapshot();
  }, []);

  // Subscribe to clock updates using React 18 useSyncExternalStore with stable snapshot
  const clockSnapshot = useSyncExternalStore(subscribe, getSnapshot, () => 'REAL_TIME');

  // Memoize now against the clock snapshot so normal renders don't re-create Date instances
  const now = useMemo(() => clock.now(), [clockSnapshot]);

  return {
    now,
    clockSnapshot,
    isSimulated: clock.isSimulated(),
    simulatedDate: clock.getSimulatedDate(),
    setSimulatedDate: (d: Date | string | null) => clock.setSimulatedDate(d),
    advanceDays: (days: number) => clock.advanceDays(days),
    reset: () => clock.reset(),
  };
}
