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
 */
export async function estimateUserTargets(
  onboardingData: OnboardingFormState
): Promise<GeminiMacroEstimationResponse> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey || apiKey.includes('placeholder')) {
    console.warn('FitBee: VITE_GEMINI_API_KEY is missing/placeholder. Using deterministic macro estimation.');
    const goalStr = onboardingData.goal as string;
    const isGain = goalStr === 'gain_muscle' || goalStr === 'gain_weight';
    const baseCal = onboardingData.weight_kg * (isGain ? 35 : 26);
    return {
      calories: Math.round(baseCal),
      protein: Math.round(onboardingData.weight_kg * 2.0),
      carbs: Math.round((baseCal * 0.45) / 4),
      fat: Math.round((baseCal * 0.25) / 9),
      recommended_template_name: (onboardingData.training_location === 'home' || onboardingData.training_location === 'both')
        ? (onboardingData.has_dumbbells ? 'Home Dumbbell Split' : 'Home Bodyweight Basics')
        : 'Gym Foundation',
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const goalDescriptions: Record<string, string> = {
      gain_muscle: 'Weight Gain / Muscle Building',
      lose_fat: 'Fat Loss',
      maintain_weight: 'Maintain Current Weight',
      improve_fitness: 'Improve General Fitness',
      gain_weight: 'Weight Gain / Muscle Building',
      lose_weight: 'Fat Loss',
    };
    const goalText = goalDescriptions[onboardingData.goal] || onboardingData.goal;

    const prompt = `
You are a precision fitness and nutrition calculator.
Calculate daily nutrition targets and recommend an initial beginner workout template.

User Profile:
- Age: ${onboardingData.age}
- Gender: ${onboardingData.gender}
- Height: ${onboardingData.height_cm} cm
- Weight: ${onboardingData.weight_kg} kg
- Goal: ${goalText}
- Activity Level: ${onboardingData.activity_level}
- Training Location: ${onboardingData.training_location}
- Has Dumbbells: ${onboardingData.has_dumbbells ? 'Yes' : 'No'}
- Max Dumbbell Weight: ${onboardingData.max_dumbbell_weight_kg ?? 'N/A'} kg

Output JSON schema strictly matching:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fat": number,
  "recommended_template_name": "Home Bodyweight Basics" | "Home Dumbbell Split" | "Gym Foundation"
}
`;

    const rawText = await generateContent(genAI, prompt);
    const cleanedText = cleanJsonResponseText(rawText);
    const parsed: GeminiMacroEstimationResponse = JSON.parse(cleanedText);
    return parsed;
  } catch (error: any) {
    console.error('Gemini Target Estimation Error:', error);
    let errMsg = 'Failed to estimate targets via Gemini API.';
    if (error?.message?.includes('API_KEY_INVALID') || error?.status === 400) {
      errMsg = 'Gemini Error: Invalid API Key provided in .env.local';
    } else if (error?.status === 404 || error?.message?.includes('404')) {
      errMsg = 'Gemini Error: Model gemini-flash-latest not found (404). Check model availability for your API key.';
    } else if (error?.message) {
      errMsg = `Gemini Error: ${error.message}`;
    }
    throw new Error(errMsg);
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
