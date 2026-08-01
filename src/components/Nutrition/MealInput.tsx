import React, { useState } from 'react';
import { parseMealText } from '../../services/geminiService';
import { recalculateFoodItemMacro } from '../../services/nutritionService';
import { ParsedFoodItem } from '../../types/database.types';
import { FoodBreakdown } from './FoodBreakdown';
import { Button } from '../common/Button';

interface MealInputProps {
  onSaveMeal: (
    rawText: string,
    foods: ParsedFoodItem[],
    totals: { calories: number; protein: number; carbs: number; fat: number }
  ) => Promise<void>;
}

export const MealInput: React.FC<MealInputProps> = ({ onSaveMeal }) => {
  const [mealText, setMealText] = useState<string>('');
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);
  const [parsedItems, setParsedItems] = useState<ParsedFoodItem[] | null>(null);

  const handleParseMeal = async () => {
    if (!mealText.trim()) return;
    setIsParsing(true);
    setErrorMessage(null);
    setSaveSuccessMessage(null);

    try {
      const response = await parseMealText(mealText);
      setParsedItems(response.foods);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error parsing meal text');
    } finally {
      setIsParsing(false);
    }
  };

  const handleUpdateItemName = (idx: number, newName: string) => {
    if (!parsedItems) return;
    const updated = [...parsedItems];
    updated[idx] = { ...updated[idx], name: newName };
    setParsedItems(updated);
  };

  const handleUpdateItemQuantity = (idx: number, newQtyStr: string) => {
    if (!parsedItems) return;
    const updated = [...parsedItems];
    updated[idx] = recalculateFoodItemMacro(updated[idx], newQtyStr);
    setParsedItems(updated);
  };

  const handleDeleteItem = (idx: number) => {
    if (!parsedItems) return;
    const updated = parsedItems.filter((_, i) => i !== idx);
    setParsedItems(updated);
  };

  const handleAddItemManually = () => {
    const newItem: ParsedFoodItem = {
      name: 'Custom Item',
      quantity: '1 serving',
      calories: 100,
      protein: 5,
      carbs: 15,
      fat: 2,
    };
    setParsedItems((prev) => [...(prev || []), newItem]);
  };

  // Calculate live totals from parsed items
  const liveTotals = (parsedItems || []).reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      protein: acc.protein + item.protein,
      carbs: acc.carbs + item.carbs,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleConfirmAndSave = async () => {
    if (!parsedItems || parsedItems.length === 0) return;
    setIsSaving(true);
    setErrorMessage(null);
    try {
      await onSaveMeal(mealText || 'Custom Logged Meal', parsedItems, liveTotals);
      setMealText('');
      setParsedItems(null);
      setSaveSuccessMessage('✓ Meal successfully logged and daily macros updated!');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(`Failed to save meal: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-lg font-medium">
          {errorMessage}
        </div>
      )}

      {saveSuccessMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-lg font-semibold animate-in fade-in">
          {saveSuccessMessage}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-300">Log a Meal (Natural Language)</label>
        <textarea
          rows={3}
          value={mealText}
          onChange={(e) => setMealText(e.target.value)}
          placeholder='e.g., "2 bananas", "250ml milk", "150g rice and paneer", "3 chapatis with dal"'
          className="input-field resize-none"
        />
      </div>

      {!parsedItems ? (
        <div className="flex gap-2">
          <Button
            onClick={handleParseMeal}
            isLoading={isParsing}
            disabled={!mealText.trim()}
            className="w-full"
          >
            {isParsing ? 'Parsing Meal with Gemini...' : 'Parse Meal & Calculate Nutrition'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in duration-200">
          <FoodBreakdown
            items={parsedItems}
            onUpdateItemName={handleUpdateItemName}
            onUpdateItemQuantity={handleUpdateItemQuantity}
            onDeleteItem={handleDeleteItem}
            onAddItemManually={handleAddItemManually}
          />

          {/* Verification Summary Totals */}
          <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-xs">
            <span className="font-semibold text-zinc-300">Meal Totals</span>
            <div className="flex items-center gap-3">
              <span className="font-bold text-amber-400">{liveTotals.calories} kcal</span>
              <span className="text-zinc-400">P: {liveTotals.protein}g</span>
              <span className="text-zinc-400">C: {liveTotals.carbs}g</span>
              <span className="text-zinc-400">F: {liveTotals.fat}g</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setParsedItems(null)}
              disabled={isSaving}
              className="w-1/3"
            >
              Reset
            </Button>
            <Button
              onClick={handleConfirmAndSave}
              isLoading={isSaving}
              className="w-2/3"
            >
              Confirm & Save Meal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
