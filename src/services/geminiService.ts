import { GoogleGenerativeAI } from '@google/generative-ai';
import type { OnboardingFormState } from '../types/fitness.types';
import type { GeminiMacroEstimationResponse, GeminiMealParseResponse, GeminiParsedMealItem } from '../types/gemini.types';
import { formatStatementsForPrompt, PREDEFINED_STATEMENTS } from './nutritionStatementLibrary';

// Helper to strip markdown code blocks if returned by Gemini
function cleanJsonResponseText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^```json/gi, '')
    .replace(/^```/g, '')
    .replace(/```$/g, '')
    .trim();
}

// Verified working model aliases per Gemini API inspection
const VERIFIED_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-3.6-flash',
  'gemini-3.5-flash-lite',
  'gemini-flash-latest',
];

/**
 * Executes a Gemini model call using verified active models with graceful fallback
 */
async function generateContent(
  genAI: GoogleGenerativeAI,
  prompt: string
): Promise<string> {
  let lastError: any = null;

  for (const modelName of VERIFIED_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        return text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`Gemini Model ${modelName} encountered an issue. Trying next model...`, err?.message || err);
      continue;
    }
  }

  throw lastError || new Error('Failed to generate content with Gemini API.');
}

/**
 * FitBee Physiological Constants
 */
export const KCAL_PER_KG_WEIGHT = 7700; // Standard energy equivalent assumption (~3500 kcal/lb)

export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

// Target weekly bodyweight change rates (as fraction of total bodyweight)
export const BODYWEIGHT_CHANGE_RATES = {
  fat_loss: { default: 0.005, min: 0.005, max: 0.010 }, // ~0.5% default, roughly 0.5% - 1.0% per week
  muscle_gain: { default: 0.003, min: 0.0025, max: 0.0050 }, // ~0.3% default starting point, roughly 0.25% - 0.5% per week (overall bodyweight gain, not guaranteed muscle tissue)
  maintenance: { default: 0.0 },
  improve_fitness: { default: 0.0 },
};

// Goal-specific protein multipliers (g/kg bodyweight)
export const PROTEIN_MULTIPLIERS: Record<string, number> = {
  lose_fat: 2.0,      // 1.8 - 2.2 g/kg (prefer higher end to protect lean tissue in deficit)
  lose_weight: 2.0,
  gain_muscle: 1.9,   // 1.6 - 2.2 g/kg (practical default ~1.8 - 2.0 g/kg for hypertrophy support)
  gain_weight: 1.9,
  maintain_weight: 1.8, // 1.6 - 2.0 g/kg
  improve_fitness: 1.8, // 1.6 - 2.0 g/kg (recovery and athletic performance)
};

// Goal-specific dietary fat multipliers (g/kg bodyweight)
export const FAT_MULTIPLIERS: Record<string, number> = {
  lose_fat: 0.8,
  lose_weight: 0.8,
  gain_muscle: 0.85,
  gain_weight: 0.85,
  maintain_weight: 0.85,
  improve_fitness: 0.85,
};

export const MIN_FAT_GRAMS = 30; // Absolute hormonal health floor
export const MIN_CARBS_GRAMS = 50; // Performance & cellular function floor

export type DeterministicTargetsInput = Pick<OnboardingFormState, 'gender' | 'age' | 'height_cm' | 'weight_kg'> & Partial<OnboardingFormState>;

/**
 * Deterministic calculation engine using Mifflin-St Jeor + Rate of Bodyweight Change rules.
 * Serves as both the authoritative calculation logic and fallback when offline.
 */
export function calculateDeterministicTargets(data: DeterministicTargetsInput): GeminiMacroEstimationResponse {
  const { weight_kg, target_weight_kg, goal, activity_level = 'moderate', gender, age, height_cm } = data;

  // Sanity check input bounds
  const validWeight = Math.max(30, Math.min(weight_kg || 70, 300));
  const validHeight = Math.max(100, Math.min(height_cm || 170, 250));
  const validAge = Math.max(12, Math.min(age || 25, 100));

  // 1. Mifflin-St Jeor BMR
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * validWeight + 6.25 * validHeight - 5 * validAge + 5;
  } else if (gender === 'female') {
    bmr = 10 * validWeight + 6.25 * validHeight - 5 * validAge - 161;
  } else {
    // Other / unspecified: average of male and female offsets
    bmr = 10 * validWeight + 6.25 * validHeight - 5 * validAge - 78;
  }

  // 2. Activity Multiplier -> TDEE (Maintenance)
  const actMultiplier = ACTIVITY_MULTIPLIERS[activity_level] || 1.55;
  const tdee = bmr * actMultiplier;

  // 3. Goal-specific Rate of Bodyweight Change -> Daily Energy Adjustment
  const goalStr = (goal as string) || 'maintain_weight';
  let targetCalories = tdee;

  if (goalStr === 'lose_fat' || goalStr === 'lose_weight') {
    // Default ~0.5% bodyweight loss/week (range 0.5% - 1.0%), modest deficit ~10% - 20% below TDEE
    const weeklyWeightLossKg = validWeight * BODYWEIGHT_CHANGE_RATES.fat_loss.default;
    const rawDeficit = (weeklyWeightLossKg * KCAL_PER_KG_WEIGHT) / 7;
    const minDeficit = tdee * 0.10;
    const maxDeficit = Math.min(tdee * 0.20, 1000);
    const boundedDeficit = Math.min(Math.max(rawDeficit, minDeficit), maxDeficit);
    targetCalories = tdee - boundedDeficit;
  } else if (goalStr === 'gain_muscle' || goalStr === 'gain_weight') {
    // Starting target around 0.3% bodyweight gain/week (range 0.25% - 0.5%, overall bodyweight gain)
    // If target weight is only slightly above current weight (<= 1.5kg), use lower end of surplus
    const isTargetClose = target_weight_kg && (target_weight_kg - validWeight > 0) && (target_weight_kg - validWeight <= 1.5);
    const weeklyRate = isTargetClose ? 0.0025 : BODYWEIGHT_CHANGE_RATES.muscle_gain.default;
    const weeklyWeightGainKg = validWeight * weeklyRate;
    const rawSurplus = (weeklyWeightGainKg * KCAL_PER_KG_WEIGHT) / 7;
    // Modest surplus: roughly +5% to +15% above TDEE, capped at 500 kcal/day
    const minSurplus = tdee * 0.05;
    const maxSurplus = Math.min(tdee * 0.15, 500);
    const boundedSurplus = Math.min(Math.max(rawSurplus, minSurplus), maxSurplus);
    targetCalories = tdee + boundedSurplus;
  } else if (goalStr === 'improve_fitness') {
    // Performance/fitness-support goal: ~0% bodyweight change, around maintenance
    // Modest adjustment if activity level is high
    targetCalories = activity_level === 'active' ? tdee * 1.05 : tdee;
  } else {
    // maintain_weight: ~0% bodyweight change, around maintenance (TDEE)
    targetCalories = tdee;
  }

  // Calorie floor safeguards
  const minCalorieFloor = gender === 'female' ? 1200 : gender === 'male' ? 1500 : 1350;
  targetCalories = Math.max(targetCalories, minCalorieFloor);

  // 4. Goal-Aware Protein Target
  const proteinMultiplier = PROTEIN_MULTIPLIERS[goalStr] || 1.8;
  let protein_g = validWeight * proteinMultiplier;
  // Protein bounds: minimum 50g or 1.2 g/kg, maximum 250g or 3.0 g/kg
  protein_g = Math.min(Math.max(protein_g, 50, validWeight * 1.2), 250, validWeight * 3.0);

  // 5. Dietary Fat Target (with percentage and hormonal floor checks)
  const fatMultiplier = FAT_MULTIPLIERS[goalStr] || 0.85;
  let fat_g = validWeight * fatMultiplier;
  // Ensure fat is between 20% and 35% of total calories
  const minFatFromCal = (targetCalories * 0.20) / 9;
  const maxFatFromCal = (targetCalories * 0.35) / 9;
  fat_g = Math.max(MIN_FAT_GRAMS, Math.min(fat_g, maxFatFromCal), minFatFromCal);

  // 6. Carbohydrates as Remaining Energy
  let remainingCal = targetCalories - (protein_g * 4) - (fat_g * 9);
  let carbs_g = remainingCal / 4;

  // If carbs are under floor, adjust fat towards floor to safely accommodate carbohydrates
  if (carbs_g < MIN_CARBS_GRAMS) {
    const neededCal = (MIN_CARBS_GRAMS - carbs_g) * 4;
    const reducibleFatCal = Math.max(0, (fat_g - MIN_FAT_GRAMS) * 9);
    const fatCalToReduce = Math.min(neededCal, reducibleFatCal);
    fat_g -= fatCalToReduce / 9;
    remainingCal = targetCalories - (protein_g * 4) - (fat_g * 9);
    carbs_g = Math.max(MIN_CARBS_GRAMS, remainingCal / 4);
  }

  // 7. Final Practical Rounding (Calories to nearest 10, Macros to whole grams)
  const finalCalories = Math.round(targetCalories / 10) * 10;
  const finalProtein = Math.round(protein_g);
  const finalFat = Math.round(fat_g);
  const finalCarbs = Math.round(carbs_g);

  return {
    calories: finalCalories,
    protein: finalProtein,
    carbs: finalCarbs,
    fat: finalFat,
    tdee: Math.round(tdee),
    recommended_template_name:
      (data.training_location === 'home' || data.training_location === 'both')
        ? (data.has_dumbbells ? 'Home Dumbbell Split' : 'Home Bodyweight Basics')
        : 'Gym Foundation',
  };
}

/**
 * 1. Initial User Target Estimation during Onboarding
 *
 * Uses FitBee individualized rate-of-bodyweight-change health rules:
 *   - Muscle Gain (gain_muscle): ~0.25% - 0.5%/week bodyweight trend (~0.3% default starting point), modest surplus (+5% - +15% of TDEE), 1.6 - 2.2 g/kg protein
 *   - Fat Loss (lose_fat): ~0.5% - 1.0%/week bodyweight trend (~0.5% default), modest deficit (10% - 20% of TDEE), 1.8 - 2.2 g/kg protein
 *   - Maintain (maintain_weight): ~0% bodyweight change, balanced nutrition around maintenance/TDEE, 1.6 - 2.0 g/kg protein
 *   - Improve Fitness (improve_fitness): ~0% bodyweight change, performance-focused around maintenance/TDEE with activity adjustments, 1.6 - 2.0 g/kg protein
 */
export async function estimateUserTargets(
  onboardingData: OnboardingFormState
): Promise<GeminiMacroEstimationResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  // ── Build equipment string ──
  const equipmentList = (onboardingData.equipment || []).length > 0
    ? onboardingData.equipment.join(', ')
    : 'None';

  const equipmentDetailsStr = Object.entries(onboardingData.equipmentDetails || {})
    .map(([name, detail]) => {
      const parts: string[] = [name];
      if (detail?.max_weight_kg) parts.push(`max ${detail.max_weight_kg}kg`);
      if (detail?.resistance_level) parts.push(`resistance: ${detail.resistance_level}`);
      return parts.join(' ');
    })
    .join('; ') || 'N/A';

  // ── Fallback: deterministic calculation ──
  if (!apiKey || apiKey.includes('placeholder')) {
    console.warn('FitBee: VITE_GEMINI_API_KEY missing. Using deterministic macro estimation.');
    return calculateDeterministicTargets(onboardingData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const goalDescriptions: Record<string, string> = {
      gain_muscle: 'Muscle Gain (gain_muscle) — targeted bodyweight gain (~0.25% - 0.5%/week, ~0.3% default starting point) to support hypertrophy and strength without excessive fat gain',
      gain_weight: 'Weight Gain (gain_muscle) — targeted bodyweight gain (~0.25% - 0.5%/week, ~0.3% default starting point) to support hypertrophy and strength',
      lose_fat: 'Fat Loss (lose_fat) — targeted bodyweight loss (~0.5% - 1.0%/week, ~0.5% default) with modest sustainable deficit (10% - 20%) while protecting lean muscle mass',
      lose_weight: 'Weight Loss (lose_fat) — targeted bodyweight loss (~0.5% - 1.0%/week, ~0.5% default) with modest sustainable deficit (10% - 20%) while protecting lean muscle mass',
      maintain_weight: 'Maintain Weight (maintain_weight) — maintain current bodyweight (~0% change) with balanced nutrition around maintenance/TDEE',
      improve_fitness: 'Improve Fitness (improve_fitness) — performance and athletic support goal around maintenance/TDEE (~0% change), prioritizing training fuel and recovery',
    };
    const goalText = goalDescriptions[onboardingData.goal as string] || onboardingData.goal;

    const prompt = `
You are FitBee's precision nutrition estimator.
Estimate realistic, highly personalized daily calorie and macronutrient targets based on the user's complete profile.
The numbers must be tailored recommendations reasoning across all profile factors together, NOT rigid universal formulas.

### 1. ESTIMATING MAINTENANCE (TDEE)
- Base Metabolic Rate (BMR) via Mifflin-St Jeor:
  * Male: 10 * weight_kg + 6.25 * height_cm - 5 * age + 5
  * Female: 10 * weight_kg + 6.25 * height_cm - 5 * age - 161
  * Other: 10 * weight_kg + 6.25 * height_cm - 5 * age - 78
- Activity Multiplier for maintenance calories (TDEE):
  * sedentary = 1.2, light = 1.375, moderate = 1.55, active = 1.725

### 2. GOAL-SPECIFIC GUIDELINES (Use as guidelines for reasoning, NOT universal fixed formulas):

* GAIN MUSCLE (gain_muscle):
  - Target bodyweight trend: ~0.25% to 0.5% bodyweight gain per week (use ~0.3%/week as the normal/default starting point).
  - IMPORTANT: This represents overall bodyweight gain, NOT guaranteed muscle-tissue gain. Do NOT make claims of guaranteed muscle gain per month (such as claiming a fixed 1.3 kg muscle/month).
  - Calorie approach: Modest surplus, roughly +5% to +15% above estimated maintenance calories.
    * Prefer the lower/middle part of this range (+5% to +10%) if the target weight is only slightly above current weight, or for older users or lower activity.
    * Avoid blindly applying a fixed +300 kcal to every user.
  - Protein: 1.6 to 2.2 g/kg bodyweight/day (practical default around 1.8 to 2.0 g/kg).
  - Fat: Nutritionally reasonable (0.8 to 1.0 g/kg, 20% to 35% of total calories). Carbs make up the remaining calories to fuel training.

* LOSE FAT (lose_fat):
  - Target bodyweight trend: ~0.5% to 1.0% bodyweight loss per week (use ~0.5%/week as the conservative default).
  - Do NOT automatically choose the most aggressive rate.
  - Calorie approach: Modest deficit, roughly 10% to 20% below estimated maintenance calories.
    * Choose the deficit based on current weight, target weight, age, sex, and activity level.
    * If target weight is substantially lower, avoid creating an excessively aggressive deficit just because the delta is large.
    * Avoid blindly applying a fixed -500 kcal deficit to everyone.
  - Protein: 1.8 to 2.2 g/kg bodyweight/day (prefer the higher end to protect lean muscle in a deficit).
  - Fat: Nutritionally adequate (0.8 to 1.0 g/kg, 20% to 35% of calories, minimum 30g). Carbs fill the remaining calories.

* MAINTAIN WEIGHT (maintain_weight):
  - Target bodyweight trend: ~0% bodyweight change/week.
  - Calorie approach: Around estimated maintenance (TDEE). Do NOT intentionally create a significant surplus or deficit.
  - Protein: 1.6 to 2.0 g/kg bodyweight/day (default ~1.8 g/kg).
  - Fat: Reasonable (0.8 to 1.0 g/kg, 20% to 35% of calories), carbs fill the rest.

* IMPROVE FITNESS (improve_fitness):
  - Treat primarily as a performance/fitness-support goal, NOT a weight-loss goal.
  - Target bodyweight trend: ~0% bodyweight change/week.
  - Calorie approach: Around estimated maintenance (TDEE). If activity level is high (e.g., active) and indicates greater energy requirements, make a modest upward adjustment rather than forcing strict maintenance.
  - Protein: 1.6 to 2.0 g/kg bodyweight/day (default ~1.8 g/kg).
  - Prioritize sufficient carbohydrates to support activity, training, and glycogen replenishment after protein and fat are accounted for.

### 3. IMPORTANT PERSONALIZATION & HOLISTIC REASONING
Use all profile data together:
- Sex & Age: Consider age and sex when deciding how aggressive the surplus or deficit should be.
- Current Weight vs. Target Weight:
  * If current and target weight are effectively the same (delta < 1 kg), prioritize maintenance/performance rather than forcing weight change.
  * If gaining muscle but target weight is only slightly above current weight, use a gentle surplus (+5% to +8%).
  * If losing fat and target weight is far below, keep the deficit sustainable (10% to 18%) rather than extreme.
- Activity Level & Training Context: Account for energy burn and prioritize carbs when training volume is high.
- The final numbers should be personalized estimates, not rigid promises.

### 4. SAFETY FLOORS & CONSTRAINTS
- Calorie floors: Absolute minimum 1200 kcal/day for females, 1500 kcal/day for males, 1350 kcal/day for other.
- Fat floor: Minimum 30g/day (and between 20% and 35% of total calories).
- Carbohydrate floor: Minimum 50g/day.
- Practical rounding: Round calories to nearest 10 kcal, protein, carbs, and fat to whole grams.

USER PROFILE:
- Sex / Gender: ${onboardingData.gender}
- Age: ${onboardingData.age} years
- Height: ${onboardingData.height_cm} cm
- Current Weight: ${onboardingData.weight_kg} kg
- Target Weight: ${onboardingData.target_weight_kg || onboardingData.weight_kg} kg
- Goal: ${goalText}
- Activity Level: ${onboardingData.activity_level} (sedentary / light / moderate / active)
- Training Location: ${onboardingData.training_location}
- Equipment Available: ${equipmentList}
- Equipment Details: ${equipmentDetailsStr}

Return ONLY a JSON object with these exact keys:
{
  "calories": <integer daily calories rounded to nearest 10>,
  "protein": <integer daily protein in grams>,
  "carbs": <integer daily carbohydrates in grams>,
  "fat": <integer daily fat in grams>
}

Do not include any other text. Return only the JSON object.
`;

    const rawText = await generateContent(genAI, prompt);
    const cleanedText = cleanJsonResponseText(rawText);
    const parsed = JSON.parse(cleanedText);

    // Validate parsed numbers against basic safety thresholds
    const cal = Number(parsed.calories);
    const pro = Number(parsed.protein);
    const car = Number(parsed.carbs);
    const fat = Number(parsed.fat);

    if (isNaN(cal) || cal < 1000 || isNaN(pro) || pro < 40 || isNaN(car) || car < 30 || isNaN(fat) || fat < 20) {
      console.warn('Gemini returned out-of-bound nutrition targets, falling back to deterministic calculations.');
      return calculateDeterministicTargets(onboardingData);
    }

    return {
      calories: Math.round(cal / 10) * 10,
      protein: Math.round(pro),
      carbs: Math.round(car),
      fat: Math.round(fat),
      recommended_template_name:
        parsed.recommended_template_name ||
        ((onboardingData.training_location === 'home' || onboardingData.training_location === 'both')
          ? (onboardingData.has_dumbbells ? 'Home Dumbbell Split' : 'Home Bodyweight Basics')
          : 'Gym Foundation'),
    };
  } catch (error: any) {
    console.error('Gemini Target Estimation Error:', error);
    console.warn('Falling back to deterministic macro estimation after Gemini error.');
    return calculateDeterministicTargets(onboardingData);
  }
}

/**
 * 2. Natural Language Meal Parser
 */
export async function parseMealText(mealDescription: string): Promise<GeminiMealParseResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey || apiKey.includes('placeholder')) {
    throw new Error('Gemini API Key is missing or invalid. Please configure VITE_GEMINI_API_KEY in your .env.local file.');
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = `
You are a precision food nutrition database parser.
Parse the user's meal description text into itemized food entries and calculate macro totals.

Meal Description: "${mealDescription}"

Output JSON schema strictly matching:
{
  "foods": [
    {
      "name": "Exact Food Name",
      "quantity": "Exact Portion Quantity (e.g., 2 medium / 250ml / 150g)",
      "calories": number (integer calories in kcal),
      "protein": number (integer protein in grams),
      "carbs": number (integer carbohydrates in grams),
      "fat": number (integer fat in grams)
    }
  ],
  "totals": {
    "calories": number (sum of calories),
    "protein": number (sum of protein),
    "carbs": number (sum of carbs),
    "fat": number (sum of fat)
  }
}
`;

    const rawText = await generateContent(genAI, prompt);
    const cleanedText = cleanJsonResponseText(rawText);

    if (!cleanedText) {
      throw new Error('Gemini API returned an empty response.');
    }

    const parsedRaw = JSON.parse(cleanedText);
    const rawFoods = parsedRaw?.foods || parsedRaw?.items || (Array.isArray(parsedRaw) ? parsedRaw : []);

    if (!Array.isArray(rawFoods) || rawFoods.length === 0) {
      throw new Error('Gemini API did not return a valid list of food items.');
    }

    const foods: GeminiParsedMealItem[] = rawFoods.map((f: any) => ({
      name: String(f.name || f.food || f.item || 'Food Item'),
      quantity: String(f.quantity || f.portion || f.amount || '1 serving'),
      calories: Math.round(Number(f.calories ?? f.cal ?? 0) || 0),
      protein: Math.round(Number(f.protein ?? f.protein_g ?? f.proteins ?? 0) || 0),
      carbs: Math.round(Number(f.carbs ?? f.carbs_g ?? f.carbohydrates ?? 0) || 0),
      fat: Math.round(Number(f.fat ?? f.fat_g ?? f.fats ?? 0) || 0),
    }));

    const totals = {
      calories: foods.reduce((sum, item) => sum + item.calories, 0),
      protein: foods.reduce((sum, item) => sum + item.protein, 0),
      carbs: foods.reduce((sum, item) => sum + item.carbs, 0),
      fat: foods.reduce((sum, item) => sum + item.fat, 0),
    };

    return { foods, totals };
  } catch (error: any) {
    console.error('Gemini Meal Parsing Error details:', error);

    let userFriendlyError = 'Failed to parse meal.';

    if (error instanceof SyntaxError) {
      userFriendlyError = `Gemini response could not be parsed as valid JSON: ${error.message}`;
    } else if (error?.message?.includes('API_KEY_INVALID') || error?.message?.includes('API key not valid')) {
      userFriendlyError = 'Invalid Gemini API Key. Please check VITE_GEMINI_API_KEY in your .env.local file.';
    } else if (error?.status === 404 || error?.message?.includes('404')) {
      userFriendlyError = 'Gemini API Error (404): Model gemini-flash-latest not found. Check model availability for your API key.';
    } else if (error?.message?.includes('QUOTA_EXCEEDED') || error?.status === 429) {
      userFriendlyError = 'Gemini API Rate Limit / Quota Exceeded. Please wait a moment and try again.';
    } else if (error?.message) {
      userFriendlyError = `Gemini API Error: ${error.message}`;
    } else {
      userFriendlyError = `Gemini API Error: ${String(error)}`;
    }

    throw new Error(userFriendlyError);
  }
}

export interface LongitudinalRecommendationInput {
  profile: {
    sex?: string;
    gender?: string;
    age: number;
    height: number;
    current_weight: number;
    target_weight?: number;
    goal: string;
    activity_level: string;
  };
  active_target: {
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    source: 'onboarding' | 'gemini_recommendation' | 'user_override';
  };
  recent_updates: Array<{
    date: string;
    weight: number;
    previous_weight?: number;
    target_calories_at_time: number;
    target_protein_at_time: number;
    target_carbs_at_time: number;
    target_fat_at_time: number;
    target_source_at_time?: string;
    user_action?: string;
  }>;
}

export interface LongitudinalRecommendationResult {
  recommended_calories: number;
  recommended_protein_g: number;
  recommended_carbs_g: number;
  recommended_fat_g: number;
  statement_ids: string[];
}

export type GoalDirection = 'WEIGHT_LOSS' | 'WEIGHT_GAIN' | 'MAINTENANCE' | 'FITNESS_RECOMP';

/**
 * Authoritative Single Source of Truth for Goal Direction.
 * Never infer goal direction from the final calorie number.
 */
export function resolveGoalDirection(goal?: string): GoalDirection {
  const g = (goal || '').toLowerCase().trim();
  if (
    g === 'gain_muscle' ||
    g === 'gain_weight' ||
    g.includes('gain') ||
    g.includes('hypertrophy') ||
    g.includes('muscle')
  ) {
    return 'WEIGHT_GAIN';
  }
  if (
    g === 'lose_fat' ||
    g === 'lose_weight' ||
    g.includes('lose') ||
    g.includes('lean') ||
    g.includes('deficit')
  ) {
    return 'WEIGHT_LOSS';
  }
  if (g === 'improve_fitness' || g.includes('fitness') || g.includes('energy')) {
    return 'FITNESS_RECOMP';
  }
  return 'MAINTENANCE';
}

/**
 * Strict invariant verification and repair layer.
 * Guarantees that neither Gemini nor fallbacks can ever produce a calorie target or statements
 * contradictory to the user's authoritative goal direction.
 */
export function validateAndEnforceRecommendationInvariants(params: {
  profile: {
    sex?: string;
    gender?: string;
    age: number;
    height: number;
    current_weight: number;
    target_weight?: number;
    goal: string;
    activity_level: string;
  };
  tdee: number;
  recommended_calories: number;
  recommended_protein_g: number;
  recommended_carbs_g: number;
  recommended_fat_g: number;
  statement_ids: string[];
}): LongitudinalRecommendationResult {
  const { profile, tdee } = params;
  let calories = Math.round(params.recommended_calories);
  let protein = Math.round(params.recommended_protein_g);
  let fat = Math.round(params.recommended_fat_g);
  let carbs = Math.round(params.recommended_carbs_g);
  let statementIds = [...(params.statement_ids || [])];

  const direction = resolveGoalDirection(profile.goal);
  const userSex = (profile.sex || profile.gender || 'other').toLowerCase();
  const minFloor = userSex === 'female' ? 1200 : 1500;
  const currentWeight = Math.max(30, Number(profile.current_weight) || 70);

  // ── 1. Invariant: Goal Direction vs Calories & TDEE ──
  if (direction === 'WEIGHT_GAIN') {
    // For WEIGHT_GAIN, calories MUST NOT be below TDEE!
    // Minimum surplus is at least +3% to +5% above TDEE, or TDEE + 50 kcal.
    const minGainCalories = Math.max(minFloor, Math.round(tdee * 1.03));
    if (calories < minGainCalories) {
      console.warn(
        `FitBee Guardrail: Calorie target ${calories} was below required gain threshold (${minGainCalories}) for goal ${profile.goal}. Repaired to surplus.`
      );
      calories = Math.max(minGainCalories, Math.round(tdee * 1.05));
    }

    // Invariant: Filter out conflicting weight-loss statement IDs
    const forbiddenForGain = new Set([
      'calories_decrease',
      'fat_loss_sustainable',
      'calories_deficit_sustainable',
      'calories_maintain_tdee',
    ]);
    statementIds = statementIds.filter((id) => !forbiddenForGain.has(id));

    // Ensure at least one gain-aligned statement
    const hasGainStatement = statementIds.some(
      (id) => id === 'calories_increase' || id === 'muscle_gain_sustainable' || id === 'calories_surplus_controlled' || id === 'calories_slight_trim'
    );
    if (!hasGainStatement) {
      statementIds.unshift(calories > tdee + 150 ? 'calories_increase' : 'muscle_gain_sustainable');
    }
  } else if (direction === 'WEIGHT_LOSS') {
    // For WEIGHT_LOSS, calories MUST be in a deficit below TDEE!
    // Minimum deficit is at least -50 kcal below TDEE, bounded down to minFloor.
    const maxLossCalories = Math.max(minFloor, Math.round(tdee - 50));
    if (calories > maxLossCalories) {
      console.warn(
        `FitBee Guardrail: Calorie target ${calories} was above deficit threshold (${maxLossCalories}) for goal ${profile.goal}. Repaired to deficit.`
      );
      calories = Math.max(minFloor, Math.round(tdee * 0.85));
    }

    // Invariant: Filter out conflicting weight-gain statement IDs
    const forbiddenForLoss = new Set([
      'calories_increase',
      'muscle_gain_sustainable',
      'calories_surplus_controlled',
      'calories_slight_trim',
      'calories_maintain_tdee',
    ]);
    statementIds = statementIds.filter((id) => !forbiddenForLoss.has(id));

    // Ensure at least one loss-aligned statement
    const hasLossStatement = statementIds.some(
      (id) => id === 'calories_decrease' || id === 'fat_loss_sustainable' || id === 'calories_deficit_sustainable'
    );
    if (!hasLossStatement) {
      statementIds.unshift('fat_loss_sustainable');
    }
  } else {
    // MAINTENANCE or FITNESS_RECOMP: Must be near TDEE
    if (Math.abs(calories - tdee) > 250) {
      calories = Math.round(tdee);
    }
    const forbiddenForMaint = new Set(['calories_decrease', 'calories_increase', 'fat_loss_sustainable', 'muscle_gain_sustainable']);
    statementIds = statementIds.filter((id) => !forbiddenForMaint.has(id));
    if (statementIds.length === 0) {
      statementIds.push('calories_maintain_tdee', 'protein_appropriate');
    }
  }

  // ── 2. Invariant: Macro Floors & Mathematical Consistency ──
  // Protein: between 1.4 and 2.6 g/kg
  const minProtein = Math.max(50, Math.round(currentWeight * 1.4));
  const maxProtein = Math.max(minProtein, Math.round(currentWeight * 2.6));
  protein = Math.min(Math.max(protein, minProtein), maxProtein);

  // Fat: 20% to 35% of calories, minimum 30g
  const minFat = Math.max(MIN_FAT_GRAMS, Math.round((calories * 0.20) / 9));
  const maxFat = Math.max(minFat, Math.round((calories * 0.35) / 9));
  fat = Math.min(Math.max(fat, minFat), maxFat);

  // Carbs: Recomputed to perfectly absorb remaining energy
  const remainingCal = calories - (protein * 4) - (fat * 9);
  carbs = Math.max(MIN_CARBS_GRAMS, Math.round(remainingCal / 4));

  // Round calories to nearest 10 for clean UX
  calories = Math.round((protein * 4 + carbs * 4 + fat * 9) / 10) * 10;

  // Enforce 1-3 statement IDs
  const finalStatementIds = statementIds.filter((id) => Boolean(PREDEFINED_STATEMENTS[id])).slice(0, 3);
  if (finalStatementIds.length === 0) {
    finalStatementIds.push('calories_on_track', 'protein_appropriate');
  }

  return {
    recommended_calories: calories,
    recommended_protein_g: protein,
    recommended_carbs_g: carbs,
    recommended_fat_g: fat,
    statement_ids: finalStatementIds,
  };
}

/**
 * Deterministic fallback for longitudinal recommendations when Gemini is offline or unavailable.
 */
export function fallbackLongitudinalRecommendation(
  input: LongitudinalRecommendationInput
): LongitudinalRecommendationResult {
  const { profile, active_target, recent_updates } = input;
  const userSex = (profile.sex || profile.gender || 'other').toLowerCase();
  const goal = profile.goal || 'maintain_weight';
  const currentWeight = profile.current_weight || 70;

  // Calculate baseline targets for current weight
  const baseline = calculateDeterministicTargets({
    gender: (userSex === 'male' || userSex === 'female') ? userSex : 'other',
    age: profile.age || 25,
    height_cm: profile.height || 170,
    weight_kg: currentWeight,
    target_weight_kg: profile.target_weight,
    goal: goal as any,
    activity_level: (profile.activity_level as any) || 'moderate',
  });

  const statement_ids: string[] = [];
  let recommended_calories = baseline.calories;
  let recommended_protein_g = baseline.protein;
  let recommended_carbs_g = baseline.carbs;
  let recommended_fat_g = baseline.fat;
  const baselineTdee = baseline.tdee || (userSex === 'female' ? 1800 : 2200);

  if (!recent_updates || recent_updates.length <= 1) {
    statement_ids.push('insufficient_history', 'calories_on_track', 'protein_appropriate');
  } else {
    // Check recent weight trend
    const latest = recent_updates[recent_updates.length - 1];
    const prev = recent_updates[recent_updates.length - 2] || latest;
    const delta = latest.weight - (prev.weight || latest.weight);

    if (goal === 'lose_fat' || goal === 'lose_weight') {
      if (delta > 0.2) {
        statement_ids.push('progress_opposite_goal', 'calories_decrease', 'protein_appropriate');
        recommended_calories = Math.max(baseline.calories - 100, userSex === 'female' ? 1200 : 1500);
      } else if (delta >= -0.1) {
        statement_ids.push('progress_slower', 'calories_decrease', 'protein_appropriate');
        recommended_calories = Math.max(baseline.calories - 100, userSex === 'female' ? 1200 : 1500);
      } else if (delta < -1.2) {
        statement_ids.push('progress_faster', 'calories_increase', 'fat_loss_sustainable');
        // Prevent loss-goal calorie increase from flipping into a surplus
        recommended_calories = Math.min(baseline.calories + 100, Math.round(baselineTdee * 0.95));
      } else {
        statement_ids.push('progress_on_track', 'calories_on_track', 'protein_appropriate');
      }
    } else if (goal === 'gain_muscle' || goal === 'gain_weight') {
      if (delta < -0.2) {
        statement_ids.push('progress_opposite_goal', 'calories_increase', 'protein_appropriate');
        recommended_calories = baseline.calories + 150;
      } else if (delta <= 0.05) {
        statement_ids.push('progress_plateau', 'calories_increase', 'protein_appropriate');
        recommended_calories = baseline.calories + 100;
      } else if (delta > 0.8) {
        statement_ids.push('progress_faster', 'calories_slight_trim', 'muscle_gain_sustainable');
        // Prevent muscle-gain trim from ever dropping below TDEE (must remain a lean surplus)
        recommended_calories = Math.max(baseline.calories - 100, Math.round(baselineTdee * 1.03));
      } else {
        statement_ids.push('progress_on_track', 'calories_on_track', 'protein_appropriate');
      }
    } else {
      if (Math.abs(delta) < 0.5) {
        statement_ids.push('stable_trend', 'calories_maintain_tdee', 'protein_appropriate');
      } else {
        statement_ids.push('calories_maintain_tdee', 'protein_appropriate');
      }
    }

    // Re-adjust carbs for calorie change
    const remainingCal = recommended_calories - (recommended_protein_g * 4) - (recommended_fat_g * 9);
    recommended_carbs_g = Math.max(MIN_CARBS_GRAMS, Math.round(remainingCal / 4));
  }

  // Preserve user custom macro ratios if previous source was user_override and calories match reasonably
  if (active_target.source === 'user_override') {
    statement_ids.push('carbs_adjusted');
  }

  // Guarantee strict invariants
  return validateAndEnforceRecommendationInvariants({
    profile: {
      sex: userSex,
      gender: userSex,
      age: profile.age || 25,
      height: profile.height || 170,
      current_weight: currentWeight,
      target_weight: profile.target_weight,
      goal,
      activity_level: profile.activity_level || 'moderate',
    },
    tdee: baselineTdee,
    recommended_calories,
    recommended_protein_g,
    recommended_carbs_g,
    recommended_fat_g,
    statement_ids,
  });
}

/**
 * Recommends longitudinal nutrition targets based on user profile and up to 6 recent check-ins.
 *
 * CRITICAL TOKEN CONSERVATION DESIGN:
 * Gemini outputs ZERO natural language text. It returns strictly a compact JSON with
 * recommended calories/macros and 1-3 statement_ids from the predefined FitBee library.
 * "Gemini chooses, FitBee speaks."
 */
export async function recommendLongitudinalTargets(
  input: LongitudinalRecommendationInput
): Promise<LongitudinalRecommendationResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey || apiKey.includes('placeholder')) {
    console.warn('FitBee: VITE_GEMINI_API_KEY missing. Using deterministic longitudinal recommendation.');
    return fallbackLongitudinalRecommendation(input);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const { profile, active_target, recent_updates } = input;
    const userSex = profile.sex || profile.gender || 'unspecified';

    // Format recent updates chronologically (oldest to newest, max 6)
    const updatesList = (recent_updates || []).slice(-6);
    const updatesFormatted = updatesList.length > 0
      ? updatesList.map((u, idx) => {
          const deltaStr = u.previous_weight !== undefined
            ? ` (${u.weight >= u.previous_weight ? '+' : ''}${(u.weight - u.previous_weight).toFixed(1)}kg vs previous)`
            : '';
          const actionStr = u.user_action ? `, Action: ${u.user_action}` : '';
          const sourceStr = u.target_source_at_time ? `, Source: ${u.target_source_at_time}` : '';
          return `Check-in ${idx + 1} [${u.date}]: Weight: ${u.weight}kg${deltaStr}, Target: ${u.target_calories_at_time}kcal (P:${u.target_protein_at_time}g, C:${u.target_carbs_at_time}g, F:${u.target_fat_at_time}g${sourceStr}${actionStr})`;
        }).join('\n')
      : 'No prior historical check-ins (initial weight update event).';

    const statementsList = formatStatementsForPrompt();

    const prompt = `
You are FitBee's precision nutrition intelligence engine.
Analyze the user's profile, active nutrition targets, and recent bodyweight check-in history to recommend updated daily targets.

USER PROFILE:
- Sex: ${userSex}
- Age: ${profile.age}
- Height: ${profile.height} cm
- Current Weight: ${profile.current_weight} kg
- Target Weight: ${profile.target_weight ? `${profile.target_weight} kg` : 'Not specified'}
- Goal: ${profile.goal}
- Activity Level: ${profile.activity_level}

ACTIVE NUTRITION TARGET:
- Calories: ${active_target.calories} kcal
- Protein: ${active_target.protein_g} g
- Carbs: ${active_target.carbs_g} g
- Fat: ${active_target.fat_g} g
- Target Source: ${active_target.source} (${active_target.source === 'user_override' ? 'User manually customized this target' : 'Generated by FitBee'})

RECENT CHECK-IN HISTORY (Oldest to Newest, max 6):
${updatesFormatted}

PHYSIOLOGICAL RULES & GUIDELINES:
1. Compare expected bodyweight change vs actual trajectory:
   - Fat Loss (lose_fat): sustainable loss is ~0.5% to 1.0% bodyweight/week. If plateaued or gaining, consider a modest calorie reduction (100-200 kcal). If losing too fast (>1.0%/week), increase calories slightly to protect lean mass.
   - Muscle Gain (gain_muscle): sustainable gain is ~0.25% to 0.5% bodyweight/week. If weight dropped or plateaued, consider increasing calories by 100-200 kcal. If gaining too fast (>0.5%/week), trim surplus to prevent excess fat gain.
   - Maintenance (maintain_weight): maintain steady bodyweight near TDEE.
2. Respect user autonomy:
   - If active target was a 'user_override', take into account their preferred macro ratios while keeping energy balanced toward their goal.
3. Safe Nutritional Floors:
   - Female minimum: 1,200 kcal; Male minimum: 1,500 kcal.
   - Fat minimum: 30g (hormonal floor) and 20%-35% of calories.
   - Carbs minimum: 50g.
   - Protein: 1.6 - 2.2 g/kg of current bodyweight.

TOKEN RESTRICTION (CRITICAL):
DO NOT write any explanation sentences, paragraphs, markdown commentary, or analysis text.
FitBee speaks to the user using predefined statements. You only choose the IDs.

OUTPUT SCHEMA (JSON ONLY):
{
  "recommended_calories": number,
  "recommended_protein_g": number,
  "recommended_carbs_g": number,
  "recommended_fat_g": number,
  "statement_ids": ["id1", "id2"]
}

Select 1 to 3 statement_ids from this PREDEFINED STATEMENTS list:
${statementsList}
`;

    const rawText = await generateContent(genAI, prompt);
    const cleanedText = cleanJsonResponseText(rawText);

    if (!cleanedText) {
      throw new Error('Gemini returned an empty response.');
    }

    const parsed = JSON.parse(cleanedText);

    const rawCalories = Math.round(Number(parsed.recommended_calories || active_target.calories));
    const rawProtein = Math.round(Number(parsed.recommended_protein_g || active_target.protein_g));
    const rawCarbs = Math.round(Number(parsed.recommended_carbs_g || active_target.carbs_g));
    const rawFat = Math.round(Number(parsed.recommended_fat_g || active_target.fat_g));

    // Validate statement_ids against library
    const rawIds: string[] = Array.isArray(parsed.statement_ids) ? parsed.statement_ids : [];
    const validIds = rawIds.filter((id) => Boolean(PREDEFINED_STATEMENTS[id]));

    // Baseline calculation to obtain authoritative TDEE
    const baseline = calculateDeterministicTargets({
      gender: (userSex === 'male' || userSex === 'female') ? userSex : 'other',
      age: profile.age || 25,
      height_cm: profile.height || 170,
      weight_kg: profile.current_weight || 70,
      target_weight_kg: profile.target_weight,
      goal: profile.goal as any,
      activity_level: (profile.activity_level as any) || 'moderate',
    });
    const authoritativeTdee = baseline.tdee || (userSex === 'female' ? 1800 : 2200);

    // Filter, validate, and enforce application business rules
    return validateAndEnforceRecommendationInvariants({
      profile: {
        sex: userSex,
        gender: userSex,
        age: profile.age || 25,
        height: profile.height || 170,
        current_weight: profile.current_weight || 70,
        target_weight: profile.target_weight,
        goal: profile.goal,
        activity_level: profile.activity_level || 'moderate',
      },
      tdee: authoritativeTdee,
      recommended_calories: rawCalories,
      recommended_protein_g: rawProtein,
      recommended_carbs_g: rawCarbs,
      recommended_fat_g: rawFat,
      statement_ids: validIds,
    });
  } catch (error: any) {
    console.warn('FitBee: Gemini longitudinal recommendation error, falling back to deterministic calculation:', error?.message || error);
    return fallbackLongitudinalRecommendation(input);
  }
}

