import React from 'react';
import { MealEntry } from '../../types/database.types';
import './nutrition.css';

interface MealHistoryListProps {
  meals: MealEntry[];
}

export const MealHistoryList: React.FC<MealHistoryListProps> = ({ meals }) => {
  if (!meals || meals.length === 0) return null;

  return (
    <div className="nut-history-section nut-animate-entrance">
      <h3 className="nut-history-title">Today's Saved Meals</h3>
      <div className="space-y-4">
        {meals.map((meal, index) => {
          // Determine meal title fallback if raw_text is generic
          const mealTitle =
            meal.raw_text && meal.raw_text.trim() && meal.raw_text !== 'Custom Logged Meal'
              ? meal.raw_text.split('\n')[0]
              : `Meal ${index + 1}`;

          // Format food items breakdown if available
          const breakdownText =
            meal.parsed_breakdown && meal.parsed_breakdown.length > 0
              ? meal.parsed_breakdown.map((item) => `${item.name} (${item.quantity})`).join(' • ')
              : meal.raw_text;

          return (
            <div key={meal.id || index} className="nut-meal-card">
              <div className="nut-meal-card-header">
                <h4 className="nut-meal-title">{mealTitle}</h4>
                <span className="nut-meal-badge">Saved ✓</span>
              </div>

              {breakdownText && breakdownText !== mealTitle && (
                <p className="nut-meal-desc">{breakdownText}</p>
              )}

              <div className="nut-meal-macros">
                <div>
                  <div className="nut-macro-val">{meal.calories}</div>
                  <div className="nut-macro-lbl">kcal</div>
                </div>
                <div>
                  <div className="nut-macro-val">{meal.protein}g</div>
                  <div className="nut-macro-lbl">Protein</div>
                </div>
                <div>
                  <div className="nut-macro-val">{meal.carbs}g</div>
                  <div className="nut-macro-lbl">Carbs</div>
                </div>
                <div>
                  <div className="nut-macro-val">{meal.fat}g</div>
                  <div className="nut-macro-lbl">Fat</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
