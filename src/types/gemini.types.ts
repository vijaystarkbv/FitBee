// Schemas for Gemini Structured JSON responses

export interface GeminiMacroEstimationResponse {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  recommended_template_name: string;
  explanation_summary?: string;
}

export interface GeminiParsedMealItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface GeminiMealParseResponse {
  foods: GeminiParsedMealItem[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}
