import React, { useMemo } from 'react';
import { WheelPicker } from './WheelPicker';

interface AgeScreenProps {
  value: number;
  onChange: (age: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AgeScreen: React.FC<AgeScreenProps> = ({ value, onChange, onNext, onBack }) => {
  const ageItems = useMemo(
    () => Array.from({ length: 69 }, (_, i) => {
      const age = i + 12;
      return { value: age, label: `${age}` };
    }),
    []
  );

  return (
    <div className="ob-card ob-screen-enter">
      <div className="ob-header">
        <h1 className="ob-title">How old are you?</h1>
        <p className="ob-subtitle">Scroll to select your age.</p>
      </div>

      <WheelPicker
        items={ageItems}
        selectedValue={value}
        onChange={onChange}
        unitLabel="years"
      />

      <div className="ob-nav-row">
        <button className="ob-btn-back" onClick={onBack}>Back</button>
        <button className="ob-btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};
