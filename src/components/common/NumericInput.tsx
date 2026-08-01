import React, { useState, useEffect } from 'react';

interface NumericInputProps {
  label?: string;
  value: number | null | undefined;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  unit?: string;
  className?: string;
  disabled?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  placeholder = '',
  unit,
  className = '',
  disabled = false,
}) => {
  // Local string state allows free backspacing and clearing without instant fallback override
  const [localStr, setLocalStr] = useState<string>(value !== null && value !== undefined ? String(value) : '');
  const [errorHint, setErrorHint] = useState<string | null>(null);

  useEffect(() => {
    if (value !== null && value !== undefined && String(value) !== localStr) {
      if (localStr !== '' || value !== 0) {
        setLocalStr(String(value));
      }
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setLocalStr(raw);

    if (raw.trim() === '') {
      setErrorHint(min !== undefined ? `Value is required (min ${min})` : null);
      return;
    }

    const num = parseFloat(raw);
    if (!isNaN(num)) {
      if (min !== undefined && num < min) {
        setErrorHint(`Minimum allowed is ${min}`);
      } else if (max !== undefined && num > max) {
        setErrorHint(`Maximum allowed is ${max}`);
      } else {
        setErrorHint(null);
        onChange(num);
      }
    }
  };

  const handleBlur = () => {
    if (localStr.trim() === '' || isNaN(parseFloat(localStr))) {
      const fallback = min !== undefined ? min : 0;
      setLocalStr(String(fallback));
      setErrorHint(null);
      onChange(fallback);
    } else {
      const num = parseFloat(localStr);
      if (min !== undefined && num < min) {
        setLocalStr(String(min));
        setErrorHint(null);
        onChange(min);
      } else if (max !== undefined && num > max) {
        setLocalStr(String(max));
        setErrorHint(null);
        onChange(max);
      }
    }
  };

  return (
    <div className="space-y-1 w-full">
      {label && <label className="text-xs font-semibold text-zinc-300 block">{label}</label>}
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          value={localStr}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field ${unit ? 'pr-12' : ''} ${errorHint ? 'border-red-500 ring-1 ring-red-500' : ''} ${className}`}
        />
        {unit && (
          <span className="absolute right-3 top-2.5 text-xs text-zinc-400 font-medium pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {errorHint && <p className="text-[11px] text-red-400 font-medium">{errorHint}</p>}
    </div>
  );
};
