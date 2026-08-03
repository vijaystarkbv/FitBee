import React, { useState } from 'react';
import { ExerciseLibraryFlow } from './ExerciseLibrary/ExerciseLibraryFlow';
import './ExerciseLibrary/exerciseLibrary.css';

interface WorkoutPageProps {
  onBackToHome?: () => void;
}

export const WorkoutPage: React.FC<WorkoutPageProps> = ({ onBackToHome }) => {
  const [inLibrary, setInLibrary] = useState(false);

  if (inLibrary) {
    return <ExerciseLibraryFlow onBackToWorkout={() => setInLibrary(false)} />;
  }

  return (
    <div className="exlib-container">
      {/* Back Button to Home */}
      {onBackToHome && (
        <button
          className="workout-back-btn"
          onClick={onBackToHome}
          aria-label="Back to Home"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </button>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="exlib-title">Workout</h1>
        <p className="exlib-subtitle">Track your training and explore exercises</p>
      </div>

      {/* Primary Action Card: Exercise Library */}
      <div className="workout-entry-card" onClick={() => setInLibrary(true)} role="button" tabIndex={0}>
        <div className="workout-entry-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <circle cx="12" cy="10" r="3" />
            <path d="M12 13v4" />
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <h2 className="workout-entry-title">Exercise Library</h2>
          <p className="workout-entry-desc">Your complete exercise library, all in one place.</p>
        </div>

        <div style={{ color: '#5C8D89' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* Routine Placeholder / History */}
      <div className="hd-card" style={{ padding: '24px 20px', textAlign: 'center', opacity: 0.7 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#6B7280' }}>
          Your active workouts & routines will appear here.
        </p>
      </div>
    </div>
  );
};
