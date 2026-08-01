import React from 'react';

interface ActivityScreenProps {
  value: 'sedentary' | 'light' | 'moderate' | 'active';
  onChange: (level: 'sedentary' | 'light' | 'moderate' | 'active') => void;
  onNext: () => void;
  onBack: () => void;
}

const CheckSvg: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const levels: { id: 'sedentary' | 'light' | 'moderate' | 'active'; title: string; desc: string }[] = [
  { id: 'sedentary', title: 'Sedentary', desc: 'Little or no exercise.' },
  { id: 'light', title: 'Lightly Active', desc: 'Exercise 1–3 days each week.' },
  { id: 'moderate', title: 'Active', desc: 'Exercise most days.' },
  { id: 'active', title: 'Athlete', desc: 'Intense training nearly every day.' },
];

export const ActivityScreen: React.FC<ActivityScreenProps> = ({ value, onChange, onNext, onBack }) => {
  return (
    <div className="ob-card ob-screen-enter">
      <div className="ob-header">
        <h1 className="ob-title">How active are you?</h1>
        <p className="ob-subtitle">This helps us calculate your daily targets.</p>
      </div>

      <div className="ob-select-grid">
        {levels.map((lvl) => (
          <div
            key={lvl.id}
            className={`ob-select-card${value === lvl.id ? ' selected' : ''}`}
            onClick={() => onChange(lvl.id)}
          >
            <p className="ob-select-card-title">{lvl.title}</p>
            <p className="ob-select-card-desc">{lvl.desc}</p>
            <div className="ob-check-indicator">
              <CheckSvg />
            </div>
          </div>
        ))}
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-back" onClick={onBack}>Back</button>
        <button className="ob-btn-primary" onClick={onNext}>Next</button>
      </div>
    </div>
  );
};
