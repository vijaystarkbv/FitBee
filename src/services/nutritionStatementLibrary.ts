/**
 * Predefined Recommendation & Status Statement Library
 *
 * "Gemini chooses, FitBee speaks."
 * This library enables minimal token consumption by allowing Gemini to return
 * only 1-3 statement IDs instead of generating long, token-heavy natural language explanations.
 */

export interface PredefinedStatement {
  id: string;
  category: 'calories' | 'progress' | 'macros' | 'goal';
  shortLabel: string;
  text: string;
}

export const PREDEFINED_STATEMENTS: Record<string, PredefinedStatement> = {
  // ── 1. Calorie / Energy Targets ──
  calories_on_track: {
    id: 'calories_on_track',
    category: 'calories',
    shortLabel: 'Calories on track',
    text: 'Your current calorie intake appears well-aligned with your progress.',
  },
  calories_increase: {
    id: 'calories_increase',
    category: 'calories',
    shortLabel: 'Increase calories',
    text: 'FitBee recommends a modest calorie increase to support your goal pace.',
  },
  calories_decrease: {
    id: 'calories_decrease',
    category: 'calories',
    shortLabel: 'Decrease calories',
    text: 'FitBee recommends a modest calorie reduction to keep your progress on track.',
  },
  calories_slight_trim: {
    id: 'calories_slight_trim',
    category: 'calories',
    shortLabel: 'Trim surplus',
    text: 'A gentle calorie trim is suggested to keep weight gain controlled and lean.',
  },
  calories_maintain_tdee: {
    id: 'calories_maintain_tdee',
    category: 'calories',
    shortLabel: 'Maintain TDEE',
    text: 'Maintaining steady energy intake around TDEE is recommended for stability.',
  },
  calories_deficit_sustainable: {
    id: 'calories_deficit_sustainable',
    category: 'calories',
    shortLabel: 'Sustainable deficit',
    text: 'Your calorie deficit remains within a safe, sustainable range.',
  },
  calories_surplus_controlled: {
    id: 'calories_surplus_controlled',
    category: 'calories',
    shortLabel: 'Controlled surplus',
    text: 'Your calorie surplus remains controlled to support muscle development.',
  },

  // ── 2. Progress / Trajectory ──
  progress_slower: {
    id: 'progress_slower',
    category: 'progress',
    shortLabel: 'Progress slower',
    text: 'Recent bodyweight changes are moving slightly slower than your target rate.',
  },
  progress_faster: {
    id: 'progress_faster',
    category: 'progress',
    shortLabel: 'Progress faster',
    text: 'Recent bodyweight changes are progressing faster than your sustainable target rate.',
  },
  progress_on_track: {
    id: 'progress_on_track',
    category: 'progress',
    shortLabel: 'Progress on track',
    text: 'Your recent bodyweight trend is tracking closely with your goal.',
  },
  progress_opposite_goal: {
    id: 'progress_opposite_goal',
    category: 'progress',
    shortLabel: 'Opposite to goal',
    text: 'Your bodyweight is trending opposite to your requested goal direction.',
  },
  progress_plateau: {
    id: 'progress_plateau',
    category: 'progress',
    shortLabel: 'Weight plateaued',
    text: 'Your bodyweight has remained plateaued over recent check-ins.',
  },
  insufficient_history: {
    id: 'insufficient_history',
    category: 'progress',
    shortLabel: 'Initial baseline',
    text: 'Preliminary recommendation based on your first check-in snapshot.',
  },
  stable_trend: {
    id: 'stable_trend',
    category: 'progress',
    shortLabel: 'Stable trend',
    text: 'Your bodyweight has remained stable, supporting your maintenance goal.',
  },

  // ── 3. Macronutrients ──
  protein_appropriate: {
    id: 'protein_appropriate',
    category: 'macros',
    shortLabel: 'Protein on point',
    text: 'Protein intake is well-positioned for lean muscle retention and recovery.',
  },
  protein_increase: {
    id: 'protein_increase',
    category: 'macros',
    shortLabel: 'Boost protein',
    text: 'FitBee suggests elevating protein to better protect muscle tissue.',
  },
  protein_decrease: {
    id: 'protein_decrease',
    category: 'macros',
    shortLabel: 'Moderate protein',
    text: 'Protein can be slightly moderated to allocate more energy to carbohydrates.',
  },
  fat_appropriate: {
    id: 'fat_appropriate',
    category: 'macros',
    shortLabel: 'Healthy fat balance',
    text: 'Dietary fat is well-balanced for hormonal health and satiety.',
  },
  fat_increase: {
    id: 'fat_increase',
    category: 'macros',
    shortLabel: 'Raise fat floor',
    text: 'Dietary fat target has been raised to meet healthy minimums.',
  },
  fat_trim: {
    id: 'fat_trim',
    category: 'macros',
    shortLabel: 'Trim dietary fat',
    text: 'Dietary fat can be trimmed slightly to leave room for training carbs.',
  },
  carbs_fuel_training: {
    id: 'carbs_fuel_training',
    category: 'macros',
    shortLabel: 'Fuel training carbs',
    text: 'Carbohydrates have been prioritized to support workout energy and performance.',
  },
  carbs_adjusted: {
    id: 'carbs_adjusted',
    category: 'macros',
    shortLabel: 'Carbs adjusted',
    text: 'Carbohydrates have been balanced to fit your adjusted daily calorie goal.',
  },

  // ── 4. Goal-Specific Context ──
  muscle_gain_sustainable: {
    id: 'muscle_gain_sustainable',
    category: 'goal',
    shortLabel: 'Controlled gain',
    text: 'Aiming for steady, controlled bodyweight gain to minimize unnecessary fat accumulation.',
  },
  fat_loss_sustainable: {
    id: 'fat_loss_sustainable',
    category: 'goal',
    shortLabel: 'Sustainable fat loss',
    text: 'Keeping the deficit moderate to protect lean tissue and metabolic rate.',
  },
  fitness_recovery_fuel: {
    id: 'fitness_recovery_fuel',
    category: 'goal',
    shortLabel: 'Performance & recovery',
    text: 'Prioritizing training fuel and recovery without forcing weight change.',
  },
};

/**
 * Returns human-readable statement text for a given statement ID.
 */
export function getStatementText(id: string): string {
  return PREDEFINED_STATEMENTS[id]?.text || id;
}

/**
 * Maps an array of statement IDs to resolved objects with ID and text.
 */
export function getStatementsFromIds(statementIds: string[]): { id: string; text: string; shortLabel: string }[] {
  if (!Array.isArray(statementIds)) return [];
  return statementIds
    .map((id) => PREDEFINED_STATEMENTS[id])
    .filter(Boolean)
    .map((s) => ({ id: s.id, text: s.text, shortLabel: s.shortLabel }));
}

/**
 * Generates an ultra-compact list of ID + short summary for inclusion in the Gemini prompt.
 * Keeps prompt size and input tokens minimal!
 */
export function formatStatementsForPrompt(): string {
  return Object.values(PREDEFINED_STATEMENTS)
    .map((s) => `"${s.id}": ${s.shortLabel}`)
    .join('\n');
}
