import React from 'react';
import { getExerciseDetailByName } from '../../../data/exerciseDetailData';
import { ExerciseVideoPlayer } from './ExerciseVideoPlayer';
import './exerciseDetail.css';

interface ExerciseDetailViewProps {
  exerciseName: string;
  onBack: () => void;
}

export const ExerciseDetailView: React.FC<ExerciseDetailViewProps> = ({ exerciseName, onBack }) => {
  const detail = getExerciseDetailByName(exerciseName);

  const renderDifficultyBadge = (difficulty: string) => {
    const diffLower = difficulty.toLowerCase();
    
    // Theme-harmonized SVG Star Coin Icon Colors:
    // Beginner: #5C8D89 (Theme Primary Accent Teal)
    // Intermediate: #E67E22 (Theme Warm Orange)
    // Advanced: #D32F2F (Theme Coral Red)
    let iconColor = '#5C8D89';
    if (diffLower === 'intermediate') iconColor = '#E67E22';
    if (diffLower === 'advanced') iconColor = '#D32F2F';

    return (
      <span className={`fitbee-diff-badge ${diffLower}`}>
        <svg
          className="fitbee-diff-icon"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill={iconColor}
          stroke={iconColor}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        {difficulty}
      </span>
    );
  };

  return (
    <div className="fitbee-exdetail-page">
      <div className="fitbee-exdetail-container">
        {/* Navigation / Back Button */}
        <div className="fitbee-exdetail-nav">
          <button className="fitbee-back-btn" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Exercises
          </button>
        </div>

        {/* SECTION 1: Cloudflare R2 MP4 Video Player & Target Muscle Legend */}
        <ExerciseVideoPlayer
          exerciseName={detail.name}
          primaryMuscles={detail.primaryMuscles}
          secondaryMuscles={detail.secondaryMuscles}
        />

        {/* SECTION 2: Exercise Information Cards */}
        {/* Title & Difficulty Card */}
        <div className="fitbee-card fitbee-header-card">
          <h1 className="fitbee-ex-title">{detail.name}</h1>
          {renderDifficultyBadge(detail.difficulty)}
        </div>

        {/* How to Perform Card */}
        <div className="fitbee-card">
          <h2 className="fitbee-card-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            How to Perform
          </h2>
          <ol className="fitbee-steps-list">
            {detail.howToPerform.map((step: string, idx: number) => (
              <li key={idx} className="fitbee-step-item">
                <span className="fitbee-step-num">{idx + 1}</span>
                <p className="fitbee-step-text">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Need, Equipment & Category Cards */}
        <div className="fitbee-card">
          <div className="fitbee-meta-grid">
            <div className="fitbee-meta-box">
              <span className="fitbee-meta-label">Need</span>
              <span className="fitbee-meta-value">{detail.location}</span>
            </div>
            <div className="fitbee-meta-box">
              <span className="fitbee-meta-label">Equipment</span>
              <span className="fitbee-meta-value">{detail.equipment}</span>
            </div>
            <div className="fitbee-meta-box">
              <span className="fitbee-meta-label">Category</span>
              <span className="fitbee-meta-value">{detail.category || 'Mobility'}</span>
            </div>
          </div>
        </div>

        {/* Tips Card */}
        <div className="fitbee-card">
          <h2 className="fitbee-card-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Tips
          </h2>
          <ul className="fitbee-tips-list">
            {detail.tips.map((tip: string, idx: number) => (
              <li key={idx} className="fitbee-tip-item">
                <span className="fitbee-tip-bullet">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
