import React, { useMemo, useState } from 'react';
import { WheelPicker } from './WheelPicker';
import { cmToFtIn, ftInToCm, kgToLbs, lbsToKg } from '../../utils/unitConversions';

interface MeasurementsScreenProps {
  heightCm: number;
  weightKg: number;
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lbs';
  onHeightChange: (cm: number) => void;
  onWeightChange: (kg: number) => void;
  onHeightUnitChange: (unit: 'cm' | 'ft') => void;
  onWeightUnitChange: (unit: 'kg' | 'lbs') => void;
  onNext: () => void;
  onBack: () => void;
}

export const MeasurementsScreen: React.FC<MeasurementsScreenProps> = ({
  heightCm,
  weightKg,
  heightUnit,
  weightUnit,
  onHeightChange,
  onWeightChange,
  onHeightUnitChange,
  onWeightUnitChange,
  onNext,
  onBack,
}) => {
  const ftIn = cmToFtIn(heightCm);
  const [ft, setFt] = useState(ftIn.ft || 5);
  const [inches, setInches] = useState(ftIn.in || 8);

  /* ── Height items ── */
  const cmItems = useMemo(
    () => Array.from({ length: 151 }, (_, i) => {
      const v = i + 100;
      return { value: v, label: `${v}` };
    }),
    []
  );

  const ftItems = useMemo(
    () => Array.from({ length: 5 }, (_, i) => {
      const v = i + 3;
      return { value: v, label: `${v} ft` };
    }),
    []
  );

  const inItems = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({ value: i, label: `${i} in` })),
    []
  );

  /* ── Weight items ── */
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

  const displayLbs = Math.round(kgToLbs(weightKg)) || 150;

  const handleFtChange = (newFt: number) => {
    setFt(newFt);
    onHeightChange(ftInToCm(newFt, inches));
  };

  const handleInChange = (newIn: number) => {
    setInches(newIn);
    onHeightChange(ftInToCm(ft, newIn));
  };

  const handleLbsChange = (lbs: number) => {
    onWeightChange(lbsToKg(lbs));
  };

  return (
    <div className="ob-card ob-screen-enter">
      {/* ── HEIGHT SECTION ── */}
      <div className="ob-header" style={{ marginBottom: 16 }}>
        <h1 className="ob-title">Your measurements</h1>
        <p className="ob-subtitle">Let's get to know you better.</p>
      </div>

      <p className="ob-section-label">Height</p>
      <p className="ob-section-sublabel">Select your measuring units</p>

      <div className="ob-unit-toggle">
        <button
          className={`ob-unit-btn${heightUnit === 'cm' ? ' active' : ''}`}
          onClick={() => onHeightUnitChange('cm')}
        >
          cm
        </button>
        <button
          className={`ob-unit-btn${heightUnit === 'ft' ? ' active' : ''}`}
          onClick={() => onHeightUnitChange('ft')}
        >
          ft / in
        </button>
      </div>

      {heightUnit === 'cm' ? (
        <WheelPicker
          items={cmItems}
          selectedValue={Math.round(heightCm)}
          onChange={(v) => onHeightChange(v)}
          unitLabel="cm"
        />
      ) : (
        <div className="ob-dual-wheel">
          <WheelPicker items={ftItems} selectedValue={ft} onChange={handleFtChange} unitLabel="ft" />
          <WheelPicker items={inItems} selectedValue={inches} onChange={handleInChange} unitLabel="in" />
        </div>
      )}

      {/* ── WEIGHT SECTION ── */}
      <div style={{ marginTop: 28 }}>
        <p className="ob-section-label">Weight</p>
        <p className="ob-section-sublabel">Select your measuring units</p>

        <div className="ob-unit-toggle">
          <button
            className={`ob-unit-btn${weightUnit === 'kg' ? ' active' : ''}`}
            onClick={() => onWeightUnitChange('kg')}
          >
            kg
          </button>
          <button
            className={`ob-unit-btn${weightUnit === 'lbs' ? ' active' : ''}`}
            onClick={() => onWeightUnitChange('lbs')}
          >
            pounds
          </button>
        </div>

        {weightUnit === 'kg' ? (
          <WheelPicker
            items={kgItems}
            selectedValue={Math.round(weightKg)}
            onChange={(v) => onWeightChange(v)}
            unitLabel="kg"
          />
        ) : (
          <WheelPicker
            items={lbsItems}
            selectedValue={displayLbs}
            onChange={handleLbsChange}
            unitLabel="lbs"
          />
        )}
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-back" onClick={onBack}>Back</button>
        <button className="ob-btn-primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};
