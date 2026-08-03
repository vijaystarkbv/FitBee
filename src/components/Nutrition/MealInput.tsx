import React, { useState, useEffect } from 'react';
import { parseMealText } from '../../services/geminiService';
import { ParsedFoodItem } from '../../types/database.types';

interface MealInputProps {
  onMealParsed?: (
    rawText: string,
    foods: ParsedFoodItem[],
    totals: { calories: number; protein: number; carbs: number; fat: number }
  ) => void;
  isExternalSaved?: boolean;
}

export const MealInput: React.FC<MealInputProps> = ({
  onMealParsed,
  isExternalSaved,
}) => {
  const [mealText, setMealText] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Clear input when meal is saved externally
  useEffect(() => {
    if (isExternalSaved) {
      setMealText('');
    }
  }, [isExternalSaved]);

  const notifyParsedState = (items: ParsedFoodItem[], text: string) => {
    if (onMealParsed) {
      const totals = items.reduce(
        (acc, item) => ({
          calories: acc.calories + item.calories,
          protein: acc.protein + item.protein,
          carbs: acc.carbs + item.carbs,
          fat: acc.fat + item.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );
      onMealParsed(text || 'Custom Logged Meal', items, totals);
    }
  };

  const handleParseMeal = async () => {
    if (!mealText.trim()) return;
    setIsParsing(true);
    setErrorMessage(null);

    try {
      const response = await parseMealText(mealText);
      notifyParsedState(response.foods, mealText);
    } catch (err: any) {
      console.error('Meal parse error:', err);
      setErrorMessage(err.message || 'Error parsing meal text');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="nut-error-banner">
          {errorMessage}
        </div>
      )}

      <div className="space-y-2">
        <label className="nut-input-label">Describe Your Meal</label>
        <textarea
          rows={3}
          value={mealText}
          onChange={(e) => setMealText(e.target.value)}
          placeholder='e.g., "2 bananas", "250ml milk", "150g rice and paneer", "3 chapatis with dal"'
          className="nut-textarea"
        />
      </div>

      <button
        type="button"
        onClick={handleParseMeal}
        disabled={isParsing || !mealText.trim()}
        className="nut-parse-btn"
      >
        {isParsing ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Parsing Meal with Gemini...
          </span>
        ) : (
          'Parse Meal & Calculate Nutrition'
        )}
      </button>
    </div>
  );
};
