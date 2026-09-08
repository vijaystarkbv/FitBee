/**
 * Comprehensive Automated Verification Suite for FitBee Push Notification System (Part 3)
 *
 * Tests:
 * 1. Category combination logic (all 8 states: NONE, HABIT, FOOD, WORKOUT, HABIT_FOOD, HABIT_WORKOUT, FOOD_WORKOUT, HABIT_FOOD_WORKOUT)
 * 2. Intensity scaling (CALM, NUDGE, CHAOS)
 * 3. Local timezone & evaluation window calculation
 * 4. RFC 8291 Web Push payload encryption & VAPID authentication
 * 5. Supabase check_and_record_notification RPC (5/day hard limit & slot idempotency)
 * 6. COMPLETE 140 NOTIFICATION MESSAGES LIBRARY VERIFICATION:
 *    - Exactly 140 messages in total
 *    - Exactly 7 states
 *    - Exactly 20 messages per state (5 Calm, 8 Nudge, 7 Chaos)
 *    - Unique IDs across all 140 messages
 *    - Non-gendered content enforcement
 *    - Message rotation and anti-repeat selection
 */

import { buildPushPayload, PushMessage, PushSubscription, VapidKeys } from '@block65/webcrypto-web-push';
import { createClient } from '@supabase/supabase-js';
import {
  NOTIFICATION_MESSAGES,
  NotificationState,
  NotificationIntensity,
  selectNotificationMessage,
} from '../src/services/notificationMessages';
import {
  getIntensityForSlot,
  getUserLocalTimeInfo,
  resolveCombinedNotificationState,
  EvaluationSlot,
} from '../src/services/notificationEngine';

const SUPABASE_URL = 'https://rbbaqzpfimffcgixyukr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_L9KrnrVHAkBfHOPospS55A_cQOTr8II';

const VAPID_PUBLIC_KEY =
  'BHT2BsY6ChvtsuFkXLxRIlQFacUv7643c583OUdZRAUBFwfOTXCxggu9txysmILuYNkWr4Z4wIG4mUpmLs-YvLY';
const VAPID_PRIVATE_KEY =
  'h9E7GuVdXpdjl9Etfpvi1EgZpBSFL0Xe7-KYQUkbc90';
const VAPID_SUBJECT = 'mailto:support@fitbee.com';

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  }
}

// ─────────────────────────────────────────────────────────────
// 1. Mandatory Category Combination Logic
// ─────────────────────────────────────────────────────────────
console.log('\n--- 1. Testing Category Combination Logic ---');
assert(resolveCombinedNotificationState(false, false, false) === 'NONE', 'All false yields NONE');
assert(resolveCombinedNotificationState(true, false, false) === 'HABIT', 'Habit only yields HABIT');
assert(resolveCombinedNotificationState(false, true, false) === 'FOOD', 'Food only yields FOOD');
assert(resolveCombinedNotificationState(false, false, true) === 'WORKOUT', 'Workout only yields WORKOUT');
assert(resolveCombinedNotificationState(true, true, false) === 'HABIT_FOOD', 'Habit + Food yields HABIT_FOOD');
assert(resolveCombinedNotificationState(true, false, true) === 'HABIT_WORKOUT', 'Habit + Workout yields HABIT_WORKOUT');
assert(resolveCombinedNotificationState(false, true, true) === 'FOOD_WORKOUT', 'Food + Workout yields FOOD_WORKOUT');
assert(resolveCombinedNotificationState(true, true, true) === 'HABIT_FOOD_WORKOUT', 'All pending yields HABIT_FOOD_WORKOUT');

// ─────────────────────────────────────────────────────────────
// 2. Intensity Scaling
// ─────────────────────────────────────────────────────────────
console.log('\n--- 2. Testing Intensity Scaling ---');
assert(getIntensityForSlot('08:00', 8) === 'CALM', '08:00 is CALM');
assert(getIntensityForSlot('12:00', 12) === 'CALM', '12:00 is CALM');
assert(getIntensityForSlot('15:00', 15) === 'NUDGE', '15:00 is NUDGE');
assert(getIntensityForSlot('19:00', 19) === 'NUDGE', '19:00 is NUDGE');
assert(getIntensityForSlot('22:00', 22) === 'CHAOS', '22:00 is CHAOS');
assert(getIntensityForSlot('23:00', 23) === 'CHAOS', 'Late night 23:00 is CHAOS');

// ─────────────────────────────────────────────────────────────
// 3. Local Timezone Resolution
// ─────────────────────────────────────────────────────────────
console.log('\n--- 3. Testing Local Timezone Resolution ---');
const utcTime = getUserLocalTimeInfo('UTC', new Date('2026-09-08T12:00:00Z'));
assert(utcTime.localDate === '2026-09-08', 'UTC date formatted correctly');
assert(utcTime.hour === 12, 'UTC hour is 12');

const nyTime = getUserLocalTimeInfo('America/New_York', new Date('2026-09-08T12:00:00Z'));
assert(nyTime.hour === 8, 'New York is EDT (UTC-4) -> 08:00');

const tokyoTime = getUserLocalTimeInfo('Asia/Tokyo', new Date('2026-09-08T12:00:00Z'));
assert(tokyoTime.hour === 21, 'Tokyo is JST (UTC+9) -> 21:00');

// ─────────────────────────────────────────────────────────────
// 4. Web Push Payload Generation & RFC 8291 Encryption
// ─────────────────────────────────────────────────────────────
console.log('\n--- 4. Testing Web Push Payload RFC 8291 Encryption ---');
async function testWebPushEncryption() {
  const dummySubscription: PushSubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/fake-subscription-token-for-testing',
    expirationTime: null,
    keys: {
      auth: 'S8AWsktD-JTmrpdjUZeOmw',
      p256dh: 'BARE-ffF2xZ-JK8Va6cUpOdw79jPzn-CAWBpOkkNJO-dH7LUrvusvrYGoaDXyu5h9rUzkoAtDyGbrkJxTWGETmg',
    },
  };

  const message: PushMessage = {
    data: JSON.stringify({
      title: 'FitBee Check-in 🐝',
      body: 'Testing RFC 8291 encryption and VAPID signatures.',
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      data: { url: '/?tab=habits' },
    }),
    options: {
      ttl: 3600,
      urgency: 'high',
    },
  };

  const vapid: VapidKeys = {
    subject: VAPID_SUBJECT,
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
  };

  const pushPayload = await buildPushPayload(message, dummySubscription, vapid);

  assert(pushPayload !== null && typeof pushPayload === 'object', 'buildPushPayload returns object');
  assert(pushPayload.method.toUpperCase() === 'POST', 'HTTP method is POST');
  assert(typeof pushPayload.headers.authorization === 'string', 'Authorization header is present');
  assert(pushPayload.headers.authorization.startsWith('vapid t='), 'Authorization is VAPID scheme');
  assert(pushPayload.headers['content-encoding'] === 'aes128gcm', 'Encoding is aes128gcm');
  assert(pushPayload.body instanceof Uint8Array, 'Body is encrypted Uint8Array');
  assert(pushPayload.body.length > 0, 'Body has encrypted payload bytes');
}

// ─────────────────────────────────────────────────────────────
// 5. Supabase check_and_record_notification RPC (Daily Cap of 5 & Idempotency)
// ─────────────────────────────────────────────────────────────
console.log('\n--- 5. Testing Supabase RPC: check_and_record_notification ---');
async function testSupabaseRPC() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Real existing profile ID for foreign key integrity
  const testUserId = 'd611d8e1-0863-4f7b-b5e7-082c0b1f0967';
  const testDate = `2099-12-${String((Date.now() % 27) + 1).padStart(2, '0')}`;

  // First clean up any prior test rows for testDate to guarantee clean state
  await supabase
    .from('notification_logs')
    .delete()
    .eq('user_id', testUserId)
    .eq('local_date', testDate);

  // First ensure table is accessible
  const { error: testSubErr } = await supabase
    .from('push_subscriptions')
    .select('id')
    .limit(1);

  assert(!testSubErr, 'push_subscriptions table is queryable via Supabase API');

  // Test slot idempotency and 5/day hard limit via RPC
  const rpcCall1 = await supabase.rpc('check_and_record_notification', {
    p_user_id: testUserId,
    p_local_date: testDate,
    p_slot_time: '08:00',
    p_notification_state: 'HABIT',
    p_intensity: 'CALM',
    p_message_id: 'H-C01',
    p_title: 'Good morning 🐝',
    p_body: "Your habits are waiting whenever you're ready. There's plenty of day left.",
    p_delivered_devices: 1,
    p_metadata: { test: true },
  });

  assert(!rpcCall1.error, `RPC call 1 returned without error: ${rpcCall1.error?.message || 'OK'}`);
  assert(rpcCall1.data?.allowed === true, 'First slot 08:00 is allowed');

  // Test duplicate call for same slot on same date
  const rpcCallDuplicate = await supabase.rpc('check_and_record_notification', {
    p_user_id: testUserId,
    p_local_date: testDate,
    p_slot_time: '08:00',
    p_notification_state: 'HABIT',
    p_intensity: 'CALM',
    p_message_id: 'H-C01',
    p_title: 'Duplicate Title',
    p_body: 'Duplicate Body',
    p_delivered_devices: 1,
  });

  assert(rpcCallDuplicate.data?.allowed === false, 'Duplicate for slot 08:00 is rejected');
  assert(rpcCallDuplicate.data?.reason === 'already_sent_for_slot', 'Reason is already_sent_for_slot');

  // Fill up to 5 slots
  const slots = ['12:00', '15:00', '19:00', '22:00'];
  for (const slot of slots) {
    const res = await supabase.rpc('check_and_record_notification', {
      p_user_id: testUserId,
      p_local_date: testDate,
      p_slot_time: slot,
      p_notification_state: 'FOOD',
      p_intensity: 'NUDGE',
      p_message_id: `F-N_${slot}`,
      p_title: `Test Title ${slot}`,
      p_body: `Test Body ${slot}`,
      p_delivered_devices: 1,
    });
    assert(res.data?.allowed === true, `Slot ${slot} recorded successfully (${res.data?.count}/5)`);
  }

  // Now attempt a 6th slot on the same day -> Must be rejected by hard limit!
  const rpcCall6th = await supabase.rpc('check_and_record_notification', {
    p_user_id: testUserId,
    p_local_date: testDate,
    p_slot_time: '23:59',
    p_notification_state: 'WORKOUT',
    p_intensity: 'CHAOS',
    p_message_id: 'W-X_6th',
    p_title: '6th Attempt',
    p_body: 'Should be blocked by 5/day hard limit',
    p_delivered_devices: 1,
  });

  assert(rpcCall6th.data?.allowed === false, '6th notification on same date is BLOCKED');
  assert(rpcCall6th.data?.reason === 'daily_limit_reached', 'Reason is daily_limit_reached');
  assert(rpcCall6th.data?.count === 5, 'Daily count reached exactly 5');

  // Clean up test rows for testDate
  await supabase
    .from('notification_logs')
    .delete()
    .eq('user_id', testUserId)
    .eq('local_date', testDate);

  console.log('Cleaned up test data for testDate');
}

// ─────────────────────────────────────────────────────────────
// 6. Complete 140 Notification Messages Library Verification
// ─────────────────────────────────────────────────────────────
console.log('\n--- 6. Testing Complete 140 Messages Library Specification ---');
function testComplete140MessageLibrary() {
  const EXPECTED_STATES: NotificationState[] = [
    'HABIT',
    'FOOD',
    'WORKOUT',
    'HABIT_FOOD',
    'HABIT_WORKOUT',
    'FOOD_WORKOUT',
    'HABIT_FOOD_WORKOUT',
  ];

  const states = Object.keys(NOTIFICATION_MESSAGES) as NotificationState[];
  assert(states.length === 7, `Library has exactly 7 states (found ${states.length})`);

  for (const expectedState of EXPECTED_STATES) {
    assert(states.includes(expectedState), `State ${expectedState} exists in library`);
  }

  let totalMessageCount = 0;
  const seenIds = new Set<string>();
  const genderedWordsRegex = /\b(bro|dude|man|girl|boy|king|queen|sir|ma'am)\b/i;

  for (const state of states) {
    const stateData = NOTIFICATION_MESSAGES[state];
    const calmList = stateData.CALM || [];
    const nudgeList = stateData.NUDGE || [];
    const chaosList = stateData.CHAOS || [];

    const stateTotal = calmList.length + nudgeList.length + chaosList.length;
    assert(
      stateTotal === 20,
      `State ${state} has exactly 20 messages (found ${stateTotal})`
    );
    assert(
      calmList.length === 5,
      `State ${state} has exactly 5 CALM messages (found ${calmList.length})`
    );
    assert(
      nudgeList.length === 8,
      `State ${state} has exactly 8 NUDGE messages (found ${nudgeList.length})`
    );
    assert(
      chaosList.length === 7,
      `State ${state} has exactly 7 CHAOS messages (found ${chaosList.length})`
    );

    const allInState = [...calmList, ...nudgeList, ...chaosList];
    for (const msg of allInState) {
      totalMessageCount++;

      // Unique ID check
      assert(!seenIds.has(msg.id), `Message ID "${msg.id}" is unique`);
      seenIds.add(msg.id);

      // State and intensity validation
      assert(msg.state === state, `Message "${msg.id}" has correct state "${state}"`);
      assert(
        msg.intensity === 'CALM' || msg.intensity === 'NUDGE' || msg.intensity === 'CHAOS',
        `Message "${msg.id}" has valid intensity "${msg.intensity}"`
      );

      // Title & Body validation
      assert(typeof msg.title === 'string' && msg.title.trim().length > 0, `Message "${msg.id}" has non-empty title`);
      assert(typeof msg.body === 'string' && msg.body.trim().length > 0, `Message "${msg.id}" has non-empty body`);

      // Gender-neutral validation
      const genderInTitle = genderedWordsRegex.test(msg.title);
      const genderInBody = genderedWordsRegex.test(msg.body);
      assert(!genderInTitle && !genderInBody, `Message "${msg.id}" is non-gendered`);
    }
  }

  assert(totalMessageCount === 140, `Library has EXACTLY 140 messages in total (found ${totalMessageCount})`);
  assert(seenIds.size === 140, `Exactly 140 unique message IDs exist (found ${seenIds.size})`);

  // Test message selection rotation
  const selectedMsg = selectNotificationMessage('HABIT', 'CALM', ['H-C01', 'H-C02', 'H-C03', 'H-C04']);
  assert(selectedMsg.id === 'H-C05', `Rotation correctly selects remaining unread message H-C05 (got ${selectedMsg.id})`);
}

async function runAll() {
  try {
    testComplete140MessageLibrary();
    await testWebPushEncryption();
    await testSupabaseRPC();
    console.log(`\n======================================================`);
    console.log(`ALL TESTS PASSED! (${passedTests}/${totalTests})`);
    console.log(`VERIFIED: EXACTLY 140 FINAL MESSAGES PROPERLY CONFIGURED`);
    console.log(`======================================================\n`);
    process.exit(0);
  } catch (err) {
    console.error('\nVerification suite failed:', err);
    process.exit(1);
  }
}

runAll();
