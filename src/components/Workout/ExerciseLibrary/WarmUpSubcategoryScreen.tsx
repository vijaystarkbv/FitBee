import React from 'react';
import { WARMUP_SUBCATEGORIES, WarmUpSubcategory } from '../../../utils/exerciseLibraryParser';
import { CategoryCard } from './CategoryCard';

interface WarmUpSubcategoryScreenProps {
  onSelectSubcategory: (sub: WarmUpSubcategory) => void;
  onBack: () => void;
}

export const WarmUpSubcategoryScreen: React.FC<WarmUpSubcategoryScreenProps> = ({
  onSelectSubcategory,
  onBack,
}) => {
  return (
    <div className="exlib-container">
      {/* Header & Breadcrumb */}
      <div className="exlib-header">
        <div className="exlib-breadcrumb">
          <button className="exlib-breadcrumb-btn" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Exercise Library
          </button>
          <span className="exlib-breadcrumb-sep">/</span>
          <span className="exlib-breadcrumb-current">Stretches - Warm-up</span>
        </div>

        <h1 className="exlib-title">Stretches - Warm-up</h1>
        <p className="exlib-subtitle">Select a target region for mobility and stretches</p>
      </div>

      {/* Subcategory Cards List (Exact Markdown Order) */}
      <div className="exlib-card-grid">
        {WARMUP_SUBCATEGORIES.map((sub) => (
          <CategoryCard
            key={sub.id}
            title={sub.title}
            stickerKey={sub.stickerKey}
            onClick={() => onSelectSubcategory(sub)}
          />
        ))}
      </div>
    </div>
  );
};
