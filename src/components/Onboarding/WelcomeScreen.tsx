import React from 'react';

interface WelcomeScreenProps {
  onBegin: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onBegin }) => {
  return (
    <div className="ob-card ob-screen-enter">
      <div className="ob-header" style={{ marginBottom: 40 }}>
        <div className="ob-welcome-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z" />
            <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7" />
            <path d="M14.5 17.5 4.5 15" />
          </svg>
        </div>
        <h1 className="ob-title">Welcome to FitBee</h1>
        <p className="ob-subtitle">
          Let's build a plan that's actually made for you.
        </p>
      </div>

      <button className="ob-btn-primary" onClick={onBegin}>
        Let's Begin
      </button>
    </div>
  );
};
