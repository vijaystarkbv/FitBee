import React from 'react';

interface GenderScreenProps {
  value: 'male' | 'female' | 'other';
  onChange: (gender: 'male' | 'female' | 'other') => void;
  onNext: () => void;
  onBack: () => void;
}

const CheckSvg: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const genderOptions: { id: 'male' | 'female' | 'other'; title: string }[] = [
  { id: 'male', title: 'Male' },
  { id: 'female', title: 'Female' },
  { id: 'other', title: 'Prefer not to say' },
];

export const GenderScreen: React.FC<GenderScreenProps> = ({ value, onChange, onNext, onBack }) => {
  return (
    <div className="ob-card ob-screen-enter">
      <div className="ob-header">
        <h1 className="ob-title">Tell us about yourself</h1>
        <p className="ob-subtitle">This helps us personalize your nutrition targets.</p>
      </div>

      <div className="ob-select-grid">
        {genderOptions.map((opt) => (
          <div
            key={opt.id}
            className={`ob-select-card${value === opt.id ? ' selected' : ''}`}
            onClick={() => onChange(opt.id)}
          >
            <p className="ob-select-card-title">{opt.title}</p>
            <div className="ob-check-indicator">
              <CheckSvg />
            </div>
          </div>
        ))}
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-back" onClick={onBack}>Back</button>
        <button className="ob-btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};
