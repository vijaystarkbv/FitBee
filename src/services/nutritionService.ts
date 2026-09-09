import { supabase } from './supabaseClient';
import { NutritionLog, MealEntry, ParsedFoodItem } from '../types/database.types';
import { getTodayDateString } from '../utils/formatters';

/**
 * Gets or creates today's (or target date's) nutrition log row for the user.
 * Concurrency-safe: handles parallel invocations without unique constraint conflicts.
 */
export async function getOrCreateTodayNutritionLog(
  userId: string,
  targetDateStr?: string
): Promise<NutritionLog> {
  const targetDate = targetDateStr || getTodayDateString();

  // 1. Check existing record
  const { data: existing, error: selectErr } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', targetDate)
    .maybeSingle();

  if (existing) return existing;

  // 2. Concurrency-safe insert / upsert on conflict (user_id, date)
  const { data: created, error: insertErr } = await supabase
    .from('nutrition_logs')
    .upsert(
      {
        user_id: userId,
        date: targetDate,
        total_calories: 0,
        total_protein: 0,
        total_carbs: 0,
        total_fat: 0,
      },
      { onConflict: 'user_id,date', ignoreDuplicates: true }
    )
    .select('*')
    .maybeSingle();

  if (created) return created;

  // 3. Fallback: if ignoreDuplicates suppressed insertion because another concurrent request
  // created it in the exact same millisecond, fetch that created row
  const { data: fallback, error: fallbackErr } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', targetDate)
    .single();

  if (fallback) return fallback;
  if (fallbackErr) throw fallbackErr;
  if (insertErr) throw insertErr;
  if (selectErr) throw selectErr;
  throw new Error(`Failed to get or create nutrition log for user ${userId} on ${targetDate}`);
}

/**
 * Saves a new meal entry and authoritatively updates the daily nutrition log aggregates
 * by summing all existing meal entries to prevent numerical drift or race condition discrepancies.
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

  // Authoritative re-sum: calculate exact sum of all meal entries for this daily log
  const { data: allMeals, error: mealsErr } = await supabase
    .from('meal_entries')
    .select('calories, protein, carbs, fat')
    .eq('nutrition_log_id', nutritionLogId);

  if (!mealsErr && allMeals) {
    const authoritativeTotals = allMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + (Number(m.calories) || 0),
        protein: acc.protein + (Number(m.protein) || 0),
        carbs: acc.carbs + (Number(m.carbs) || 0),
        fat: acc.fat + (Number(m.fat) || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const { error: updateErr } = await supabase
      .from('nutrition_logs')
      .update({
        total_calories: authoritativeTotals.calories,
        total_protein: authoritativeTotals.protein,
        total_carbs: authoritativeTotals.carbs,
        total_fat: authoritativeTotals.fat,
      })
      .eq('id', nutritionLogId);

    if (updateErr) {
      console.error('Error updating nutrition_logs authoritative totals:', updateErr);
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
