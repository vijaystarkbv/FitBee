import React, { useEffect, useState } from 'react';

interface ProgressRingProps {
  current: number;
  goal: number;
  label: string;
  unit: string;
  /** Override the ring color; defaults to var(--hd-ring-progress) */
  color?: string;
  /** Size of the SVG container; defaults to 100 */
  size?: number;
  /** Delay before the entrance animation starts (ms) */
  animationDelay?: number;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  current,
  goal,
  label,
  unit,
  color,
  size = 100,
  animationDelay = 0,
}) => {
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = goal > 0 ? Math.min(animatedCurrent / goal, 1) : 0;
  const offset = circumference - percent * circumference;

  const hasOverflow = goal > 0 && animatedCurrent > goal;
  const overflowPercent = hasOverflow ? Math.min((animatedCurrent - goal) / goal, 1) : 0;
  const overflowOffset = circumference - overflowPercent * circumference;

  // Count-up animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [animationDelay]);

  useEffect(() => {
    if (!mounted) return;

    // Animate the number counting up
    const targetValue = current;
    const duration = 1000; // 1s
    const steps = 40;
    const stepDuration = duration / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setAnimatedCurrent(Math.round(targetValue * eased));

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedCurrent(targetValue);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [mounted, current]);

  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="hd-ring-item">
      <div className="hd-ring-svg-container" style={{ width: size, height: size }}>
        <svg className="hd-ring-svg" viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="hd-ring-track"
            cx={cx}
            cy={cy}
            r={radius}
          />
          <circle
            className="hd-ring-progress"
            cx={cx}
            cy={cy}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={mounted ? offset : circumference}
            style={color ? { stroke: color } : undefined}
          />
          {hasOverflow && (
            <circle
              className="hd-ring-overflow"
              cx={cx}
              cy={cy}
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={mounted ? overflowOffset : circumference}
            />
          )}
        </svg>
        <div className="hd-ring-center">
          <span className="hd-ring-value">{animatedCurrent}</span>
          <span className="hd-ring-goal">/ {goal}</span>
        </div>
      </div>
      <div>
        <span className="hd-ring-label">{label}</span>
        <span className="hd-ring-unit"> {unit}</span>
      </div>
    </div>
  );
};
