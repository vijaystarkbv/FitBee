import React, { useState, useEffect } from 'react';
import './nutrition.css';

export interface EditableMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealReviewCardProps {
  initialMacros: EditableMacros;
  onSave: (adjustedMacros: EditableMacros) => Promise<void>;
  isSaving: boolean;
  isSaved: boolean;
}

export const MealReviewCard: React.FC<MealReviewCardProps> = ({
  initialMacros,
  onSave,
  isSaving,
  isSaved,
}) => {
  const [macros, setMacros] = useState<EditableMacros>(initialMacros);

  // Sync state if initialMacros change (e.g., brand new Gemini analysis)
  useEffect(() => {
    setMacros(initialMacros);
  }, [initialMacros]);

  const updateMacro = (key: keyof EditableMacros, delta: number) => {
    if (isSaved) return; // Read-only once saved
    setMacros((prev) => {
      const currentVal = prev[key];
      const newVal = Math.max(0, currentVal + delta);
      return { ...prev, [key]: newVal };
    });
  };

  const handleSaveClick = () => {
    if (isSaved || isSaving) return;
    onSave(macros);
  };

  return (
    <div className="nut-card nut-animate-entrance">
      <h3 className="nut-card-title">Nutrition Review</h3>
      <p className="nut-card-subtitle">
        Review & fine-tune the estimated nutrition values before saving.
      </p>

      {/* ── Nutrient Rows ── */}
      <div className="nut-review-grid">
        {/* Calories */}
        <div className="nut-review-row">
          <div className="nut-review-label-container">
            <span className="nut-review-label">Calories</span>
            <span className="nut-review-unit">kcal</span>
          </div>
          <div className="nut-stepper">
            <button
              type="button"
              className="nut-stepper-btn"
              onClick={() => updateMacro('calories', -10)}
              disabled={isSaved || macros.calories <= 0}
              aria-label="Decrease Calories"
            >
              -
            </button>
            <span className="nut-stepper-value">{macros.calories}</span>
            <button
              type="button"
              className="nut-stepper-btn"
              onClick={() => updateMacro('calories', 10)}
              disabled={isSaved}
              aria-label="Increase Calories"
            >
              +
            </button>
          </div>
        </div>

        {/* Protein */}
        <div className="nut-review-row">
          <div className="nut-review-label-container">
            <span className="nut-review-label">Protein</span>
            <span className="nut-review-unit">grams (g)</span>
          </div>
          <div className="nut-stepper">
            <button
              type="button"
              className="nut-stepper-btn"
              onClick={() => updateMacro('protein', -1)}
              disabled={isSaved || macros.protein <= 0}
              aria-label="Decrease Protein"
            >
              -
            </button>
            <span className="nut-stepper-value">{macros.protein}g</span>
            <button
              type="button"
              className="nut-stepper-btn"
              onClick={() => updateMacro('protein', 1)}
              disabled={isSaved}
              aria-label="Increase Protein"
            >
              +
            </button>
          </div>
        </div>

        {/* Carbohydrates */}
        <div className="nut-review-row">
          <div className="nut-review-label-container">
            <span className="nut-review-label">Carbohydrates</span>
            <span className="nut-review-unit">grams (g)</span>
          </div>
          <div className="nut-stepper">
            <button
              type="button"
              className="nut-stepper-btn"
              onClick={() => updateMacro('carbs', -1)}
              disabled={isSaved || macros.carbs <= 0}
              aria-label="Decrease Carbs"
            >
              -
            </button>
            <span className="nut-stepper-value">{macros.carbs}g</span>
            <button
              type="button"
              className="nut-stepper-btn"
              onClick={() => updateMacro('carbs', 1)}
              disabled={isSaved}
              aria-label="Increase Carbs"
            >
              +
            </button>
          </div>
        </div>

        {/* Fat */}
        <div className="nut-review-row">
          <div className="nut-review-label-container">
            <span className="nut-review-label">Fat</span>
            <span className="nut-review-unit">grams (g)</span>
          </div>
          <div className="nut-stepper">
            <button
              type="button"
              className="nut-stepper-btn"
              onClick={() => updateMacro('fat', -1)}
              disabled={isSaved || macros.fat <= 0}
              aria-label="Decrease Fat"
            >
              -
            </button>
            <span className="nut-stepper-value">{macros.fat}g</span>
            <button
              type="button"
              className="nut-stepper-btn"
              onClick={() => updateMacro('fat', 1)}
              disabled={isSaved}
              aria-label="Increase Fat"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* ── Save Button ── */}
      <button
        type="button"
        className={`nut-save-btn${isSaved ? ' saved' : ''}`}
        onClick={handleSaveClick}
        disabled={isSaved || isSaving}
      >
        {isSaved ? (
          <span className="nut-save-check">Saved ✓</span>
        ) : isSaving ? (
          'Saving Meal...'
        ) : (
          'Save Meal'
        )}
      </button>
    </div>
  );
};
