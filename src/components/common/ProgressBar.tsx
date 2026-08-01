import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  label: string;
  unit?: string;
  color?: 'amber' | 'emerald' | 'blue' | 'purple';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  unit = 'g',
  color = 'amber',
}) => {
  const percentage = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0;

  const colorStyles = {
    amber: 'bg-amber-500',
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-xs font-medium text-zinc-300">
        <span>{label}</span>
        <span>
          <strong className="text-zinc-100 font-semibold">{current}</strong> / {target} {unit} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${colorStyles[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
