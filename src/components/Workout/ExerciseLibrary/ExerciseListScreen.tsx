import React, { useMemo } from 'react';
import { getFilteredExercises, ExerciseLibraryItem } from '../../../utils/exerciseLibraryParser';

interface ExerciseListScreenProps {
  categoryTitle: string;
  subcategoryTitle?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  onBack: () => void;
  onSelectExercise?: (exerciseName: string) => void;
}

export const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({
  categoryTitle,
  subcategoryTitle,
  difficulty,
  onBack,
  onSelectExercise,
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
          exercises.map((ex) => (
            <div
              key={ex.id}
              className="exlib-ex-card"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectExercise && onSelectExercise(ex.name)}
            >
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

              {/* Target Muscles */}
              {ex.primaryMuscles.length > 0 && (
                <p className="exlib-ex-muscles">
                  Target: <strong style={{ color: '#1F2937' }}>{ex.primaryMuscles.join(', ')}</strong>
                  {ex.secondaryMuscles.length > 0 && ` • Secondary: ${ex.secondaryMuscles.join(', ')}`}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
