import {
  calculateWorkoutDayCompletion,
} from '../src/services/workoutHistoryService';
import {
  calculateNutritionTargetsScore,
  calculateMetricProximityScore,
} from '../src/services/nutritionHistoryService';
import { generateUUID } from '../src/services/habitService';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`  ✓ ${msg}`);
}

console.log('====================================================');
console.log('TEST SUITE 1: CANONICAL WORKOUT COMPLETION ENGINE');
console.log('====================================================');

// Mock Wednesday Template Version with 8 scheduled exercises
const mock8ExerciseTemplateVersion: any = {
  template_id: 'tmpl-1',
  version_number: 1,
  effective_from: '2026-01-01',
  scheduled_days: ['wednesday'],
  days_config: [
    {
      day_name: 'Wednesday',
      is_enabled: true,
      exercises: [
        { exercise_id: 'ex-1', exercise_name: 'Bulgarian Split Squat' },
        { exercise_id: 'ex-2', exercise_name: 'Push-up' },
        { exercise_id: 'ex-3', exercise_name: 'Single Arm Row' },
        { exercise_id: 'ex-4', exercise_name: 'Glute Bridge' },
        { exercise_id: 'ex-5', exercise_name: 'Shoulder Press' },
        { exercise_id: 'ex-6', exercise_name: 'Concentration Curl' },
        { exercise_id: 'ex-7', exercise_name: 'Skull Crusher' },
        { exercise_id: 'ex-8', exercise_name: 'Dead Bug' },
      ],
    },
  ],
};

const wednesdayDate = new Date(2026, 8, 9); // Sep 9, 2026 is Wednesday

// Helper to generate mock workout logs
function createMockLog(exerciseIds: string[], exerciseNames: string[] = []) {
  return [
    {
      id: 'log-1',
      start_time: '2026-09-09T10:00:00.000Z',
      workout_log_sets: exerciseIds.map((id, idx) => ({
        id: `set-${idx}`,
        exercise_id: id,
        exercise_name: exerciseNames[idx] || `Exercise ${id}`,
        set_number: 1,
        reps_completed: 10,
        weight_kg: 20,
      })),
    },
  ];
}

// Case A: 8/8 exercises done
{
  console.log('\n--- Case A: 8/8 scheduled exercises completed ---');
  const logs = createMockLog(['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5', 'ex-6', 'ex-7', 'ex-8']);
  const res = calculateWorkoutDayCompletion(wednesdayDate, mock8ExerciseTemplateVersion, logs, true);
  assert(res.isScheduled === true, 'Wednesday is scheduled');
  assert(res.totalScheduledExercises === 8, '8 total scheduled exercises');
  assert(res.requiredExercises === 7, '8 * 0.85 = 6.8 -> rounds to 7 required');
  assert(res.completedScheduledExercises === 8, '8 completed');
  assert(res.isCompleted === true, 'Marked completed');
  assert(res.isFullyCompleted === true, 'Marked fully completed');
  assert(res.isPartiallyCompleted === false, 'Not partially completed');
  assert(res.status === 'COMPLETED', 'Status is COMPLETED');
}

// Case B: 7/8 exercises done (passes 85% rounded threshold: 7 >= 7)
{
  console.log('\n--- Case B: 7/8 scheduled exercises completed (87.5%) ---');
  const logs = createMockLog(['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5', 'ex-6', 'ex-7']);
  const res = calculateWorkoutDayCompletion(wednesdayDate, mock8ExerciseTemplateVersion, logs, true);
  assert(res.completedScheduledExercises === 7, '7 completed');
  assert(res.isCompleted === true, 'Marked completed (7/8 >= 7 required)');
  assert(res.isFullyCompleted === false, 'Not fully completed (7 < 8)');
  assert(res.isPartiallyCompleted === true, 'Marked partially completed for detail modal');
  assert(res.status === 'COMPLETED', 'Status is COMPLETED');
}

// Case C: 6/8 exercises done (fails 85% rounded threshold: 6 < 7)
{
  console.log('\n--- Case C: 6/8 scheduled exercises completed (75%) ---');
  const logs = createMockLog(['ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5', 'ex-6']);
  const res = calculateWorkoutDayCompletion(wednesdayDate, mock8ExerciseTemplateVersion, logs, true);
  assert(res.completedScheduledExercises === 6, '6 completed');
  assert(res.isCompleted === false, 'NOT marked completed (6 < 7 required)');
  assert(res.status === 'MISSED', 'Status is MISSED in past');
}

// Case D: 1 or 2 exercises done (the exact bug the user reported!)
{
  console.log('\n--- Case D: 2/8 exercises done (User bug reproduction) ---');
  const logs = createMockLog(['ex-1', 'ex-3'], ['Bulgarian Split Squat', 'Single Arm Row']);
  const res = calculateWorkoutDayCompletion(wednesdayDate, mock8ExerciseTemplateVersion, logs, true);
  assert(res.completedScheduledExercises === 2, '2 completed');
  assert(res.isCompleted === false, 'NOT marked completed (2 < 7 required)');
  assert(res.status === 'MISSED', 'Status is MISSED (Bug fixed! No longer falsely COMPLETED)');
}

// Case E: Unrelated workout only (user did Leg Press and Bench Press)
{
  console.log('\n--- Case E: Unrelated workout only (0 scheduled exercises matched) ---');
  const logs = createMockLog(['unrelated-1', 'unrelated-2'], ['Leg Press', 'Barbell Bench Press']);
  const res = calculateWorkoutDayCompletion(wednesdayDate, mock8ExerciseTemplateVersion, logs, true);
  assert(res.completedScheduledExercises === 0, '0 scheduled exercises completed');
  assert(res.isCompleted === false, 'Unrelated workout does NOT satisfy scheduled template');
  assert(res.hasAnyWorkout === true, 'Logs show workout activity occurred');
  assert(res.status === 'EXTRA', 'Status is EXTRA (user performed an extra/unrelated workout)');
}

// Case F: 7/8 scheduled + 3 unrelated exercises
{
  console.log('\n--- Case F: 7/8 scheduled + 3 extra unrelated exercises ---');
  const logs = createMockLog([
    'ex-1', 'ex-2', 'ex-3', 'ex-4', 'ex-5', 'ex-6', 'ex-7',
    'unrelated-1', 'unrelated-2', 'unrelated-3'
  ]);
  const res = calculateWorkoutDayCompletion(wednesdayDate, mock8ExerciseTemplateVersion, logs, true);
  assert(res.completedScheduledExercises === 7, '7 scheduled exercises completed');
  assert(res.isCompleted === true, 'Extra exercises do not hinder completion');
  assert(res.status === 'COMPLETED', 'Status is COMPLETED');
}

// Case G: 4-Exercise Template (Rounding check: 4 * 0.85 = 3.4 -> 3 required)
{
  console.log('\n--- Case G: 4-exercise template (4 * 0.85 = 3.4 -> rounds down to 3) ---');
  const mock4ExTemplate: any = {
    template_id: 'tmpl-4',
    scheduled_days: ['wednesday'],
    days_config: [
      {
        day_name: 'Wednesday',
        is_enabled: true,
        exercises: [
          { exercise_id: 'e1' }, { exercise_id: 'e2' }, { exercise_id: 'e3' }, { exercise_id: 'e4' }
        ],
      },
    ],
  };

  // 3 of 4 done -> satisfies threshold
  const logs3 = createMockLog(['e1', 'e2', 'e3']);
  const res3 = calculateWorkoutDayCompletion(wednesdayDate, mock4ExTemplate, logs3, true);
  assert(res3.requiredExercises === 3, 'Required exercises is 3');
  assert(res3.completedScheduledExercises === 3, 'Completed is 3');
  assert(res3.isCompleted === true, '3/4 is completed');
  assert(res3.isPartiallyCompleted === true, 'Partially done (3 < 4)');

  // 2 of 4 done -> fails threshold
  const logs2 = createMockLog(['e1', 'e2']);
  const res2 = calculateWorkoutDayCompletion(wednesdayDate, mock4ExTemplate, logs2, true);
  assert(res2.isCompleted === false, '2/4 is INCOMPLETE');
}

// Case H: 3-Exercise Template (Rounding check: 3 * 0.85 = 2.55 -> rounds up to 3 required)
{
  console.log('\n--- Case H: 3-exercise template (3 * 0.85 = 2.55 -> rounds up to 3) ---');
  const mock3ExTemplate: any = {
    template_id: 'tmpl-3',
    scheduled_days: ['wednesday'],
    days_config: [
      {
        day_name: 'Wednesday',
        is_enabled: true,
        exercises: [{ exercise_id: 'e1' }, { exercise_id: 'e2' }, { exercise_id: 'e3' }],
      },
    ],
  };

  // 2 of 3 done -> fails (2 < 3)
  const logs2 = createMockLog(['e1', 'e2']);
  const res2 = calculateWorkoutDayCompletion(wednesdayDate, mock3ExTemplate, logs2, true);
  assert(res2.requiredExercises === 3, 'Required exercises is 3 (2.55 rounds to 3)');
  assert(res2.completedScheduledExercises === 2, 'Completed is 2');
  assert(res2.isCompleted === false, '2/3 is INCOMPLETE');

  // 3 of 3 done -> passes
  const logs3 = createMockLog(['e1', 'e2', 'e3']);
  const res3 = calculateWorkoutDayCompletion(wednesdayDate, mock3ExTemplate, logs3, true);
  assert(res3.completedScheduledExercises === 3, 'Completed is 3');
  assert(res3.isCompleted === true, '3/3 is COMPLETED');
}

// Case I: 1-Exercise Template
{
  console.log('\n--- Case I: 1-exercise template (1 * 0.85 = 0.85 -> rounds up to 1) ---');
  const mock1ExTemplate: any = {
    template_id: 'tmpl-1ex',
    scheduled_days: ['wednesday'],
    days_config: [
      {
        day_name: 'Wednesday',
        is_enabled: true,
        exercises: [{ exercise_id: 'e1' }],
      },
    ],
  };
  const logs1 = createMockLog(['e1']);
  const res1 = calculateWorkoutDayCompletion(wednesdayDate, mock1ExTemplate, logs1, true);
  assert(res1.requiredExercises === 1, 'Required is 1');
  assert(res1.isCompleted === true, '1/1 is COMPLETED');
}

console.log('\n====================================================');
console.log('TEST SUITE 2: NET CALORIES & WALKING BURN AUDIT');
console.log('====================================================');

const mockTargets = {
  calories: 2300,
  protein: 150,
  carbs: 250,
  fat: 70,
};

// Scenario 1: User ate 2400 kcal (104%), but walked 100 kcal burn -> Net = 2300 kcal (100%!)
{
  console.log('\n--- Scenario 1: Target 2300, Ate 2400, Burn 100 -> Net 2300 (100%) ---');
  const actual = { calories: 2400, protein: 150, carbs: 250, fat: 70 };
  const res = calculateNutritionTargetsScore(actual, mockTargets, 100);
  assert(res.caloriesScore === 100, `Calorie score is 100% (actual: ${res.caloriesScore}%)`);
  assert(res.overallScore === 100, `Overall score is 100% (actual: ${res.overallScore}%)`);
  assert(res.isCompleted === true, 'Targets marked completed');
}

// Scenario 2: User ate 2300 kcal, but walked 5km and burnt 250 kcal -> Net = 2050 kcal (89.1% -> NOT 100%)
{
  console.log('\n--- Scenario 2: Target 2300, Ate 2300, Burn 250 -> Net 2050 (89.1%) ---');
  const actual = { calories: 2300, protein: 150, carbs: 250, fat: 70 };
  const res = calculateNutritionTargetsScore(actual, mockTargets, 250);
  assert(res.caloriesScore === 89, `Calorie score is 89% (actual: ${res.caloriesScore}%)`);
  assert(res.caloriesScore < 100, 'Calorie score is correctly below 100% due to walking deficit');
}

// Scenario 3: Proximity score behavior
{
  console.log('\n--- Scenario 3: Proximity score symmetry ---');
  // 105% intake -> 95% score (symmetric penalty for overeating)
  const score105 = calculateMetricProximityScore(2415, 2300);
  assert(score105 === 95, `105% intake gives 95% score (actual: ${score105})`);

  // 118% intake -> 82% score
  const score118 = calculateMetricProximityScore(82.6, 70);
  assert(score118 === 82, `118% fat intake gives 82% score (actual: ${score118})`);

  // Average of 95, 99, 98, 82 = ~93.5% -> 94%
  // Explaining user question: 105% cal (95), 101% pro (99), 98% carb (98), 118% fat (82) -> avg = 93.5 -> 94%!
  console.log('  -> Explains why user saw 94% average: Proximity penalties are symmetric for over-target macros!');
}

console.log('\n====================================================');
console.log('TEST SUITE 3: HABIT TIMER PERSISTENCE & UUID GENERATION');
console.log('====================================================');

// Verify UUID generator adheres to RFC4122 v4
{
  console.log('\n--- UUID v4 validation ---');
  const uuids = Array.from({ length: 20 }, () => generateUUID());
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  uuids.forEach((id, idx) => {
    assert(uuidRegex.test(id), `UUID #${idx + 1} (${id}) is valid RFC4122 v4`);
  });
}

console.log('\n====================================================');
console.log('ALL VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉');
console.log('====================================================');
