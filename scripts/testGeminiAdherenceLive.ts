import { buildLongitudinalPrompt } from '../src/services/geminiService';
import { PREDEFINED_STATEMENTS } from '../src/services/nutritionStatementLibrary';

async function testLiveGemini() {
  console.log('Testing Live Gemini with Nutrition Adherence Prompt...\n');

  // Case: User undereate (PARTIAL_ADHERENCE, calorie adherence 85.9%) and gained only 0.1kg
  const prompt = `You are FitBee's Clinical Sports Nutrition AI Engine.
You perform longitudinal evaluation of a user's weight changes against their nutrition targets and actual nutrition adherence history.

USER CLINICAL & PHYSIOLOGICAL PROFILE:
- Sex: male
- Age: 26
- Height: 175 cm
- Current Weight: 54.4 kg
- Target Weight: 60 kg
- Primary Fitness Goal: gain_muscle
- Activity Level: light
- Basal Metabolic Rate (BMR, Mifflin-St Jeor): ~1516 kcal
- Estimated Total Daily Energy Expenditure (TDEE): ~2085 kcal

ACTIVE NUTRITION TARGETS CURRENTLY IN EFFECT:
- Calories: 2270 kcal
- Protein: 140 g
- Carbohydrates: 250 g
- Fat: 60 g
- Source: gemini_recommendation

LONGITUDINAL WEIGHT CHECK HISTORY (Newest to Oldest):
1. 2026-08-25: 54.4 kg (delta from previous: +0.10 kg, target at time: 2270 kcal, P: 140g, C: 250g, F: 60g)
2. 2026-08-11: 54.3 kg (baseline weight check, target at time: 2270 kcal, P: 140g, C: 250g, F: 60g)

WEEKLY NUTRITION ADHERENCE HISTORY (Chronological, Oldest to Newest):
- Week 2026-08-11 to 2026-08-17: 7/7 days logged | Target: 2270 kcal, 140g P, 250g C, 60g F | Actual Avg: 1950 kcal (85.9%), 115g P (82.1%), 215g C (86.0%), 48g F (80.0%) | Status: PARTIAL_ADHERENCE
- Week 2026-08-18 to 2026-08-24: 7/7 days logged | Target: 2270 kcal, 140g P, 250g C, 60g F | Actual Avg: 1950 kcal (85.9%), 115g P (82.1%), 215g C (86.0%), 48g F (80.0%) | Status: PARTIAL_ADHERENCE

PHYSIOLOGICAL RULES REGARDING ADHERENCE:
1. Target followed + Progress on track -> Maintain current target.
2. Target followed + Progress too fast/slow -> Recalibrate calories.
3. Target NOT followed / partial adherence -> DO NOT recalibrate target solely based on weight change! If user ate 1950 kcal instead of 2270 kcal target and gained only 0.1 kg, the lack of weight gain is explained by eating at roughly maintenance (1950 kcal vs TDEE ~2085 kcal), NOT by an inadequate target. You must KEEP the current target (2270 kcal) and instruct adherence.
4. Insufficient logging data (<4 days/wk) -> Keep current target.

OUTPUT FORMAT REQUIREMENTS:
Output ONLY a raw JSON object with:
{
  "recommended_calories": number,
  "recommended_protein": number,
  "recommended_carbs": number,
  "recommended_fat": number,
  "statement_ids": string[],
  "reasoning": string
}
Available statement IDs include: "insufficient_adherence", "keep_target_collect_data", "insufficient_logging_data", "calories_on_track", "high_adherence_on_track", "progress_faster", "calories_slight_trim".`;

  const res = await fetch('https://fitbee.veyro.workers.dev/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      responseMimeType: 'application/json',
    }),
  });

  const json = await res.json();
  console.log('Gemini HTTP Status:', res.status);
  console.log('Gemini Response Text:\n', json.text);

  const parsed = JSON.parse(json.text);
  console.log('\nParsed Recommendations:');
  console.log('- Recommended Calories:', parsed.recommended_calories);
  console.log('- Statement IDs:', parsed.statement_ids);
  console.log('- Reasoning:', parsed.reasoning);

  if (parsed.recommended_calories === 2270) {
    console.log('\n✓ PERFECT: Gemini correctly maintained 2270 kcal target instead of increasing it!');
  } else {
    console.log(`\nNote: Gemini returned ${parsed.recommended_calories} kcal.`);
  }

  if (parsed.statement_ids.includes('insufficient_adherence') || parsed.statement_ids.includes('keep_target_collect_data')) {
    console.log('✓ PERFECT: Gemini selected adherence statement ID from the library!');
  }
}

testLiveGemini().catch(console.error);
