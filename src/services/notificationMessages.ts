/**
 * FitBee Complete Notification Content Library (Part 3)
 *
 * Exactly 140 Production Notification Messages:
 * - 20 Habit notifications (5 Calm, 8 Nudge, 7 Chaos)
 * - 20 Food notifications (5 Calm, 8 Nudge, 7 Chaos)
 * - 20 Workout notifications (5 Calm, 8 Nudge, 7 Chaos)
 * - 20 Habit + Food notifications (5 Calm, 8 Nudge, 7 Chaos)
 * - 20 Habit + Workout notifications (5 Calm, 8 Nudge, 7 Chaos)
 * - 20 Food + Workout notifications (5 Calm, 8 Nudge, 7 Chaos)
 * - 20 Habit + Food + Workout notifications (5 Calm, 8 Nudge, 7 Chaos)
 *
 * Content Principles:
 * - Zero gender-specific terms (no bro, dude, man, girl, boy, king, queen, etc.)
 * - Escalating tone: Morning (CALM) -> Midday/Evening (NUDGE) -> Late night (CHAOS)
 * - Playful, funny, and dramatic without shaming or cruelty
 * - Rotation and anti-repeat selection
 */

export type NotificationState =
  | 'HABIT'
  | 'FOOD'
  | 'WORKOUT'
  | 'HABIT_FOOD'
  | 'HABIT_WORKOUT'
  | 'FOOD_WORKOUT'
  | 'HABIT_FOOD_WORKOUT';

export type NotificationIntensity = 'CALM' | 'NUDGE' | 'CHAOS';

export interface NotificationMessageItem {
  id: string;
  state: NotificationState;
  intensity: NotificationIntensity;
  title: string;
  body: string;
}

export const NOTIFICATION_MESSAGES: Record<
  NotificationState,
  Record<NotificationIntensity, NotificationMessageItem[]>
> = {
  // ─────────────────────────────────────────────────────────────
  // 1. HABITS (20 messages: 5 Calm, 8 Nudge, 7 Chaos)
  // ─────────────────────────────────────────────────────────────
  HABIT: {
    CALM: [
      {
        id: 'H-C01',
        state: 'HABIT',
        intensity: 'CALM',
        title: 'Good morning 🐝',
        body: "Your habits are waiting whenever you're ready. There's plenty of day left.",
      },
      {
        id: 'H-C02',
        state: 'HABIT',
        intensity: 'CALM',
        title: 'Fresh day, fresh start 🌱',
        body: "A few habits are on today's list. Take them one at a time.",
      },
      {
        id: 'H-C03',
        state: 'HABIT',
        intensity: 'CALM',
        title: "Today's habits",
        body: 'Your habit list is ready. No rush, just a little progress at a time.',
      },
      {
        id: 'H-C04',
        state: 'HABIT',
        intensity: 'CALM',
        title: 'Your day is open',
        body: "Your habits are still waiting in the wings. You've got this.",
      },
      {
        id: 'H-C05',
        state: 'HABIT',
        intensity: 'CALM',
        title: 'Small things count 🐝',
        body: "Today's habits don't need to happen all at once. Just start with one.",
      },
    ],
    NUDGE: [
      {
        id: 'H-N01',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'Quick check-in 👀',
        body: "You've still got a few habits waiting on today's list.",
      },
      {
        id: 'H-N02',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'Still on the list 🐝',
        body: "Your habits haven't disappeared. They are, unfortunately, still here.",
      },
      {
        id: 'H-N03',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'A little reminder',
        body: "Today's habits are still unfinished. A small step now makes the rest easier.",
      },
      {
        id: 'H-N04',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'Your habits called',
        body: "They're wondering when they're getting checked off.",
      },
      {
        id: 'H-N05',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'Progress is waiting',
        body: "You've got unfinished habits today. Time to knock one out?",
      },
      {
        id: 'H-N06',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'One step at a time',
        body: 'Your habit list is still looking at you. Pick one and get moving.',
      },
      {
        id: 'H-N07',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'Just checking...',
        body: "Some habits are still unfinished today. There's still time.",
      },
      {
        id: 'H-N08',
        state: 'HABIT',
        intensity: 'NUDGE',
        title: 'Still got time ⏰',
        body: "Your habits aren't going anywhere. Might as well give them some attention.",
      },
    ],
    CHAOS: [
      {
        id: 'H-X01',
        state: 'HABIT',
        intensity: 'CHAOS',
        title: '🚨 HABIT ALERT',
        body: 'Your habits are still unfinished and the day is getting suspiciously short.',
      },
      {
        id: 'H-X02',
        state: 'HABIT',
        intensity: 'CHAOS',
        title: '🚨 The clock!',
        body: 'Your habit list is still alive. The clock is not slowing down.',
      },
      {
        id: 'H-X03',
        state: 'HABIT',
        intensity: 'CHAOS',
        title: "THEY'RE STILL HERE",
        body: 'Your unfinished habits have survived the entire day. This feels personal.',
      },
      {
        id: 'H-X04',
        state: 'HABIT',
        intensity: 'CHAOS',
        title: '🐝 Emergency meeting',
        body: "Your habits would like to discuss the fact that it's GETTING LATEE.",
      },
      {
        id: 'H-X05',
        state: 'HABIT',
        intensity: 'CHAOS',
        title: '⏰ Time is running',
        body: "Your streak doesn't need perfection. It just needs you to finish today's habits.",
      },
      {
        id: 'H-X06',
        state: 'HABIT',
        intensity: 'CHAOS',
        title: 'THIS IS GETTING CLOSE',
        body: 'Your habits are still waiting. Tomorrow is getting uncomfortably NEARR.',
      },
      {
        id: 'H-X07',
        state: 'HABIT',
        intensity: 'CHAOS',
        title: '🚨 LAST STRETCH',
        body: 'Your remaining habits are running out of today. Go save the checklist.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 2. FOOD LOGGING (20 messages: 5 Calm, 8 Nudge, 7 Chaos)
  // ─────────────────────────────────────────────────────────────
  FOOD: {
    CALM: [
      {
        id: 'F-C01',
        state: 'FOOD',
        intensity: 'CALM',
        title: 'Good morning 🍎',
        body: 'Your nutrition log is ready for today. Add your meals whenever you start eating.',
      },
      {
        id: 'F-C02',
        state: 'FOOD',
        intensity: 'CALM',
        title: "Today's food log",
        body: 'Keep today’s meals recorded as you go. Future-you will appreciate the data.',
      },
      {
        id: 'F-C03',
        state: 'FOOD',
        intensity: 'CALM',
        title: 'Food tracking time 🥗',
        body: 'Nothing urgent. Just remember to keep your nutrition log updated today.',
      },
      {
        id: 'F-C04',
        state: 'FOOD',
        intensity: 'CALM',
        title: 'Your meals, recorded',
        body: 'Logging as you go makes the rest of the day much easier to track.',
      },
      {
        id: 'F-C05',
        state: 'FOOD',
        intensity: 'CALM',
        title: 'A little food check-in',
        body: "Today's nutrition log is waiting. Add your meals whenever you're ready.",
      },
    ],
    NUDGE: [
      {
        id: 'F-N01',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: 'Quick food check 🍎',
        body: 'Have you logged today’s meals yet? Your nutrition history is looking a little empty.',
      },
      {
        id: 'F-N02',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: 'Your food log is waiting',
        body: 'Keep today’s nutrition data up to date while the meals are still fresh in your memory.',
      },
      {
        id: 'F-N03',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: "Don't forget the data",
        body: 'Your meals happened. Your nutrition log would like evidence.',
      },
      {
        id: 'F-N04',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: 'Food log check-in 👀',
        body: "Today's nutrition entries are still waiting for you.",
      },
      {
        id: 'F-N05',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: 'A small reminder',
        body: 'Keeping your food log updated now saves you from reconstructing the entire day later.',
      },
      {
        id: 'F-N06',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: 'Your meals are counting',
        body: "Make sure today's food makes it into your nutrition log too.",
      },
      {
        id: 'F-N07',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: 'Still tracking? 🍽️',
        body: "Your nutrition log isn't finished yet. A quick update now keeps things tidy.",
      },
      {
        id: 'F-N08',
        state: 'FOOD',
        intensity: 'NUDGE',
        title: 'Future-you says thanks',
        body: 'Log today’s food while you still remember what you actually ate.',
      },
    ],
    CHAOS: [
      {
        id: 'F-X01',
        state: 'FOOD',
        intensity: 'CHAOS',
        title: '🚨 FOOD LOG ALERT',
        body: "Today's nutrition log is still unfinished and the day is running out.",
      },
      {
        id: 'F-X02',
        state: 'FOOD',
        intensity: 'CHAOS',
        title: ' WHERE DID THE MEALS GO?',
        body: 'You ate them. Now the nutrition log needs the paperwork.',
      },
      {
        id: 'F-X03',
        state: 'FOOD',
        intensity: 'CHAOS',
        title: 'THE FOOD HAS BEEN EATEN',
        body: 'Now someone needs to tell FitBee about it. Preferably before midnight.',
      },
      {
        id: 'F-X04',
        state: 'FOOD',
        intensity: 'CHAOS',
        title: '⏰ THE LOG IS WAITING',
        body: "Today's nutrition data is still incomplete. The clock is getting involved.",
      },
      {
        id: 'F-X05',
        state: 'FOOD',
        intensity: 'CHAOS',
        title: 'THIS IS GETTING LATE 🍽️',
        body: 'Your food log is still unfinished. Tomorrow is beginning to look suspiciously close.',
      },
      {
        id: 'F-X06',
        state: 'FOOD',
        intensity: 'CHAOS',
        title: '🚨 NUTRITION EMERGENCY',
        body: 'Not an actual emergency. But your food log would really like to exist before the day ends.',
      },
      {
        id: 'F-X07',
        state: 'FOOD',
        intensity: 'CHAOS',
        title: '🚨 THE DAY IS ALMOST OVER',
        body: 'Your nutrition log is still waiting. Future-you is going to have questions.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 3. WORKOUT (20 messages: 5 Calm, 8 Nudge, 7 Chaos)
  // ─────────────────────────────────────────────────────────────
  WORKOUT: {
    CALM: [
      {
        id: 'W-C01',
        state: 'WORKOUT',
        intensity: 'CALM',
        title: "Today's workout 🏋️",
        body: "Your scheduled workout is waiting for you. Take your time and get started when you're ready.",
      },
      {
        id: 'W-C02',
        state: 'WORKOUT',
        intensity: 'CALM',
        title: 'Workout day 💪',
        body: "You've got a workout scheduled today. There's plenty of time to get it done.",
      },
      {
        id: 'W-C03',
        state: 'WORKOUT',
        intensity: 'CALM',
        title: 'Your workout is ready',
        body: "Today's session is on the calendar. Whenever you're ready, FitBee is ready too.",
      },
      {
        id: 'W-C04',
        state: 'WORKOUT',
        intensity: 'CALM',
        title: "Move when you're ready",
        body: 'Your scheduled workout is still waiting. One session, one step at a time.',
      },
      {
        id: 'W-C05',
        state: 'WORKOUT',
        intensity: 'CALM',
        title: "Today's session",
        body: "Your workout is on today's list. No panic. Just show up when you're ready.",
      },
    ],
    NUDGE: [
      {
        id: 'W-N01',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'Quick workout check 🏋️',
        body: "Today's scheduled workout is still waiting for you.",
      },
      {
        id: 'W-N02',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'Your workout called',
        body: 'It would like to know whether today is still workout day.',
      },
      {
        id: 'W-N03',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'Still got a session',
        body: "Your scheduled workout hasn't been checked off yet.",
      },
      {
        id: 'W-N04',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'Time to move 👀',
        body: "Today's workout is still on the list. A little movement goes a long way.",
      },
      {
        id: 'W-N05',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'Workout reminder',
        body: "You've still got today's session waiting. Future-you may appreciate the effort.",
      },
      {
        id: 'W-N06',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'Your session is waiting',
        body: "Today's workout is still unfinished. There's still time to get it done.",
      },
      {
        id: 'W-N07',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'One workout',
        body: "That's all that's standing between you and a completed workout day.",
      },
      {
        id: 'W-N08',
        state: 'WORKOUT',
        intensity: 'NUDGE',
        title: 'Still on the schedule',
        body: "Your workout hasn't gone anywhere. Might be a good time to start.",
      },
    ],
    CHAOS: [
      {
        id: 'W-X01',
        state: 'WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 WORKOUT ALERT',
        body: "Today's workout is still unfinished and the day is getting dangerously short.",
      },
      {
        id: 'W-X02',
        state: 'WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 THE WORKOUT IS STILL HERE',
        body: 'Your scheduled session has survived the entire day. It is now staring at you.',
      },
      {
        id: 'W-X03',
        state: 'WORKOUT',
        intensity: 'CHAOS',
        title: 'THE CLOCK IS MOVING',
        body: 'Your workout is still waiting. The clock has absolutely no sympathy.',
      },
      {
        id: 'W-X04',
        state: 'WORKOUT',
        intensity: 'CHAOS',
        title: '🐝 FITNESS EMERGENCY',
        body: 'Your workout is still unfinished. This notification has been authorized to be dramatic.',
      },
      {
        id: 'W-X05',
        state: 'WORKOUT',
        intensity: 'CHAOS',
        title: 'THIS IS GETTING LATE',
        body: 'Your scheduled workout is still waiting. Tomorrow is getting closer.',
      },
      {
        id: 'W-X06',
        state: 'WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 LAST STRETCH',
        body: "Today's workout is still incomplete. The day is running out of runway.",
      },
      {
        id: 'W-X07',
        state: 'WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 BEFORE MIDNIGHT',
        body: "Your workout is still on the list. Time to decide whether today's session gets saved.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 4. HABIT + FOOD (20 messages: 5 Calm, 8 Nudge, 7 Chaos)
  // ─────────────────────────────────────────────────────────────
  HABIT_FOOD: {
    CALM: [
      {
        id: 'HF-C01',
        state: 'HABIT_FOOD',
        intensity: 'CALM',
        title: 'Good morning 🐝',
        body: 'Your habits and nutrition log are ready for today. Take it one step at a time.',
      },
      {
        id: 'HF-C02',
        state: 'HABIT_FOOD',
        intensity: 'CALM',
        title: 'Two little things',
        body: "Today's habits and food tracking are waiting whenever you're ready.",
      },
      {
        id: 'HF-C03',
        state: 'HABIT_FOOD',
        intensity: 'CALM',
        title: 'Your day is underway 🌱',
        body: 'Keep an eye on your habits and nutrition as the day goes on.',
      },
      {
        id: 'HF-C04',
        state: 'HABIT_FOOD',
        intensity: 'CALM',
        title: 'Start simple',
        body: 'A few habits and your nutrition log are still waiting. No rush, just begin.',
      },
      {
        id: 'HF-C05',
        state: 'HABIT_FOOD',
        intensity: 'CALM',
        title: "Today's checklist",
        body: 'Your habits and food log are ready. Small progress is still progress.',
      },
    ],
    NUDGE: [
      {
        id: 'HF-N01',
        state: 'HABIT_FOOD',
        intensity: 'NUDGE',
        title: 'Quick check-in 👀',
        body: 'Your habits and nutrition log are both still waiting for some attention.',
      },
      {
        id: 'HF-N02',
        state: 'HABIT_FOOD',
        intensity: 'NUDGE',
        title: 'Two things remain',
        body: "Your habit list and food log aren't finished yet. Plenty of time to tackle them.",
      },
      {
        id: 'HF-N03',
        state: 'HABIT_FOOD',
        intensity: 'NUDGE',
        title: 'Still on the list',
        body: 'Your habits are waiting, and your nutrition log is too.',
      },
      {
        id: 'HF-N04',
        state: 'HABIT_FOOD',
        intensity: 'NUDGE',
        title: 'Progress check 🐝',
        body: "A few habits and today's food log are still unfinished.",
      },
      {
        id: 'HF-N05',
        state: 'HABIT_FOOD',
        intensity: 'NUDGE',
        title: "Don't lose the thread",
        body: "Keep your habits moving and your nutrition log updated while there's still time.",
      },
      {
        id: 'HF-N06',
        state: 'HABIT_FOOD',
        intensity: 'NUDGE',
        title: 'Your checklist called',
        body: 'It says the habits and food log are still waiting.',
      },
      {
        id: 'HF-N07',
        state: 'HABIT_FOOD',
        intensity: 'NUDGE',
        title: 'Two birds, one reminder',
        body: 'Your habits and nutrition tracking can both use a little attention.',
      },
      {
        id: 'HF-N08',
        state: 'HABIT_FOOD',
        intensity: 'NUDGE',
        title: 'Still got time ⏰',
        body: "Your habits and food log aren't done yet. Pick one and start there.",
      },
    ],
    CHAOS: [
      {
        id: 'HF-X01',
        state: 'HABIT_FOOD',
        intensity: 'CHAOS',
        title: '🚨 TWO THINGS LEFT',
        body: 'Your habits and nutrition log are both unfinished. The clock is officially involved.',
      },
      {
        id: 'HF-X02',
        state: 'HABIT_FOOD',
        intensity: 'CHAOS',
        title: '🚨 THE CHECKLIST IS WAITING',
        body: 'Habits and food tracking are still alive this late in the day.',
      },
      {
        id: 'HF-X03',
        state: 'HABIT_FOOD',
        intensity: 'CHAOS',
        title: "THEY'RE STILL HERE",
        body: 'Your habits and nutrition log have made it all the way to tonight. Impressive, honestly.',
      },
      {
        id: 'HF-X04',
        state: 'HABIT_FOOD',
        intensity: 'CHAOS',
        title: '🐝 EMERGENCY CHECK-IN',
        body: 'Your habits and food log need attention before today disappears.',
      },
      {
        id: 'HF-X05',
        state: 'HABIT_FOOD',
        intensity: 'CHAOS',
        title: '⏰ TIME IS RUNNING',
        body: "Two parts of today's routine are still unfinished. There's still time to save them.",
      },
      {
        id: 'HF-X06',
        state: 'HABIT_FOOD',
        intensity: 'CHAOS',
        title: 'THIS IS GETTING CLOSE',
        body: 'Your habits and nutrition log are still waiting. Tomorrow is approaching rapidly.',
      },
      {
        id: 'HF-X07',
        state: 'HABIT_FOOD',
        intensity: 'CHAOS',
        title: '🚨 LAST CALL',
        body: 'Habits and food tracking are still unfinished. The day is nearly out of room.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 5. HABIT + WORKOUT (20 messages: 5 Calm, 8 Nudge, 7 Chaos)
  // ─────────────────────────────────────────────────────────────
  HABIT_WORKOUT: {
    CALM: [
      {
        id: 'HW-C01',
        state: 'HABIT_WORKOUT',
        intensity: 'CALM',
        title: 'Good morning 🐝',
        body: "Today's habits and workout are ready whenever you are.",
      },
      {
        id: 'HW-C02',
        state: 'HABIT_WORKOUT',
        intensity: 'CALM',
        title: 'Movement + habits',
        body: "Your habits and scheduled workout are both on today's list.",
      },
      {
        id: 'HW-C03',
        state: 'HABIT_WORKOUT',
        intensity: 'CALM',
        title: 'Fresh day 💪',
        body: "There's a workout to tackle and a few habits to check off. Take it one step at a time.",
      },
      {
        id: 'HW-C04',
        state: 'HABIT_WORKOUT',
        intensity: 'CALM',
        title: "Today's routine",
        body: 'Your habits and workout are waiting. No rush, just keep moving.',
      },
      {
        id: 'HW-C05',
        state: 'HABIT_WORKOUT',
        intensity: 'CALM',
        title: "Start whenever you're ready",
        body: "Your habit list and workout are ready for today's progress.",
      },
    ],
    NUDGE: [
      {
        id: 'HW-N01',
        state: 'HABIT_WORKOUT',
        intensity: 'NUDGE',
        title: 'Quick check-in 👀',
        body: "Your habits and today's workout are still waiting.",
      },
      {
        id: 'HW-N02',
        state: 'HABIT_WORKOUT',
        intensity: 'NUDGE',
        title: 'Two things on deck',
        body: "Your habit list and scheduled workout haven't been completed yet.",
      },
      {
        id: 'HW-N03',
        state: 'HABIT_WORKOUT',
        intensity: 'NUDGE',
        title: 'Your routine called',
        body: 'It says the habits and workout are both still waiting.',
      },
      {
        id: 'HW-N04',
        state: 'HABIT_WORKOUT',
        intensity: 'NUDGE',
        title: 'Keep moving 💪',
        body: "Today's habits and workout are still unfinished. There's still time.",
      },
      {
        id: 'HW-N05',
        state: 'HABIT_WORKOUT',
        intensity: 'NUDGE',
        title: 'Progress check',
        body: "You've still got habits to complete and a workout to tackle today.",
      },
      {
        id: 'HW-N06',
        state: 'HABIT_WORKOUT',
        intensity: 'NUDGE',
        title: "Still on today's list",
        body: 'Your habits are waiting, and your workout is too.',
      },
      {
        id: 'HW-N07',
        state: 'HABIT_WORKOUT',
        intensity: 'NUDGE',
        title: 'One step, then another',
        body: "Start with a habit or start with the workout. Either way, you're moving forward.",
      },
      {
        id: 'HW-N08',
        state: 'HABIT_WORKOUT',
        intensity: 'NUDGE',
        title: 'Still got time ⏰',
        body: "Your habits and workout aren't finished yet. Time to get one moving.",
      },
    ],
    CHAOS: [
      {
        id: 'HW-X01',
        state: 'HABIT_WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 TWO THINGS REMAIN',
        body: 'Your habits and workout are both unfinished. The clock is getting loud.',
      },
      {
        id: 'HW-X02',
        state: 'HABIT_WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 THE ROUTINE IS STILL ALIVE',
        body: 'Habits and workout have made it this far. They would like to be completed.',
      },
      {
        id: 'HW-X03',
        state: 'HABIT_WORKOUT',
        intensity: 'CHAOS',
        title: 'THE CLOCK HAS SPOKEN',
        body: 'Your habits and workout are still waiting. Time is becoming less generous.',
      },
      {
        id: 'HW-X04',
        state: 'HABIT_WORKOUT',
        intensity: 'CHAOS',
        title: '🐝 FITNESS PANIC',
        body: 'Your habit list and workout are both unfinished. This is officially a dramatic moment.',
      },
      {
        id: 'HW-X05',
        state: 'HABIT_WORKOUT',
        intensity: 'CHAOS',
        title: 'THIS IS GETTING LATE',
        body: 'Your habits and workout are still waiting. Tomorrow is getting closer.',
      },
      {
        id: 'HW-X06',
        state: 'HABIT_WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 LAST STRETCH',
        body: "Two parts of today's routine are still unfinished. There's not much day left.",
      },
      {
        id: 'HW-X07',
        state: 'HABIT_WORKOUT',
        intensity: 'CHAOS',
        title: 'HELLO..!! SAVE THE ROUTINE',
        body: 'Your habits and workout are still on the list. The clock is running out.',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 6. FOOD + WORKOUT (20 messages: 5 Calm, 8 Nudge, 7 Chaos)
  // ─────────────────────────────────────────────────────────────
  FOOD_WORKOUT: {
    CALM: [
      {
        id: 'FW-C01',
        state: 'FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Good morning 🍎',
        body: "Today's workout and nutrition log are ready whenever you are.",
      },
      {
        id: 'FW-C02',
        state: 'FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Two parts of today',
        body: 'Keep your workout and food tracking in mind as the day gets going.',
      },
      {
        id: 'FW-C03',
        state: 'FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Today’s plan 💪',
        body: 'Your workout is scheduled and your nutrition log is ready. Take it one step at a time.',
      },
      {
        id: 'FW-C04',
        state: 'FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Start the day right',
        body: "Your workout and nutrition tracking are both ready for today's progress.",
      },
      {
        id: 'FW-C05',
        state: 'FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Your day is underway',
        body: 'There’s a workout to complete and food to keep track of. No rush.',
      },
    ],
    NUDGE: [
      {
        id: 'FW-N01',
        state: 'FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Quick check-in 👀',
        body: "Today's workout and nutrition log are both still waiting.",
      },
      {
        id: 'FW-N02',
        state: 'FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Two things remain',
        body: "Your workout hasn't been completed and your food log needs an update.",
      },
      {
        id: 'FW-N03',
        state: 'FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Keep the day moving',
        body: 'Your workout and nutrition tracking are still unfinished.',
      },
      {
        id: 'FW-N04',
        state: 'FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Your routine called',
        body: 'It says the workout and food log are still waiting.',
      },
      {
        id: 'FW-N05',
        state: 'FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: "Still on today's list",
        body: 'Your workout is waiting, and your nutrition log could use an update too.',
      },
      {
        id: 'FW-N06',
        state: 'FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Progress check 💪',
        body: "There's still a workout to complete and food to record today.",
      },
      {
        id: 'FW-N07',
        state: 'FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Two quick wins',
        body: 'Your workout and nutrition log are both still open. Start with whichever feels easier.',
      },
      {
        id: 'FW-N08',
        state: 'FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Still got time ⏰',
        body: "Today's workout and food log aren't finished yet.",
      },
    ],
    CHAOS: [
      {
        id: 'FW-X01',
        state: 'FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 TWO THINGS LEFT',
        body: 'Your workout and nutrition log are still unfinished. The clock is not helping.',
      },
      {
        id: 'FW-X02',
        state: 'FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: 'HEYY...!! THE COMBO REMAINS',
        body: 'Workout and food tracking have both survived until late today.',
      },
      {
        id: 'FW-X03',
        state: 'FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: 'THE WORKOUT + FOOD LOG',
        body: 'They’re both still here. They have apparently decided to stay until the last minute.',
      },
      {
        id: 'FW-X04',
        state: 'FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: '🐝 LATE-DAY CHECK-IN',
        body: 'Your workout and nutrition log need attention before the day disappears.',
      },
      {
        id: 'FW-X05',
        state: 'FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: '⏰ THIS IS GETTING CLOSE',
        body: "Two parts of today's routine are still unfinished. Tomorrow is approaching.",
      },
      {
        id: 'FW-X06',
        state: 'FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 FINAL STRETCH',
        body: "Your workout and nutrition log are still waiting. There isn't much day left.",
      },
      {
        id: 'FW-X07',
        state: 'FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: 'HAA!! BEFORE MIDNIGHT',
        body: "Today's workout and food log are still unfinished. The clock is officially judging nobody, but it is moving.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────
  // 7. HABIT + FOOD + WORKOUT (20 messages: 5 Calm, 8 Nudge, 7 Chaos)
  // ─────────────────────────────────────────────────────────────
  HABIT_FOOD_WORKOUT: {
    CALM: [
      {
        id: 'HFW-C01',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Good morning 🐝',
        body: "Today's habits, workout and nutrition are all ready whenever you are. Plenty of time.",
      },
      {
        id: 'HFW-C02',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Fresh day 🌱',
        body: 'Your full routine is waiting. Take it one piece at a time.',
      },
      {
        id: 'HFW-C03',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CALM',
        title: "Today's checklist",
        body: "Habits, workout and nutrition are all on today's list. No need to do everything at once.",
      },
      {
        id: 'HFW-C04',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Start anywhere',
        body: "You've got habits to check, a workout to tackle and food to log. One thing at a time.",
      },
      {
        id: 'HFW-C05',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CALM',
        title: 'Your day is open',
        body: 'Your full FitBee routine is still ahead of you. Start wherever feels easiest.',
      },
    ],
    NUDGE: [
      {
        id: 'HFW-N01',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Quick check-in 👀',
        body: 'Your habits, workout and nutrition log are all still waiting.',
      },
      {
        id: 'HFW-N02',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'A few things remain',
        body: "Today's habits, workout and food tracking are still unfinished.",
      },
      {
        id: 'HFW-N03',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'The full checklist',
        body: "Habits. Workout. Nutrition. They're all still on today's list.",
      },
      {
        id: 'HFW-N04',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Progress check 🐝',
        body: "You've still got your habits, workout and nutrition log waiting for attention.",
      },
      {
        id: 'HFW-N05',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Three things, one day',
        body: "Your routine isn't finished yet. Pick one thing and get the momentum started.",
      },
      {
        id: 'HFW-N06',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Still on the list',
        body: "Your habits, workout and food log are all waiting. There's still time.",
      },
      {
        id: 'HFW-N07',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Where to start?',
        body: 'Habits, workout or food? Pick one. Getting started is the important part.',
      },
      {
        id: 'HFW-N08',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'NUDGE',
        title: 'Still got time ⏰',
        body: 'Your full routine is still unfinished. One completed piece makes the rest easier.',
      },
    ],
    CHAOS: [
      {
        id: 'HFW-X01',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 THE FULL CHECKLIST',
        body: 'Habits. Workout. Nutrition. ALL THREE are still unfinished.',
      },
      {
        id: 'HFW-X02',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: 'GOSHH THREE THINGS. ONE DAY.',
        body: 'Your entire FitBee checklist is still alive this late. We may need to move.',
      },
      {
        id: 'HFW-X03',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: "THEY'RE ALL STILL HERE",
        body: 'Habits, workout and food tracking have formed an alliance against your bedtime.',
      },
      {
        id: 'HFW-X04',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: '🐝 THIS IS A SITUATION',
        body: 'Your habits, workout and nutrition log are all unfinished. The clock has entered the conversation.',
      },
      {
        id: 'HFW-X05',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: '🚨 FULL ALERT',
        body: 'Nothing on today’s routine has been checked off yet. There is still time, but not an infinite amount.',
      },
      {
        id: 'HFW-X06',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: 'GOSHH THE CLOCK IS RUNNING',
        body: 'Habits. Workout. Nutrition. Three things remain and today is nearly over.',
      },
      {
        id: 'HFW-X07',
        state: 'HABIT_FOOD_WORKOUT',
        intensity: 'CHAOS',
        title: 'HOPE!! THIS IS THE LAST STRETCH',
        body: 'Your entire FitBee routine is still waiting. Tomorrow is getting dangerously close.',
      },
    ],
  },
};

/**
 * Selects a message for the given state and intensity, rotating to avoid recently sent messages.
 */
export function selectNotificationMessage(
  state: NotificationState,
  intensity: NotificationIntensity,
  recentMessageIds: string[] = []
): NotificationMessageItem {
  const pool = NOTIFICATION_MESSAGES[state]?.[intensity] || [];
  if (pool.length === 0) {
    // Fallback if pool is empty
    return {
      id: `fallback_${state.toLowerCase()}_${intensity.toLowerCase()}`,
      state,
      intensity,
      title: 'FitBee Reminder 🐝',
      body: 'You have unfinished activities waiting for you in FitBee.',
    };
  }

  // Filter out recently used messages
  const recentSet = new Set(recentMessageIds);
  const unreadPool = pool.filter((msg) => !recentSet.has(msg.id));

  if (unreadPool.length > 0) {
    const randomIndex = Math.floor(Math.random() * unreadPool.length);
    return unreadPool[randomIndex];
  }

  // If all messages in this bucket were recently used, pick a random one from the pool
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}
