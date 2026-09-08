/**
 * FitBee Weekly Nutrition Adherence & Longitudinal Progress Test Suite
 *
 * Tests:
 * 1. Followed plan + progress on track (Maintain target)
 * 2. Followed plan + progress too fast (Calorie reduction / trim)
 * 3. Did not follow plan + minimal weight change (Guardrail: Keep current target, do NOT increase)
 * 4. Insufficient logging data (Guardrail: Keep current target)
 * 5. Target changed between weeks (Historical target preservation)
 * 6. Actual intake above target (Uncapped ratio, e.g. 114.5%)
 */

import {
  calculateWeeklyAdherenceSummaries,
} from '../src/services/nutritionHistoryService';
import {
  fallbackLongitudinalRecommendation,
} from '../src/services/geminiService';
import { NutritionLog, Profile } from '../src/types/database.types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✓ PASSED: ${message}`);
  }
}

async function runTests() {
  console.log('================================================================');
  console.log('  FITBEE WEEKLY NUTRITION ADHERENCE COMPREHENSIVE TEST SUITE    ');
  console.log('================================================================\n');

  const baseProfile: Profile = {
    id: 'test-user-adherence-001',
    user_id: 'test-user-adherence-001',
    age: 26,
    gender: 'male',
    sex: 'male',
    height_cm: 175,
    weight_kg: 54.8,
    target_weight_kg: 60.0,
    goal: 'gain_muscle',
    activity_level: 'light',
    target_calories: 2270,
    target_protein: 140,
    target_carbs: 250,
    target_fat: 60,
    onboarding_completed: true,
  } as any;

  // ─────────────────────────────────────────────────────────────
  // TEST 1: Followed plan + on track
  // Target: 2270 kcal, Actual avg: 2250 kcal (HIGH_ADHERENCE, 7/7 days)
  // Weight: +0.5 kg over 2 weeks (+0.25 kg/wk)
  // ─────────────────────────────────────────────────────────────
  console.log('--- TEST 1: Followed plan + on track ---');
  const mockWeek1Logs: Record<string, NutritionLog> = {};
  for (let d = 1; d <= 7; d++) {
    const dayStr = `2026-08-${String(d + 10).padStart(2, '0')}`;
    mockWeek1Logs[dayStr] = {
      id: `log-${d}`,
      user_id: baseProfile.id,
      date: dayStr,
      total_calories: 2250,
      total_protein: 138,
      total_carbs: 248,
      total_fat: 60,
    } as any;
  }
  for (let d = 8; d <= 14; d++) {
    const dayStr = `2026-08-${String(d + 10).padStart(2, '0')}`;
    mockWeek1Logs[dayStr] = {
      id: `log-${d}`,
      user_id: baseProfile.id,
      date: dayStr,
      total_calories: 2260,
      total_protein: 140,
      total_carbs: 250,
      total_fat: 60,
    } as any;
  }

  const summaries1 = await calculateWeeklyAdherenceSummaries(
    baseProfile.id,
    '2026-08-11',
    '2026-08-24',
    baseProfile,
    mockWeek1Logs
  );

  assert(summaries1.length === 2, 'Should divide 14-day interval into 2 weekly summaries');
  assert(summaries1[0].daysLogged === 7, 'Week 1 should have 7/7 days logged');
  assert(summaries1[0].classification === 'HIGH_ADHERENCE', 'Week 1 should be HIGH_ADHERENCE');
  assert(summaries1[1].classification === 'HIGH_ADHERENCE', 'Week 2 should be HIGH_ADHERENCE');

  const rec1 = fallbackLongitudinalRecommendation({
    profile: {
      sex: 'male',
      age: 26,
      height: 175,
      current_weight: 54.8,
      target_weight: 60.0,
      goal: 'gain_muscle',
      activity_level: 'light',
    },
    active_target: {
      calories: 2270,
      protein_g: 140,
      carbs_g: 250,
      fat_g: 60,
      source: 'gemini_recommendation',
    },
    recent_updates: [
      {
        date: '2026-08-11',
        weight: 54.3,
        target_calories_at_time: 2270,
        target_protein_at_time: 140,
        target_carbs_at_time: 250,
        target_fat_at_time: 60,
      },
      {
        date: '2026-08-25',
        weight: 54.8,
        previous_weight: 54.3,
        target_calories_at_time: 2270,
        target_protein_at_time: 140,
        target_carbs_at_time: 250,
        target_fat_at_time: 60,
      },
    ],
    adherence_history: summaries1,
  });

  assert(rec1.recommended_calories === 2270, `Expected calories to be maintained at 2270, got ${rec1.recommended_calories}`);
  assert(
    rec1.statement_ids.includes('calories_on_track') || rec1.statement_ids.includes('high_adherence_on_track'),
    'Should include on-track / high-adherence statement'
  );

  // ─────────────────────────────────────────────────────────────
  // TEST 2: Followed plan + progress too fast
  // Target: 2270 kcal, Actual: 2270 kcal
  // Weight: 54.3 -> 56.0 kg (+1.7 kg over 2 weeks)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 2: Followed plan + progress too fast ---');
  const rec2 = fallbackLongitudinalRecommendation({
    profile: {
      sex: 'male',
      age: 26,
      height: 175,
      current_weight: 56.0,
      target_weight: 60.0,
      goal: 'gain_muscle',
      activity_level: 'light',
    },
    active_target: {
      calories: 2270,
      protein_g: 140,
      carbs_g: 250,
      fat_g: 60,
      source: 'gemini_recommendation',
    },
    recent_updates: [
      {
        date: '2026-08-11',
        weight: 54.3,
        target_calories_at_time: 2270,
        target_protein_at_time: 140,
        target_carbs_at_time: 250,
        target_fat_at_time: 60,
      },
      {
        date: '2026-08-25',
        weight: 56.0,
        previous_weight: 54.3,
        target_calories_at_time: 2270,
        target_protein_at_time: 140,
        target_carbs_at_time: 250,
        target_fat_at_time: 60,
      },
    ],
    adherence_history: summaries1,
  });

  assert(rec2.recommended_calories < 2270, `Expected calorie reduction for rapid gain, got ${rec2.recommended_calories}`);
  assert(rec2.statement_ids.includes('progress_faster'), 'Should detect progress_faster');
  assert(rec2.statement_ids.includes('calories_slight_trim'), 'Should recommend calories_slight_trim');

  // ─────────────────────────────────────────────────────────────
  // TEST 3: Did not follow plan + minimal weight change
  // Target: 2270 kcal, Actual: 1950 kcal (~85.9%, PARTIAL)
  // Weight: 54.3 -> 54.4 kg (+0.1 kg)
  // CRITICAL REQUIREMENT: Must NOT increase target to 2500! Keep 2270!
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 3: Did not follow plan + minimal weight change (CRITICAL) ---');
  const mockWeek3Logs: Record<string, NutritionLog> = {};
  for (let d = 1; d <= 14; d++) {
    const dayStr = `2026-08-${String(d + 10).padStart(2, '0')}`;
    mockWeek3Logs[dayStr] = {
      id: `log-${d}`,
      user_id: baseProfile.id,
      date: dayStr,
      total_calories: 1950,
      total_protein: 115,
      total_carbs: 215,
      total_fat: 48,
    } as any;
  }

  const summaries3 = await calculateWeeklyAdherenceSummaries(
    baseProfile.id,
    '2026-08-11',
    '2026-08-24',
    baseProfile,
    mockWeek3Logs
  );

  assert(summaries3[0].classification === 'PARTIAL_ADHERENCE', 'Week 1 should be PARTIAL_ADHERENCE');
  assert(summaries3[0].calorieAdherenceRatio < 0.90, 'Calorie ratio should be ~0.859');

  const rec3 = fallbackLongitudinalRecommendation({
    profile: {
      sex: 'male',
      age: 26,
      height: 175,
      current_weight: 54.4,
      target_weight: 60.0,
      goal: 'gain_muscle',
      activity_level: 'light',
    },
    active_target: {
      calories: 2270,
      protein_g: 140,
      carbs_g: 250,
      fat_g: 60,
      source: 'gemini_recommendation',
    },
    recent_updates: [
      {
        date: '2026-08-11',
        weight: 54.3,
        target_calories_at_time: 2270,
        target_protein_at_time: 140,
        target_carbs_at_time: 250,
        target_fat_at_time: 60,
      },
      {
        date: '2026-08-25',
        weight: 54.4,
        previous_weight: 54.3,
        target_calories_at_time: 2270,
        target_protein_at_time: 140,
        target_carbs_at_time: 250,
        target_fat_at_time: 60,
      },
    ],
    adherence_history: summaries3,
  });

  assert(
    rec3.recommended_calories === 2270,
    `CRITICAL: Target must NOT be increased when user undereate! Expected 2270, got ${rec3.recommended_calories}`
  );
  assert(
    rec3.statement_ids.includes('insufficient_adherence'),
    'Should include statement insufficient_adherence'
  );
  assert(
    rec3.statement_ids.includes('keep_target_collect_data'),
    'Should include statement keep_target_collect_data'
  );

  // ─────────────────────────────────────────────────────────────
  // TEST 4: Insufficient logging data (2/14 days logged)
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 4: Insufficient logging data (2/14 days) ---');
  const mockWeek4Logs: Record<string, NutritionLog> = {
    '2026-08-12': { total_calories: 2200, total_protein: 135, total_carbs: 240, total_fat: 58 } as any,
    '2026-08-19': { total_calories: 2150, total_protein: 130, total_carbs: 235, total_fat: 55 } as any,
  };

  const summaries4 = await calculateWeeklyAdherenceSummaries(
    baseProfile.id,
    '2026-08-11',
    '2026-08-24',
    baseProfile,
    mockWeek4Logs
  );

  assert(summaries4[0].classification === 'INSUFFICIENT_DATA', 'Week 1 should be INSUFFICIENT_DATA');
  assert(summaries4[1].classification === 'INSUFFICIENT_DATA', 'Week 2 should be INSUFFICIENT_DATA');

  const rec4 = fallbackLongitudinalRecommendation({
    profile: {
      sex: 'male',
      age: 26,
      height: 175,
      current_weight: 54.5,
      target_weight: 60.0,
      goal: 'gain_muscle',
      activity_level: 'light',
    },
    active_target: {
      calories: 2270,
      protein_g: 140,
      carbs_g: 250,
      fat_g: 60,
      source: 'gemini_recommendation',
    },
    recent_updates: [
      {
        date: '2026-08-11',
        weight: 54.3,
        target_calories_at_time: 2270,
        target_protein_at_time: 140,
        target_carbs_at_time: 250,
        target_fat_at_time: 60,
      },
      {
        date: '2026-08-25',
        weight: 54.5,
        previous_weight: 54.3,
        target_calories_at_time: 2270,
        target_protein_at_time: 140,
        target_carbs_at_time: 250,
        target_fat_at_time: 60,
      },
    ],
    adherence_history: summaries4,
  });

  assert(rec4.recommended_calories === 2270, `Target must be preserved on missing data! Expected 2270, got ${rec4.recommended_calories}`);
  assert(
    rec4.statement_ids.includes('insufficient_logging_data') || rec4.statement_ids.includes('insufficient_adherence'),
    'Should include insufficient data/adherence statement'
  );

  // ─────────────────────────────────────────────────────────────
  // TEST 5: Target changed between weeks
  // Week 1 Target: 2270 kcal, Actual: 2260 kcal
  // Week 2 Target: 2400 kcal, Actual: 2390 kcal
  // Verify Week 1 does NOT retroactively evaluate against 2400!
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 5: Target changed between weeks ---');
  const mockWeek5Logs: Record<string, NutritionLog> = {};
  for (let d = 1; d <= 7; d++) {
    mockWeek5Logs[`2026-08-${String(d + 10).padStart(2, '0')}`] = {
      total_calories: 2260,
      total_protein: 140,
      total_carbs: 250,
      total_fat: 60,
    } as any;
  }
  for (let d = 8; d <= 14; d++) {
    mockWeek5Logs[`2026-08-${String(d + 10).padStart(2, '0')}`] = {
      total_calories: 2390,
      total_protein: 150,
      total_carbs: 270,
      total_fat: 65,
    } as any;
  }

  const versions = [
    {
      id: 'v1',
      user_id: baseProfile.id,
      effective_from: '2026-08-01T00:00:00Z',
      effective_to: '2026-08-17T23:59:59Z',
      calories: 2270,
      protein: 140,
      carbs: 250,
      fat: 60,
      source: 'onboarding',
      created_at: '2026-08-01T00:00:00Z',
    },
    {
      id: 'v2',
      user_id: baseProfile.id,
      effective_from: '2026-08-18T00:00:00Z',
      effective_to: null,
      calories: 2400,
      protein: 150,
      carbs: 270,
      fat: 65,
      source: 'gemini_recommendation',
      created_at: '2026-08-18T00:00:00Z',
    },
  ];

  (global as any).localStorage = {
    getItem: (key: string) => {
      if (key.includes('fitbee_target_versions_')) {
        return JSON.stringify(versions);
      }
      return null;
    },
    setItem: () => {},
  };
  (global as any).window = global;

  const summaries5 = await calculateWeeklyAdherenceSummaries(
    baseProfile.id,
    '2026-08-11',
    '2026-08-24',
    baseProfile,
    mockWeek5Logs
  );

  assert(summaries5[0].targetCalories === 2270, `Week 1 target should be 2270, got ${summaries5[0].targetCalories}`);
  assert(summaries5[1].targetCalories === 2400, `Week 2 target should be 2400, got ${summaries5[1].targetCalories}`);
  assert(summaries5[0].classification === 'HIGH_ADHERENCE', 'Week 1 should be HIGH_ADHERENCE against 2270');
  assert(summaries5[1].classification === 'HIGH_ADHERENCE', 'Week 2 should be HIGH_ADHERENCE against 2400');

  // ─────────────────────────────────────────────────────────────
  // TEST 6: Actual intake above target (uncapped)
  // Target: 2270, Actual: 2600 -> Ratio ≈ 114.5%
  // ─────────────────────────────────────────────────────────────
  console.log('\n--- TEST 6: Actual intake above target (uncapped ratio) ---');
  const mockWeek6Logs: Record<string, NutritionLog> = {};
  for (let d = 1; d <= 7; d++) {
    mockWeek6Logs[`2026-08-${String(d + 10).padStart(2, '0')}`] = {
      total_calories: 2600,
      total_protein: 160,
      total_carbs: 300,
      total_fat: 75,
    } as any;
  }

  const summaries6 = await calculateWeeklyAdherenceSummaries(
    baseProfile.id,
    '2026-08-11',
    '2026-08-17',
    baseProfile,
    mockWeek6Logs
  );

  assert(summaries6[0].calorieAdherenceRatio > 1.0, 'Ratio should exceed 1.0 when eating above target');
  assert(summaries6[0].calorieAdherenceRatio === 1.145, `Expected ratio 1.145, got ${summaries6[0].calorieAdherenceRatio}`);
  assert(summaries6[0].adherencePercentStr === '114.5%', `Expected '114.5%', got ${summaries6[0].adherencePercentStr}`);

  console.log('\n================================================================');
  console.log('  ALL 6 LOGICAL ADHERENCE SCENARIOS PASSED WITH FLYING COLORS! 🐝 ');
  console.log('================================================================\n');
}

runTests().catch((err) => {
  console.error('Test suite execution failed:', err);
  process.exit(1);
});
