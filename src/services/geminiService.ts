import { GoogleGenerativeAI } from '@google/generative-ai';
import { OnboardingFormState } from '../types/fitness.types';
import { GeminiMacroEstimationResponse, GeminiMealParseResponse, GeminiParsedMealItem } from '../types/gemini.types';

// Helper to strip markdown code blocks if returned by Gemini
function cleanJsonResponseText(text: string): string {
  if (!text) return '';
  return text
    .replace(/^```json/gi, '')
    .replace(/^```/g, '')
    .replace(/```$/g, '')
    .trim();
}

// Verified working model aliases per Gemini API ListModels inspection
const VERIFIED_MODELS = [
  'gemini-flash-latest',
  'gemini-flash-lite-latest',
];

/**
 * Executes a Gemini model call using verified active models
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
      if (err?.status === 404 || err?.message?.includes('404') || err?.message?.includes('not found')) {
        console.warn(`Gemini Model ${modelName} returned 404. Trying next verified model...`);
        continue;
      }
      break;
    }
  }

  throw lastError || new Error('Failed to generate content with Gemini API.');
}

/**
 * 1. Initial User Target Estimation during Onboarding
 *
 * Uses FitBee health rules:
 *   - Weight Loss: ~0.5 kg/week (~2 kg/month)
 *   - Muscle Gain: ~1.3 kg/month lean gain
 *   - Maintain: maintain body weight, balanced nutrition
 *   - Improve Fitness: maintain body weight, prioritize recovery & performance
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

  // ── Fallback: deterministic Mifflin-St Jeor calculation ──
  if (!apiKey || apiKey.includes('placeholder')) {
    console.warn('FitBee: VITE_GEMINI_API_KEY missing. Using deterministic macro estimation.');
    return deterministicEstimate(onboardingData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const goalDescriptions: Record<string, string> = {
      gain_muscle: 'Lean Muscle Gain — target approximately 1.3 kg per month of lean muscle while minimizing fat gain',
      lose_fat: 'Fat Loss — target approximately 0.5 kg per week of weight loss (about 2 kg per month)',
      maintain_weight: 'Maintain Weight — maintain current body weight with balanced, optimized nutrition',
      improve_fitness: 'Improve Fitness — maintain body weight while prioritizing recovery and athletic performance',
    };
    const goalText = goalDescriptions[onboardingData.goal as string] || onboardingData.goal;

    const prompt = `
You are FitBee's precision nutrition calculator.
Calculate daily nutrition targets strictly following FitBee's health rules.

FITBEE HEALTH RULES (MANDATORY — do NOT override these):
- Weight Loss goal: Target 0.5 kg weight loss per week (approximately 2 kg per month). Calculate caloric deficit accordingly.
- Muscle Gain goal: Target approximately 1.3 kg lean muscle gain per month. Calculate caloric surplus accordingly while minimizing unnecessary fat gain.
- Maintain Weight goal: Maintain current body weight. Optimize for balanced nutrition.
- Improve Fitness goal: Maintain current body weight. Prioritize recovery and athletic performance nutrition.

Use the Mifflin-St Jeor equation for BMR, then apply the appropriate activity multiplier for TDEE.
Apply the goal-specific adjustment to TDEE to arrive at daily calories.
Calculate protein at 1.8-2.2g per kg bodyweight.
Calculate fat at 0.8-1.0g per kg bodyweight.
Fill remaining calories with carbohydrates.

USER PROFILE:
- Age: ${onboardingData.age} years
- Gender: ${onboardingData.gender}
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
  "calories": <integer daily calories>,
  "protein": <integer daily protein in grams>,
  "carbs": <integer daily carbohydrates in grams>,
  "fat": <integer daily fat in grams>
}

Do not include any other text. Return only the JSON object.
`;

    const rawText = await generateContent(genAI, prompt);
    const cleanedText = cleanJsonResponseText(rawText);
    const parsed = JSON.parse(cleanedText);

    // Validate & normalize
    return {
      calories: Math.round(Number(parsed.calories) || 2000),
      protein: Math.round(Number(parsed.protein) || 120),
      carbs: Math.round(Number(parsed.carbs) || 250),
      fat: Math.round(Number(parsed.fat) || 55),
      recommended_template_name:
        parsed.recommended_template_name ||
        ((onboardingData.training_location === 'home' || onboardingData.training_location === 'both')
          ? (onboardingData.has_dumbbells ? 'Home Dumbbell Split' : 'Home Bodyweight Basics')
          : 'Gym Foundation'),
    };
  } catch (error: any) {
    console.error('Gemini Target Estimation Error:', error);

    // On Gemini failure, fall back to deterministic calculation
    console.warn('Falling back to deterministic macro estimation after Gemini error.');
    return deterministicEstimate(onboardingData);
  }
}

/**
 * Deterministic fallback using Mifflin-St Jeor + FitBee health rules.
 */
function deterministicEstimate(data: OnboardingFormState): GeminiMacroEstimationResponse {
  const { weight_kg, goal, activity_level, gender, age, height_cm } = data;

  // Mifflin-St Jeor BMR
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
  } else {
    bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
  }

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };

  let tdee = bmr * (activityMultipliers[activity_level] || 1.55);

  // FitBee health rules
  const goalStr = goal as string;
  if (goalStr === 'lose_fat' || goalStr === 'lose_weight') {
    // 0.5 kg/week = ~500 kcal/day deficit
    tdee -= 500;
  } else if (goalStr === 'gain_muscle' || goalStr === 'gain_weight') {
    // ~1.3 kg/month lean gain = ~300 kcal/day surplus
    tdee += 300;
  }
  // maintain_weight & improve_fitness: TDEE as-is

  const calories = Math.max(Math.round(tdee), 1200);
  const protein = Math.round(weight_kg * 2.0);
  const fat = Math.round(weight_kg * 0.9);
  const carbCalories = calories - protein * 4 - fat * 9;
  const carbs = Math.max(Math.round(carbCalories / 4), 80);

  return {
    calories,
    protein: Math.max(protein, 80),
    carbs,
    fat: Math.max(fat, 30),
    recommended_template_name:
      (data.training_location === 'home' || data.training_location === 'both')
        ? (data.has_dumbbells ? 'Home Dumbbell Split' : 'Home Bodyweight Basics')
        : 'Gym Foundation',
  };
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
