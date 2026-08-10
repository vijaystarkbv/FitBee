import React, { useMemo } from 'react';
import { getFilteredExercises, ExerciseLibraryItem } from '../../../utils/exerciseLibraryParser';

interface ExerciseListScreenProps {
  categoryTitle: string;
  subcategoryTitle?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  onBack: () => void;
  onSelectExercise?: (exerciseName: string) => void;
  mode?: 'browse' | 'select';
  selectedExercises?: string[];
  onToggleSelect?: (exerciseName: string) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (exerciseName: string) => void;
  otherDaysExercises?: Record<string, string[]>;
}

export const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({
  categoryTitle,
  subcategoryTitle,
  difficulty,
  onBack,
  onSelectExercise,
  mode = 'browse',
  selectedExercises = [],
  onToggleSelect,
  favorites = new Set(),
  onToggleFavorite,
  otherDaysExercises = {},
}) => {

  const exercises: ExerciseLibraryItem[] = useMemo(() => {
    return getFilteredExercises(categoryTitle, difficulty, subcategoryTitle);
  }, [categoryTitle, subcategoryTitle, difficulty]);

  const getLocationClass = (location: string) => {
    if (location === 'Home') return 'location-home';
    if (location === 'Home Equipment') return 'location-home-eq';
    return 'location-gym';
  };

  const getDifficultyClass = (diff: string) => {
    if (diff === 'Beginner') return 'beginner';
    if (diff === 'Intermediate') return 'intermediate';
    return 'advanced';
  };

  return (
    <div className="exlib-container">
      {/* Header & Breadcrumb */}
      <div className="exlib-header">
        <div className="exlib-breadcrumb">
          <button className="exlib-breadcrumb-btn" onClick={onBack}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Difficulty
          </button>
          <span className="exlib-breadcrumb-sep">/</span>
          <span className="exlib-breadcrumb-current">{subcategoryTitle || categoryTitle}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <h1 className="exlib-title" style={{ margin: 0 }}>
            {subcategoryTitle || categoryTitle}
          </h1>
          <span className="exlib-count-badge">{exercises.length} Exercises</span>
        </div>
        <p className="exlib-subtitle">
          Showing {difficulty} level exercises from master blueprint
        </p>
      </div>

      {/* Exercise List */}
      <div className="exlib-card-grid">
        {exercises.length === 0 ? (
          <div className="exlib-card" style={{ cursor: 'default', justifyContent: 'center', textAlign: 'center', padding: '40px 20px' }}>
            <p style={{ margin: 0, color: '#6B7280', fontSize: 15 }}>No exercises found for this selection.</p>
          </div>
        ) : (
          exercises.map((ex) => {
            const isSelected = selectedExercises.includes(ex.name);
            const isFav = favorites.has(ex.name);

            return (
              <div
                key={ex.id}
                className={`exlib-ex-card ${mode === 'select' ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={() => {
                  if (mode === 'select' && onToggleSelect) {
                    onToggleSelect(ex.name);
                  } else if (onSelectExercise) {
                    onSelectExercise(ex.name);
                  }
                }}
              >
                {/* Cross-Day Warning Label */}
                {mode === 'select' && otherDaysExercises[ex.name] && otherDaysExercises[ex.name].length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#D97706' }}>
                      Already selected for {otherDaysExercises[ex.name].join(', ')}
                    </span>
                  </div>
                )}

                <div className="exlib-ex-header">
                  <h3 className="exlib-ex-name">{ex.name}</h3>
                  <span className={`exlib-diff-pill ${getDifficultyClass(ex.difficulty)}`}>
                    {ex.difficulty}
                  </span>
                </div>

                {/* Tags: Location & Equipment */}
                <div className="exlib-ex-tags">
                  <span className={`exlib-tag ${getLocationClass(ex.location)}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    {ex.location}
                  </span>

                  <span className="exlib-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 12h12M4 8v8M20 8v8" />
                    </svg>
                    {ex.equipment}
                  </span>
                </div>

                {/* Target Muscles & Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
                  {ex.primaryMuscles.length > 0 && (
                    <p className="exlib-ex-muscles" style={{ margin: 0, flex: 1 }}>
                      <strong style={{ color: '#1F2937' }}>{ex.primaryMuscles.join(', ')}</strong>
                      {ex.secondaryMuscles &&
                      ex.secondaryMuscles.length > 0 &&
                      ex.secondaryMuscles[0] !== 'None' &&
                      ex.secondaryMuscles[0] !== ''
                        ? ` • ${ex.secondaryMuscles.join(', ')}`
                        : ''}
                    </p>
                  )}

                  {mode === 'select' ? (
                    <button
                      type="button"
                      className={`exlib-select-btn ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleSelect) onToggleSelect(ex.name);
                      }}
                      aria-label={isSelected ? 'Deselect exercise' : 'Select exercise'}
                    >
                      {isSelected ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`exlib-fav-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleFavorite) onToggleFavorite(ex.name);
                      }}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#EAB308' : 'none'} stroke={isFav ? '#EAB308' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};


