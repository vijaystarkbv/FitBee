import React, { useState } from 'react';
import { MealInput } from './MealInput';
import { MealReviewCard, EditableMacros } from './MealReviewCard';
import { MealHistoryList } from './MealHistoryList';
import { Profile, NutritionLog, MealEntry, ParsedFoodItem } from '../../types/database.types';
import './nutrition.css';

interface MealLogPageProps {
  profile: Profile;
  todayNutrition: NutritionLog | null;
  todayMeals: MealEntry[];
  onSaveMeal: (
    rawText: string,
    foods: ParsedFoodItem[],
    totals: EditableMacros
  ) => Promise<MealEntry>;
  onBackToHome: () => void;
}

export const MealLogPage: React.FC<MealLogPageProps> = ({
  profile,
  todayNutrition,
  todayMeals,
  onSaveMeal,
  onBackToHome,
}) => {
  const [parsedMealState, setParsedMealState] = useState<{
    rawText: string;
    foods: ParsedFoodItem[];
    initialTotals: EditableMacros;
  } | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Called when user parses text or edits food items in MealInput
  const handleMealParsed = (
    rawText: string,
    foods: ParsedFoodItem[],
    totals: EditableMacros
  ) => {
    setParsedMealState({ rawText, foods, initialTotals: totals });
    setIsSaved(false); // Reset saved state for new/updated parsing
    setSaveError(null);
  };

  // Called when user clicks Save Meal on the Review Card
  const handleSaveMealClick = async (adjustedMacros: EditableMacros) => {
    if (!parsedMealState || isSaved || isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      await onSaveMeal(
        parsedMealState.rawText,
        parsedMealState.foods,
        adjustedMacros
      );
      setIsSaved(true);
    } catch (err: any) {
      console.error('Error saving meal:', err);
      setSaveError(err?.message || 'Failed to save meal. Please check connection and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="nut-container">
      {/* ── Header ── */}
      <div className="nut-header">
        <button className="nut-back-btn" onClick={onBackToHome}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="nut-title">Log Your Meal</h1>
        <p className="nut-subtitle">
          Describe your meal naturally and review the estimated nutrition before saving.
        </p>
      </div>

      {/* ── Daily Summary Card ── */}
      <div className="nut-card" style={{ marginBottom: 24 }}>
        <h3 className="nut-card-title">Today's Nutrition Summary</h3>
        <p className="nut-card-subtitle">Live daily progress</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
              {todayNutrition?.total_calories || 0}
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
              / {profile.target_calories || 2000} kcal
            </div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
              {todayNutrition?.total_protein || 0}g
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
              / {profile.target_protein || 120}g P
            </div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
              {todayNutrition?.total_carbs || 0}g
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
              / {profile.target_carbs || 250}g C
            </div>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
              {todayNutrition?.total_fat || 0}g
            </div>
            <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
              / {profile.target_fat || 55}g F
            </div>
          </div>
        </div>
      </div>

      {/* ── Meal Input Card (Reuses existing MealInput & Gemini integration) ── */}
      <div className="nut-card" style={{ marginBottom: 24 }}>
        <h3 className="nut-card-title">+ Log Meal</h3>
        <p className="nut-card-subtitle">
          Enter what you ate in natural language
        </p>
        <MealInput
          onMealParsed={handleMealParsed}
          isExternalSaved={isSaved}
        />
      </div>

      {/* ── Save Error Banner ── */}
      {saveError && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #F87171',
          borderRadius: 10,
          padding: '12px 16px',
          marginBottom: 16,
          color: '#991B1B',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: "'Inter', sans-serif",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div style={{ flex: 1 }}>
            <strong>Save Error:</strong> {saveError}
          </div>
        </div>
      )}

      {/* ── Editable Nutrition Review Card (Appears after Gemini returns) ── */}
      {parsedMealState && (
        <MealReviewCard
          initialMacros={parsedMealState.initialTotals}
          onSave={handleSaveMealClick}
          isSaving={isSaving}
          isSaved={isSaved}
        />
      )}

      {/* ── Meal History List (Read-Only Saved Meals) ── */}
      <MealHistoryList meals={todayMeals} />
    </div>
  );
};
