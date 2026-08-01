import React, { useMemo } from 'react';
import { WheelPicker } from './WheelPicker';
import { kgToLbs, lbsToKg } from '../../utils/unitConversions';

interface TargetWeightScreenProps {
  targetWeightKg: number;
  weightUnit: 'kg' | 'lbs';
  onTargetWeightChange: (kg: number) => void;
  onNext: () => void;
  onBack: () => void;
}

export const TargetWeightScreen: React.FC<TargetWeightScreenProps> = ({
  targetWeightKg,
  weightUnit,
  onTargetWeightChange,
  onNext,
  onBack,
}) => {
  const kgItems = useMemo(
    () => Array.from({ length: 271 }, (_, i) => {
      const v = i + 30;
      return { value: v, label: `${v}` };
    }),
    []
  );

  const lbsItems = useMemo(
    () => Array.from({ length: 591 }, (_, i) => {
      const v = i + 60;
      return { value: v, label: `${v}` };
    }),
    []
  );

  const displayLbs = Math.round(kgToLbs(targetWeightKg)) || 150;
  const unitLabel = weightUnit === 'kg' ? 'kg' : 'lbs';

  const handleLbsChange = (lbs: number) => {
    onTargetWeightChange(lbsToKg(lbs));
  };

  return (
    <div className="ob-card ob-screen-enter">
      <div className="ob-header">
        <h1 className="ob-title">What's your target weight?</h1>
        <p className="ob-subtitle">Set a goal to work towards.</p>
      </div>

      {weightUnit === 'kg' ? (
        <WheelPicker
          items={kgItems}
          selectedValue={Math.round(targetWeightKg)}
          onChange={(v) => onTargetWeightChange(v)}
          unitLabel={unitLabel}
        />
      ) : (
        <WheelPicker
          items={lbsItems}
          selectedValue={displayLbs}
          onChange={handleLbsChange}
          unitLabel={unitLabel}
        />
      )}

      <div className="ob-nav-row">
        <button className="ob-btn-back" onClick={onBack}>Back</button>
        <button className="ob-btn-primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};
