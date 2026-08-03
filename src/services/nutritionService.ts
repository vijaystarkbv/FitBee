import { supabase } from './supabaseClient';
import { NutritionLog, MealEntry, ParsedFoodItem } from '../types/database.types';
import { getTodayDateString } from '../utils/formatters';

/**
 * Gets or creates today's nutrition log row for the user
 */
export async function getOrCreateTodayNutritionLog(userId: string): Promise<NutritionLog> {
  const today = getTodayDateString();

  const { data: existing } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .maybeSingle();

  if (existing) return existing;

  const { data: created, error } = await supabase
    .from('nutrition_logs')
    .insert({
      user_id: userId,
      date: today,
      total_calories: 0,
      total_protein: 0,
      total_carbs: 0,
      total_fat: 0,
    })
    .select('*')
    .single();

  if (error) throw error;
  return created;
}

/**
 * Saves a new meal entry and updates the daily nutrition log aggregates
 */
export async function saveMealEntry(
  nutritionLogId: string,
  rawText: string,
  parsedFoods: ParsedFoodItem[],
  totals: { calories: number; protein: number; carbs: number; fat: number }
): Promise<MealEntry> {
  const safeTotals = {
    calories: Math.round(Number(totals.calories) || 0),
    protein: Math.round(Number(totals.protein) || 0),
    carbs: Math.round(Number(totals.carbs) || 0),
    fat: Math.round(Number(totals.fat) || 0),
  };

  const safeFoods = parsedFoods.map((f) => ({
    name: String(f.name || 'Food Item'),
    quantity: String(f.quantity || '1 serving'),
    calories: Math.round(Number(f.calories) || 0),
    protein: Math.round(Number(f.protein) || 0),
    carbs: Math.round(Number(f.carbs) || 0),
    fat: Math.round(Number(f.fat) || 0),
  }));

  const { data: meal, error } = await supabase
    .from('meal_entries')
    .insert({
      nutrition_log_id: nutritionLogId,
      raw_text: rawText,
      calories: safeTotals.calories,
      protein: safeTotals.protein,
      carbs: safeTotals.carbs,
      fat: safeTotals.fat,
      parsed_breakdown: safeFoods,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error inserting meal_entry:', error);
    throw error;
  }

  // Increment total macros on nutrition_log
  const { data: currentLog } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('id', nutritionLogId)
    .single();

  if (currentLog) {
    const { error: updateErr } = await supabase
      .from('nutrition_logs')
      .update({
        total_calories: (Number(currentLog.total_calories) || 0) + safeTotals.calories,
        total_protein: (Number(currentLog.total_protein) || 0) + safeTotals.protein,
        total_carbs: (Number(currentLog.total_carbs) || 0) + safeTotals.carbs,
        total_fat: (Number(currentLog.total_fat) || 0) + safeTotals.fat,
      })
      .eq('id', nutritionLogId);

    if (updateErr) {
      console.error('Error updating nutrition_logs:', updateErr);
      throw updateErr;
    }
  }

  return meal;
}

/**
 * Fetches all meal entries for a specific daily nutrition log
 */
export async function getTodayMeals(nutritionLogId: string): Promise<MealEntry[]> {
  const { data, error } = await supabase
    .from('meal_entries')
    .select('*')
    .eq('nutrition_log_id', nutritionLogId)
    .order('created_at', { ascending: true }); // Oldest top, newest bottom

  if (error) {
    console.error('Error fetching today meals:', error);
    return [];
  }

  return data || [];
}

/**
 * Recalculates single food item macros when user edits quantity (ratio math)
 */
export function recalculateFoodItemMacro(
  originalItem: ParsedFoodItem,
  newQuantityStr: string
): ParsedFoodItem {
  const oldNumMatch = originalItem.quantity.match(/[\d.]+/);
  const newNumMatch = newQuantityStr.match(/[\d.]+/);

  const baseCal = Number(originalItem.calories) || 0;
  const baseP = Number(originalItem.protein) || 0;
  const baseC = Number(originalItem.carbs) || 0;
  const baseF = Number(originalItem.fat) || 0;

  if (!oldNumMatch || !newNumMatch) {
    return {
      ...originalItem,
      quantity: newQuantityStr,
      calories: baseCal,
      protein: baseP,
      carbs: baseC,
      fat: baseF,
    };
  }

  const oldVal = parseFloat(oldNumMatch[0]);
  const newVal = parseFloat(newNumMatch[0]);

  if (isNaN(oldVal) || isNaN(newVal) || oldVal === 0) {
    return { ...originalItem, quantity: newQuantityStr };
  }

  const ratio = newVal / oldVal;

  return {
    ...originalItem,
    quantity: newQuantityStr,
    calories: Math.round(baseCal * ratio),
    protein: Math.round(baseP * ratio),
    carbs: Math.round(baseC * ratio),
    fat: Math.round(baseF * ratio),
  };
}
