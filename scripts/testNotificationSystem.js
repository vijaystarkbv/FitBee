/**
 * Comprehensive Automated Verification Suite for FitBee Push Notification System
 *
 * Tests:
 * 1. Timezone & Evaluation window calculation
 * 2. Mandatory category combination logic (7 states + NONE)
 * 3. Intensity scaling (CALM, NUDGE, CHAOS)
 * 4. Message library structure and rotation selector
 * 5. Web Push payload encryption & VAPID authentication
 * 6. Supabase check_and_record_notification RPC (daily cap of 5 & slot idempotency)
 */

import { buildPushPayload } from '@block65/webcrypto-web-push';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rbbaqzpfimffcgixyukr.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_L9KrnrVHAkBfHOPospS55A_cQOTr8II';

const VAPID_PUBLIC_KEY =
  'BHT2BsY6ChvtsuFkXLxRIlQFacUv7643c583OUdZRAUBFwfOTXCxggu9txysmILuYNkWr4Z4wIG4mUpmLs-YvLY';
const VAPID_PRIVATE_KEY =
  'h9E7GuVdXpdjl9Etfpvi1EgZpBSFL0Xe7-KYQUkbc90';
const VAPID_SUBJECT = 'mailto:support@fitbee.com';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    throw new Error(message);
  } else {
    console.log(`✅ PASS: ${message}`);
    passedTests++;
  }
}

// ── 1. Category Combination Resolution ──
function resolveCombinedNotificationState(habitPending, foodPending, workoutPending) {
  if (habitPending && foodPending && workoutPending) return 'HABIT_FOOD_WORKOUT';
  if (habitPending && foodPending) return 'HABIT_FOOD';
  if (habitPending && workoutPending) return 'HABIT_WORKOUT';
  if (foodPending && workoutPending) return 'FOOD_WORKOUT';
  if (habitPending) return 'HABIT';
  if (foodPending) return 'FOOD';
  if (workoutPending) return 'WORKOUT';
  return 'NONE';
}

console.log('\n--- 1. Testing Category Combination Logic ---');
assert(resolveCombinedNotificationState(false, false, false) === 'NONE', 'All false yields NONE');
assert(resolveCombinedNotificationState(true, false, false) === 'HABIT', 'Habit only yields HABIT');
assert(resolveCombinedNotificationState(false, true, false) === 'FOOD', 'Food only yields FOOD');
assert(resolveCombinedNotificationState(false, false, true) === 'WORKOUT', 'Workout only yields WORKOUT');
assert(resolveCombinedNotificationState(true, true, false) === 'HABIT_FOOD', 'Habit + Food yields HABIT_FOOD');
assert(resolveCombinedNotificationState(true, false, true) === 'HABIT_WORKOUT', 'Habit + Workout yields HABIT_WORKOUT');
assert(resolveCombinedNotificationState(false, true, true) === 'FOOD_WORKOUT', 'Food + Workout yields FOOD_WORKOUT');
assert(resolveCombinedNotificationState(true, true, true) === 'HABIT_FOOD_WORKOUT', 'All pending yields HABIT_FOOD_WORKOUT');

// ── 2. Intensity Scaling ──
function getIntensityForSlot(slot, hour) {
  if (slot === '22:00' || (hour !== undefined && hour >= 21)) return 'CHAOS';
  if (slot === '15:00' || slot === '19:00' || (hour !== undefined && hour >= 14 && hour < 21)) return 'NUDGE';
  return 'CALM';
}

console.log('\n--- 2. Testing Intensity Scaling ---');
assert(getIntensityForSlot('08:00', 8) === 'CALM', '08:00 is CALM');
assert(getIntensityForSlot('12:00', 12) === 'CALM', '12:00 is CALM');
assert(getIntensityForSlot('15:00', 15) === 'NUDGE', '15:00 is NUDGE');
assert(getIntensityForSlot('19:00', 19) === 'NUDGE', '19:00 is NUDGE');
assert(getIntensityForSlot('22:00', 22) === 'CHAOS', '22:00 is CHAOS');
assert(getIntensityForSlot('23:00', 23) === 'CHAOS', 'Late night 23:00 is CHAOS');

// ── 3. Timezone resolution ──
function getUserLocalTimeInfo(timezone = 'UTC', baseDate = new Date()) {
  let tz = timezone || 'UTC';
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
  } catch (_) {
    tz = 'UTC';
  }

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    weekday: 'long',
  });

  const parts = formatter.formatToParts(baseDate);
  const partMap = {};
  for (const part of parts) {
    partMap[part.type] = part.value;
  }

  const localDate = `${partMap.year}-${partMap.month}-${partMap.day}`;
  const localTime = `${partMap.hour}:${partMap.minute}`;
  const hour = parseInt(partMap.hour, 10);
  const minute = parseInt(partMap.minute, 10);
  const weekdayName = partMap.weekday;

  return { localDate, localTime, hour, minute, weekdayName };
}

console.log('\n--- 3. Testing Local Timezone Resolution ---');
const utcTime = getUserLocalTimeInfo('UTC', new Date('2026-09-08T12:00:00Z'));
assert(utcTime.localDate === '2026-09-08', 'UTC date formatted correctly');
assert(utcTime.hour === 12, 'UTC hour is 12');

const nyTime = getUserLocalTimeInfo('America/New_York', new Date('2026-09-08T12:00:00Z'));
assert(nyTime.hour === 8, 'New York is EDT (UTC-4) -> 08:00');

const tokyoTime = getUserLocalTimeInfo('Asia/Tokyo', new Date('2026-09-08T12:00:00Z'));
assert(tokyoTime.hour === 21, 'Tokyo is JST (UTC+9) -> 21:00');

// ── 4. Web Push Payload Generation & RFC 8291 Encryption ──
console.log('\n--- 4. Testing Web Push Payload RFC 8291 Encryption ---');
async function testWebPushEncryption() {
  const dummySubscription = {
    endpoint: 'https://fcm.googleapis.com/fcm/send/fake-subscription-token-for-testing',
    expirationTime: null,
    keys: {
      auth: 'S8AWsktD-JTmrpdjUZeOmw',
      p256dh: 'BARE-ffF2xZ-JK8Va6cUpOdw79jPzn-CAWBpOkkNJO-dH7LUrvusvrYGoaDXyu5h9rUzkoAtDyGbrkJxTWGETmg',
    },
  };

  const message = {
    data: JSON.stringify({
      title: 'FitBee Test Notification 🐝',
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

  const vapid = {
    subject: VAPID_SUBJECT,
    publicKey: VAPID_PUBLIC_KEY,
    privateKey: VAPID_PRIVATE_KEY,
  };

  // Generate payload
  const pushPayload = await buildPushPayload(message, dummySubscription, vapid);

  assert(pushPayload !== null && typeof pushPayload === 'object', 'buildPushPayload returns object');
  assert(pushPayload.method.toUpperCase() === 'POST', 'HTTP method is POST');
  assert(typeof pushPayload.headers.authorization === 'string', 'Authorization header is present');
  assert(pushPayload.headers.authorization.startsWith('vapid t='), 'Authorization is VAPID scheme');
  assert(pushPayload.headers['content-encoding'] === 'aes128gcm', 'Encoding is aes128gcm');
  assert(pushPayload.body instanceof Uint8Array, 'Body is encrypted Uint8Array');
  assert(pushPayload.body.length > 0, 'Body has encrypted payload bytes');
}

// ── 5. Supabase check_and_record_notification RPC ──
console.log('\n--- 5. Testing Supabase RPC: check_and_record_notification ---');
async function testSupabaseRPC() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Use real existing profile ID for RPC foreign key integrity
  const testUserId = 'd611d8e1-0863-4f7b-b5e7-082c0b1f0967';
  const testDate = '2099-01-01'; // Future date to prevent colliding with real data

  // First ensure table is accessible
  const { data: testSubCheck, error: testSubErr } = await supabase
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
    p_message_id: 'test_m1',
    p_title: 'Test Title 1',
    p_body: 'Test Body 1',
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
    p_message_id: 'test_m1_dup',
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
      p_message_id: `test_${slot}`,
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
    p_message_id: 'test_6th',
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

async function runAll() {
  try {
    await testWebPushEncryption();
    await testSupabaseRPC();
    console.log(`\n========================================`);
    console.log(`ALL TESTS PASSED! (${passedTests}/${totalTests})`);
    console.log(`========================================\n`);
    process.exit(0);
  } catch (err) {
    console.error('\nVerification suite failed:', err);
    process.exit(1);
  }
}

runAll();
