import React, { useState, useEffect } from 'react';

interface RestTimerProps {
  defaultSeconds?: number;
  onTimerComplete?: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({ defaultSeconds = 60, onTimerComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(defaultSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [initialDuration, setInitialDuration] = useState<number>(defaultSeconds);

  useEffect(() => {
    let timerId: any = null;
    if (isRunning && timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (onTimerComplete) onTimerComplete();
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeLeft, onTimerComplete]);

  const handleStartPreset = (sec: number) => {
    setInitialDuration(sec);
    setTimeLeft(sec);
    setIsRunning(true);
  };

  const togglePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPct = initialDuration > 0 ? ((initialDuration - timeLeft) / initialDuration) * 100 : 0;

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-3.5 rounded-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-zinc-200">Rest Timer</span>
        </div>
        <span className="text-lg font-bold text-amber-400 font-mono">{formatTime(timeLeft)}</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Controls & Presets */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5">
          {[30, 60, 90, 120].map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => handleStartPreset(sec)}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
                initialDuration === sec && isRunning
                  ? 'bg-amber-500 text-zinc-950'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {sec}s
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlayPause}
            className="btn-primary text-xs py-1 px-3"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            type="button"
            onClick={resetTimer}
            className="btn-secondary text-xs py-1 px-2.5"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
