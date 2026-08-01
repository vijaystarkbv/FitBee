import React from 'react';

interface UnitToggleProps {
  label?: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (val: any) => void;
}

export const UnitToggle: React.FC<UnitToggleProps> = ({ label, value, options, onChange }) => {
  return (
    <div className="flex items-center justify-between text-xs">
      {label && <span className="font-medium text-zinc-400">{label}</span>}
      <div className="inline-flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
