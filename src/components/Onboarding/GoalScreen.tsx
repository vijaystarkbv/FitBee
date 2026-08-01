import React from 'react';

type Goal = 'gain_muscle' | 'lose_fat' | 'maintain_weight' | 'improve_fitness';

interface GoalScreenProps {
  value: Goal;
  onChange: (goal: Goal) => void;
  onNext: () => void;
  onBack: () => void;
}

const CheckSvg: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const goals: { id: Goal; title: string }[] = [
  { id: 'gain_muscle', title: 'Gain Muscle' },
  { id: 'lose_fat', title: 'Lose Fat' },
  { id: 'maintain_weight', title: 'Maintain Weight' },
  { id: 'improve_fitness', title: 'Improve Fitness' },
];

export const GoalScreen: React.FC<GoalScreenProps> = ({ value, onChange, onNext, onBack }) => {
  return (
    <div className="ob-card ob-screen-enter">
      <div className="ob-header">
        <h1 className="ob-title">What's your goal?</h1>
        <p className="ob-subtitle">We'll tailor your plan around this.</p>
      </div>

      <div className="ob-select-grid cols-2">
        {goals.map((g) => (
          <div
            key={g.id}
            className={`ob-select-card${value === g.id ? ' selected' : ''}`}
            onClick={() => onChange(g.id)}
          >
            <p className="ob-select-card-title">{g.title}</p>
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
