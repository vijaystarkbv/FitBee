import React from 'react';
import { CategoryCard } from './CategoryCard';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

interface DifficultySelectionScreenProps {
  categoryTitle: string;
  subcategoryTitle?: string;
  onSelectDifficulty: (difficulty: DifficultyLevel) => void;
  onBack: () => void;
}

export const DifficultySelectionScreen: React.FC<DifficultySelectionScreenProps> = ({
  categoryTitle,
  subcategoryTitle,
  onSelectDifficulty,
  onBack,
}) => {
  const difficulties: { title: DifficultyLevel; numberBadge: number; badgeClass: string }[] = [
    { title: 'Beginner', numberBadge: 1, badgeClass: 'beginner' },
    { title: 'Intermediate', numberBadge: 2, badgeClass: 'intermediate' },
    { title: 'Advanced', numberBadge: 3, badgeClass: 'advanced' },
  ];

  return (
    <div className="exlib-container">
      {/* Header & Breadcrumb */}
      <div className="exlib-header">
        <div className="exlib-breadcrumb">
          <button className="exlib-breadcrumb-btn" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {subcategoryTitle ? categoryTitle : 'Exercise Library'}
          </button>
          <span className="exlib-breadcrumb-sep">/</span>
          <span className="exlib-breadcrumb-current">{subcategoryTitle || categoryTitle}</span>
        </div>

        <h1 className="exlib-title">Select Difficulty</h1>
        <p className="exlib-subtitle">Choose experience level for {subcategoryTitle || categoryTitle}</p>
      </div>

      {/* Difficulty Cards with Number Badges 1, 2, 3 */}
      <div className="exlib-card-grid">
        {difficulties.map((diff) => (
          <CategoryCard
            key={diff.title}
            title={diff.title}
            numberBadge={diff.numberBadge}
            badgeText={`● Level ${diff.numberBadge}`}
            badgeClass={diff.badgeClass}
            onClick={() => onSelectDifficulty(diff.title)}
          />
        ))}
      </div>
    </div>
  );
};
