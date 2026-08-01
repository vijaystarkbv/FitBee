import React from 'react';

interface NumberPickerProps {
  label?: string;
  value: number;
  onChange: (newValue: number) => void;
  step?: number;
  min?: number;
  max?: number;
  unit?: string;
}

export const NumberPicker: React.FC<NumberPickerProps> = ({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 999,
  unit = '',
}) => {
  const handleDecrement = () => {
    const next = Number((value - step).toFixed(1));
    if (next >= min) onChange(next);
  };

  const handleIncrement = () => {
    const next = Number((value + step).toFixed(1));
    if (next <= max) onChange(next);
  };

  return (
    <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-lg p-2.5">
      {label && <span className="text-xs font-medium text-zinc-400">{label}</span>}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md font-bold text-zinc-200 transition-colors"
        >
          -
        </button>
        <span className="text-sm font-semibold text-zinc-100 min-w-12 text-center">
          {value} {unit}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          className="w-8 h-8 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed rounded-md font-bold text-zinc-200 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
};
