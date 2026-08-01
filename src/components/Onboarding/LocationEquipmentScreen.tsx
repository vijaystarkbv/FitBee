import React, { useMemo } from 'react';
import { WheelPicker } from './WheelPicker';
import { EquipmentDetail } from '../../types/fitness.types';
import { kgToLbs, lbsToKg } from '../../utils/unitConversions';

type Location = 'home' | 'gym' | 'both' | 'none';

interface LocationEquipmentScreenProps {
  location: Location;
  onLocationChange: (loc: Location) => void;
  equipment: string[];
  equipmentDetails: Record<string, EquipmentDetail>;
  onEquipmentToggle: (name: string) => void;
  onEquipmentDetailChange: (name: string, detail: EquipmentDetail) => void;
  weightUnit: 'kg' | 'lbs';
  onNext: () => void;
  onBack: () => void;
}

const CheckSvg: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const locations: { id: Location; title: string }[] = [
  { id: 'home', title: 'Home' },
  { id: 'gym', title: 'Gym' },
  { id: 'both', title: 'Both' },
  { id: 'none', title: 'None' },
];

const EQUIPMENT_LIST = [
  'Dumbbells', 'Adjustable Dumbbells', 'Resistance Bands', 'Pull-up Bar',
  'Barbell', 'Weight Plates', 'Bench', 'Kettlebells',
  'Push-up Bars', 'Dip Bars', 'Jump Rope', 'Medicine Ball',
  'Exercise Ball', 'Grip Trainer', 'Suspension Trainer (TRX)',
  'Treadmill', 'Exercise Bike', 'Rowing Machine', 'Yoga Mat', 'Foam Roller',
];

/* Equipment that needs follow-up weight questions */
const WEIGHT_FOLLOWUP = ['Dumbbells', 'Adjustable Dumbbells', 'Barbell', 'Kettlebells'];
const RESISTANCE_FOLLOWUP = ['Resistance Bands'];

export const LocationEquipmentScreen: React.FC<LocationEquipmentScreenProps> = ({
  location,
  onLocationChange,
  equipment,
  equipmentDetails,
  onEquipmentToggle,
  onEquipmentDetailChange,
  weightUnit,
  onNext,
  onBack,
}) => {
  const showEquipment = location === 'home' || location === 'both';

  /* Which selected equipment needs follow-up */
  const weightFollowups = equipment.filter((e) => WEIGHT_FOLLOWUP.includes(e));
  const resistanceFollowups = equipment.filter((e) => RESISTANCE_FOLLOWUP.includes(e));
  const hasFollowups = weightFollowups.length > 0 || resistanceFollowups.length > 0;

  /* Weight wheel items */
  const kgWeightItems = useMemo(
    () => Array.from({ length: 100 }, (_, i) => {
      const v = i + 1;
      return { value: v, label: `${v}` };
    }),
    []
  );

  const lbsWeightItems = useMemo(
    () => Array.from({ length: 220 }, (_, i) => {
      const v = i + 1;
      return { value: v, label: `${v}` };
    }),
    []
  );

  const getWeightKg = (name: string) => equipmentDetails[name]?.max_weight_kg || 10;
  const getWeightDisplay = (name: string) => {
    const kg = getWeightKg(name);
    return weightUnit === 'kg' ? Math.round(kg) : Math.round(kgToLbs(kg));
  };

  const handleWeightChange = (name: string, displayValue: number) => {
    const kg = weightUnit === 'kg' ? displayValue : lbsToKg(displayValue);
    onEquipmentDetailChange(name, { ...equipmentDetails[name], max_weight_kg: kg });
  };

  const resistanceLevels = ['Light', 'Medium', 'Heavy', 'Extra Heavy'];

  return (
    <div className="ob-card ob-screen-enter">
      <div className="ob-header">
        <h1 className="ob-title">Where will you mostly work out?</h1>
        <p className="ob-subtitle">We'll customize exercises for your setup.</p>
      </div>

      {/* Location selection */}
      <div className="ob-select-grid cols-2">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className={`ob-select-card${location === loc.id ? ' selected' : ''}`}
            onClick={() => onLocationChange(loc.id)}
          >
            <p className="ob-select-card-title">{loc.title}</p>
            <div className="ob-check-indicator">
              <CheckSvg />
            </div>
          </div>
        ))}
      </div>

      {/* Equipment section — animates in if Home or Both */}
      {showEquipment && (
        <div className="ob-followup-section">
          <p className="ob-section-label">Select the equipment you own</p>
          <div className="ob-equipment-grid">
            {EQUIPMENT_LIST.map((name) => {
              const isSelected = equipment.includes(name);
              return (
                <button
                  key={name}
                  className={`ob-equipment-chip${isSelected ? ' selected' : ''}`}
                  onClick={() => onEquipmentToggle(name)}
                  type="button"
                >
                  <span className="ob-chip-check">
                    <CheckSvg />
                  </span>
                  {name}
                </button>
              );
            })}
          </div>

          {/* Follow-up questions */}
          {hasFollowups && (
            <div className="ob-followup-section">
              {weightFollowups.map((name) => (
                <div key={name} className="ob-followup-item">
                  <p className="ob-followup-label">
                    What is your maximum {name.toLowerCase()} weight?
                  </p>
                  <WheelPicker
                    items={weightUnit === 'kg' ? kgWeightItems : lbsWeightItems}
                    selectedValue={getWeightDisplay(name)}
                    onChange={(v) => handleWeightChange(name, v)}
                    unitLabel={weightUnit}
                  />
                </div>
              ))}

              {resistanceFollowups.map((name) => {
                const currentLevel = equipmentDetails[name]?.resistance_level || 'Medium';
                return (
                  <div key={name} className="ob-followup-item">
                    <p className="ob-followup-label">What is your resistance band level?</p>
                    <div className="ob-unit-toggle" style={{ flexWrap: 'wrap' }}>
                      {resistanceLevels.map((level) => (
                        <button
                          key={level}
                          className={`ob-unit-btn${currentLevel === level ? ' active' : ''}`}
                          onClick={() =>
                            onEquipmentDetailChange(name, { ...equipmentDetails[name], resistance_level: level })
                          }
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="ob-nav-row">
        <button className="ob-btn-back" onClick={onBack}>Back</button>
        <button className="ob-btn-primary" onClick={onNext}>
          Finish
        </button>
      </div>
    </div>
  );
};
