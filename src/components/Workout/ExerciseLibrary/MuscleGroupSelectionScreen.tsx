import React from 'react';
import { MAIN_CATEGORIES, MainCategory } from '../../../utils/exerciseLibraryParser';
import { CategoryCard } from './CategoryCard';

interface MuscleGroupSelectionScreenProps {
  onSelectCategory: (category: MainCategory) => void;
  onBackToWorkout: () => void;
  mode?: 'browse' | 'select';
}

export const MuscleGroupSelectionScreen: React.FC<MuscleGroupSelectionScreenProps> = ({
  onSelectCategory,
  onBackToWorkout,
  mode = 'browse',
}) => {
  const displayCategories = mode === 'select' 
    ? MAIN_CATEGORIES.filter(cat => cat.title !== 'Stretches - Warm-up')
    : MAIN_CATEGORIES;

  return (
    <div className="exlib-container">
      {/* Header & Breadcrumb */}
      <div className="exlib-header">
        <div className="exlib-breadcrumb">
          <button className="exlib-breadcrumb-btn" onClick={onBackToWorkout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            {mode === 'select' ? 'Cancel Selection' : 'Workout'}
          </button>
          <span className="exlib-breadcrumb-sep">/</span>
          <span className="exlib-breadcrumb-current">Exercise Library</span>
        </div>

        <h1 className="exlib-title">
          {mode === 'select' ? 'Select Exercise' : 'Exercise Library'}
        </h1>
        <p className="exlib-subtitle">Select a muscle group to browse curated exercises</p>
      </div>

      {/* Category Cards List (Exact Markdown Order) */}
      <div className="exlib-card-grid">
        {displayCategories.map((cat) => (
          <CategoryCard
            key={cat.id}
            title={cat.title}
            stickerKey={cat.stickerKey}
            onClick={() => onSelectCategory(cat)}
          />
        ))}
      </div>
    </div>
  );
};
