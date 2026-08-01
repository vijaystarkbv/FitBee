import React from 'react';

interface NameScreenProps {
  value: string;
  onChange: (name: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const NameScreen: React.FC<NameScreenProps> = ({ value, onChange, onNext, onBack }) => {
  return (
    <div className="ob-card ob-screen-enter">
      <div className="ob-header">
        <h1 className="ob-title">What should we call you?</h1>
        <p className="ob-subtitle">We'll use this to personalize your experience.</p>
      </div>

      <div className="ob-input-group">
        <input
          type="text"
          className="ob-input"
          placeholder="Your name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoFocus
          maxLength={40}
        />
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
