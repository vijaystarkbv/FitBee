import { ExerciseDetailItem } from '../types/exerciseDetail';

export const EXERCISE_DETAILS_REGISTRY: Record<string, ExerciseDetailItem> = {
  // ==========================================
  // NECK EXERCISES
  // ==========================================
  'Neck Flexion': {
    id: 'neck_flexion',
    name: 'Neck Flexion',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Neck Mobility',
    primaryMuscles: ['Neck Mobility'],
    secondaryMuscles: [],
    howToPerform: [
      'Stand or sit upright with your shoulders relaxed.',
      'Slowly lower your chin toward your chest without rounding your back.',
      'Pause briefly when you feel a gentle stretch in the back of your neck.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Move only until you feel a comfortable stretch.',
      'Keep your shoulders relaxed.',
      'Perform the movement slowly.',
      'Avoid jerking your head.'
    ]
  },
  'Neck Extension': {
    id: 'neck_extension',
    name: 'Neck Extension',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Neck Mobility',
    primaryMuscles: ['Neck Mobility'],
    secondaryMuscles: [],
    howToPerform: [
      'Stand or sit upright with your shoulders relaxed and your head facing forward.',
      'Slowly lift your chin and gently tilt your head backward using only your neck.',
      'Pause briefly when you feel a comfortable stretch in the front of your neck.',
      'Return slowly to the starting position with smooth, controlled movement.'
    ],
    tips: [
      'Move only within a comfortable range. Never force your neck backward.',
      'Keep your shoulders relaxed and avoid leaning your upper body.',
      'Perform the movement slowly and maintain full control throughout the exercise.',
      'Stop immediately if you experience pain, dizziness, or discomfort.'
    ]
  },
  'Neck Side Stretch': {
    id: 'neck_side_stretch',
    name: 'Neck Side Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Neck Stretch',
    primaryMuscles: ['Neck'],
    secondaryMuscles: ['Upper Trapezius'],
    howToPerform: [
      'Stand or sit upright with your shoulders relaxed.',
      'Slowly tilt your head toward one shoulder without raising the shoulder.',
      'Pause when you feel a gentle stretch along the opposite side of your neck.',
      'Return to the starting position and repeat on the opposite side.'
    ],
    tips: [
      'Keep both shoulders relaxed throughout the movement.',
      'Stretch only until you feel gentle tension.',
      'Avoid twisting your head while stretching.',
      'Perform the movement slowly and evenly on both sides.'
    ]
  },
  'Neck Rotation': {
    id: 'neck_rotation',
    name: 'Neck Rotation',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Neck Mobility',
    primaryMuscles: ['Neck Mobility'],
    secondaryMuscles: [],
    howToPerform: [
      'Stand or sit upright with your shoulders relaxed.',
      'Slowly rotate your head to one side while keeping your chin level.',
      'Pause briefly when you reach a comfortable range of motion.',
      'Return to the center and repeat on the opposite side.'
    ],
    tips: [
      'Move smoothly without forcing the rotation.',
      'Keep your shoulders still throughout the exercise.',
      'Maintain an upright posture.',
      'Stop if you experience pain or dizziness.'
    ]
  },
  'Chin Tuck': {
    id: 'chin_tuck',
    name: 'Chin Tuck',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Neck Posture',
    primaryMuscles: ['Neck Posture'],
    secondaryMuscles: ['Deep Neck Flexors'],
    howToPerform: [
      'Stand or sit upright with your shoulders relaxed and your eyes facing forward.',
      'Gently pull your chin straight backward without tilting your head up or down.',
      'Hold the tucked position for a few seconds while keeping your neck long.',
      'Relax and slowly return to the starting position.'
    ],
    tips: [
      'Keep your head level throughout the movement.',
      'Avoid looking downward while tucking your chin.',
      'Perform slow, controlled repetitions.',
      'Focus on posture rather than force.'
    ]
  },

  // ==========================================
  // SHOULDER EXERCISES
  // ==========================================
  'Wall Push-up': {
    id: 'wall_push_up',
    name: 'Wall Push-up',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Wall',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Chest'],
    howToPerform: [
      'Stand facing a wall and place your hands on it slightly wider than shoulder-width apart.',
      'Step back until your body forms a straight line from head to heels.',
      'Bend your elbows to bring your chest toward the wall.',
      'Push through your palms to return to the starting position.'
    ],
    tips: [
      'Keep your elbows close to your body to emphasize the triceps.',
      'Keep your body in a straight line.',
      'Lower yourself with control.',
      'Keep your core engaged throughout the movement.'
    ]
  },
  'Incline Pike Push-up': {
    id: 'incline_pike_push_up',
    name: 'Incline Pike Push-up',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Upper Chest'],
    howToPerform: [
      'Place your hands on the floor and elevate your hips into an inverted "V" position.',
      'Rest your feet on a chair or bench if needed to reduce the difficulty.',
      'Bend your elbows to lower the top of your head toward the floor.',
      'Push back to the starting position with control.'
    ],
    tips: [
      'Keep your hips elevated throughout the movement.',
      'Lower yourself slowly.',
      'Avoid shrugging your shoulders.',
      'Maintain a neutral neck position.'
    ]
  },
  'Wall Handstand Hold': {
    id: 'wall_handstand_hold',
    name: 'Wall Handstand Hold',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Wall',
    category: 'Strength',
    target: 'Shoulders',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Face away from a wall and place your hands on the floor.',
      'Carefully walk your feet up the wall until your body is nearly vertical.',
      'Keep your arms straight and engage your shoulders and core.',
      'Hold the position before carefully returning to the floor.'
    ],
    tips: [
      'Keep your core tight.',
      'Push strongly through your shoulders.',
      'Avoid arching your lower back.',
      'Exit the position slowly and safely.'
    ]
  },
  'Plank Shoulder Tap': {
    id: 'plank_shoulder_tap',
    name: 'Plank Shoulder Tap',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Begin in a high plank position with your hands beneath your shoulders.',
      'Lift one hand and tap the opposite shoulder.',
      'Return your hand to the floor.',
      'Alternate sides while keeping your hips stable.'
    ],
    tips: [
      'Keep your hips level.',
      'Avoid rotating your torso.',
      'Move slowly and under control.',
      'Engage your core throughout.'
    ]
  },
  'Bear Crawl Hold': {
    id: 'bear_crawl_hold',
    name: 'Bear Crawl Hold',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Begin on your hands and knees.',
      'Lift your knees a few centimeters off the floor.',
      'Keep your back flat and brace your core.',
      'Hold the position while breathing steadily.'
    ],
    tips: [
      'Keep your knees close to the floor.',
      'Avoid raising your hips too high.',
      'Maintain a neutral spine.',
      'Keep your shoulders directly above your hands.'
    ]
  },
  'Shoulder Rolls': {
    id: 'shoulder_rolls',
    name: 'Shoulder Rolls',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Shoulders',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Upper Trapezius'],
    howToPerform: [
      'Stand or sit upright with your shoulders relaxed and your arms at your sides.',
      'Slowly roll both shoulders forward in a smooth circular motion.',
      'Continue for several repetitions, then reverse the direction by rolling your shoulders backward.',
      'Perform the movement slowly and with full control.'
    ],
    tips: [
      'Keep the movement slow and controlled.',
      'Relax your neck throughout the exercise.',
      'Make large, comfortable circles without forcing the movement.',
      'Breathe normally and avoid shrugging your shoulders.'
    ]
  },
  'Arm Circles': {
    id: 'arm_circles',
    name: 'Arm Circles',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Shoulders',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Stand upright with your feet shoulder-width apart and extend both arms straight out to the sides.',
      'Begin making small circles with your arms while keeping them level with your shoulders.',
      'Gradually increase the size of the circles while maintaining control.',
      'Reverse the direction and repeat for the same duration.'
    ],
    tips: [
      'Keep your arms straight but not locked.',
      'Maintain good posture throughout the movement.',
      'Perform both forward and backward circles evenly.',
      'Stop if you experience shoulder pain.'
    ]
  },
  'Reverse Arm Circles': {
    id: 'reverse_arm_circles',
    name: 'Reverse Arm Circles',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Rear Shoulders',
    primaryMuscles: ['Rear Shoulders'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Stand upright with your arms extended straight out to your sides.',
      'Rotate your arms in small backward circles while keeping them level with your shoulders.',
      'Gradually increase the size of the circles without losing control.',
      'Continue with smooth, steady movements before relaxing your arms.'
    ],
    tips: [
      'Keep your shoulders relaxed.',
      'Avoid arching your lower back.',
      'Move smoothly without rushing.',
      'Maintain steady breathing throughout the exercise.'
    ]
  },
  'Cross Body Shoulder Stretch': {
    id: 'cross_body_shoulder_stretch',
    name: 'Cross Body Shoulder Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Rear Shoulders',
    primaryMuscles: ['Rear Shoulders'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Stand or sit upright with relaxed shoulders.',
      'Bring one arm across your chest at shoulder height.',
      'Use your opposite hand to gently pull the arm closer to your body until you feel a comfortable stretch.',
      'Hold briefly, then repeat on the opposite side.'
    ],
    tips: [
      'Keep the stretching shoulder relaxed.',
      'Do not twist your upper body during the stretch.',
      'Stretch only until you feel gentle tension.',
      'Perform the exercise equally on both sides.'
    ]
  },
  'Wall Angels': {
    id: 'wall_angels',
    name: 'Wall Angels',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Wall',
    category: 'Mobility',
    target: 'Rear Shoulders',
    primaryMuscles: ['Rear Shoulders'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Stand with your back against a wall and keep your head, upper back, and hips in contact with the wall.',
      'Raise your arms into a "W" position with your elbows bent at 90 degrees.',
      'Slowly slide your arms upward into a "Y" position while maintaining contact with the wall.',
      'Return slowly to the starting position with controlled movement.'
    ],
    tips: [
      'Keep your lower back as close to the wall as comfortably possible.',
      'Move only through a pain-free range of motion.',
      'Keep your shoulders relaxed throughout the exercise.',
      'Perform slow, controlled repetitions.'
    ]
  },
  'Dumbbell Shoulder Press': {
    id: 'dumbbell_shoulder_press',
    name: 'Dumbbell Shoulder Press',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Hold a dumbbell in each hand at shoulder height with your palms facing forward.',
      'Brace your core and press the dumbbells overhead.',
      'Extend your arms without locking your elbows.',
      'Lower the dumbbells slowly back to shoulder height.'
    ],
    tips: [
      'Keep your back neutral.',
      'Press both dumbbells evenly.',
      'Avoid arching your lower back.',
      'Lower the weights with control.'
    ]
  },
  'Band Shoulder Press': {
    id: 'band_shoulder_press',
    name: 'Band Shoulder Press',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Stand on the center of a resistance band.',
      'Hold the handles at shoulder height.',
      'Press the handles overhead until your arms are nearly straight.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Keep your core engaged.',
      'Avoid shrugging your shoulders.',
      'Press in a straight path.',
      'Control the lowering phase.'
    ]
  },
  'Band Front Raise': {
    id: 'band_front_raise',
    name: 'Band Front Raise',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Upper Chest'],
    howToPerform: [
      'Stand on the center of a resistance band.',
      'Hold the handles with your palms facing your thighs.',
      'Raise your arms forward until they reach shoulder height.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows slightly bent.',
      'Avoid swinging the band.',
      'Lift only to shoulder height.',
      'Lower slowly with control.'
    ]
  },
  'Shoulder Press Machine': {
    id: 'shoulder_press_machine',
    name: 'Shoulder Press Machine',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Shoulder Press Machine',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Adjust the seat so the handles are level with your shoulders.',
      'Grip the handles firmly.',
      'Press the handles upward until your arms are nearly straight.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your back against the pad.',
      'Avoid locking your elbows.',
      'Press smoothly.',
      'Control the lowering phase.'
    ]
  },
  'Smith Machine Shoulder Press': {
    id: 'smith_machine_shoulder_press',
    name: 'Smith Machine Shoulder Press',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Smith Machine',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Sit or stand beneath the Smith machine bar.',
      'Grip the bar slightly wider than shoulder-width.',
      'Press the bar overhead until your arms are nearly straight.',
      'Lower the bar slowly back to shoulder height.'
    ],
    tips: [
      'Keep your wrists neutral.',
      'Maintain an upright posture.',
      'Lower the bar under control.',
      'Avoid excessive arching of your lower back.'
    ]
  },
  'Resistance Band Shoulder Opener': {
    id: 'resistance_band_shoulder_opener',
    name: 'Resistance Band Shoulder Opener',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Mobility',
    target: 'Shoulders',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Chest'],
    howToPerform: [
      'Hold a resistance band with both hands slightly wider than shoulder-width apart.',
      'Keep your arms straight and slowly raise the band overhead.',
      'Continue moving the band behind your body as far as comfortably possible.',
      'Reverse the movement slowly and return to the starting position.'
    ],
    tips: [
      'Use a light resistance band.',
      'Keep your elbows straight but not locked.',
      'Do not force the movement beyond your comfortable range.',
      'Perform the exercise slowly and with full control.'
    ]
  },
  'Pike Push-up': {
    id: 'pike_push_up',
    name: 'Pike Push-up',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Upper Chest'],
    howToPerform: [
      'Start in an inverted V position with your hips raised.',
      'Keep your legs mostly straight and your hands shoulder-width apart.',
      'Lower the top of your head toward the floor by bending your elbows.',
      'Press back to the starting position.'
    ],
    tips: [
      'Keep your hips elevated.',
      'Look toward your feet.',
      'Lower yourself with control.',
      'Avoid collapsing your shoulders.'
    ]
  },
  'Wall Walk': {
    id: 'wall_walk',
    name: 'Wall Walk',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'Wall',
    category: 'Strength',
    target: 'Shoulders',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Begin in a push-up position with your feet against a wall.',
      'Slowly walk your feet up the wall while walking your hands closer to it.',
      'Continue until you reach a comfortable height.',
      'Reverse the movement slowly to return to the starting position.'
    ],
    tips: [
      'Keep your core engaged.',
      'Move slowly and under control.',
      'Avoid arching your lower back.',
      'Descend carefully.'
    ]
  },
  'Bear Crawl': {
    id: 'bear_crawl',
    name: 'Bear Crawl',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Begin on your hands and feet with your knees slightly lifted off the floor.',
      'Keep your back flat and brace your core.',
      'Move your opposite hand and foot forward together.',
      'Continue crawling with slow, controlled steps.'
    ],
    tips: [
      'Keep your knees close to the floor.',
      'Avoid rotating your hips.',
      'Maintain a neutral spine.',
      'Move with control rather than speed.'
    ]
  },
  'Crab Walk': {
    id: 'crab_walk',
    name: 'Crab Walk',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Sit on the floor with your hands behind you and your feet flat.',
      'Lift your hips into a tabletop position.',
      'Walk forward by moving one hand and the opposite foot together.',
      'Continue with slow, controlled movements.'
    ],
    tips: [
      'Keep your hips elevated.',
      'Engage your core throughout.',
      'Maintain steady breathing.',
      'Avoid locking your elbows.'
    ]
  },
  'Scapular Push-up': {
    id: 'scapular_push_up',
    name: 'Scapular Push-up',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Serratus'],
    howToPerform: [
      'Begin in a high plank with your arms straight.',
      'Without bending your elbows, allow your chest to sink slightly by squeezing your shoulder blades together.',
      'Push the floor away to spread your shoulder blades apart.',
      'Repeat using only your shoulder blade movement.'
    ],
    tips: [
      'Keep your elbows locked.',
      'Move only through your shoulder blades.',
      'Keep your core engaged.',
      'Perform slow, controlled repetitions.'
    ]
  },
  'Shoulder CARs': {
    id: 'shoulder_cars',
    name: 'Shoulder CARs',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Full Shoulder Mobility',
    primaryMuscles: ['Full Shoulder Mobility'],
    secondaryMuscles: ['Rotator Cuff'],
    howToPerform: [
      'Stand upright with one arm extended.',
      'Slowly move your arm through the largest pain-free circle possible.',
      'Rotate your shoulder while keeping the rest of your body still.',
      'Repeat before switching to the opposite arm.'
    ],
    tips: [
      'Move as slowly as possible.',
      'Keep your torso stable.',
      'Use a full comfortable range of motion.',
      'Perform evenly on both shoulders.'
    ]
  },
  'Arnold Press': {
    id: 'arnold_press',
    name: 'Arnold Press',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Full Shoulders',
    primaryMuscles: ['Full Shoulders'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Hold a dumbbell in each hand with your palms facing you at shoulder height.',
      'Rotate your palms outward as you press the dumbbells overhead.',
      'Fully extend your arms without locking your elbows.',
      'Reverse the motion slowly back to the starting position.'
    ],
    tips: [
      'Rotate smoothly throughout the movement.',
      'Keep your core engaged.',
      'Avoid arching your lower back.',
      'Lower the weights under control.'
    ]
  },
  'Seated Dumbbell Press': {
    id: 'seated_dumbbell_press',
    name: 'Seated Dumbbell Press',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Sit upright on a bench while holding a dumbbell in each hand at shoulder height.',
      'Press both dumbbells overhead.',
      'Extend your arms without locking your elbows.',
      'Lower the dumbbells slowly back to shoulder level.'
    ],
    tips: [
      'Keep your back supported.',
      'Press both dumbbells evenly.',
      'Avoid shrugging your shoulders.',
      'Control the lowering phase.'
    ]
  },
  'Standing Dumbbell Press': {
    id: 'standing_dumbbell_press',
    name: 'Standing Dumbbell Press',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Stand upright with a dumbbell in each hand at shoulder height.',
      'Brace your core.',
      'Press the dumbbells overhead until your arms are nearly straight.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Keep your core tight.',
      'Avoid leaning backward.',
      'Press in a straight path.',
      'Lower the weights with control.'
    ]
  },
  'Front Raise': {
    id: 'front_raise',
    name: 'Front Raise',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Upper Chest'],
    howToPerform: [
      'Hold a dumbbell in each hand in front of your thighs.',
      'Raise both arms forward until they reach shoulder height.',
      'Pause briefly at the top.',
      'Lower the weights slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows slightly bent.',
      'Avoid swinging the weights.',
      'Lift only to shoulder height.',
      'Lower slowly under control.'
    ]
  },
  'Lateral Raise': {
    id: 'lateral_raise',
    name: 'Lateral Raise',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Side Shoulders',
    primaryMuscles: ['Side Shoulders'],
    secondaryMuscles: ['Upper Trapezius'],
    howToPerform: [
      'Hold a dumbbell in each hand with your arms resting at your sides.',
      'Raise both arms outward until they reach shoulder height.',
      'Pause briefly at the top of the movement.',
      'Lower the dumbbells slowly to the starting position.'
    ],
    tips: [
      'Keep a slight bend in your elbows.',
      'Lift only to shoulder height.',
      'Avoid swinging the weights.',
      'Lower the weights with control.'
    ]
  },
  'Bent-over Reverse Fly': {
    id: 'bent_over_reverse_fly',
    name: 'Bent-over Reverse Fly',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Rear Shoulders',
    primaryMuscles: ['Rear Shoulders'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Hold a dumbbell in each hand and hinge forward at your hips.',
      'Let your arms hang beneath your shoulders.',
      'Raise both arms out to your sides until they reach shoulder height.',
      'Lower the weights slowly to the starting position.'
    ],
    tips: [
      'Keep your back flat.',
      'Squeeze your shoulder blades together.',
      'Avoid using momentum.',
      'Control the lowering phase.'
    ]
  },
  'Band Lateral Raise': {
    id: 'band_lateral_raise',
    name: 'Band Lateral Raise',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Side Shoulders',
    primaryMuscles: ['Side Shoulders'],
    secondaryMuscles: ['Upper Trapezius'],
    howToPerform: [
      'Stand on the center of a resistance band.',
      'Hold the handles with your arms at your sides.',
      'Raise both arms outward until they reach shoulder height.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows slightly bent.',
      'Avoid shrugging your shoulders.',
      'Lift under control.',
      'Maintain constant band tension.'
    ]
  },
  'Band Reverse Fly': {
    id: 'band_reverse_fly',
    name: 'Band Reverse Fly',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Rear Shoulders',
    primaryMuscles: ['Rear Shoulders'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Hold a resistance band with both hands at shoulder height.',
      'Extend your arms in front of your chest.',
      'Pull the band apart until your arms move out to your sides.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Squeeze your shoulder blades together.',
      'Keep your shoulders relaxed.',
      'Avoid bending your elbows excessively.',
      'Perform slow, controlled repetitions.'
    ]
  },
  'Band Face Pull': {
    id: 'band_face_pull',
    name: 'Band Face Pull',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Rear Shoulders',
    primaryMuscles: ['Rear Shoulders'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Anchor a resistance band at face height.',
      'Hold both ends with your arms extended.',
      'Pull the band toward your face while driving your elbows outward.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Lead with your elbows.',
      'Squeeze your shoulder blades together.',
      'Keep your wrists neutral.',
      'Control every repetition.'
    ]
  },
  'Machine Lateral Raise': {
    id: 'machine_lateral_raise',
    name: 'Machine Lateral Raise',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Lateral Raise Machine',
    category: 'Strength',
    target: 'Side Shoulders',
    primaryMuscles: ['Side Shoulders'],
    secondaryMuscles: ['Upper Trapezius'],
    howToPerform: [
      'Sit on the machine with your upper arms resting against the pads.',
      'Grip the handles if available.',
      'Raise the pads until your arms reach shoulder height.',
      'Lower them slowly back to the starting position.'
    ],
    tips: [
      'Keep your back against the pad.',
      'Avoid using momentum.',
      'Lift only to shoulder height.',
      'Control the lowering phase.'
    ]
  },
  'Cable Front Raise': {
    id: 'cable_front_raise',
    name: 'Cable Front Raise',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Upper Chest'],
    howToPerform: [
      'Attach a straight handle to the low pulley.',
      'Hold the handle with both hands or one hand.',
      'Raise the handle in front of you until it reaches shoulder height.',
      'Lower it slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows slightly bent.',
      'Avoid swinging your body.',
      'Lift under control.',
      'Lower the cable slowly.'
    ]
  },
  'Cable Lateral Raise': {
    id: 'cable_lateral_raise',
    name: 'Cable Lateral Raise',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Side Shoulders',
    primaryMuscles: ['Side Shoulders'],
    secondaryMuscles: ['Upper Trapezius'],
    howToPerform: [
      'Attach a single handle to the low pulley.',
      'Stand sideways to the machine and hold the handle with your outside hand.',
      'Raise your arm outward until it reaches shoulder height.',
      'Lower slowly before switching arms.'
    ],
    tips: [
      'Keep a slight bend in your elbow.',
      'Lift only to shoulder level.',
      'Maintain constant cable tension.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Cable Reverse Fly': {
    id: 'cable_reverse_fly',
    name: 'Cable Reverse Fly',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Rear Shoulders',
    primaryMuscles: ['Rear Shoulders'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Stand between two cable pulleys set at shoulder height.',
      'Cross your arms to grip the opposite handles.',
      'Pull your arms outward until they are in line with your shoulders.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows slightly bent.',
      'Squeeze your shoulder blades together.',
      'Avoid using momentum.',
      'Perform controlled repetitions.'
    ]
  },
  'Cable Face Pull': {
    id: 'cable_face_pull',
    name: 'Cable Face Pull',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Rear Shoulders',
    primaryMuscles: ['Rear Shoulders'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Attach a rope handle at face height.',
      'Grip both ends of the rope with your arms extended.',
      'Pull the rope toward your face while driving your elbows outward.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Lead with your elbows.',
      'Squeeze your shoulder blades together.',
      'Keep your wrists neutral.',
      'Perform slow, controlled repetitions.'
    ]
  },
  'Elevated Pike Push-up': {
    id: 'elevated_pike_push_up',
    name: 'Elevated Pike Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'Chair',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Upper Chest'],
    howToPerform: [
      'Place your feet on a sturdy bench or chair and your hands on the floor.',
      'Raise your hips into an inverted "V" position.',
      'Lower the top of your head toward the floor by bending your elbows.',
      'Press back to the starting position with control.'
    ],
    tips: [
      'Keep your hips elevated throughout the exercise.',
      'Lower yourself slowly.',
      'Avoid shrugging your shoulders.',
      'Maintain a neutral neck position.'
    ]
  },
  'Hindu Push-up': {
    id: 'hindu_push_up',
    name: 'Hindu Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Chest'],
    howToPerform: [
      'Begin in an inverted V position.',
      'Lower your chest toward the floor in a sweeping motion.',
      'Continue forward until your chest rises into an upward-facing position.',
      'Reverse the movement to return to the starting position.'
    ],
    tips: [
      'Perform the movement as one smooth motion.',
      'Engage your core throughout.',
      'Avoid rushing the exercise.',
      'Maintain controlled breathing.'
    ]
  },
  'Handstand Shoulder Tap': {
    id: 'handstand_shoulder_tap',
    name: 'Handstand Shoulder Tap',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'Wall',
    category: 'Strength',
    target: 'Shoulders',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Kick into a wall-supported handstand.',
      'Shift your weight onto one arm.',
      'Briefly lift the opposite hand and tap your shoulder.',
      'Return your hand to the floor and alternate sides.'
    ],
    tips: [
      'Keep your body tight throughout.',
      'Shift your weight gradually.',
      'Avoid rushing the movement.',
      'Practice against a wall until comfortable.'
    ]
  },
  'Handstand Push-up (Wall Assisted)': {
    id: 'handstand_push_up_wall_assisted',
    name: 'Handstand Push-up (Wall Assisted)',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'Wall',
    category: 'Strength',
    target: 'Shoulders',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Kick into a handstand with your heels against a wall.',
      'Bend your elbows to lower your head toward the floor.',
      'Press through your hands until your arms are fully extended.',
      'Repeat with slow, controlled movement.'
    ],
    tips: [
      'Keep your core engaged.',
      'Lower yourself under control.',
      'Avoid flaring your elbows.',
      'Use a padded surface if needed.'
    ]
  },
  'Freestanding Handstand Push-up': {
    id: 'freestanding_handstand_push_up',
    name: 'Freestanding Handstand Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Shoulders',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Triceps', 'Core'],
    howToPerform: [
      'Balance in a freestanding handstand.',
      'Slowly bend your elbows to lower your head.',
      'Press yourself back to full arm extension.',
      'Stabilize your balance before beginning the next repetition.'
    ],
    tips: [
      'Attempt only after mastering wall-assisted handstand push-ups.',
      'Keep your core tight.',
      'Lower yourself under full control.',
      'Practice on a safe surface.'
    ]
  },
  'Upright Row': {
    id: 'upright_row',
    name: 'Upright Row',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Side Shoulders',
    primaryMuscles: ['Side Shoulders'],
    secondaryMuscles: ['Traps'],
    howToPerform: [
      'Hold a dumbbell in each hand in front of your thighs.',
      'Pull the weights upward by leading with your elbows.',
      'Raise them until your elbows reach shoulder height.',
      'Lower the weights slowly to the starting position.'
    ],
    tips: [
      'Keep your wrists below your elbows.',
      'Avoid lifting above shoulder height.',
      'Use controlled movement.',
      'Choose a comfortable weight.'
    ]
  },
  'Cuban Press': {
    id: 'cuban_press',
    name: 'Cuban Press',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Rotator Cuff',
    primaryMuscles: ['Rotator Cuff'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Hold light dumbbells with your elbows bent at 90 degrees.',
      'Perform an upright row until your upper arms are level with your shoulders.',
      'Rotate your forearms upward.',
      'Press the dumbbells overhead before reversing the movement.'
    ],
    tips: [
      'Use light weights.',
      'Move slowly through each phase.',
      'Focus on shoulder control.',
      'Avoid using momentum.'
    ]
  },
  'Leaning Lateral Raise': {
    id: 'leaning_lateral_raise',
    name: 'Leaning Lateral Raise',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Side Shoulders',
    primaryMuscles: ['Side Shoulders'],
    secondaryMuscles: ['Upper Trapezius'],
    howToPerform: [
      'Hold onto a sturdy object with one hand and lean slightly away.',
      'Hold a dumbbell in your opposite hand.',
      'Raise the dumbbell outward until it reaches shoulder height.',
      'Lower slowly before repeating on the opposite side.'
    ],
    tips: [
      'Keep a slight bend in your elbow.',
      'Lift only to shoulder height.',
      'Avoid swinging the weight.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Band Upright Row': {
    id: 'band_upright_row',
    name: 'Band Upright Row',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Side Shoulders',
    primaryMuscles: ['Side Shoulders'],
    secondaryMuscles: ['Traps'],
    howToPerform: [
      'Stand on the center of a resistance band.',
      'Hold both handles with your hands in front of your thighs.',
      'Pull the band upward by leading with your elbows.',
      'Lower slowly back to the starting position.'
    ],
    tips: [
      'Keep your elbows higher than your hands.',
      'Avoid pulling above shoulder height.',
      'Maintain constant band tension.',
      'Move with control.'
    ]
  },
  'Behind-the-Neck Press': {
    id: 'behind_the_neck_press',
    name: 'Behind-the-Neck Press',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Sit or stand beneath a barbell positioned behind your neck.',
      'Grip the bar slightly wider than shoulder-width.',
      'Press the bar overhead until your arms are nearly straight.',
      'Lower the bar carefully back behind your neck.'
    ],
    tips: [
      'Perform only if you have excellent shoulder mobility.',
      'Use lighter weights than a standard shoulder press.',
      'Keep the movement slow and controlled.',
      'Stop immediately if you feel shoulder discomfort.'
    ]
  },
  'Single Arm Cable Press': {
    id: 'single_arm_cable_press',
    name: 'Single Arm Cable Press',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Front Shoulders',
    primaryMuscles: ['Front Shoulders'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Set the cable handle to shoulder height.',
      'Hold the handle with one hand in a staggered stance.',
      'Press the handle straight forward until your arm is nearly extended.',
      'Return slowly before switching arms.'
    ],
    tips: [
      'Keep your torso stable.',
      'Resist rotation throughout the movement.',
      'Press in a straight line.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Cable Y Raise': {
    id: 'cable_y_raise',
    name: 'Cable Y Raise',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Rear Shoulders',
    primaryMuscles: ['Rear Shoulders'],
    secondaryMuscles: ['Rotator Cuff'],
    howToPerform: [
      'Attach two cable handles to the lowest pulleys.',
      'Hold the handles with your arms crossed in front of your body.',
      'Raise your arms upward in a "Y" shape.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Keep a slight bend in your elbows.',
      'Lift with control.',
      'Avoid shrugging your shoulders.',
      'Focus on squeezing your upper back.'
    ]
  },

  // ==========================================
  // ARMS EXERCISES
  // ==========================================
  'Self Resistance Curl': {
    id: 'self_resistance_curl',
    name: 'Self Resistance Curl',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Stand upright with one arm bent at about 90 degrees.',
      'Use your opposite hand to provide resistance against the curling arm.',
      'Slowly curl upward while matching the movement with equal resistance.',
      'Lower the arm slowly while continuing to resist the movement.'
    ],
    tips: [
      'Apply steady resistance throughout the movement.',
      'Avoid using momentum.',
      'Move slowly and under control.',
      'Perform equal repetitions on both arms.'
    ]
  },
  'Isometric Bicep Hold': {
    id: 'isometric_bicep_hold',
    name: 'Isometric Bicep Hold',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Bend your elbow to approximately 90 degrees.',
      'Hold the position while squeezing your biceps.',
      'Maintain steady tension without moving your arm.',
      'Relax after the desired hold time and repeat.'
    ],
    tips: [
      'Keep your shoulders relaxed.',
      'Breathe normally during the hold.',
      'Avoid shrugging your shoulders.',
      'Maintain constant muscle tension.'
    ]
  },
  'Assisted Chin-up': {
    id: 'assisted_chin_up',
    name: 'Assisted Chin-up',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Attach a resistance band securely to a pull-up bar.',
      'Place one foot or knee into the band.',
      'Grip the bar with your palms facing you.',
      'Pull yourself upward until your chin clears the bar, then lower yourself slowly.'
    ],
    tips: [
      'Pull with your elbows.',
      'Avoid swinging your body.',
      'Lower yourself slowly.',
      'Choose an appropriate assistance band.'
    ]
  },
  'Standing Dumbbell Curl': {
    id: 'standing_dumbbell_curl',
    name: 'Standing Dumbbell Curl',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Stand upright with a dumbbell in each hand.',
      'Keep your elbows close to your sides.',
      'Curl both dumbbells toward your shoulders.',
      'Lower the weights slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows stationary.',
      'Avoid swinging your body.',
      'Lower the weights slowly.',
      'Squeeze your biceps at the top.'
    ]
  },
  'Alternating Dumbbell Curl': {
    id: 'alternating_dumbbell_curl',
    name: 'Alternating Dumbbell Curl',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Hold a dumbbell in each hand with your arms fully extended.',
      'Curl one dumbbell toward your shoulder.',
      'Lower it slowly before curling the opposite arm.',
      'Continue alternating each repetition.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Perform each repetition under control.',
      'Avoid leaning backward.',
      'Fully extend your arm between repetitions.'
    ]
  },
  'Band Curl': {
    id: 'band_curl',
    name: 'Band Curl',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Stand on the center of a resistance band.',
      'Hold the handles with your palms facing forward.',
      'Curl the handles toward your shoulders.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Keep constant tension on the band.',
      'Avoid swinging your torso.',
      'Keep your elbows tucked.',
      'Lower the band slowly.'
    ]
  },
  'Machine Bicep Curl': {
    id: 'machine_bicep_curl',
    name: 'Machine Bicep Curl',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Bicep Curl Machine',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Adjust the seat so your elbows align with the machine\'s pivot point.',
      'Grip the handles firmly.',
      'Curl the handles toward your shoulders.',
      'Lower the weight slowly until your arms are extended.'
    ],
    tips: [
      'Keep your upper arms against the pads.',
      'Move through a full range of motion.',
      'Avoid using momentum.',
      'Control the lowering phase.'
    ]
  },
  'Bench Dip': {
    id: 'bench_dip',
    name: 'Bench Dip',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Bench / Chair',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Sit on the edge of a sturdy bench with your hands beside your hips.',
      'Slide your hips forward off the bench.',
      'Bend your elbows to lower your body.',
      'Press through your hands to return to the starting position.'
    ],
    tips: [
      'Keep your elbows pointing backward.',
      'Lower only until your shoulders remain comfortable.',
      'Avoid shrugging your shoulders.',
      'Move slowly and under control.'
    ]
  },
  'Chair Dip': {
    id: 'chair_dip',
    name: 'Chair Dip',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Chair',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Place your hands on the edge of a sturdy chair.',
      'Extend your legs forward and slide your hips off the chair.',
      'Lower yourself by bending your elbows.',
      'Press yourself back up to the starting position.'
    ],
    tips: [
      'Use a stable chair.',
      'Keep your elbows close to your body.',
      'Lower yourself under control.',
      'Avoid locking your elbows.'
    ]
  },
  'Overhead Tricep Extension': {
    id: 'overhead_tricep_extension',
    name: 'Overhead Tricep Extension',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Hold one dumbbell with both hands overhead.',
      'Keep your elbows close to your head.',
      'Lower the weight behind your head.',
      'Extend your arms to return to the starting position.'
    ],
    tips: [
      'Keep your elbows pointing forward.',
      'Avoid arching your lower back.',
      'Move slowly and under control.',
      'Fully extend your arms at the top.'
    ]
  },
  'Single Arm Overhead Extension': {
    id: 'single_arm_overhead_extension',
    name: 'Single Arm Overhead Extension',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Hold a dumbbell overhead with one hand.',
      'Keep your upper arm close to your head.',
      'Lower the weight behind your head.',
      'Extend your arm back to the starting position before switching sides.'
    ],
    tips: [
      'Keep your elbow stationary.',
      'Avoid leaning sideways.',
      'Lower the weight under control.',
      'Perform equal repetitions on both arms.'
    ]
  },
  'Band Pushdown': {
    id: 'band_pushdown',
    name: 'Band Pushdown',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Secure a resistance band to a high anchor point.',
      'Grip the handles with your elbows bent at your sides.',
      'Extend your arms downward until your elbows are fully straight.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows tucked close to your body.',
      'Avoid using your shoulders.',
      'Maintain constant tension on the band.',
      'Control the return movement.'
    ]
  },
  'Machine Tricep Extension': {
    id: 'machine_tricep_extension',
    name: 'Machine Tricep Extension',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Tricep Extension Machine',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Adjust the machine so your elbows align with the pivot point.',
      'Grip the handles firmly.',
      'Extend your arms until they are nearly straight.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows stationary.',
      'Avoid locking your elbows forcefully.',
      'Perform slow, controlled repetitions.',
      'Use a full range of motion.'
    ]
  },
  'Fingertip Plank': {
    id: 'fingertip_plank',
    name: 'Fingertip Plank',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Begin in a high plank position.',
      'Support your body using only your fingertips instead of your palms.',
      'Keep your body in a straight line from head to heels.',
      'Hold the position while breathing steadily.'
    ],
    tips: [
      'Start with short hold times.',
      'Keep your core engaged.',
      'Spread your fingers evenly.',
      'Stop if you feel finger pain.'
    ]
  },
  'Fingertip Push-up (Wall)': {
    id: 'fingertip_push_up_wall',
    name: 'Fingertip Push-up (Wall)',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Wall',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Stand facing a wall.',
      'Place your fingertips on the wall at shoulder height.',
      'Bend your elbows to lean toward the wall.',
      'Push yourself back to the starting position using your fingertips.'
    ],
    tips: [
      'Apply pressure gradually.',
      'Keep your fingers spread.',
      'Move slowly and under control.',
      'Stop if your fingers become painful.'
    ]
  },
  'Standard Grip Squeeze': {
    id: 'standard_grip_squeeze',
    name: 'Standard Grip Squeeze',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Grip Strengthener',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Hold a grip strengthener or squeeze ball in one hand.',
      'Squeeze it firmly using your entire hand.',
      'Hold the squeeze briefly.',
      'Release slowly before repeating.'
    ],
    tips: [
      'Squeeze through the full range.',
      'Avoid rushing the repetitions.',
      'Perform equal repetitions on both hands.',
      'Relax your hand between repetitions.'
    ]
  },
  'Timed Grip Hold': {
    id: 'timed_grip_hold',
    name: 'Timed Grip Hold',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Grip Strengthener',
    category: 'Strength',
    target: 'Grip Strength',
    primaryMuscles: ['Grip Strength'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Hold a grip strengthener or heavy object securely.',
      'Squeeze it as firmly as comfortable.',
      'Maintain the grip for the desired time.',
      'Relax before repeating.'
    ],
    tips: [
      'Breathe normally during the hold.',
      'Keep your wrist neutral.',
      'Increase hold time gradually.',
      'Train both hands equally.'
    ]
  },
  'Wrist Curl': {
    id: 'wrist_curl',
    name: 'Wrist Curl',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Sit with your forearms resting on your thighs or a bench, palms facing upward.',
      'Hold a dumbbell in each hand.',
      'Curl your wrists upward.',
      'Lower the weights slowly to the starting position.'
    ],
    tips: [
      'Move only your wrists.',
      'Keep your forearms supported.',
      'Lower the weights slowly.',
      'Avoid using momentum.'
    ]
  },
  'Reverse Wrist Curl': {
    id: 'reverse_wrist_curl',
    name: 'Reverse Wrist Curl',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Rest your forearms on your thighs or a bench with your palms facing downward.',
      'Hold a dumbbell in each hand.',
      'Raise the backs of your hands upward.',
      'Lower the weights slowly.'
    ],
    tips: [
      'Keep the movement small and controlled.',
      'Do not lift your forearms.',
      'Use lighter weights.',
      'Lower slowly.'
    ]
  },
  'Band Wrist Curl': {
    id: 'band_wrist_curl',
    name: 'Band Wrist Curl',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Secure one end of a resistance band under your foot.',
      'Hold the other end with your palm facing upward.',
      'Curl your wrist upward against the band\'s resistance.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your forearm still.',
      'Move only at the wrist.',
      'Maintain steady tension.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Band Reverse Wrist Curl': {
    id: 'band_reverse_wrist_curl',
    name: 'Band Reverse Wrist Curl',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Secure one end of a resistance band under your foot.',
      'Hold the band with your palm facing downward.',
      'Lift the back of your hand upward.',
      'Lower slowly to the starting position.'
    ],
    tips: [
      'Keep your forearm supported.',
      'Use controlled movements.',
      'Avoid swinging.',
      'Train both wrists equally.'
    ]
  },
  'Wrist Curl Machine': {
    id: 'wrist_curl_machine',
    name: 'Wrist Curl Machine',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Wrist Curl Machine',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Sit at the wrist curl machine and position your forearms on the pad.',
      'Grip the handles with your palms facing upward.',
      'Curl your wrists upward.',
      'Lower slowly back to the starting position.'
    ],
    tips: [
      'Keep your forearms on the pad.',
      'Move only your wrists.',
      'Perform slow repetitions.',
      'Avoid excessive weight.'
    ]
  },
  'Reverse Wrist Curl Machine': {
    id: 'reverse_wrist_curl_machine',
    name: 'Reverse Wrist Curl Machine',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Reverse Wrist Curl Machine',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Position your forearms on the machine pad with your palms facing downward.',
      'Grip the handles firmly.',
      'Lift the backs of your hands upward.',
      'Lower slowly to the starting position.'
    ],
    tips: [
      'Keep the movement controlled.',
      'Avoid lifting your forearms.',
      'Use a comfortable weight.',
      'Focus on smooth repetitions.'
    ]
  },
  'Towel Curl (Leg Resistance)': {
    id: 'towel_curl_leg_resistance',
    name: 'Towel Curl (Leg Resistance)',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'Towel',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Sit on a chair and loop a towel beneath one foot.',
      'Hold both ends of the towel with one hand.',
      'Curl your hand upward while pressing downward with your foot to create resistance.',
      'Lower your arm slowly while maintaining steady resistance.'
    ],
    tips: [
      'Apply consistent resistance with your leg.',
      'Move slowly through the full range of motion.',
      'Avoid using momentum.',
      'Perform equal repetitions on both arms.'
    ]
  },
  'Close Grip Chin-up': {
    id: 'close_grip_chin_up',
    name: 'Close Grip Chin-up',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Grip the pull-up bar with a narrow underhand grip.',
      'Hang with your arms fully extended.',
      'Pull yourself upward until your chin passes the bar.',
      'Lower yourself slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Pull smoothly without swinging.',
      'Lower yourself under control.',
      'Engage your core throughout.'
    ]
  },
  'Hammer Curl': {
    id: 'hammer_curl',
    name: 'Hammer Curl',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Brachialis'],
    howToPerform: [
      'Hold a dumbbell in each hand with your palms facing each other.',
      'Keep your elbows close to your sides.',
      'Curl the dumbbells toward your shoulders.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Maintain a neutral grip throughout.',
      'Avoid swinging your body.',
      'Keep your elbows stationary.',
      'Lower the weights under control.'
    ]
  },
  'Concentration Curl': {
    id: 'concentration_curl',
    name: 'Concentration Curl',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Sit on a bench with your elbow resting against the inside of your thigh.',
      'Hold a dumbbell with your arm fully extended.',
      'Curl the dumbbell toward your shoulder.',
      'Lower it slowly before switching arms.'
    ],
    tips: [
      'Keep your upper arm still.',
      'Squeeze your biceps at the top.',
      'Lower the weight slowly.',
      'Perform equal repetitions on both arms.'
    ]
  },
  'Incline Dumbbell Curl': {
    id: 'incline_dumbbell_curl',
    name: 'Incline Dumbbell Curl',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Sit on an incline bench while holding a dumbbell in each hand.',
      'Let your arms hang fully extended.',
      'Curl the dumbbells toward your shoulders.',
      'Lower them slowly until your arms are fully extended.'
    ],
    tips: [
      'Keep your elbows behind your body.',
      'Avoid swinging the weights.',
      'Use a full range of motion.',
      'Lower the dumbbells under control.'
    ]
  },
  'Cross Body Hammer Curl': {
    id: 'cross_body_hammer_curl',
    name: 'Cross Body Hammer Curl',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Brachialis'],
    howToPerform: [
      'Hold a dumbbell in each hand with a neutral grip.',
      'Curl one dumbbell diagonally across your body toward the opposite shoulder.',
      'Lower it slowly.',
      'Repeat with the opposite arm.'
    ],
    tips: [
      'Keep your elbow close to your body.',
      'Avoid rotating your wrist.',
      'Control every repetition.',
      'Perform evenly on both sides.'
    ]
  },
  'Single Arm Band Curl': {
    id: 'single_arm_band_curl',
    name: 'Single Arm Band Curl',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Stand on one end of a resistance band.',
      'Hold the opposite end with one hand.',
      'Curl the band toward your shoulder.',
      'Lower slowly before switching arms.'
    ],
    tips: [
      'Keep your elbow close to your side.',
      'Maintain constant band tension.',
      'Avoid leaning backward.',
      'Complete equal repetitions on both arms.'
    ]
  },
  'Hammer Band Curl': {
    id: 'hammer_band_curl',
    name: 'Hammer Band Curl',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Stand on the center of a resistance band using a neutral grip.',
      'Hold the handles with your palms facing each other.',
      'Curl the handles toward your shoulders.',
      'Lower them slowly with control.'
    ],
    tips: [
      'Keep your wrists neutral.',
      'Avoid swinging your body.',
      'Maintain steady band tension.',
      'Lower the handles slowly.'
    ]
  },
  'EZ Bar Curl': {
    id: 'ez_bar_curl',
    name: 'EZ Bar Curl',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'EZ Bar',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Stand upright while holding an EZ bar with an underhand grip.',
      'Keep your elbows close to your sides.',
      'Curl the bar toward your shoulders.',
      'Lower it slowly to the starting position.'
    ],
    tips: [
      'Keep your upper arms stationary.',
      'Avoid using momentum.',
      'Lower the bar slowly.',
      'Squeeze your biceps at the top.'
    ]
  },
  'Barbell Curl': {
    id: 'barbell_curl',
    name: 'Barbell Curl',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Stand upright while holding a barbell with an underhand grip.',
      'Keep your elbows close to your sides.',
      'Curl the barbell toward your shoulders.',
      'Lower it slowly until your arms are fully extended.'
    ],
    tips: [
      'Keep your upper arms stationary.',
      'Avoid using momentum.',
      'Lower the bar under control.',
      'Squeeze your biceps at the top.'
    ]
  },
  'Preacher Curl': {
    id: 'preacher_curl',
    name: 'Preacher Curl',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Preacher Curl Bench',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Sit at the preacher curl bench and rest your upper arms on the pad.',
      'Grip the bar or EZ bar with an underhand grip.',
      'Curl the weight toward your shoulders.',
      'Lower it slowly until your arms are nearly straight.'
    ],
    tips: [
      'Keep your upper arms firmly on the pad.',
      'Avoid swinging the weight.',
      'Move through a full range of motion.',
      'Lower the weight slowly.'
    ]
  },
  'Cable Curl': {
    id: 'cable_curl',
    name: 'Cable Curl',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Attach a straight bar to the low cable pulley.',
      'Grip the bar with an underhand grip.',
      'Curl the handle toward your shoulders.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows tucked.',
      'Maintain constant cable tension.',
      'Avoid leaning backward.',
      'Lower the handle under control.'
    ]
  },
  'Tricep Kickback': {
    id: 'tricep_kickback',
    name: 'Tricep Kickback',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Hold a dumbbell in one hand and hinge forward at your hips.',
      'Keep your upper arm close to your body with your elbow bent.',
      'Extend your forearm backward until your arm is straight.',
      'Return slowly before switching arms.'
    ],
    tips: [
      'Keep your upper arm stationary.',
      'Avoid swinging the weight.',
      'Fully extend your arm at the top.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Skull Crusher (Dumbbell)': {
    id: 'skull_crusher_dumbbell',
    name: 'Skull Crusher (Dumbbell)',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Lie on a bench while holding a dumbbell in each hand above your chest.',
      'Keep your upper arms vertical.',
      'Bend your elbows to lower the dumbbells beside your head.',
      'Extend your arms back to the starting position.'
    ],
    tips: [
      'Keep your elbows close together.',
      'Lower the weights slowly.',
      'Avoid moving your upper arms.',
      'Use controlled repetitions.'
    ]
  },
  'Overhead Band Extension': {
    id: 'overhead_band_extension',
    name: 'Overhead Band Extension',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Anchor a resistance band beneath your feet or behind you.',
      'Hold the band overhead with both hands.',
      'Extend your arms until they are fully straight.',
      'Lower the band slowly behind your head.'
    ],
    tips: [
      'Keep your elbows close to your head.',
      'Maintain constant band tension.',
      'Avoid arching your back.',
      'Move slowly and under control.'
    ]
  },
  'Single Arm Band Extension': {
    id: 'single_arm_band_extension',
    name: 'Single Arm Band Extension',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Secure a resistance band behind you.',
      'Hold one end of the band overhead with one hand.',
      'Extend your arm until it is fully straight.',
      'Lower slowly before switching arms.'
    ],
    tips: [
      'Keep your elbow pointing forward.',
      'Avoid moving your upper arm.',
      'Perform equal repetitions on both sides.',
      'Maintain steady band tension.'
    ]
  },
  'Cable Pushdown': {
    id: 'cable_pushdown',
    name: 'Cable Pushdown',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Attach a straight bar or rope to the high pulley.',
      'Keep your elbows close to your sides.',
      'Push the handle downward until your arms are fully extended.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows fixed in place.',
      'Avoid using your shoulders.',
      'Fully extend your arms.',
      'Control the return movement.'
    ]
  },
  'Rope Pushdown': {
    id: 'rope_pushdown',
    name: 'Rope Pushdown',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Attach a rope to the high cable pulley.',
      'Grip both rope ends with your elbows close to your sides.',
      'Push the rope downward while separating the ends at the bottom.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows fixed beside your body.',
      'Fully extend your arms.',
      'Separate the rope at the bottom.',
      'Control the return movement.'
    ]
  },
  'Straight Bar Pushdown': {
    id: 'straight_bar_pushdown',
    name: 'Straight Bar Pushdown',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Attach a straight bar to the high cable pulley.',
      'Grip the bar with your hands shoulder-width apart.',
      'Push the bar downward until your arms are fully extended.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows tucked.',
      'Avoid leaning over the bar.',
      'Move through a full range of motion.',
      'Lower the weight under control.'
    ]
  },
  'EZ Bar Skull Crusher': {
    id: 'ez_bar_skull_crusher',
    name: 'EZ Bar Skull Crusher',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'EZ Bar',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Lie on a flat bench holding an EZ bar above your chest.',
      'Keep your upper arms nearly vertical.',
      'Bend your elbows to lower the bar toward your forehead.',
      'Extend your arms back to the starting position.'
    ],
    tips: [
      'Keep your elbows close together.',
      'Lower the bar slowly.',
      'Avoid moving your upper arms.',
      'Use controlled repetitions.'
    ]
  },
  'Wrist Push-up (Knees)': {
    id: 'wrist_push_up_knees',
    name: 'Wrist Push-up (Knees)',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Wrists'],
    howToPerform: [
      'Begin on your hands and knees.',
      'Rotate your hands so your fingers point toward your knees if comfortable.',
      'Slowly shift your body weight forward until you feel your wrists working.',
      'Push back to the starting position.'
    ],
    tips: [
      'Start with a small range of motion.',
      'Keep the movement slow.',
      'Stop if you feel wrist pain.',
      'Build tolerance gradually.'
    ]
  },
  'Reverse Wrist Push-up': {
    id: 'reverse_wrist_push_up',
    name: 'Reverse Wrist Push-up',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Wrists'],
    howToPerform: [
      'Kneel with the backs of your hands on the floor.',
      'Keep your elbows slightly bent.',
      'Lift the backs of your hands slightly by extending your wrists.',
      'Lower them slowly back to the floor.'
    ],
    tips: [
      'Use a gentle range of motion.',
      'Avoid forcing the movement.',
      'Perform slow repetitions.',
      'Stop if discomfort becomes painful.'
    ]
  },
  'Negative Grip Reps': {
    id: 'negative_grip_reps',
    name: 'Negative Grip Reps',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Grip Strengthener',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Hold a grip strengthener fully squeezed.',
      'Slowly release the grip over several seconds.',
      'Reset the grip quickly.',
      'Repeat using controlled negative repetitions.'
    ],
    tips: [
      'Focus on the lowering phase.',
      'Move as slowly as possible.',
      'Train both hands equally.',
      'Rest if your grip begins to fail.'
    ]
  },
  'Reverse Curl': {
    id: 'reverse_curl',
    name: 'Reverse Curl',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Barbell or Adjustable Dumbbells',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Biceps'],
    howToPerform: [
      'Hold a barbell or dumbbells with an overhand grip.',
      'Keep your elbows close to your sides.',
      'Curl the weight toward your shoulders.',
      'Lower it slowly to the starting position.'
    ],
    tips: [
      'Keep your wrists straight.',
      'Avoid swinging your torso.',
      'Lower the weight under control.',
      'Use a comfortable weight.'
    ]
  },
  'Farmer\'s Carry': {
    id: 'farmers_carry',
    name: "Farmer's Carry",
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Grip',
    primaryMuscles: ['Grip'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Hold a heavy dumbbell or kettlebell in each hand.',
      'Stand tall with your shoulders pulled back.',
      'Walk forward using slow, controlled steps.',
      'Continue for the desired distance or time before setting the weights down.'
    ],
    tips: [
      'Keep your core engaged.',
      'Avoid leaning to either side.',
      'Take controlled steps.',
      'Grip the weights firmly throughout.'
    ]
  },
  'Band Finger Extension': {
    id: 'band_finger_extension',
    name: 'Band Finger Extension',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Finger Extensors',
    primaryMuscles: ['Finger Extensors'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Place a resistance band around your fingertips.',
      'Begin with your fingers close together.',
      'Spread your fingers apart against the band\'s resistance.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Move through a full comfortable range.',
      'Keep your wrist neutral.',
      'Perform slow repetitions.',
      'Train both hands evenly.'
    ]
  },
  'Cable Wrist Curl': {
    id: 'cable_wrist_curl',
    name: 'Cable Wrist Curl',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Attach a straight handle to the low cable pulley.',
      'Rest your forearms on a bench or your thighs with your palms facing upward.',
      'Curl your wrists upward.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Move only at the wrists.',
      'Keep your forearms supported.',
      'Maintain constant cable tension.',
      'Perform controlled repetitions.'
    ]
  },
  'Cable Reverse Curl': {
    id: 'cable_reverse_curl',
    name: 'Cable Reverse Curl',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Biceps'],
    howToPerform: [
      'Attach a straight bar to the low cable pulley.',
      'Grip the bar with an overhand grip.',
      'Curl the bar toward your shoulders.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Maintain constant cable tension.',
      'Avoid swinging your torso.',
      'Lower the bar under control.'
    ]
  },
  'Single Arm Self Resistance Curl': {
    id: 'single_arm_self_resistance_curl',
    name: 'Single Arm Self Resistance Curl',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Stand upright with one arm extended.',
      'Grip your working wrist with the opposite hand to provide resistance.',
      'Curl your arm upward while applying equal resistance with the opposite hand.',
      'Lower slowly while continuing to resist the movement.'
    ],
    tips: [
      'Maintain constant resistance throughout the movement.',
      'Move slowly and under control.',
      'Avoid shrugging your shoulders.',
      'Perform equal repetitions on both arms.'
    ]
  },
  'Archer Chin-up': {
    id: 'archer_chin_up',
    name: 'Archer Chin-up',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Grip the pull-up bar with a wide underhand grip.',
      'Pull yourself toward one hand while keeping the opposite arm nearly straight.',
      'Bring your chin close to the working hand.',
      'Lower yourself slowly before repeating on the opposite side.'
    ],
    tips: [
      'Keep your movement controlled.',
      'Avoid swinging your body.',
      'Engage your core throughout.',
      'Train both sides equally.'
    ]
  },
  'Zottman Curl': {
    id: 'zottman_curl',
    name: 'Zottman Curl',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Hold a dumbbell in each hand with your palms facing forward.',
      'Curl the dumbbells toward your shoulders.',
      'Rotate your palms downward at the top.',
      'Lower the weights slowly before rotating back to the starting position.'
    ],
    tips: [
      'Rotate your wrists smoothly.',
      'Control the lowering phase.',
      'Keep your elbows close to your body.',
      'Avoid swinging the weights.'
    ]
  },
  'Drag Curl': {
    id: 'drag_curl',
    name: 'Drag Curl',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Barbell or Adjustable Dumbbells',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Hold a barbell or dumbbells against the front of your thighs.',
      'Pull your elbows backward while sliding the weight close to your body.',
      'Curl until the weight reaches your upper chest.',
      'Lower slowly along the same path.'
    ],
    tips: [
      'Keep the weight close to your body.',
      'Pull with your elbows rather than your wrists.',
      'Avoid leaning backward.',
      'Lower the weight under control.'
    ]
  },
  'High Band Curl': {
    id: 'high_band_curl',
    name: 'High Band Curl',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Anchor a resistance band above shoulder height.',
      'Hold the handles with your palms facing upward.',
      'Curl your hands toward your forehead while keeping your elbows high.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows stationary.',
      'Maintain constant band tension.',
      'Perform slow repetitions.',
      'Squeeze your biceps at the top.'
    ]
  },
  'Bayesian Cable Curl': {
    id: 'bayesian_cable_curl',
    name: 'Bayesian Cable Curl',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Attach a single handle to a low cable pulley.',
      'Face away from the machine while holding the handle behind your body.',
      'Curl the handle toward your shoulder while keeping your elbow behind your torso.',
      'Lower slowly until your arm is fully extended.'
    ],
    tips: [
      'Keep your elbow behind your body.',
      'Move through a full range of motion.',
      'Maintain constant cable tension.',
      'Perform equal repetitions on both arms.'
    ]
  },
  'Spider Curl': {
    id: 'spider_curl',
    name: 'Spider Curl',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Incline Bench & EZ Bar',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Lie face down on an incline bench with your arms hanging straight down.',
      'Hold an EZ bar or dumbbells with an underhand grip.',
      'Curl the weight toward your shoulders.',
      'Lower slowly until your arms are fully extended.'
    ],
    tips: [
      'Keep your upper arms stationary.',
      'Avoid swinging the weight.',
      'Lower under control.',
      'Squeeze your biceps at the top.'
    ]
  },
  'Incline EZ Bar Curl': {
    id: 'incline_ez_bar_curl',
    name: 'Incline EZ Bar Curl',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'EZ Bar',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Sit on an incline bench while holding an EZ bar.',
      'Allow your arms to hang fully extended.',
      'Curl the bar toward your shoulders.',
      'Lower slowly until your arms are fully straight.'
    ],
    tips: [
      'Keep your elbows behind your body.',
      'Avoid using momentum.',
      'Move through the full range.',
      'Lower the bar under control.'
    ]
  },
  'Tiger Bend Push-up': {
    id: 'tiger_bend_push_up',
    name: 'Tiger Bend Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Begin in a forearm plank position with your elbows beneath your shoulders.',
      'Press through your forearms to straighten your arms into a high plank.',
      'Lower yourself back onto your forearms with control.',
      'Repeat while maintaining a straight body position.'
    ],
    tips: [
      'Keep your core engaged throughout.',
      'Avoid letting your hips sag.',
      'Press evenly through both arms.',
      'Move slowly and under control.'
    ]
  },
  'Tate Press': {
    id: 'tate_press',
    name: 'Tate Press',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Chest'],
    howToPerform: [
      'Lie on a flat bench holding a dumbbell in each hand above your chest.',
      'Point your elbows outward while keeping the dumbbells close together.',
      'Lower the dumbbells toward the center of your chest.',
      'Press them back to the starting position.'
    ],
    tips: [
      'Keep the movement controlled.',
      'Focus on extending your elbows.',
      'Avoid flaring your shoulders excessively.',
      'Use moderate weight to maintain proper form.'
    ]
  },
  'Band Kickback (Triceps)': {
    id: 'band_kickback_triceps',
    name: 'Band Kickback (Triceps)',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Anchor a resistance band beneath your foot or to a low anchor.',
      'Hinge forward slightly while keeping your upper arm close to your body.',
      'Extend your forearm backward until your arm is fully straight.',
      'Return slowly before switching sides.'
    ],
    tips: [
      'Keep your upper arm stationary.',
      'Fully extend your elbow at the top.',
      'Maintain constant band tension.',
      'Perform equal repetitions on both arms.'
    ]
  },
  'Close Grip Bench Press': {
    id: 'close_grip_bench_press',
    name: 'Close Grip Bench Press',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Chest'],
    howToPerform: [
      'Lie on a flat bench and grip the bar slightly narrower than shoulder-width.',
      'Unrack the bar and position it above your chest.',
      'Lower the bar slowly toward your lower chest.',
      'Press the bar back to the starting position.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Maintain a neutral wrist position.',
      'Avoid bouncing the bar.',
      'Control every repetition.'
    ]
  },
  'Weighted Dips': {
    id: 'weighted_dips',
    name: 'Weighted Dips',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Dip Station & Weight Belt',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Chest'],
    howToPerform: [
      'Attach a weight belt or hold a dumbbell securely between your legs.',
      'Grip the parallel bars and support your body with straight arms.',
      'Lower yourself until your elbows reach about 90 degrees.',
      'Press back to the starting position.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Descend under control.',
      'Avoid excessive forward lean.',
      'Use a manageable amount of added weight.'
    ]
  },
  'Cable Overhead Extension': {
    id: 'cable_overhead_extension',
    name: 'Cable Overhead Extension',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Attach a rope handle to a high cable pulley.',
      'Face away from the machine and hold the rope overhead.',
      'Extend your elbows until your arms are fully straight.',
      'Lower the rope slowly behind your head.'
    ],
    tips: [
      'Keep your elbows pointing forward.',
      'Avoid arching your lower back.',
      'Maintain constant cable tension.',
      'Control the lowering phase.'
    ]
  },
  'Fingertip Push-up': {
    id: 'fingertip_push_up',
    name: 'Fingertip Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Begin in a standard push-up position supported only by your fingertips.',
      'Keep your body in a straight line from head to heels.',
      'Lower your chest toward the floor with control.',
      'Push back to the starting position using your fingertips.'
    ],
    tips: [
      'Attempt only after building sufficient finger strength.',
      'Spread your fingers evenly.',
      'Keep your core engaged.',
      'Stop immediately if you feel finger pain.'
    ]
  },
  'One-Hand Fingertip Plank': {
    id: 'one_hand_fingertip_plank',
    name: 'One-Hand Fingertip Plank',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Begin in a high plank supported on one hand using only your fingertips.',
      'Extend your opposite arm comfortably for balance.',
      'Keep your body in a straight line while holding the position.',
      'Repeat on the opposite side.'
    ],
    tips: [
      'Build up to this exercise gradually.',
      'Keep your core tight.',
      'Avoid rotating your hips.',
      'Perform equal holds on both sides.'
    ]
  },
  'Single Finger Grip': {
    id: 'single_finger_grip',
    name: 'Single Finger Grip',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Grip Strengthener',
    category: 'Strength',
    target: 'Grip',
    primaryMuscles: ['Grip'],
    secondaryMuscles: ['Fingers'],
    howToPerform: [
      'Hold a grip strengthener or pinch object using only one finger and your thumb.',
      'Apply firm pressure to maintain your grip.',
      'Hold for the desired duration.',
      'Repeat with each finger individually.'
    ],
    tips: [
      'Begin with short hold times.',
      'Train every finger equally.',
      'Keep your wrist neutral.',
      'Stop if you feel finger pain.'
    ]
  },
  'Overcrush Hold': {
    id: 'overcrush_hold',
    name: 'Overcrush Hold',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Grip Strengthener',
    category: 'Strength',
    target: 'Grip Strength',
    primaryMuscles: ['Grip Strength'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Hold a grip strengthener in one hand.',
      'Squeeze it as hard as possible until fully closed.',
      'Continue applying maximum pressure for the desired time.',
      'Release slowly before repeating.'
    ],
    tips: [
      'Focus on maximum squeezing force.',
      'Keep your wrist straight.',
      'Breathe normally during the hold.',
      'Perform equal holds on both hands.'
    ]
  },
  'Plate Pinch Hold': {
    id: 'plate_pinch_hold',
    name: 'Plate Pinch Hold',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Weight Plates',
    category: 'Strength',
    target: 'Grip Strength',
    primaryMuscles: ['Grip Strength'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Pinch one or two weight plates together using only your fingers and thumb.',
      'Lift the plates off the floor.',
      'Hold them for the desired duration.',
      'Lower them carefully before repeating.'
    ],
    tips: [
      'Keep the plates secure throughout the hold.',
      'Maintain a neutral wrist.',
      'Increase hold time gradually.',
      'Train both hands equally.'
    ]
  },
  'Wrist Roller': {
    id: 'wrist_roller',
    name: 'Wrist Roller',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Wrist Roller',
    category: 'Strength',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Grip'],
    howToPerform: [
      'Hold a wrist roller with both hands at shoulder height.',
      'Roll the rope upward by rotating your wrists until the weight reaches the top.',
      'Reverse the movement to lower the weight slowly.',
      'Continue alternating directions.'
    ],
    tips: [
      'Move only at the wrists.',
      'Keep your arms level.',
      'Control both the lifting and lowering phases.',
      'Alternate rolling directions.'
    ]
  },
  'Bottom-Up Dumbbell Hold': {
    id: 'bottom_up_dumbbell_hold',
    name: 'Bottom-Up Dumbbell Hold',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Grip',
    primaryMuscles: ['Grip'],
    secondaryMuscles: ['Wrist Stability'],
    howToPerform: [
      'Hold a dumbbell vertically with the weighted end pointing upward.',
      'Grip the handle firmly to balance the dumbbell.',
      'Keep your wrist straight while holding the position.',
      'Lower carefully before switching hands.'
    ],
    tips: [
      'Start with a light dumbbell.',
      'Keep your wrist stable.',
      'Avoid sudden movements.',
      'Perform equal holds on both hands.'
    ]
  },
  'Band Grip Hold': {
    id: 'band_grip_hold',
    name: 'Band Grip Hold',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Grip Strength',
    primaryMuscles: ['Grip Strength'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Hold both ends of a resistance band.',
      'Stretch the band slightly to create tension.',
      'Squeeze the band tightly while maintaining the tension.',
      'Hold for the desired duration before relaxing.'
    ],
    tips: [
      'Maintain constant tension.',
      'Keep your wrists neutral.',
      'Breathe normally throughout the hold.',
      'Perform equal holds with both hands.'
    ]
  },
  'Fat Grip Barbell Hold': {
    id: 'fat_grip_barbell_hold',
    name: 'Fat Grip Barbell Hold',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Grip Strength',
    primaryMuscles: ['Grip Strength'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Grip a barbell fitted with thick grips or a thick bar.',
      'Lift the bar to a standing position.',
      'Hold the bar securely without letting it roll.',
      'Lower it safely after the desired hold time.'
    ],
    tips: [
      'Keep your shoulders relaxed.',
      'Stand tall throughout the hold.',
      'Grip the bar as firmly as possible.',
      'Use a manageable weight.'
    ]
  },
  'Towel Dead Hang': {
    id: 'towel_dead_hang',
    name: 'Towel Dead Hang',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Pull-up Bar & Towels',
    category: 'Strength',
    target: 'Grip',
    primaryMuscles: ['Grip'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Loop two towels securely over a pull-up bar.',
      'Grip one towel in each hand.',
      'Lift your feet and hang with your arms fully extended.',
      'Hold the position for the desired duration before lowering safely.'
    ],
    tips: [
      'Keep your shoulders active.',
      'Avoid swinging.',
      'Release carefully when fatigued.',
      'Build your hold time gradually.'
    ]
  },
  'Thick Bar Farmer Carry': {
    id: 'thick_bar_farmer_carry',
    name: 'Thick Bar Farmer Carry',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: "Thick Handle Farmer's Carry Implements",
    category: 'Strength',
    target: 'Grip',
    primaryMuscles: ['Grip'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Hold a thick-handled dumbbell or farmer\'s carry implements in each hand.',
      'Stand tall with your shoulders pulled back.',
      'Walk forward using slow, controlled steps.',
      'Continue for the desired distance before setting the weights down.'
    ],
    tips: [
      'Keep your core engaged.',
      'Maintain an upright posture.',
      'Grip the handles firmly throughout.',
      'Take controlled, even steps.'
    ]
  },

  // ==========================================
  // CORE EXERCISES
  // ==========================================
  'Forearm Plank': {
    id: 'forearm_plank',
    name: 'Forearm Plank',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Lower Back'],
    howToPerform: [
      'Lie face down and place your forearms on the floor with your elbows directly beneath your shoulders.',
      'Lift your body while keeping a straight line from your head to your heels.',
      'Tighten your core and glutes.',
      'Hold the position while breathing steadily.'
    ],
    tips: [
      'Keep your hips level.',
      'Avoid arching your lower back.',
      'Keep your neck neutral.',
      'Breathe normally throughout the hold.'
    ]
  },
  'High Plank': {
    id: 'high_plank',
    name: 'High Plank',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Begin in a push-up position with your hands beneath your shoulders.',
      'Extend your legs behind you and keep your body straight.',
      'Tighten your core and glutes.',
      'Hold the position while maintaining steady breathing.'
    ],
    tips: [
      'Keep your hips level.',
      'Push the floor away with your hands.',
      'Avoid locking your elbows.',
      'Maintain a neutral neck position.'
    ]
  },
  'Knee Plank': {
    id: 'knee_plank',
    name: 'Knee Plank',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Lower Back'],
    howToPerform: [
      'Begin on your forearms and knees.',
      'Keep your body in a straight line from your head to your knees.',
      'Tighten your abdominal muscles.',
      'Hold the position with controlled breathing.'
    ],
    tips: [
      'Avoid letting your hips sag.',
      'Keep your shoulders above your elbows.',
      'Breathe steadily.',
      'Focus on maintaining proper posture.'
    ]
  },
  'Crunch': {
    id: 'crunch',
    name: 'Crunch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Upper Abs',
    primaryMuscles: ['Upper Abs'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Lie on your back with your knees bent and your feet flat on the floor.',
      'Place your hands lightly behind your head or across your chest.',
      'Lift your shoulders off the floor by contracting your abdominal muscles.',
      'Lower slowly back to the starting position.'
    ],
    tips: [
      'Lift using your abs, not your neck.',
      'Keep the movement short and controlled.',
      'Exhale as you lift.',
      'Lower yourself slowly.'
    ]
  },
  'Heel Touch': {
    id: 'heel_touch',
    name: 'Heel Touch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Obliques',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Lie on your back with your knees bent and feet flat on the floor.',
      'Lift your shoulders slightly off the floor.',
      'Reach one hand toward the same-side heel.',
      'Alternate sides with controlled repetitions.'
    ],
    tips: [
      'Keep your lower back on the floor.',
      'Move side to side without twisting excessively.',
      'Keep your neck relaxed.',
      'Perform smooth repetitions.'
    ]
  },
  'Bent Knee Leg Raise': {
    id: 'bent_knee_leg_raise',
    name: 'Bent Knee Leg Raise',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Lie on your back with your knees bent.',
      'Tighten your core and lift your knees toward your chest.',
      'Pause briefly at the top.',
      'Lower your legs slowly without letting your feet drop.'
    ],
    tips: [
      'Keep your lower back against the floor.',
      'Move slowly throughout the exercise.',
      'Avoid swinging your legs.',
      'Exhale as you lift.'
    ]
  },
  'Flutter Kick': {
    id: 'flutter_kick',
    name: 'Flutter Kick',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Lie flat on your back with your legs extended.',
      'Lift both legs slightly off the floor.',
      'Alternate small up-and-down kicking motions.',
      'Continue while keeping your core engaged.'
    ],
    tips: [
      'Keep your lower back pressed into the floor.',
      'Make small, controlled kicks.',
      'Avoid holding your breath.',
      'Stop if your lower back begins to arch.'
    ]
  },
  'Dead Bug': {
    id: 'dead_bug',
    name: 'Dead Bug',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Deep Core',
    primaryMuscles: ['Deep Core'],
    secondaryMuscles: ['Lower Back'],
    howToPerform: [
      'Lie on your back with your arms extended toward the ceiling and your knees bent at 90 degrees.',
      'Tighten your core.',
      'Slowly lower one arm and the opposite leg toward the floor.',
      'Return to the starting position and alternate sides.'
    ],
    tips: [
      'Keep your lower back pressed into the floor.',
      'Move slowly and with control.',
      'Avoid arching your back.',
      'Exhale during each extension.'
    ]
  },
  'Kneeling Ab Rollout': {
    id: 'kneeling_ab_rollout',
    name: 'Kneeling Ab Rollout',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Ab Wheel',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Kneel on the floor while holding the handles of an ab wheel.',
      'Slowly roll the wheel forward while keeping your core tight.',
      'Extend only as far as you can maintain a neutral spine.',
      'Roll back to the starting position using your core.'
    ],
    tips: [
      'Keep your hips aligned with your shoulders.',
      'Avoid arching your lower back.',
      'Move slowly throughout the rollout.',
      'Start with a shorter range and increase gradually.'
    ]
  },
  'Partial Rollout': {
    id: 'partial_rollout',
    name: 'Partial Rollout',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Ab Wheel',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Kneel on the floor while holding the handles of an ab wheel.',
      'Roll the wheel forward only part of the way while keeping your core tight.',
      'Pause briefly at your furthest comfortable position.',
      'Roll back to the starting position under control.'
    ],
    tips: [
      'Keep your back neutral.',
      'Start with a short range of motion.',
      'Avoid letting your hips sag.',
      'Control both the rollout and return.'
    ]
  },
  'Band Wood Chop': {
    id: 'band_wood_chop',
    name: 'Band Wood Chop',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Obliques',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Anchor a resistance band above shoulder height.',
      'Hold the band with both hands while standing sideways to the anchor.',
      'Pull the band diagonally across your body toward your opposite hip.',
      'Return slowly before repeating on the other side.'
    ],
    tips: [
      'Rotate through your torso.',
      'Keep your arms mostly straight.',
      'Control the return movement.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Hanging Knee Raise': {
    id: 'hanging_knee_raise',
    name: 'Hanging Knee Raise',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Hang from a pull-up bar with your arms fully extended.',
      'Tighten your core.',
      'Lift your knees toward your chest.',
      'Lower your legs slowly to the starting position.'
    ],
    tips: [
      'Avoid swinging your body.',
      'Lift using your abdominal muscles.',
      'Lower your legs under control.',
      'Keep your shoulders active throughout.'
    ]
  },
  'Machine Crunch': {
    id: 'machine_crunch',
    name: 'Machine Crunch',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Ab Crunch Machine',
    category: 'Strength',
    target: 'Upper Abs',
    primaryMuscles: ['Upper Abs'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Sit on the crunch machine and adjust the pads.',
      'Grip the handles and brace your core.',
      'Crunch forward by contracting your abdominal muscles.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Focus on squeezing your abs.',
      'Avoid pulling with your arms.',
      'Perform slow repetitions.',
      'Return under full control.'
    ]
  },
  'Roman Chair Knee Raise': {
    id: 'roman_chair_knee_raise',
    name: 'Roman Chair Knee Raise',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Roman Chair',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Support yourself on the Roman chair with your forearms on the pads.',
      'Keep your upper body steady.',
      'Raise your knees toward your chest.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Avoid swinging your legs.',
      'Lift with your core.',
      'Keep your shoulders relaxed.',
      'Lower your legs slowly.'
    ]
  },
  'Side Plank': {
    id: 'side_plank',
    name: 'Side Plank',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Obliques',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Lie on one side with your forearm directly beneath your shoulder.',
      'Lift your hips until your body forms a straight line.',
      'Hold the position while keeping your core engaged.',
      'Repeat on the opposite side.'
    ],
    tips: [
      'Keep your hips elevated.',
      'Avoid rotating your torso.',
      'Keep your neck neutral.',
      'Breathe steadily throughout the hold.'
    ]
  },
  'Plank Reach': {
    id: 'plank_reach',
    name: 'Plank Reach',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Begin in a high plank position with your hands beneath your shoulders.',
      'Slowly lift one arm and reach it straight in front of you.',
      'Pause briefly while keeping your hips level.',
      'Return your hand to the floor and repeat with the opposite arm.'
    ],
    tips: [
      'Keep your core tight throughout.',
      'Avoid rotating your hips.',
      'Reach slowly and under control.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Toe Touch': {
    id: 'toe_touch',
    name: 'Toe Touch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Upper Abs',
    primaryMuscles: ['Upper Abs'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Lie on your back with your legs extended straight upward.',
      'Reach both hands toward your toes by lifting your shoulders off the floor.',
      'Pause briefly at the top.',
      'Lower yourself slowly to the starting position.'
    ],
    tips: [
      'Lift using your abdominal muscles.',
      'Keep your lower back on the floor.',
      'Avoid pulling on your neck.',
      'Perform controlled repetitions.'
    ]
  },
  'Reverse Crunch': {
    id: 'reverse_crunch',
    name: 'Reverse Crunch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Lie on your back with your knees bent.',
      'Lift your knees toward your chest while curling your hips off the floor.',
      'Pause briefly at the top.',
      'Lower your hips and legs slowly.'
    ],
    tips: [
      'Move slowly without swinging.',
      'Keep your lower back controlled.',
      'Exhale as you lift.',
      'Focus on curling your pelvis upward.'
    ]
  },
  'Bicycle Crunch': {
    id: 'bicycle_crunch',
    name: 'Bicycle Crunch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Obliques',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Lie on your back with your hands behind your head.',
      'Lift your shoulders and legs off the floor.',
      'Bring one knee toward your chest while rotating the opposite elbow toward it.',
      'Alternate sides with controlled movement.'
    ],
    tips: [
      'Rotate through your torso.',
      'Avoid pulling on your neck.',
      'Keep your movement slow.',
      'Fully extend the opposite leg.'
    ]
  },
  'Cross Crunch': {
    id: 'cross_crunch',
    name: 'Cross Crunch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Obliques',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Upper Abs'],
    howToPerform: [
      'Lie on your back with your knees bent.',
      'Place one hand behind your head.',
      'Lift your shoulder while rotating your torso toward the opposite knee.',
      'Lower slowly and repeat before switching sides.'
    ],
    tips: [
      'Rotate your shoulders rather than your neck.',
      'Keep your lower back on the floor.',
      'Move with control.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Scissor Kick': {
    id: 'scissor_kick',
    name: 'Scissor Kick',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Lie on your back with your legs extended.',
      'Lift both legs slightly off the floor.',
      'Cross one leg over the other in a controlled scissor motion.',
      'Continue alternating while keeping your core engaged.'
    ],
    tips: [
      'Keep your lower back pressed into the floor.',
      'Use slow, controlled movements.',
      'Keep your legs mostly straight.',
      'Avoid holding your breath.'
    ]
  },
  'Leg Raise': {
    id: 'leg_raise',
    name: 'Leg Raise',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Lie flat on your back with your legs extended.',
      'Tighten your core and raise both legs toward the ceiling.',
      'Pause briefly when your legs are nearly vertical.',
      'Lower them slowly without touching the floor.'
    ],
    tips: [
      'Keep your lower back pressed into the floor.',
      'Avoid swinging your legs.',
      'Lower with control.',
      'Reduce the range if your back arches.'
    ]
  },
  'Hollow Hold': {
    id: 'hollow_hold',
    name: 'Hollow Hold',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Deep Core',
    primaryMuscles: ['Deep Core'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Lie on your back with your arms extended overhead.',
      'Lift your shoulders and legs slightly off the floor.',
      'Press your lower back firmly into the floor.',
      'Hold the position while maintaining steady breathing.'
    ],
    tips: [
      'Keep your lower back in contact with the floor.',
      'Hold a shorter position if needed.',
      'Breathe normally.',
      'Maintain full-body tension.'
    ]
  },
  'Full Rollout': {
    id: 'full_rollout',
    name: 'Full Rollout',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Ab Wheel',
    category: 'Strength',
    target: 'Full Core',
    primaryMuscles: ['Full Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Kneel while holding the handles of an ab wheel.',
      'Roll the wheel forward until your body is nearly fully extended.',
      'Keep your core tight and your back neutral.',
      'Pull yourself back to the starting position using your core.'
    ],
    tips: [
      'Move only as far as you can maintain proper form.',
      'Avoid arching your lower back.',
      'Roll back slowly.',
      'Engage your core throughout.'
    ]
  },
  'Pallof Press': {
    id: 'pallof_press',
    name: 'Pallof Press',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Deep Core',
    primaryMuscles: ['Deep Core'],
    secondaryMuscles: ['Obliques'],
    howToPerform: [
      'Attach a resistance band at chest height.',
      'Stand sideways to the anchor and hold the band close to your chest.',
      'Press your hands straight forward until your arms are fully extended.',
      'Return slowly without allowing your torso to rotate.'
    ],
    tips: [
      'Keep your torso facing forward.',
      'Resist rotational movement.',
      'Keep your core engaged.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Pallof Hold': {
    id: 'pallof_hold',
    name: 'Pallof Hold',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Deep Core',
    primaryMuscles: ['Deep Core'],
    secondaryMuscles: ['Obliques'],
    howToPerform: [
      'Attach a resistance band at chest height.',
      'Hold the band against your chest while standing sideways to the anchor.',
      'Press your arms straight forward.',
      'Hold the position while resisting the band\'s pull before returning slowly.'
    ],
    tips: [
      'Keep your hips square.',
      'Do not let your torso rotate.',
      'Breathe normally during the hold.',
      'Perform equal holds on both sides.'
    ]
  },
  'Standing Band Crunch': {
    id: 'standing_band_crunch',
    name: 'Standing Band Crunch',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Upper Abs',
    primaryMuscles: ['Upper Abs'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Anchor a resistance band overhead.',
      'Hold the band beside your head with both hands.',
      'Crunch downward by contracting your abdominal muscles.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Move through your torso rather than your hips.',
      'Keep tension on the band.',
      'Squeeze your abs at the bottom.',
      'Return under control.'
    ]
  },
  'Hanging Leg Raise': {
    id: 'hanging_leg_raise',
    name: 'Hanging Leg Raise',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Hang from a pull-up bar with your arms fully extended.',
      'Keep your legs straight.',
      'Raise your legs until they are parallel to the floor or higher.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Avoid swinging.',
      'Keep your core tight.',
      'Lower your legs slowly.',
      'Maintain active shoulders throughout.'
    ]
  },
  'Cable Crunch': {
    id: 'cable_crunch',
    name: 'Cable Crunch',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Upper Abs',
    primaryMuscles: ['Upper Abs'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Attach a rope to the high cable pulley.',
      'Kneel facing the machine while holding the rope beside your head.',
      'Crunch downward by contracting your abdominal muscles.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your hips relatively still.',
      'Focus on squeezing your abs.',
      'Avoid pulling with your arms.',
      'Control the return movement.'
    ]
  },
  'Cable Wood Chop': {
    id: 'cable_wood_chop',
    name: 'Cable Wood Chop',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Obliques',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Attach a handle to a high cable pulley.',
      'Stand sideways to the machine and grip the handle with both hands.',
      'Pull the cable diagonally across your body toward your opposite hip.',
      'Return slowly before repeating on the other side.'
    ],
    tips: [
      'Rotate through your torso.',
      'Keep your arms mostly straight.',
      'Control the return phase.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Cable Pallof Press': {
    id: 'cable_pallof_press',
    name: 'Cable Pallof Press',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Deep Core',
    primaryMuscles: ['Deep Core'],
    secondaryMuscles: ['Obliques'],
    howToPerform: [
      'Set a cable handle at chest height.',
      'Stand sideways to the machine and hold the handle close to your chest.',
      'Press the handle straight forward.',
      'Return slowly while resisting the cable\'s pull.'
    ],
    tips: [
      'Keep your torso stable.',
      'Resist rotation throughout the movement.',
      'Perform slow repetitions.',
      'Train both sides evenly.'
    ]
  },
  'Decline Sit-up': {
    id: 'decline_sit_up',
    name: 'Decline Sit-up',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Decline Bench',
    category: 'Strength',
    target: 'Upper Abs',
    primaryMuscles: ['Upper Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Secure your feet beneath the pads of a decline bench.',
      'Lie back with your hands across your chest or beside your head.',
      'Sit up by contracting your abdominal muscles.',
      'Lower yourself slowly to the starting position.'
    ],
    tips: [
      'Avoid pulling on your neck.',
      'Control both the lifting and lowering phases.',
      'Exhale as you sit up.',
      'Maintain steady movement throughout.'
    ]
  },
  'Walking Plank': {
    id: 'walking_plank',
    name: 'Walking Plank',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Begin in a forearm plank position.',
      'Press one hand into the floor, then the other, until you reach a high plank.',
      'Lower one forearm at a time to return to the starting position.',
      'Alternate the leading arm each repetition.'
    ],
    tips: [
      'Keep your hips level.',
      'Move slowly and with control.',
      'Engage your core throughout.',
      'Alternate which arm leads each repetition.'
    ]
  },
  'Plank Jack': {
    id: 'plank_jack',
    name: 'Plank Jack',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Cardio',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Cardio'],
    howToPerform: [
      'Begin in a high plank position.',
      'Jump both feet outward while keeping your upper body stable.',
      'Jump your feet back together.',
      'Continue with controlled, rhythmic repetitions.'
    ],
    tips: [
      'Keep your hips level.',
      'Avoid bouncing your upper body.',
      'Engage your core throughout.',
      'Land softly on your feet.'
    ]
  },
  'RKC Plank': {
    id: 'rkc_plank',
    name: 'RKC Plank',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Deep Core',
    primaryMuscles: ['Deep Core'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Begin in a forearm plank with your elbows beneath your shoulders.',
      'Tighten your core, glutes, and thighs as hard as possible.',
      'Pull your elbows toward your toes without actually moving them.',
      'Hold the position while maintaining full-body tension.'
    ],
    tips: [
      'Focus on maximum muscle tension.',
      'Keep your body perfectly straight.',
      'Breathe with short, controlled breaths.',
      'Hold for quality rather than duration.'
    ]
  },
  'V-Up': {
    id: 'v_up',
    name: 'V-Up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Full Core',
    primaryMuscles: ['Full Core'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Lie flat with your arms extended overhead and your legs straight.',
      'Simultaneously lift your arms and legs toward each other.',
      'Reach for your toes at the top.',
      'Lower slowly to the starting position.'
    ],
    tips: [
      'Keep your legs straight.',
      'Avoid using momentum.',
      'Lower under full control.',
      'Exhale as you lift.'
    ]
  },
  'Jackknife Sit-up': {
    id: 'jackknife_sit_up',
    name: 'Jackknife Sit-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Full Core',
    primaryMuscles: ['Full Core'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Lie flat with your arms extended overhead.',
      'Lift one leg and the opposite arm simultaneously toward each other.',
      'Return slowly to the starting position.',
      'Alternate sides with each repetition.'
    ],
    tips: [
      'Keep your movements controlled.',
      'Avoid jerking your body.',
      'Maintain a steady rhythm.',
      'Keep your core engaged throughout.'
    ]
  },
  'Hollow Body Crunch': {
    id: 'hollow_body_crunch',
    name: 'Hollow Body Crunch',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Deep Core',
    primaryMuscles: ['Deep Core'],
    secondaryMuscles: ['Upper Abs'],
    howToPerform: [
      'Begin in a hollow body hold position.',
      'Lift your shoulders slightly higher by contracting your abdominal muscles.',
      'Hold briefly at the top.',
      'Return slowly to the hollow hold position.'
    ],
    tips: [
      'Keep your lower back pressed into the floor.',
      'Avoid relaxing between repetitions.',
      'Move through a small controlled range.',
      'Maintain full-body tension.'
    ]
  },
  'Double Leg Raise': {
    id: 'double_leg_raise',
    name: 'Double Leg Raise',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Lie flat on your back with your legs together.',
      'Tighten your core and raise both legs until they are nearly vertical.',
      'Pause briefly at the top.',
      'Lower your legs slowly without touching the floor.'
    ],
    tips: [
      'Keep your lower back pressed into the floor.',
      'Avoid swinging your legs.',
      'Lower as slowly as possible.',
      'Reduce the range if your back begins to arch.'
    ]
  },
  'Dragon Flag Progression': {
    id: 'dragon_flag_progression',
    name: 'Dragon Flag Progression',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'Bench',
    category: 'Strength',
    target: 'Full Core',
    primaryMuscles: ['Full Core'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Lie on a bench while gripping it securely behind your head.',
      'Lift your hips and legs together while keeping your body as straight as possible.',
      'Lower yourself slowly through a controlled range of motion.',
      'Return to the starting position and repeat.'
    ],
    tips: [
      'Start with shorter ranges before progressing.',
      'Keep your body rigid throughout.',
      'Avoid bending at the hips.',
      'Control the lowering phase.'
    ]
  },
  'Dragon Flag': {
    id: 'dragon_flag',
    name: 'Dragon Flag',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'Bench',
    category: 'Strength',
    target: 'Full Core',
    primaryMuscles: ['Full Core'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Grip a sturdy bench firmly behind your head.',
      'Lift your entire body until only your upper back remains on the bench.',
      'Keep your body perfectly straight as you lower yourself slowly.',
      'Stop just above the bench before repeating.'
    ],
    tips: [
      'Attempt only after mastering the progression.',
      'Keep your body rigid from shoulders to feet.',
      'Lower as slowly as possible.',
      'Avoid bending at the hips.'
    ]
  },
  'Hollow Rock': {
    id: 'hollow_rock',
    name: 'Hollow Rock',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Deep Core',
    primaryMuscles: ['Deep Core'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Begin in a hollow body hold with your arms overhead and legs extended.',
      'Press your lower back firmly into the floor.',
      'Rock your body gently forward and backward while maintaining the hollow position.',
      'Continue without losing body tension.'
    ],
    tips: [
      'Keep your body rigid throughout.',
      'Avoid bending your knees.',
      'Use small, controlled rocks.',
      'Maintain steady breathing.'
    ]
  },
  'Standing Rollout': {
    id: 'standing_rollout',
    name: 'Standing Rollout',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Ab Wheel',
    category: 'Strength',
    target: 'Full Core',
    primaryMuscles: ['Full Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Stand while holding an ab wheel on the floor in front of you.',
      'Roll the wheel forward as you hinge at the hips.',
      'Extend your body while keeping your core tight.',
      'Pull yourself back to the starting position using your core.'
    ],
    tips: [
      'Attempt only after mastering kneeling rollouts.',
      'Keep your back neutral.',
      'Avoid letting your hips sag.',
      'Move slowly throughout the exercise.'
    ]
  },
  'Single Arm Rollout': {
    id: 'single_arm_rollout',
    name: 'Single Arm Rollout',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Ab Wheel',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Kneel while gripping the ab wheel with one hand.',
      'Brace your core.',
      'Roll forward as far as you can while maintaining balance.',
      'Return slowly before switching arms.'
    ],
    tips: [
      'Start with a short range of motion.',
      'Keep your torso stable.',
      'Avoid rotating your hips.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Band Rotation': {
    id: 'band_rotation',
    name: 'Band Rotation',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Obliques',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Deep Core'],
    howToPerform: [
      'Anchor a resistance band at chest height.',
      'Hold the band with both hands while standing sideways to the anchor.',
      'Rotate your torso away from the anchor.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Rotate through your torso.',
      'Keep your hips mostly still.',
      'Maintain constant band tension.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Hanging Windshield Wiper': {
    id: 'hanging_windshield_wiper',
    name: 'Hanging Windshield Wiper',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Obliques',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Full Core'],
    howToPerform: [
      'Hang from a pull-up bar with your legs raised.',
      'Keep your legs together and as straight as possible.',
      'Rotate your legs slowly from one side to the other.',
      'Return to the center before repeating.'
    ],
    tips: [
      'Avoid swinging your body.',
      'Move slowly through the full range.',
      'Keep your shoulders active.',
      'Control both directions.'
    ]
  },
  'Toes-to-Bar': {
    id: 'toes_to_bar',
    name: 'Toes-to-Bar',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Full Core',
    primaryMuscles: ['Full Core'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Hang from a pull-up bar with your arms fully extended.',
      'Tighten your core and raise your legs toward the bar.',
      'Touch or reach your toes to the bar.',
      'Lower your legs slowly to the starting position.'
    ],
    tips: [
      'Avoid excessive swinging.',
      'Lift with your core rather than momentum.',
      'Lower your legs under control.',
      'Maintain active shoulders.'
    ]
  },
  'Hanging Leg Raise Station': {
    id: 'hanging_leg_raise_station',
    name: 'Hanging Leg Raise Station',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Hanging Leg Raise Station',
    category: 'Strength',
    target: 'Lower Abs',
    primaryMuscles: ['Lower Abs'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Support yourself on the hanging leg raise station with your forearms on the pads.',
      'Keep your legs straight.',
      'Raise your legs until they are parallel to the floor or higher.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Avoid swinging your legs.',
      'Keep your core tight.',
      'Lower with full control.',
      'Maintain an upright posture.'
    ]
  },
  'Landmine Rotation': {
    id: 'landmine_rotation',
    name: 'Landmine Rotation',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Landmine Attachment & Barbell',
    category: 'Strength',
    target: 'Obliques',
    primaryMuscles: ['Obliques'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Hold one end of a landmine barbell with both hands.',
      'Press the bar in front of your chest.',
      'Rotate the bar in a controlled arc from one hip to the other.',
      'Reverse the movement while keeping your core engaged.'
    ],
    tips: [
      'Rotate through your torso.',
      'Keep your arms mostly straight.',
      'Control the movement in both directions.',
      'Avoid twisting your knees excessively.'
    ]
  },
  'Dragon Flag Bench': {
    id: 'dragon_flag_bench',
    name: 'Dragon Flag Bench',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Flat Bench',
    category: 'Strength',
    target: 'Full Core',
    primaryMuscles: ['Full Core'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Lie on a flat bench and grip it firmly behind your head.',
      'Lift your body until only your upper back remains on the bench.',
      'Lower your body slowly while keeping it perfectly straight.',
      'Stop just above the bench before repeating.'
    ],
    tips: [
      'Attempt only after mastering Dragon Flag Progressions.',
      'Keep your body rigid throughout.',
      'Lower yourself as slowly as possible.',
      'Avoid bending at the hips.'
    ]
  },

  // ==========================================
  // LEGS EXERCISES
  // ==========================================
  'Chair Squat': {
    id: 'chair_squat',
    name: 'Chair Squat',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Chair',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand in front of a sturdy chair with your feet shoulder-width apart.',
      'Push your hips back and lower yourself until you lightly touch the chair.',
      'Press through your heels to stand back up.',
      'Repeat with controlled movement.'
    ],
    tips: [
      'Keep your chest lifted.',
      'Push your knees in line with your toes.',
      'Avoid dropping onto the chair.',
      'Drive through your heels to stand.'
    ]
  },
  'Box Squat': {
    id: 'box_squat',
    name: 'Box Squat',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Bench / Box',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand in front of a box or bench with your feet shoulder-width apart.',
      'Push your hips back and lower until you lightly sit on the box.',
      'Pause briefly without relaxing completely.',
      'Stand back up by driving through your heels.'
    ],
    tips: [
      'Keep your back neutral.',
      'Control the descent.',
      'Avoid rocking forward.',
      'Keep your knees tracking over your toes.'
    ]
  },
  'Bodyweight Squat': {
    id: 'bodyweight_squat',
    name: 'Bodyweight Squat',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand with your feet shoulder-width apart.',
      'Push your hips back and bend your knees to lower yourself.',
      'Lower until your thighs are parallel to the floor or as comfortable.',
      'Stand back up by pushing through your heels.'
    ],
    tips: [
      'Keep your chest upright.',
      'Keep your heels on the floor.',
      'Don\'t let your knees collapse inward.',
      'Control both the lowering and lifting phases.'
    ]
  },
  'Static Split Squat': {
    id: 'static_split_squat',
    name: 'Static Split Squat',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand in a split stance with one foot forward and one foot behind.',
      'Lower your body by bending both knees.',
      'Pause briefly when your front thigh is nearly parallel to the floor.',
      'Push through your front heel to return to the starting position.'
    ],
    tips: [
      'Keep your torso upright.',
      'Lower straight down instead of forward.',
      'Keep your front knee over your foot.',
      'Complete equal repetitions on both legs.'
    ]
  },
  'Forward Lunge': {
    id: 'forward_lunge',
    name: 'Forward Lunge',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand upright with your feet together.',
      'Step forward with one leg.',
      'Lower until both knees are bent around 90 degrees.',
      'Push through your front foot to return and repeat on the opposite leg.'
    ],
    tips: [
      'Keep your upper body tall.',
      'Avoid letting your front knee move far past your toes.',
      'Push through your front heel.',
      'Alternate legs evenly.'
    ]
  },
  'Glute Bridge': {
    id: 'glute_bridge',
    name: 'Glute Bridge',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Lie on your back with your knees bent and feet flat on the floor.',
      'Press through your heels and lift your hips.',
      'Squeeze your glutes at the top.',
      'Lower your hips slowly back to the floor.'
    ],
    tips: [
      'Keep your core engaged.',
      'Avoid overextending your lower back.',
      'Pause briefly at the top.',
      'Lower with control.'
    ]
  },
  'Frog Pump': {
    id: 'frog_pump',
    name: 'Frog Pump',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Lie on your back and bring the soles of your feet together.',
      'Allow your knees to fall outward.',
      'Press through the outer edges of your feet to lift your hips.',
      'Lower slowly to the starting position.'
    ],
    tips: [
      'Squeeze your glutes at the top.',
      'Keep the movement controlled.',
      'Avoid arching your lower back.',
      'Maintain steady breathing.'
    ]
  },
  'Donkey Kick': {
    id: 'donkey_kick',
    name: 'Donkey Kick',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Begin on your hands and knees.',
      'Keep one knee bent at 90 degrees.',
      'Lift your foot upward until your thigh aligns with your torso.',
      'Lower slowly before repeating on the opposite leg.'
    ],
    tips: [
      'Keep your hips level.',
      'Avoid arching your lower back.',
      'Squeeze your glutes at the top.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Standing Calf Raise': {
    id: 'standing_calf_raise',
    name: 'Standing Calf Raise',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Calves',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand upright with your feet hip-width apart.',
      'Raise your heels until you are standing on your toes.',
      'Pause briefly at the top.',
      'Lower your heels slowly back to the floor.'
    ],
    tips: [
      'Move through a full range of motion.',
      'Avoid bouncing.',
      'Hold onto a wall if needed for balance.',
      'Lower your heels under control.'
    ]
  },
  'Seated Calf Raise (Chair)': {
    id: 'seated_calf_raise_chair',
    name: 'Seated Calf Raise (Chair)',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Chair',
    category: 'Strength',
    target: 'Soleus',
    primaryMuscles: ['Soleus'],
    secondaryMuscles: ['Calves'],
    howToPerform: [
      'Sit on a sturdy chair with your feet flat on the floor.',
      'Raise your heels while keeping the balls of your feet on the floor.',
      'Pause briefly at the top.',
      'Lower your heels slowly.'
    ],
    tips: [
      'Keep your knees bent throughout.',
      'Move only through your ankles.',
      'Pause at the top of each repetition.',
      'Perform slow, controlled repetitions.'
    ]
  },
  'Single Leg Stand': {
    id: 'single_leg_stand',
    name: 'Single Leg Stand',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Balance',
    target: 'Balance',
    primaryMuscles: ['Balance'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand upright with your feet together.',
      'Lift one foot off the floor while balancing on the other leg.',
      'Hold the position while keeping your body upright.',
      'Lower your foot and repeat on the opposite leg.'
    ],
    tips: [
      'Keep your gaze fixed on one point.',
      'Keep your core engaged.',
      'Start near a wall if needed.',
      'Perform equal holds on both legs.'
    ]
  },
  'Heel Walk': {
    id: 'heel_walk',
    name: 'Heel Walk',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Tibialis',
    primaryMuscles: ['Tibialis'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand upright with your toes lifted off the floor.',
      'Walk forward using only your heels.',
      'Keep your toes pointing upward throughout.',
      'Continue for the desired distance before resting.'
    ],
    tips: [
      'Take short, controlled steps.',
      'Keep your knees slightly bent.',
      'Avoid letting your toes touch the floor.',
      'Maintain an upright posture.'
    ]
  },
  'Toe Walk': {
    id: 'toe_walk',
    name: 'Toe Walk',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Calves',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand on the balls of your feet.',
      'Raise your heels as high as possible.',
      'Walk forward while remaining on your toes.',
      'Continue for the desired distance.'
    ],
    tips: [
      'Keep your heels elevated.',
      'Take controlled steps.',
      'Maintain good posture.',
      'Keep your core engaged.'
    ]
  },
  'Goblet Squat': {
    id: 'goblet_squat',
    name: 'Goblet Squat',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Hold a dumbbell vertically against your chest.',
      'Stand with your feet shoulder-width apart.',
      'Lower into a squat by pushing your hips back.',
      'Drive through your heels to stand back up.'
    ],
    tips: [
      'Keep the weight close to your chest.',
      'Keep your chest lifted.',
      'Push your knees in line with your toes.',
      'Control the movement throughout.'
    ]
  },
  'Romanian Deadlift': {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Hold a pair of dumbbells in front of your thighs.',
      'Hinge at your hips while keeping your back flat.',
      'Lower the weights until you feel a stretch in your hamstrings.',
      'Drive your hips forward to return to standing.'
    ],
    tips: [
      'Keep the weights close to your legs.',
      'Bend slightly at the knees.',
      'Avoid rounding your back.',
      'Move slowly throughout the exercise.'
    ]
  },
  'Band Squat': {
    id: 'band_squat',
    name: 'Band Squat',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand on the center of a resistance band.',
      'Hold the handles at shoulder height.',
      'Lower into a squat while maintaining tension on the band.',
      'Stand back up by driving through your heels.'
    ],
    tips: [
      'Keep constant tension on the band.',
      'Keep your chest upright.',
      'Push your knees outward.',
      'Control both the descent and ascent.'
    ]
  },
  'Lateral Band Walk': {
    id: 'lateral_band_walk',
    name: 'Lateral Band Walk',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Glute Medius',
    primaryMuscles: ['Glute Medius'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Place a resistance band around your ankles or just above your knees.',
      'Bend your knees slightly into an athletic stance.',
      'Step sideways while maintaining band tension.',
      'Continue for the desired distance before switching directions.'
    ],
    tips: [
      'Keep tension on the band at all times.',
      'Avoid bringing your feet completely together.',
      'Keep your hips level.',
      'Take small, controlled steps.'
    ]
  },
  'Leg Press': {
    id: 'leg_press',
    name: 'Leg Press',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Leg Press Machine',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Sit on the leg press machine with your feet shoulder-width apart on the platform.',
      'Release the safety handles.',
      'Lower the platform by bending your knees.',
      'Press the platform back until your legs are nearly straight.'
    ],
    tips: [
      'Keep your lower back against the seat.',
      'Avoid locking your knees.',
      'Push through your heels.',
      'Control the lowering phase.'
    ]
  },
  'Leg Extension Machine': {
    id: 'leg_extension_machine',
    name: 'Leg Extension Machine',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Leg Extension Machine',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: [],
    howToPerform: [
      'Sit on the machine and position your ankles behind the pad.',
      'Grip the handles beside the seat.',
      'Extend your knees until your legs are nearly straight.',
      'Lower the weight slowly.'
    ],
    tips: [
      'Move through a controlled range.',
      'Avoid swinging the weight.',
      'Pause briefly at the top.',
      'Lower slowly.'
    ]
  },
  'Seated Hamstring Curl': {
    id: 'seated_hamstring_curl',
    name: 'Seated Hamstring Curl',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Hamstring Curl Machine',
    category: 'Strength',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Calves'],
    howToPerform: [
      'Sit on the hamstring curl machine with your ankles behind the roller pad.',
      'Grip the side handles.',
      'Curl the pad downward by bending your knees.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your hips against the seat.',
      'Move slowly through the full range.',
      'Squeeze your hamstrings at the bottom.',
      'Control the return movement.'
    ]
  },
  'Standing Hamstring Curl': {
    id: 'standing_hamstring_curl',
    name: 'Standing Hamstring Curl',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'None',
    category: 'Strength',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand upright while holding a wall or chair for balance.',
      'Bend one knee to bring your heel toward your glutes.',
      'Pause briefly at the top.',
      'Lower slowly before switching legs.'
    ],
    tips: [
      'Keep your thighs aligned.',
      'Avoid swinging your leg.',
      'Perform slow repetitions.',
      'Complete equal repetitions on both legs.'
    ]
  },
  'Narrow Squat': {
    id: 'narrow_squat',
    name: 'Narrow Squat',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand with your feet closer than shoulder-width apart.',
      'Push your hips back and bend your knees to lower into a squat.',
      'Lower until your thighs are parallel to the floor or as comfortable.',
      'Push through your heels to return to standing.'
    ],
    tips: [
      'Keep your knees tracking over your toes.',
      'Keep your chest upright.',
      'Avoid lifting your heels.',
      'Control the movement throughout.'
    ]
  },
  'Wide Squat': {
    id: 'wide_squat',
    name: 'Wide Squat',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Adductors'],
    howToPerform: [
      'Stand with your feet wider than shoulder-width apart.',
      'Point your toes slightly outward.',
      'Lower into a squat while keeping your chest lifted.',
      'Push through your heels to return to standing.'
    ],
    tips: [
      'Push your knees outward.',
      'Keep your back neutral.',
      'Lower with control.',
      'Drive through your heels.'
    ]
  },
  'Sumo Squat': {
    id: 'sumo_squat',
    name: 'Sumo Squat',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Inner Thigh'],
    howToPerform: [
      'Stand in a wide stance with your toes pointed outward.',
      'Push your hips back while bending your knees.',
      'Lower until your thighs are parallel to the floor or as comfortable.',
      'Push through your heels to stand back up.'
    ],
    tips: [
      'Keep your knees aligned with your toes.',
      'Maintain an upright torso.',
      'Squeeze your glutes at the top.',
      'Avoid rounding your back.'
    ]
  },
  'Reverse Lunge': {
    id: 'reverse_lunge',
    name: 'Reverse Lunge',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Stand upright with your feet together.',
      'Step one leg backward.',
      'Lower until both knees are bent around 90 degrees.',
      'Push through your front heel to return and repeat on the opposite side.'
    ],
    tips: [
      'Keep your torso upright.',
      'Step back far enough for balance.',
      'Keep your front knee stable.',
      'Alternate legs evenly.'
    ]
  },
  'Walking Lunge': {
    id: 'walking_lunge',
    name: 'Walking Lunge',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Step forward into a lunge.',
      'Push through your front foot to stand.',
      'Bring your back foot forward into the next lunge.',
      'Continue alternating while walking forward.'
    ],
    tips: [
      'Keep your chest lifted.',
      'Maintain steady balance.',
      'Keep your knees aligned with your toes.',
      'Use controlled steps.'
    ]
  },
  'Side Lunge': {
    id: 'side_lunge',
    name: 'Side Lunge',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Adductors',
    primaryMuscles: ['Adductors'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand with your feet together.',
      'Take a large step to one side.',
      'Bend the stepping knee while keeping the opposite leg straight.',
      'Push back to the starting position and repeat on the opposite side.'
    ],
    tips: [
      'Push your hips backward.',
      'Keep your planted foot flat.',
      'Avoid leaning forward excessively.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Fire Hydrant': {
    id: 'fire_hydrant',
    name: 'Fire Hydrant',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Glute Medius',
    primaryMuscles: ['Glute Medius'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Begin on your hands and knees.',
      'Keep one knee bent at 90 degrees.',
      'Lift your knee out to the side without rotating your hips.',
      'Lower slowly before switching legs.'
    ],
    tips: [
      'Keep your core engaged.',
      'Avoid twisting your hips.',
      'Lift only as high as you can maintain form.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Single Leg Glute Bridge': {
    id: 'single_leg_glute_bridge',
    name: 'Single Leg Glute Bridge',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Lie on your back with one foot flat on the floor and the other leg extended.',
      'Press through the planted heel.',
      'Lift your hips until your body forms a straight line.',
      'Lower slowly before switching legs.'
    ],
    tips: [
      'Keep your hips level.',
      'Squeeze your glutes at the top.',
      'Avoid arching your lower back.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Hip Thrust (Bench)': {
    id: 'hip_thrust_bench',
    name: 'Hip Thrust (Bench)',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'Bench / Chair',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Rest your upper back against a sturdy bench.',
      'Bend your knees with your feet flat on the floor.',
      'Drive through your heels to lift your hips.',
      'Lower slowly back to the starting position.'
    ],
    tips: [
      'Keep your chin tucked slightly.',
      'Squeeze your glutes at the top.',
      'Avoid overextending your lower back.',
      'Lower with control.'
    ]
  },
  'Single Leg Calf Raise': {
    id: 'single_leg_calf_raise',
    name: 'Single Leg Calf Raise',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Calves',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand on one foot while holding a wall or chair for balance if needed.',
      'Raise your heel as high as possible.',
      'Pause briefly at the top.',
      'Lower slowly before switching legs.'
    ],
    tips: [
      'Move through a full range of motion.',
      'Keep your standing leg straight but not locked.',
      'Lower your heel under control.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Jump Rope (Imaginary)': {
    id: 'jump_rope_imaginary',
    name: 'Jump Rope (Imaginary)',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Cardio',
    target: 'Calves',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Cardio'],
    howToPerform: [
      'Stand upright with your feet together.',
      'Mimic the motion of turning a jump rope with your wrists.',
      'Jump lightly on the balls of your feet with each imaginary rope rotation.',
      'Continue at a steady rhythm.'
    ],
    tips: [
      'Land softly on your feet.',
      'Keep your jumps low.',
      'Maintain a steady rhythm.',
      'Keep your core engaged.'
    ]
  },
  'Single Leg Reach': {
    id: 'single_leg_reach',
    name: 'Single Leg Reach',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Balance',
    target: 'Balance',
    primaryMuscles: ['Balance'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand on one leg with a slight bend in the knee.',
      'Hinge forward at the hips while reaching both hands toward the floor.',
      'Extend your free leg behind you for balance.',
      'Return to standing before repeating on the opposite leg.'
    ],
    tips: [
      'Keep your back neutral.',
      'Move slowly and under control.',
      'Focus on a fixed point for balance.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Dumbbell Lunge': {
    id: 'dumbbell_lunge',
    name: 'Dumbbell Lunge',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Hold a dumbbell in each hand at your sides.',
      'Step forward into a lunge.',
      'Lower until both knees are bent around 90 degrees.',
      'Push through your front heel to return and alternate legs.'
    ],
    tips: [
      'Keep your torso upright.',
      'Keep your front knee aligned with your toes.',
      'Lower with control.',
      'Avoid leaning forward.'
    ]
  },
  'Bulgarian Split Squat': {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Bench / Chair',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand a few feet in front of a bench and place one foot behind you on it.',
      'Lower your body by bending your front knee.',
      'Descend until your front thigh is nearly parallel to the floor.',
      'Push through your front heel to return before switching legs.'
    ],
    tips: [
      'Keep most of your weight on the front leg.',
      'Maintain an upright torso.',
      'Keep your front knee stable.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Dumbbell Step-up': {
    id: 'dumbbell_step_up',
    name: 'Dumbbell Step-up',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Hold a dumbbell in each hand.',
      'Step onto a sturdy bench or platform with one foot.',
      'Drive through your leading heel to stand on the platform.',
      'Step down with control and repeat on the opposite leg.'
    ],
    tips: [
      'Push through your leading leg.',
      'Avoid pushing off excessively with the trailing foot.',
      'Stand fully at the top.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Dumbbell Hip Thrust': {
    id: 'dumbbell_hip_thrust',
    name: 'Dumbbell Hip Thrust',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Rest your upper back against a bench and place a dumbbell across your hips.',
      'Bend your knees with your feet flat on the floor.',
      'Drive through your heels to lift your hips.',
      'Lower slowly to the starting position.'
    ],
    tips: [
      'Hold the dumbbell securely.',
      'Squeeze your glutes at the top.',
      'Avoid arching your lower back.',
      'Lower under control.'
    ]
  },
  'Band Glute Bridge': {
    id: 'band_glute_bridge',
    name: 'Band Glute Bridge',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Place a resistance band just above your knees.',
      'Lie on your back with your knees bent and feet flat.',
      'Push through your heels and lift your hips.',
      'Lower slowly while maintaining band tension.'
    ],
    tips: [
      'Push your knees outward against the band.',
      'Squeeze your glutes at the top.',
      'Keep your core engaged.',
      'Lower with control.'
    ]
  },
  'Band Kickback': {
    id: 'band_kickback',
    name: 'Band Kickback',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Anchor a resistance band around your ankle or to a low anchor.',
      'Stand upright while holding a stable surface for balance.',
      'Extend one leg straight backward by squeezing your glutes.',
      'Return slowly before repeating on the opposite leg.'
    ],
    tips: [
      'Keep your torso upright.',
      'Avoid arching your lower back.',
      'Move only at the hip.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Smith Machine Squat': {
    id: 'smith_machine_squat',
    name: 'Smith Machine Squat',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Smith Machine',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Position the bar across your upper back on the Smith machine.',
      'Stand with your feet slightly in front of the bar.',
      'Lower into a squat by bending your knees and hips.',
      'Push through your heels to return to standing.'
    ],
    tips: [
      'Keep your chest upright.',
      'Lower with control.',
      'Keep your knees aligned with your toes.',
      'Avoid locking your knees at the top.'
    ]
  },
  'Barbell Back Squat': {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Full Legs',
    primaryMuscles: ['Full Legs'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Position the barbell across your upper back.',
      'Stand with your feet shoulder-width apart.',
      'Lower into a squat by pushing your hips back and bending your knees.',
      'Drive through your heels to return to standing.'
    ],
    tips: [
      'Keep your back neutral.',
      'Brace your core before each repetition.',
      'Keep your heels on the floor.',
      'Maintain control throughout the movement.'
    ]
  },
  'Front Squat': {
    id: 'front_squat',
    name: 'Front Squat',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Rest the barbell across the front of your shoulders.',
      'Keep your elbows lifted high.',
      'Lower into a squat while keeping your torso upright.',
      'Push through your heels to return to standing.'
    ],
    tips: [
      'Keep your elbows high.',
      'Brace your core.',
      'Keep your chest lifted.',
      'Lower with control.'
    ]
  },
  'Hack Squat': {
    id: 'hack_squat',
    name: 'Hack Squat',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Hack Squat Machine',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Position yourself in the hack squat machine.',
      'Place your feet shoulder-width apart on the platform.',
      'Lower the weight by bending your knees.',
      'Push through your heels to return to the starting position.'
    ],
    tips: [
      'Keep your back against the pad.',
      'Avoid locking your knees.',
      'Control the lowering phase.',
      'Keep your knees aligned with your toes.'
    ]
  },
  'Walking Barbell Lunge': {
    id: 'walking_barbell_lunge',
    name: 'Walking Barbell Lunge',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Place a barbell across your upper back.',
      'Step forward into a lunge.',
      'Push through your front heel to step into the next lunge.',
      'Continue alternating legs while walking forward.'
    ],
    tips: [
      'Keep your torso upright.',
      'Control each step.',
      'Keep your front knee stable.',
      'Maintain steady balance.'
    ]
  },
  'Barbell Romanian Deadlift': {
    id: 'barbell_romanian_deadlift',
    name: 'Barbell Romanian Deadlift',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Hold a barbell in front of your thighs.',
      'Hinge at your hips while keeping your back flat.',
      'Lower the bar until you feel a stretch in your hamstrings.',
      'Drive your hips forward to return to standing.'
    ],
    tips: [
      'Keep the bar close to your legs.',
      'Maintain a slight bend in your knees.',
      'Avoid rounding your back.',
      'Squeeze your glutes at the top.'
    ]
  },
  'Hip Thrust Machine': {
    id: 'hip_thrust_machine',
    name: 'Hip Thrust Machine',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Hip Thrust Machine',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Position yourself in the hip thrust machine.',
      'Place your feet flat on the platform.',
      'Drive through your heels to lift your hips.',
      'Lower slowly to the starting position.'
    ],
    tips: [
      'Squeeze your glutes at the top.',
      'Keep your chin slightly tucked.',
      'Avoid arching your lower back.',
      'Control every repetition.'
    ]
  },
  'Standing Calf Raise Machine': {
    id: 'standing_calf_raise_machine',
    name: 'Standing Calf Raise Machine',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Standing Calf Raise Machine',
    category: 'Strength',
    target: 'Calves',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Position your shoulders beneath the pads.',
      'Place the balls of your feet on the platform.',
      'Raise your heels as high as possible.',
      'Lower slowly until you feel a stretch.'
    ],
    tips: [
      'Use a full range of motion.',
      'Avoid bouncing.',
      'Pause briefly at the top.',
      'Lower under control.'
    ]
  },
  'Seated Calf Raise Machine': {
    id: 'seated_calf_raise_machine',
    name: 'Seated Calf Raise Machine',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Seated Calf Raise Machine',
    category: 'Strength',
    target: 'Soleus',
    primaryMuscles: ['Soleus'],
    secondaryMuscles: ['Calves'],
    howToPerform: [
      'Sit on the machine with your knees beneath the pads.',
      'Place the balls of your feet on the platform.',
      'Raise your heels as high as possible.',
      'Lower slowly until you feel a stretch.'
    ],
    tips: [
      'Keep your knees bent throughout.',
      'Move only through your ankles.',
      'Pause at the top.',
      'Lower slowly.'
    ]
  },
  'Elevated Calf Raise': {
    id: 'elevated_calf_raise',
    name: 'Elevated Calf Raise',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'Step / Platform',
    category: 'Strength',
    target: 'Calves',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand on the edge of a step or platform with your heels hanging off.',
      'Lower your heels until you feel a stretch.',
      'Raise your heels as high as possible.',
      'Lower slowly and repeat.'
    ],
    tips: [
      'Move through the full range of motion.',
      'Avoid bouncing.',
      'Hold onto a wall for balance if needed.',
      'Control both the upward and downward movement.'
    ]
  },
  'Jump Squat': {
    id: 'jump_squat',
    name: 'Jump Squat',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes', 'Power'],
    howToPerform: [
      'Stand with your feet shoulder-width apart.',
      'Lower into a squat while keeping your chest upright.',
      'Explosively jump upward as high as possible.',
      'Land softly and immediately lower into the next repetition.'
    ],
    tips: [
      'Land softly on the balls of your feet.',
      'Keep your knees aligned with your toes.',
      'Absorb the landing by bending your knees.',
      'Focus on explosive power with controlled landings.'
    ]
  },
  'Shrimp Squat': {
    id: 'shrimp_squat',
    name: 'Shrimp Squat',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Balance'],
    howToPerform: [
      'Stand on one leg while holding the opposite foot behind you.',
      'Lower yourself by bending the standing leg.',
      'Descend until your rear knee lightly approaches the floor.',
      'Push through your standing heel to return to the starting position.'
    ],
    tips: [
      'Keep your balance throughout.',
      'Move slowly and under control.',
      'Keep your chest lifted.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Skater Squat': {
    id: 'skater_squat',
    name: 'Skater Squat',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand on one leg with the other leg extended behind you.',
      'Lower yourself until your rear knee nearly touches the floor.',
      'Keep your working foot flat throughout.',
      'Push through your heel to return to standing.'
    ],
    tips: [
      'Keep your hips level.',
      'Avoid collapsing your knee inward.',
      'Move through a controlled range.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Pistol Squat': {
    id: 'pistol_squat',
    name: 'Pistol Squat',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Full Legs',
    primaryMuscles: ['Full Legs'],
    secondaryMuscles: ['Balance'],
    howToPerform: [
      'Stand on one leg while extending the other leg forward.',
      'Lower into a squat while keeping the extended leg off the floor.',
      'Descend as low as your mobility allows.',
      'Push through your heel to stand back up.'
    ],
    tips: [
      'Keep your core tight.',
      'Maintain balance throughout.',
      'Lower with full control.',
      'Practice assisted variations if needed.'
    ]
  },
  'Curtsy Lunge': {
    id: 'curtsy_lunge',
    name: 'Curtsy Lunge',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Adductors'],
    howToPerform: [
      'Stand upright with your feet hip-width apart.',
      'Step one leg diagonally behind the other.',
      'Lower until both knees are comfortably bent.',
      'Push through your front heel to return before switching sides.'
    ],
    tips: [
      'Keep your torso upright.',
      'Control the crossing movement.',
      'Keep your front knee stable.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Jumping Lunge': {
    id: 'jumping_lunge',
    name: 'Jumping Lunge',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Power'],
    howToPerform: [
      'Begin in a lunge position.',
      'Explosively jump upward.',
      'Switch your legs in mid-air.',
      'Land softly in the opposite lunge and repeat.'
    ],
    tips: [
      'Land softly with bent knees.',
      'Keep your chest upright.',
      'Maintain balance after each landing.',
      'Focus on controlled explosive movement.'
    ]
  },
  'Nordic Curl Progression': {
    id: 'nordic_curl_progression',
    name: 'Nordic Curl Progression',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'Ankle Anchor',
    category: 'Strength',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Kneel with your ankles securely anchored.',
      'Keep your body in a straight line from knees to shoulders.',
      'Slowly lower yourself forward as far as possible.',
      'Push lightly with your hands if needed to return to the starting position.'
    ],
    tips: [
      'Lower as slowly as possible.',
      'Keep your hips extended.',
      'Use your hands only as needed.',
      'Focus on controlling the descent.'
    ]
  },
  'Explosive Calf Hop': {
    id: 'explosive_calf_hop',
    name: 'Explosive Calf Hop',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Calves',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand on the balls of your feet.',
      'Perform quick, explosive hops using only your ankles.',
      'Keep your knees slightly bent.',
      'Land softly and continue rhythmically.'
    ],
    tips: [
      'Stay on the balls of your feet.',
      'Keep your hops quick and light.',
      'Land quietly.',
      'Maintain an upright posture.'
    ]
  },
  'Airplane Balance': {
    id: 'airplane_balance',
    name: 'Airplane Balance',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Balance',
    target: 'Balance',
    primaryMuscles: ['Balance'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand on one leg.',
      'Hinge forward while extending the opposite leg straight behind you.',
      'Extend your arms outward like airplane wings.',
      'Hold briefly before returning to standing and switching sides.'
    ],
    tips: [
      'Keep your hips level.',
      'Maintain a neutral spine.',
      'Focus your eyes on one point.',
      'Perform equal holds on both legs.'
    ]
  },
  'Dumbbell Sumo Squat': {
    id: 'dumbbell_sumo_squat',
    name: 'Dumbbell Sumo Squat',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Inner Thigh',
    primaryMuscles: ['Inner Thigh'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Hold a dumbbell vertically with both hands.',
      'Stand in a wide stance with your toes pointed outward.',
      'Lower into a squat while keeping the dumbbell close to your body.',
      'Push through your heels to return to standing.'
    ],
    tips: [
      'Keep your chest upright.',
      'Push your knees outward.',
      'Squeeze your glutes at the top.',
      'Control the movement throughout.'
    ]
  },
  'Single Leg Romanian Deadlift': {
    id: 'single_leg_romanian_deadlift',
    name: 'Single Leg Romanian Deadlift',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Balance'],
    howToPerform: [
      'Stand on one leg while holding a dumbbell in the opposite hand.',
      'Hinge at your hips as your free leg extends straight behind you.',
      'Lower until your torso is nearly parallel to the floor.',
      'Drive through your standing heel to return upright.'
    ],
    tips: [
      'Keep your back neutral.',
      'Keep your hips level.',
      'Move slowly and under control.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Dumbbell Jump Squat': {
    id: 'dumbbell_jump_squat',
    name: 'Dumbbell Jump Squat',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Power',
    primaryMuscles: ['Power'],
    secondaryMuscles: ['Quads', 'Glutes'],
    howToPerform: [
      'Hold a light dumbbell in each hand.',
      'Lower into a squat.',
      'Explosively jump upward while keeping the dumbbells stable.',
      'Land softly and immediately lower into the next repetition.'
    ],
    tips: [
      'Use lighter weights.',
      'Land softly with bent knees.',
      'Keep your chest upright.',
      'Focus on explosive movement and controlled landings.'
    ]
  },
  'Monster Walk': {
    id: 'monster_walk',
    name: 'Monster Walk',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hip Stability'],
    howToPerform: [
      'Place a resistance band around your ankles or above your knees.',
      'Bend your knees slightly into an athletic stance.',
      'Walk diagonally forward while maintaining band tension.',
      'Reverse the movement and continue backward.'
    ],
    tips: [
      'Keep constant tension on the band.',
      'Avoid bringing your feet together completely.',
      'Keep your hips level.',
      'Take controlled, deliberate steps.'
    ]
  },
  'Bulgarian Split Squat (Barbell)': {
    id: 'bulgarian_split_squat_barbell',
    name: 'Bulgarian Split Squat (Barbell)',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Position a barbell across your upper back.',
      'Place your rear foot on a bench behind you.',
      'Lower until your front thigh is nearly parallel to the floor.',
      'Push through your front heel to return before switching legs.'
    ],
    tips: [
      'Keep your torso upright.',
      'Brace your core.',
      'Lower under control.',
      'Perform equal repetitions on both legs.'
    ]
  },
  'Jefferson Squat': {
    id: 'jefferson_squat',
    name: 'Jefferson Squat',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Legs',
    primaryMuscles: ['Legs'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Stand straddling a barbell with one foot in front and one behind.',
      'Grip the bar with one hand in front of your body and the other behind.',
      'Lift the bar by extending your hips and knees.',
      'Lower it back to the floor under control.'
    ],
    tips: [
      'Keep your spine neutral.',
      'Brace your core before lifting.',
      'Lift smoothly without twisting.',
      'Alternate your stance between sets.'
    ]
  },
  'Sissy Squat Machine': {
    id: 'sissy_squat_machine',
    name: 'Sissy Squat Machine',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Sissy Squat Machine',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Position yourself securely in the sissy squat machine.',
      'Lean backward while bending your knees.',
      'Lower until you feel a strong stretch in your quads.',
      'Extend your knees to return to the starting position.'
    ],
    tips: [
      'Move slowly throughout the exercise.',
      'Keep your hips extended.',
      'Avoid bouncing at the bottom.',
      'Use a comfortable range of motion.'
    ]
  },
  'Zercher Squat': {
    id: 'zercher_squat',
    name: 'Zercher Squat',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Hold a barbell in the crooks of your elbows.',
      'Stand with your feet shoulder-width apart.',
      'Lower into a squat while keeping your torso upright.',
      'Push through your heels to return to standing.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Brace your core throughout.',
      'Keep your chest lifted.',
      'Lower with control.'
    ]
  },
  'Deficit Deadlift': {
    id: 'deficit_deadlift',
    name: 'Deficit Deadlift',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell & Platform',
    category: 'Strength',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand on a small platform with a barbell in front of you.',
      'Hinge at your hips and grip the bar.',
      'Drive through your feet to lift the bar to standing.',
      'Lower the bar slowly back to the floor.'
    ],
    tips: [
      'Maintain a neutral spine.',
      'Keep the bar close to your legs.',
      'Avoid jerking the weight.',
      'Lower under full control.'
    ]
  },
  'Trap Bar Deadlift': {
    id: 'trap_bar_deadlift',
    name: 'Trap Bar Deadlift',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Trap Bar',
    category: 'Strength',
    target: 'Full Legs',
    primaryMuscles: ['Full Legs'],
    secondaryMuscles: ['Posterior Chain'],
    howToPerform: [
      'Stand inside the trap bar with your feet hip-width apart.',
      'Grip the side handles and brace your core.',
      'Push through your feet to stand upright.',
      'Lower the bar slowly back to the floor.'
    ],
    tips: [
      'Keep your chest lifted.',
      'Maintain a neutral spine.',
      'Push through your heels.',
      'Control both the lifting and lowering phases.'
    ]
  },

  // ==========================================
  // CHEST EXERCISES
  // ==========================================
  'Doorway Chest Stretch': {
    id: 'doorway_chest_stretch',
    name: 'Doorway Chest Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Stand in a doorway and place both forearms against the sides of the frame.',
      'Keep your elbows around shoulder height.',
      'Step one foot forward until you feel a gentle stretch across your chest.',
      'Hold briefly before returning to the starting position.'
    ],
    tips: [
      'Keep your shoulders relaxed.',
      'Do not lean excessively forward.',
      'Stretch only until you feel gentle tension.',
      'Breathe normally throughout the stretch.'
    ]
  },
  'Standing Chest Opener': {
    id: 'standing_chest_opener',
    name: 'Standing Chest Opener',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Stand upright with your feet shoulder-width apart.',
      'Clasp your hands behind your back or extend your arms behind you.',
      'Gently lift your chest while drawing your shoulders backward.',
      'Hold briefly before relaxing to the starting position.'
    ],
    tips: [
      'Keep your neck relaxed.',
      'Avoid arching your lower back excessively.',
      'Open your chest gradually without forcing the movement.',
      'Maintain smooth, steady breathing.'
    ]
  },
  'Prayer Stretch': {
    id: 'prayer_stretch',
    name: 'Prayer Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Wrists'],
    howToPerform: [
      'Stand or sit upright and place your palms together in front of your chest.',
      'Keep your palms pressed together while slowly lowering your hands toward your waist.',
      'Continue until you feel a comfortable stretch in your chest and wrists.',
      'Hold briefly before returning to the starting position.'
    ],
    tips: [
      'Keep your palms firmly together throughout the movement.',
      'Lower your hands slowly.',
      'Stretch only until you feel comfortable tension.',
      'Keep your shoulders relaxed and maintain an upright posture.'
    ]
  },
  'Band Chest Stretch': {
    id: 'band_chest_stretch',
    name: 'Band Chest Stretch',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Stretch',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Hold a resistance band with both hands slightly wider than shoulder-width apart.',
      'Extend your arms in front of you while keeping a light tension on the band.',
      'Slowly raise your arms overhead and slightly behind your body until you feel a gentle stretch across your chest.',
      'Return slowly to the starting position with controlled movement.'
    ],
    tips: [
      'Use a light resistance band.',
      'Keep your elbows slightly bent.',
      'Stretch only within a comfortable range.',
      'Perform the movement slowly and avoid sudden jerks.'
    ]
  },
  'Incline Push-up (Chair/Bench)': {
    id: 'incline_push_up_chair_bench',
    name: 'Incline Push-up (Chair/Bench)',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Chair',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Place your hands on a sturdy chair or bench slightly wider than shoulder-width apart.',
      'Step your feet back until your body forms a straight line.',
      'Lower your chest toward the edge of the chair by bending your elbows.',
      'Push back to the starting position with controlled movement.'
    ],
    tips: [
      'Use a stable chair or bench.',
      'Keep your body straight throughout the exercise.',
      'Avoid letting your hips sag.',
      'Control both the lowering and pushing phases.'
    ]
  },
  'Knee Push-up': {
    id: 'knee_push_up',
    name: 'Knee Push-up',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Begin in a push-up position with your knees resting on the floor.',
      'Keep your hands slightly wider than shoulder-width apart.',
      'Lower your chest toward the floor while keeping your body aligned from knees to head.',
      'Push yourself back to the starting position.'
    ],
    tips: [
      'Keep your core engaged.',
      'Do not let your hips drop.',
      'Lower yourself under control.',
      'Keep your elbows at about a 45-degree angle.'
    ]
  },
  'Floor Dumbbell Press': {
    id: 'floor_dumbbell_press',
    name: 'Floor Dumbbell Press',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Lie on your back with a dumbbell in each hand and your knees bent.',
      'Hold the dumbbells above your chest with your palms facing forward.',
      'Lower the dumbbells until your upper arms gently touch the floor.',
      'Press the weights back to the starting position.'
    ],
    tips: [
      'Keep your wrists straight.',
      'Press both dumbbells evenly.',
      'Avoid bouncing your elbows off the floor.',
      'Move with slow, controlled repetitions.'
    ]
  },
  'Neutral Grip Floor Press': {
    id: 'neutral_grip_floor_press',
    name: 'Neutral Grip Floor Press',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Lie on your back holding two dumbbells with your palms facing each other.',
      'Press the dumbbells directly above your chest.',
      'Lower the weights until your upper arms lightly touch the floor.',
      'Press the dumbbells back up while maintaining the neutral grip.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Maintain a neutral wrist position.',
      'Lower the weights slowly.',
      'Avoid locking your elbows at the top.'
    ]
  },
  'Band Chest Press': {
    id: 'band_chest_press',
    name: 'Band Chest Press',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Anchor a resistance band securely behind you at chest height.',
      'Hold one handle in each hand with your elbows bent.',
      'Press both hands forward until your arms are nearly straight.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep tension on the band throughout the movement.',
      'Avoid shrugging your shoulders.',
      'Press in a straight line.',
      'Control the return phase.'
    ]
  },
  'Machine Chest Press': {
    id: 'machine_chest_press',
    name: 'Machine Chest Press',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Chest Press Machine',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Adjust the seat so the handles are level with your chest.',
      'Grip the handles firmly with your feet flat on the floor.',
      'Press the handles forward until your arms are almost straight.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Adjust the seat before beginning.',
      'Keep your back against the pad.',
      'Avoid locking your elbows.',
      'Control the movement in both directions.'
    ]
  },
  'Smith Machine Bench Press': {
    id: 'smith_machine_bench_press',
    name: 'Smith Machine Bench Press',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Smith Machine',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Lie on the bench with your eyes directly beneath the bar.',
      'Grip the bar slightly wider than shoulder-width apart.',
      'Lower the bar slowly toward your mid-chest.',
      'Press the bar back up until your arms are nearly straight.'
    ],
    tips: [
      'Keep your feet firmly planted.',
      'Lower the bar with control.',
      'Avoid bouncing the bar off your chest.',
      'Maintain a neutral wrist position.'
    ]
  },
  'Standard Push-up': {
    id: 'standard_push_up',
    name: 'Standard Push-up',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Core'],
    howToPerform: [
      'Begin in a high plank position with your hands slightly wider than shoulder-width apart.',
      'Keep your body in a straight line from head to heels.',
      'Lower your chest toward the floor by bending your elbows.',
      'Push yourself back to the starting position with control.'
    ],
    tips: [
      'Keep your core engaged throughout the movement.',
      'Avoid letting your hips sag.',
      'Lower yourself until your elbows reach about 90 degrees.',
      'Maintain controlled, steady repetitions.'
    ]
  },
  'Wide Push-up': {
    id: 'wide_push_up',
    name: 'Wide Push-up',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Start in a push-up position with your hands placed wider than shoulder-width apart.',
      'Keep your body aligned from head to heels.',
      'Lower your chest toward the floor with control.',
      'Push back to the starting position.'
    ],
    tips: [
      'Keep your elbows slightly bent outward.',
      'Avoid dropping your hips.',
      'Perform slow, controlled repetitions.',
      'Keep your neck neutral.'
    ]
  },
  'Close-Grip Push-up': {
    id: 'close_grip_push_up',
    name: 'Close-Grip Push-up',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Chest'],
    howToPerform: [
      'Begin in a push-up position with your hands directly beneath your shoulders.',
      'Keep your elbows close to your body.',
      'Lower your chest toward the floor.',
      'Push back to the starting position while maintaining control.'
    ],
    tips: [
      'Keep your elbows tucked throughout the exercise.',
      'Engage your core.',
      'Avoid flaring your elbows.',
      'Move with full control.'
    ]
  },
  'Diamond Push-up': {
    id: 'diamond_push_up',
    name: 'Diamond Push-up',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Triceps',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: ['Chest'],
    howToPerform: [
      'Place your hands together beneath your chest so your thumbs and index fingers form a diamond shape.',
      'Extend your legs behind you into a high plank.',
      'Lower your chest toward your hands.',
      'Push yourself back to the starting position.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Maintain a straight body position.',
      'Avoid rushing the movement.',
      'Stop if you lose proper form.'
    ]
  },
  'Staggered Push-up': {
    id: 'staggered_push_up',
    name: 'Staggered Push-up',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Core', 'Triceps'],
    howToPerform: [
      'Begin in a push-up position with one hand slightly ahead of the other.',
      'Keep your body straight and your core engaged.',
      'Lower your chest toward the floor.',
      'Push back up and switch hand positions after completing the set.'
    ],
    tips: [
      'Keep your hips level.',
      'Perform equal repetitions on both sides.',
      'Control the lowering phase.',
      'Avoid rotating your torso.'
    ]
  },
  'Alternating Floor Press': {
    id: 'alternating_floor_press',
    name: 'Alternating Floor Press',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Lie on your back holding a dumbbell in each hand.',
      'Press both dumbbells above your chest.',
      'Lower one dumbbell while keeping the other arm extended.',
      'Press it back up and alternate sides.'
    ],
    tips: [
      'Keep your core engaged.',
      'Prevent your torso from rotating.',
      'Lower each dumbbell slowly.',
      'Maintain a steady rhythm.'
    ]
  },
  'Single Arm Floor Press': {
    id: 'single_arm_floor_press',
    name: 'Single Arm Floor Press',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Lie on your back holding one dumbbell above your chest.',
      'Extend your free arm comfortably to the side for balance.',
      'Lower the dumbbell until your upper arm touches the floor.',
      'Press it back up before switching arms.'
    ],
    tips: [
      'Keep your core tight throughout the exercise.',
      'Avoid twisting your torso.',
      'Control both the lowering and lifting phases.',
      'Complete equal repetitions on each arm.'
    ]
  },
  'Dumbbell Squeeze Press': {
    id: 'dumbbell_squeeze_press',
    name: 'Dumbbell Squeeze Press',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Inner Chest',
    primaryMuscles: ['Inner Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Lie on your back holding two dumbbells pressed firmly together above your chest.',
      'Maintain pressure between the dumbbells throughout the exercise.',
      'Lower them slowly toward your chest.',
      'Press them back to the starting position while continuing to squeeze.'
    ],
    tips: [
      'Keep constant pressure between the dumbbells.',
      'Move slowly and under control.',
      'Avoid locking your elbows.',
      'Keep your wrists neutral.'
    ]
  },
  'Standing Band Chest Fly': {
    id: 'standing_band_chest_fly',
    name: 'Standing Band Chest Fly',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Anchor a resistance band securely behind you at chest height.',
      'Hold one handle in each hand with your arms extended outward.',
      'Bring your hands together in front of your chest in a wide arc.',
      'Slowly return to the starting position.'
    ],
    tips: [
      'Keep a slight bend in your elbows.',
      'Avoid shrugging your shoulders.',
      'Control the return movement.',
      'Keep constant tension on the band.'
    ]
  },
  'Low-to-High Band Fly': {
    id: 'low_to_high_band_fly',
    name: 'Low-to-High Band Fly',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Upper Chest',
    primaryMuscles: ['Upper Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Anchor a resistance band at a low position behind you.',
      'Hold the handles with your palms facing forward.',
      'Bring your hands upward and inward until they meet in front of your upper chest.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Move in a smooth upward arc.',
      'Keep a slight bend in your elbows.',
      'Avoid using momentum.',
      'Maintain constant tension on the band.'
    ]
  },
  'High-to-Low Band Fly': {
    id: 'high_to_low_band_fly',
    name: 'High-to-Low Band Fly',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Lower Chest',
    primaryMuscles: ['Lower Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Anchor a resistance band above shoulder height.',
      'Hold the handles with your arms extended upward.',
      'Pull your hands downward and inward in a wide arc.',
      'Slowly return to the starting position.'
    ],
    tips: [
      'Keep your elbows slightly bent.',
      'Move with slow, controlled repetitions.',
      'Avoid shrugging your shoulders.',
      'Keep tension on the band throughout the exercise.'
    ]
  },
  'Flat Barbell Bench Press': {
    id: 'flat_barbell_bench_press',
    name: 'Flat Barbell Bench Press',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Front Shoulders'],
    howToPerform: [
      'Lie flat on the bench with your eyes directly beneath the barbell.',
      'Grip the bar slightly wider than shoulder-width apart and unrack it.',
      'Lower the bar slowly to your mid-chest while keeping your elbows under control.',
      'Press the bar upward until your arms are nearly straight.'
    ],
    tips: [
      'Keep your feet firmly planted on the floor.',
      'Avoid bouncing the bar off your chest.',
      'Maintain a neutral wrist position.',
      'Keep the movement slow and controlled.'
    ]
  },
  'Incline Barbell Bench Press': {
    id: 'incline_barbell_bench_press',
    name: 'Incline Barbell Bench Press',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Upper Chest',
    primaryMuscles: ['Upper Chest'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Set the bench to an incline of about 30–45 degrees.',
      'Grip the bar slightly wider than shoulder-width apart.',
      'Lower the bar toward your upper chest with control.',
      'Press the bar back to the starting position.'
    ],
    tips: [
      'Keep your shoulder blades pulled back.',
      'Avoid flaring your elbows too much.',
      'Lower the bar under control.',
      'Keep your feet firmly on the floor.'
    ]
  },
  'Decline Bench Press': {
    id: 'decline_bench_press',
    name: 'Decline Bench Press',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Decline Bench',
    category: 'Strength',
    target: 'Lower Chest',
    primaryMuscles: ['Lower Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Secure your legs on the decline bench and lie back.',
      'Grip the bar slightly wider than shoulder-width apart.',
      'Lower the bar toward your lower chest.',
      'Press the bar upward until your arms are nearly straight.'
    ],
    tips: [
      'Keep your core engaged.',
      'Lower the bar with control.',
      'Avoid locking your elbows.',
      'Maintain a stable body position.'
    ]
  },
  'Flat Dumbbell Bench Press': {
    id: 'flat_dumbbell_bench_press',
    name: 'Flat Dumbbell Bench Press',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Stabilizers'],
    howToPerform: [
      'Lie flat on a bench while holding a dumbbell in each hand.',
      'Press both dumbbells above your chest with your palms facing forward.',
      'Lower the dumbbells until your elbows reach about 90 degrees.',
      'Press the dumbbells back to the starting position.'
    ],
    tips: [
      'Move both dumbbells evenly.',
      'Keep your wrists straight.',
      'Avoid dropping your elbows too low.',
      'Maintain full control throughout the movement.'
    ]
  },
  'Incline Dumbbell Bench Press': {
    id: 'incline_dumbbell_bench_press',
    name: 'Incline Dumbbell Bench Press',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Upper Chest',
    primaryMuscles: ['Upper Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Adjust the bench to an incline of about 30–45 degrees.',
      'Hold a dumbbell in each hand above your upper chest.',
      'Lower the dumbbells slowly to either side of your chest.',
      'Press them back to the starting position.'
    ],
    tips: [
      'Keep your shoulder blades retracted.',
      'Avoid bouncing the weights.',
      'Press both dumbbells evenly.',
      'Maintain a controlled tempo.'
    ]
  },
  'Decline Dumbbell Bench Press': {
    id: 'decline_dumbbell_bench_press',
    name: 'Decline Dumbbell Bench Press',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Lower Chest',
    primaryMuscles: ['Lower Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Lie securely on a decline bench with a dumbbell in each hand.',
      'Press the dumbbells above your chest.',
      'Lower them slowly until your elbows reach a comfortable depth.',
      'Press them back to the starting position.'
    ],
    tips: [
      'Keep your wrists neutral.',
      'Lower the weights under control.',
      'Avoid locking your elbows.',
      'Maintain steady breathing.'
    ]
  },
  'Pec Deck Machine': {
    id: 'pec_deck_machine',
    name: 'Pec Deck Machine',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Pec Deck Machine',
    category: 'Strength',
    target: 'Chest Isolation',
    primaryMuscles: ['Chest Isolation'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Adjust the seat so the handles are level with your chest.',
      'Place your forearms or hands on the machine pads.',
      'Bring the handles together in front of your chest.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep a slight bend in your elbows.',
      'Avoid using momentum.',
      'Control both phases of the movement.',
      'Keep your shoulders relaxed.'
    ]
  },
  'Cable Chest Fly': {
    id: 'cable_chest_fly',
    name: 'Cable Chest Fly',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Chest Isolation',
    primaryMuscles: ['Chest Isolation'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Set both cable pulleys to chest height and hold one handle in each hand.',
      'Step forward slightly into a stable stance.',
      'Bring your hands together in a wide arc in front of your chest.',
      'Return slowly until you feel a gentle stretch.'
    ],
    tips: [
      'Keep your elbows slightly bent.',
      'Maintain constant tension on the cables.',
      'Avoid shrugging your shoulders.',
      'Perform slow, controlled repetitions.'
    ]
  },
  'Archer Push-up': {
    id: 'archer_push_up',
    name: 'Archer Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Shoulders', 'Core'],
    howToPerform: [
      'Begin in a wide push-up position with your hands placed well outside shoulder-width.',
      'Shift your body weight toward one arm while keeping the opposite arm nearly straight.',
      'Lower your chest toward the working hand with control.',
      'Push back to the starting position and repeat before switching sides.'
    ],
    tips: [
      'Keep your core engaged throughout the movement.',
      'Lower yourself slowly and under control.',
      'Avoid twisting your hips.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Decline Push-up (Feet Elevated)': {
    id: 'decline_push_up_feet_elevated',
    name: 'Decline Push-up (Feet Elevated)',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'Chair',
    category: 'Strength',
    target: 'Upper Chest',
    primaryMuscles: ['Upper Chest'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Place your feet on a sturdy bench or chair and your hands on the floor.',
      'Keep your body in a straight line.',
      'Lower your chest toward the floor by bending your elbows.',
      'Push back to the starting position with control.'
    ],
    tips: [
      'Keep your hips level.',
      'Avoid flaring your elbows.',
      'Lower yourself slowly.',
      'Use a stable surface for your feet.'
    ]
  },
  'Pseudo Planche Push-up': {
    id: 'pseudo_planche_push_up',
    name: 'Pseudo Planche Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Front Shoulders', 'Triceps'],
    howToPerform: [
      'Begin in a push-up position with your hands placed near your hips.',
      'Lean your body weight forward over your hands.',
      'Lower your chest while maintaining the forward lean.',
      'Press back to the starting position.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Lean forward gradually.',
      'Maintain a rigid body position.',
      'Stop if you lose proper form.'
    ]
  },
  'Explosive Push-up': {
    id: 'explosive_push_up',
    name: 'Explosive Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Power'],
    howToPerform: [
      'Begin in a standard push-up position.',
      'Lower yourself under control.',
      'Push explosively so your hands briefly leave the floor.',
      'Land softly and continue into the next repetition.'
    ],
    tips: [
      'Land with slightly bent elbows.',
      'Maintain a straight body throughout.',
      'Focus on controlled landings.',
      'Build explosive power gradually.'
    ]
  },
  'Clap Push-up': {
    id: 'clap_push_up',
    name: 'Clap Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Explosive Power'],
    howToPerform: [
      'Begin in a standard push-up position.',
      'Lower your chest toward the floor.',
      'Push explosively high enough to clap your hands.',
      'Land softly and immediately stabilize your body.'
    ],
    tips: [
      'Attempt only after mastering explosive push-ups.',
      'Land with control.',
      'Keep your core engaged.',
      'Stop if you cannot land safely.'
    ]
  },
  'One-Arm Push-up': {
    id: 'one_arm_push_up',
    name: 'One-Arm Push-up',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Core', 'Triceps'],
    howToPerform: [
      'Start in a wide push-up position with one hand behind your back.',
      'Spread your feet wider for better balance.',
      'Lower your chest toward the floor using one arm.',
      'Press back up before repeating on the opposite arm.'
    ],
    tips: [
      'Keep your hips square.',
      'Engage your core throughout.',
      'Control the lowering phase.',
      'Train both sides equally.'
    ]
  },
  'Weighted Push-up (Weight Vest/Backpack)': {
    id: 'weighted_push_up_weight_vest_backpack',
    name: 'Weighted Push-up (Weight Vest/Backpack)',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Weight Vest / Backpack',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps'],
    howToPerform: [
      'Wear a weighted vest or secure a loaded backpack.',
      'Assume a standard push-up position.',
      'Lower your chest toward the floor with control.',
      'Push back to the starting position.'
    ],
    tips: [
      'Use a secure, evenly balanced load.',
      'Maintain proper push-up form.',
      'Avoid excessive weight.',
      'Move with full control.'
    ]
  },
  'Single Arm Band Press': {
    id: 'single_arm_band_press',
    name: 'Single Arm Band Press',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Anchor a resistance band behind you at chest height.',
      'Hold one handle with one hand and assume a staggered stance.',
      'Press the handle straight forward until your arm is nearly extended.',
      'Return slowly before repeating on the opposite side.'
    ],
    tips: [
      'Resist torso rotation.',
      'Keep your core tight.',
      'Press in a straight line.',
      'Perform equal repetitions on both arms.'
    ]
  },
  'Incline Cable Fly': {
    id: 'incline_cable_fly',
    name: 'Incline Cable Fly',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Upper Chest',
    primaryMuscles: ['Upper Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Set both cable pulleys to a low position.',
      'Hold one handle in each hand and step forward.',
      'Raise your hands upward and inward in a wide arc.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Maintain a slight bend in your elbows.',
      'Avoid using momentum.',
      'Keep constant cable tension.',
      'Control the return movement.'
    ]
  },
  'Decline Cable Fly': {
    id: 'decline_cable_fly',
    name: 'Decline Cable Fly',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Lower Chest',
    primaryMuscles: ['Lower Chest'],
    secondaryMuscles: ['Front Shoulders'],
    howToPerform: [
      'Set both cable pulleys above shoulder height.',
      'Hold one handle in each hand and step forward.',
      'Pull the handles downward and inward in a wide arc.',
      'Slowly return to the starting position.'
    ],
    tips: [
      'Keep your elbows slightly bent.',
      'Move smoothly throughout the exercise.',
      'Avoid shrugging your shoulders.',
      'Maintain tension on the cables.'
    ]
  },
  'Ring Push-up (Gymnastics Rings)': {
    id: 'ring_push_up_gymnastics_rings',
    name: 'Ring Push-up (Gymnastics Rings)',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Gymnastics Rings',
    category: 'Strength',
    target: 'Chest',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Core', 'Stabilizers'],
    howToPerform: [
      'Adjust the rings to a comfortable height and grip them firmly.',
      'Assume a push-up position while keeping your body straight.',
      'Lower your chest between the rings with control.',
      'Press back up while stabilizing the rings.'
    ],
    tips: [
      'Keep the rings close to your body.',
      'Engage your core throughout.',
      'Move slowly to maintain stability.',
      'Only attempt after mastering standard push-ups.'
    ]
  },

  // ==========================================
  // BACK EXERCISES
  // ==========================================
  'Cat-Cow Stretch': {
    id: 'cat_cow_stretch',
    name: 'Cat-Cow Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Spine',
    primaryMuscles: ['Spine'],
    secondaryMuscles: ['Back'],
    howToPerform: [
      'Begin on your hands and knees with your hands below your shoulders and knees below your hips.',
      'Inhale as you arch your back, lift your chest, and look slightly upward.',
      'Exhale as you round your spine, tuck your chin, and draw your belly inward.',
      'Repeat the movement slowly while matching your breathing.'
    ],
    tips: [
      'Move slowly between each position.',
      'Coordinate your breathing with the movement.',
      'Avoid forcing your spine into either position.',
      'Keep your shoulders relaxed.'
    ]
  },
  'Child\'s Pose': {
    id: 'childs_pose',
    name: "Child's Pose",
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Back',
    primaryMuscles: ['Back'],
    secondaryMuscles: ['Hips'],
    howToPerform: [
      'Kneel on the floor and sit back onto your heels.',
      'Lower your torso forward while extending your arms in front of you.',
      'Rest your forehead comfortably on the floor.',
      'Hold the stretch while breathing slowly before returning upright.'
    ],
    tips: [
      'Keep your shoulders relaxed.',
      'Stretch only to a comfortable position.',
      'Breathe slowly throughout the stretch.',
      'Allow your hips to sink naturally toward your heels.'
    ]
  },
  'Thread the Needle': {
    id: 'thread_the_needle',
    name: 'Thread the Needle',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Shoulders'],
    howToPerform: [
      'Begin on your hands and knees in a tabletop position.',
      'Slide one arm underneath your opposite arm with your palm facing upward.',
      'Lower your shoulder and the side of your head toward the floor.',
      'Hold briefly before returning to the starting position and repeating on the opposite side.'
    ],
    tips: [
      'Keep your hips as level as possible.',
      'Move slowly into the stretch.',
      'Do not force your shoulder to the floor.',
      'Repeat evenly on both sides.'
    ]
  },
  'Cobra Stretch': {
    id: 'cobra_stretch',
    name: 'Cobra Stretch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Lower Back',
    primaryMuscles: ['Lower Back'],
    secondaryMuscles: ['Abs'],
    howToPerform: [
      'Lie face down with your hands placed beneath your shoulders.',
      'Press your palms into the floor while slowly lifting your chest.',
      'Keep your hips and legs relaxed against the ground.',
      'Hold briefly before lowering yourself back down with control.'
    ],
    tips: [
      'Lift only as high as feels comfortable.',
      'Keep your shoulders away from your ears.',
      'Avoid locking your elbows.',
      'Stop if you feel pain in your lower back.'
    ]
  },
  'Seated Spinal Twist': {
    id: 'seated_spinal_twist',
    name: 'Seated Spinal Twist',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Spine',
    primaryMuscles: ['Spine'],
    secondaryMuscles: ['Obliques'],
    howToPerform: [
      'Sit on the floor with both legs extended.',
      'Bend one knee and place the foot outside your opposite leg.',
      'Gently rotate your upper body toward the bent knee while keeping your spine tall.',
      'Hold briefly before returning to the center and repeating on the opposite side.'
    ],
    tips: [
      'Lengthen your spine before twisting.',
      'Twist from your torso instead of your neck.',
      'Avoid forcing the rotation.',
      'Breathe slowly throughout the movement.'
    ]
  },
  'Standing Side Stretch': {
    id: 'standing_side_stretch',
    name: 'Standing Side Stretch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Obliques'],
    howToPerform: [
      'Stand upright with your feet shoulder-width apart.',
      'Raise one arm overhead while keeping the other arm relaxed.',
      'Lean your torso gently toward the opposite side until you feel a stretch.',
      'Return to the starting position and repeat on the opposite side.'
    ],
    tips: [
      'Keep your hips facing forward.',
      'Avoid leaning forward or backward.',
      'Reach upward before bending sideways.',
      'Perform the stretch evenly on both sides.'
    ]
  },
  'Superman Hold': {
    id: 'superman_hold',
    name: 'Superman Hold',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Back',
    primaryMuscles: ['Lower Back'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Lie face down with your arms extended overhead.',
      'Lift your arms, chest, and legs slightly off the floor.',
      'Hold the position while squeezing your back muscles.',
      'Lower slowly to the starting position.'
    ],
    tips: [
      'Keep your neck neutral.',
      'Avoid excessive arching.',
      'Breathe steadily.',
      'Lower yourself with control.'
    ]
  },
  'Superman Raise': {
    id: 'superman_raise',
    name: 'Superman Raise',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Back',
    primaryMuscles: ['Lower Back'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Lie face down with your arms extended in front of you.',
      'Lift your arms, chest, and legs off the floor simultaneously.',
      'Pause briefly at the top.',
      'Lower yourself slowly to the starting position.'
    ],
    tips: [
      'Move slowly without jerking.',
      'Keep your neck neutral.',
      'Engage your core during the movement.',
      'Avoid excessive arching of the lower back.'
    ]
  },
  'Alternating Superman': {
    id: 'alternating_superman',
    name: 'Alternating Superman',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Back',
    primaryMuscles: ['Lower Back'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Lie face down with your arms extended overhead.',
      'Lift your right arm and left leg at the same time.',
      'Lower them slowly and repeat with the opposite arm and leg.',
      'Continue alternating with smooth, controlled repetitions.'
    ],
    tips: [
      'Keep your hips stable.',
      'Move slowly and with control.',
      'Avoid rotating your torso.',
      'Breathe steadily throughout the exercise.'
    ]
  },
  'Australian Row': {
    id: 'australian_row',
    name: 'Australian Row',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Biceps'],
    howToPerform: [
      'Position yourself beneath a sturdy bar with your body in a straight line.',
      'Grip the bar slightly wider than shoulder-width.',
      'Pull your chest toward the bar by driving your elbows backward.',
      'Lower yourself slowly to the starting position.'
    ],
    tips: [
      'Keep your body straight throughout.',
      'Squeeze your shoulder blades together.',
      'Avoid shrugging your shoulders.',
      'Lower yourself under control.'
    ]
  },
  'Assisted Pull-up': {
    id: 'assisted_pull_up',
    name: 'Assisted Pull-up',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Biceps'],
    howToPerform: [
      'Attach a resistance band securely to a pull-up bar.',
      'Place one foot or knee into the band.',
      'Pull yourself upward until your chin reaches the bar.',
      'Lower yourself slowly to the starting position.'
    ],
    tips: [
      'Pull with your back instead of your arms.',
      'Avoid swinging your body.',
      'Lower yourself slowly.',
      'Use a band that provides appropriate assistance.'
    ]
  },
  'Band Row': {
    id: 'band_row',
    name: 'Band Row',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Mid Back',
    primaryMuscles: ['Mid Back'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Anchor a resistance band securely in front of you.',
      'Hold the handles with your arms extended.',
      'Pull the band toward your torso by driving your elbows backward.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your chest lifted.',
      'Squeeze your shoulder blades together.',
      'Avoid leaning backward.',
      'Maintain constant tension on the band.'
    ]
  },
  'Seated Band Row': {
    id: 'seated_band_row',
    name: 'Seated Band Row',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Mid Back',
    primaryMuscles: ['Mid Back'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Sit on the floor with your legs extended.',
      'Loop a resistance band around your feet and hold both ends.',
      'Pull the band toward your waist while keeping your back straight.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Sit tall throughout the movement.',
      'Avoid rounding your back.',
      'Pull your elbows close to your body.',
      'Control the return phase.'
    ]
  },
  'Dumbbell Row': {
    id: 'dumbbell_row',
    name: 'Dumbbell Row',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Mid Back'],
    howToPerform: [
      'Place one knee and one hand on a bench for support.',
      'Hold a dumbbell in your free hand with your arm extended.',
      'Pull the dumbbell toward your hip by driving your elbow backward.',
      'Lower the weight slowly before switching sides.'
    ],
    tips: [
      'Keep your back flat.',
      'Pull with your elbow rather than your hand.',
      'Avoid twisting your torso.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Chest Supported Row': {
    id: 'chest_supported_row',
    name: 'Chest Supported Row',
    difficulty: 'Beginner',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells & Incline Bench',
    category: 'Strength',
    target: 'Mid Back',
    primaryMuscles: ['Mid Back'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Lie face down on an incline bench while holding a dumbbell in each hand.',
      'Let your arms hang straight beneath you.',
      'Pull both dumbbells toward your ribs.',
      'Lower them slowly to the starting position.'
    ],
    tips: [
      'Keep your chest in contact with the bench.',
      'Squeeze your shoulder blades together.',
      'Avoid using momentum.',
      'Lower the weights under control.'
    ]
  },
  'Assisted Pull-up Machine': {
    id: 'assisted_pull_up_machine',
    name: 'Assisted Pull-up Machine',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Assisted Pull-up Machine',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Biceps'],
    howToPerform: [
      'Select an appropriate assistance weight on the machine.',
      'Kneel or stand on the assisted platform and grip the handles.',
      'Pull yourself upward until your chin reaches the handles.',
      'Lower yourself slowly with control.'
    ],
    tips: [
      'Use a weight that allows proper form.',
      'Pull your elbows downward.',
      'Avoid swinging your body.',
      'Control the lowering phase.'
    ]
  },
  'Seated Row Machine': {
    id: 'seated_row_machine',
    name: 'Seated Row Machine',
    difficulty: 'Beginner',
    location: 'Gym',
    equipment: 'Seated Row Machine',
    category: 'Strength',
    target: 'Mid Back',
    primaryMuscles: ['Mid Back'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Sit on the machine with your feet firmly against the footrests.',
      'Grip the handles with your arms extended.',
      'Pull the handles toward your torso while squeezing your shoulder blades together.',
      'Return slowly until your arms are fully extended.'
    ],
    tips: [
      'Keep your chest lifted.',
      'Avoid leaning backward excessively.',
      'Pull smoothly without jerking.',
      'Control the return movement.'
    ]
  },
  'Reverse Snow Angel': {
    id: 'reverse_snow_angel',
    name: 'Reverse Snow Angel',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Lie face down with your arms extended overhead and your palms facing the floor.',
      'Lift your chest slightly while raising your arms off the ground.',
      'Sweep your arms outward and down toward your hips in a wide arc.',
      'Reverse the movement slowly and repeat.'
    ],
    tips: [
      'Keep your arms off the floor throughout the movement.',
      'Squeeze your shoulder blades together.',
      'Avoid shrugging your shoulders.',
      'Move slowly and with control.'
    ]
  },
  'Cobra Hold': {
    id: 'cobra_hold',
    name: 'Cobra Hold',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Lower Back',
    primaryMuscles: ['Lower Back'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Lie face down with your hands beside your chest.',
      'Lift your chest off the floor while keeping your hips grounded.',
      'Pull your shoulders back and keep your neck neutral.',
      'Hold the position before lowering slowly.'
    ],
    tips: [
      'Avoid overextending your lower back.',
      'Keep your shoulders relaxed.',
      'Engage your back muscles throughout the hold.',
      'Breathe steadily.'
    ]
  },
  'Reverse Plank': {
    id: 'reverse_plank',
    name: 'Reverse Plank',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Lower Back', 'Glutes'],
    howToPerform: [
      'Sit on the floor with your legs extended and your hands behind your hips.',
      'Press through your hands and lift your hips until your body forms a straight line.',
      'Squeeze your glutes and engage your core.',
      'Hold briefly before lowering with control.'
    ],
    tips: [
      'Keep your shoulders pulled back.',
      'Avoid letting your hips sag.',
      'Keep your neck neutral.',
      'Breathe steadily throughout the hold.'
    ]
  },
  'Table Bridge': {
    id: 'table_bridge',
    name: 'Table Bridge',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Back',
    primaryMuscles: ['Back'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Sit with your knees bent and your hands placed behind you.',
      'Press through your hands and feet to lift your hips.',
      'Raise your body until your torso is parallel to the floor.',
      'Lower yourself slowly back to the starting position.'
    ],
    tips: [
      'Keep your shoulders stable.',
      'Squeeze your glutes at the top.',
      'Avoid arching your lower back.',
      'Move slowly throughout the exercise.'
    ]
  },
  'Bird Dog': {
    id: 'bird_dog',
    name: 'Bird Dog',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Core',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Lower Back'],
    howToPerform: [
      'Begin on your hands and knees in a tabletop position.',
      'Extend one arm forward while extending the opposite leg backward.',
      'Hold briefly while keeping your hips level.',
      'Return to the starting position and repeat on the opposite side.'
    ],
    tips: [
      'Keep your spine neutral.',
      'Avoid rotating your hips.',
      'Move slowly and with control.',
      'Focus on balance and stability.'
    ]
  },
  'Chin-up': {
    id: 'chin_up',
    name: 'Chin-up',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Grip the pull-up bar with your palms facing you.',
      'Hang with your arms fully extended.',
      'Pull yourself upward until your chin clears the bar.',
      'Lower yourself slowly to the starting position.'
    ],
    tips: [
      'Pull with your elbows rather than your arms.',
      'Avoid swinging your body.',
      'Lower yourself slowly.',
      'Keep your core engaged.'
    ]
  },
  'Pull-up': {
    id: 'pull_up',
    name: 'Pull-up',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Upper Back', 'Biceps'],
    howToPerform: [
      'Grip the pull-up bar with your palms facing away from you.',
      'Hang with your arms fully extended.',
      'Pull yourself upward until your chin passes the bar.',
      'Lower yourself slowly with control.'
    ],
    tips: [
      'Keep your shoulders down and back.',
      'Avoid using momentum.',
      'Control the lowering phase.',
      'Maintain a full range of motion.'
    ]
  },
  'Neutral Grip Pull-up': {
    id: 'neutral_grip_pull_up',
    name: 'Neutral Grip Pull-up',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Biceps'],
    howToPerform: [
      'Grip the neutral handles with your palms facing each other.',
      'Hang with your arms fully extended.',
      'Pull yourself upward until your chin reaches handle height.',
      'Lower yourself slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Engage your core throughout.',
      'Avoid swinging.',
      'Lower yourself slowly.'
    ]
  },
  'Straight Arm Pulldown': {
    id: 'straight_arm_pulldown',
    name: 'Straight Arm Pulldown',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Secure a resistance band overhead and hold both ends with straight arms.',
      'Stand tall with your arms extended above shoulder height.',
      'Pull your arms downward toward your thighs while keeping them nearly straight.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows only slightly bent.',
      'Focus on squeezing your lats.',
      'Avoid leaning backward.',
      'Control the return movement.'
    ]
  },
  'Face Pull': {
    id: 'face_pull',
    name: 'Face Pull',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Anchor a resistance band at face height.',
      'Hold both ends of the band with your arms extended.',
      'Pull the band toward your face while driving your elbows outward.',
      'Slowly return to the starting position.'
    ],
    tips: [
      'Lead with your elbows.',
      'Squeeze your shoulder blades together.',
      'Keep your wrists neutral.',
      'Perform slow, controlled repetitions.'
    ]
  },
  'Band Lat Pulldown': {
    id: 'band_lat_pulldown',
    name: 'Band Lat Pulldown',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Secure a resistance band to a high anchor point.',
      'Hold both ends of the band with your arms fully extended overhead.',
      'Pull the band toward your upper chest by driving your elbows downward.',
      'Slowly return to the starting position.'
    ],
    tips: [
      'Keep your chest lifted.',
      'Pull with your elbows rather than your hands.',
      'Avoid leaning backward.',
      'Control the return movement.'
    ]
  },
  'Single Arm Band Row': {
    id: 'single_arm_band_row',
    name: 'Single Arm Band Row',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Anchor a resistance band securely in front of you.',
      'Hold the handle with one hand while standing in a staggered stance.',
      'Pull your elbow back toward your hip.',
      'Return slowly before repeating on the opposite side.'
    ],
    tips: [
      'Resist rotating your torso.',
      'Keep your shoulders level.',
      'Pull smoothly through the full range.',
      'Complete equal repetitions on both sides.'
    ]
  },
  'Reverse Fly': {
    id: 'reverse_fly',
    name: 'Reverse Fly',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Hold a dumbbell in each hand and hinge forward at your hips.',
      'Keep a slight bend in your elbows.',
      'Raise both arms outward until they reach shoulder height.',
      'Lower the weights slowly to the starting position.'
    ],
    tips: [
      'Squeeze your shoulder blades together.',
      'Avoid swinging the weights.',
      'Keep your neck neutral.',
      'Lower the weights under control.'
    ]
  },
  'Renegade Row': {
    id: 'renegade_row',
    name: 'Renegade Row',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Back',
    primaryMuscles: ['Back'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Begin in a high plank while gripping a dumbbell in each hand.',
      'Keep your body stable and row one dumbbell toward your ribs.',
      'Lower it with control.',
      'Repeat on the opposite side while keeping your hips level.'
    ],
    tips: [
      'Keep your hips from rotating.',
      'Engage your core throughout.',
      'Move slowly and with control.',
      'Use lighter weights until your balance improves.'
    ]
  },
  'Single Arm Row': {
    id: 'single_arm_row',
    name: 'Single Arm Row',
    difficulty: 'Intermediate',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Mid Back'],
    howToPerform: [
      'Support yourself with one hand on a bench or sturdy surface.',
      'Hold a dumbbell in your free hand.',
      'Pull your elbow toward your hip until the dumbbell reaches your side.',
      'Lower it slowly before repeating on the opposite side.'
    ],
    tips: [
      'Keep your back flat.',
      'Pull with your elbow.',
      'Avoid twisting your torso.',
      'Perform equal repetitions on both sides.'
    ]
  },
  'Lat Pulldown': {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Biceps'],
    howToPerform: [
      'Sit at the machine and secure your thighs beneath the pads.',
      'Grip the bar slightly wider than shoulder-width.',
      'Pull the bar toward your upper chest by driving your elbows downward.',
      'Slowly return the bar to the starting position.'
    ],
    tips: [
      'Keep your chest lifted.',
      'Avoid leaning too far backward.',
      'Pull smoothly without jerking.',
      'Control the return phase.'
    ]
  },
  'Close Grip Lat Pulldown': {
    id: 'close_grip_lat_pulldown',
    name: 'Close Grip Lat Pulldown',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Mid Back'],
    howToPerform: [
      'Sit at the machine using a close-grip attachment.',
      'Pull the handle toward your upper chest.',
      'Squeeze your back muscles at the bottom.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows close to your body.',
      'Avoid swinging your torso.',
      'Move through a full range of motion.',
      'Control every repetition.'
    ]
  },
  'Wide Grip Lat Pulldown': {
    id: 'wide_grip_lat_pulldown',
    name: 'Wide Grip Lat Pulldown',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Upper Lats',
    primaryMuscles: ['Upper Lats'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Sit at the machine and grip the bar with a wide overhand grip.',
      'Pull the bar toward your upper chest.',
      'Pause briefly while squeezing your lats.',
      'Return slowly until your arms are fully extended.'
    ],
    tips: [
      'Keep your chest proud.',
      'Avoid pulling behind your neck.',
      'Lead with your elbows.',
      'Lower the weight under control.'
    ]
  },
  'Cable Seated Row': {
    id: 'cable_seated_row',
    name: 'Cable Seated Row',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Mid Back',
    primaryMuscles: ['Mid Back'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Sit at the cable row station with your feet firmly against the platform.',
      'Hold the handle with your arms fully extended.',
      'Pull the handle toward your lower ribs while squeezing your shoulder blades together.',
      'Return slowly until your arms are fully extended.'
    ],
    tips: [
      'Sit tall throughout the movement.',
      'Avoid rounding your back.',
      'Pull with your elbows.',
      'Control the return movement.'
    ]
  },
  'Straight Arm Cable Pulldown': {
    id: 'straight_arm_cable_pulldown',
    name: 'Straight Arm Cable Pulldown',
    difficulty: 'Intermediate',
    location: 'Gym',
    equipment: 'Cable Machine',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Stand facing a high cable attachment while holding the straight bar.',
      'Keep your arms nearly straight.',
      'Pull the bar down toward your thighs using your lats.',
      'Return slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows only slightly bent.',
      'Avoid leaning backward.',
      'Focus on squeezing your lats.',
      'Move slowly throughout the exercise.'
    ]
  },
  'Prone Y Raise': {
    id: 'prone_y_raise',
    name: 'Prone Y Raise',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Lie face down with your arms extended overhead in a "Y" position.',
      'Keep your thumbs pointing upward.',
      'Lift your arms off the floor while squeezing your shoulder blades together.',
      'Lower your arms slowly to the starting position.'
    ],
    tips: [
      'Keep your neck neutral.',
      'Lift with your upper back, not your lower back.',
      'Move slowly and under control.',
      'Avoid shrugging your shoulders.'
    ]
  },
  'Prone T Raise': {
    id: 'prone_t_raise',
    name: 'Prone T Raise',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Lie face down with your arms extended straight out to your sides, forming a "T".',
      'Keep your thumbs pointing upward.',
      'Raise your arms until your shoulder blades squeeze together.',
      'Lower slowly to the starting position.'
    ],
    tips: [
      'Keep your elbows slightly soft.',
      'Focus on squeezing your upper back.',
      'Avoid using momentum.',
      'Maintain controlled breathing.'
    ]
  },
  'Prone W Raise': {
    id: 'prone_w_raise',
    name: 'Prone W Raise',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Lie face down with your elbows bent to form a "W" shape.',
      'Pull your shoulder blades together.',
      'Lift your elbows and hands off the floor.',
      'Lower slowly with control.'
    ],
    tips: [
      'Keep your shoulders away from your ears.',
      'Squeeze your shoulder blades at the top.',
      'Avoid arching your lower back.',
      'Move through a comfortable range.'
    ]
  },
  'Swimmer': {
    id: 'swimmer',
    name: 'Swimmer',
    difficulty: 'Advanced',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Full Back',
    primaryMuscles: ['Full Back'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Lie face down with your arms extended overhead.',
      'Lift your arms, chest, and legs slightly off the floor.',
      'Alternate lifting your opposite arm and leg in a swimming motion.',
      'Continue with smooth, controlled movements.'
    ],
    tips: [
      'Keep your neck in a neutral position.',
      'Move slowly instead of rushing.',
      'Engage your glutes throughout the exercise.',
      'Maintain steady breathing.'
    ]
  },
  'Wide Grip Pull-up': {
    id: 'wide_grip_pull_up',
    name: 'Wide Grip Pull-up',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Upper Lats',
    primaryMuscles: ['Upper Lats'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Grip the pull-up bar wider than shoulder-width apart.',
      'Hang with your arms fully extended.',
      'Pull yourself upward until your chin clears the bar.',
      'Lower yourself slowly back to the starting position.'
    ],
    tips: [
      'Pull with your elbows.',
      'Keep your chest lifted.',
      'Avoid swinging your body.',
      'Lower yourself under full control.'
    ]
  },
  'Archer Pull-up': {
    id: 'archer_pull_up',
    name: 'Archer Pull-up',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Biceps'],
    howToPerform: [
      'Grip the pull-up bar with a wide overhand grip.',
      'Pull yourself toward one hand while keeping the opposite arm nearly straight.',
      'Bring your chin close to the working hand.',
      'Lower with control and repeat on the opposite side.'
    ],
    tips: [
      'Perform equal repetitions on both sides.',
      'Keep your movement slow and controlled.',
      'Avoid swinging.',
      'Engage your core throughout.'
    ]
  },
  'Commando Pull-up': {
    id: 'commando_pull_up',
    name: 'Commando Pull-up',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Biceps',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Back'],
    howToPerform: [
      'Grip the pull-up bar with one hand in front of the other.',
      'Pull yourself upward while keeping your head beside the bar.',
      'Lower yourself under control.',
      'Switch your hand position after completing the set.'
    ],
    tips: [
      'Alternate your leading hand each set.',
      'Keep your body stable.',
      'Avoid excessive swinging.',
      'Lower yourself slowly.'
    ]
  },
  'Typewriter Pull-up': {
    id: 'typewriter_pull_up',
    name: 'Typewriter Pull-up',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Pull yourself to the top of a wide-grip pull-up.',
      'Move your body sideways toward one hand while keeping your chin above the bar.',
      'Shift across to the opposite side.',
      'Lower yourself slowly to complete the repetition.'
    ],
    tips: [
      'Master wide-grip pull-ups first.',
      'Keep your movement controlled.',
      'Avoid dropping suddenly.',
      'Engage your core throughout.'
    ]
  },
  'Muscle-up': {
    id: 'muscle_up',
    name: 'Muscle-up',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Pull-up Bar',
    category: 'Strength',
    target: 'Back',
    primaryMuscles: ['Back'],
    secondaryMuscles: ['Chest', 'Arms'],
    howToPerform: [
      'Grip the pull-up bar slightly wider than shoulder-width.',
      'Pull explosively until your chest reaches the bar.',
      'Transition your chest over the bar by leaning forward.',
      'Press upward until your arms are fully extended before lowering with control.'
    ],
    tips: [
      'Master strict pull-ups before attempting muscle-ups.',
      'Use an explosive pull.',
      'Keep your wrists strong during the transition.',
      'Lower yourself slowly to maintain control.'
    ]
  },
  'High Row': {
    id: 'high_row',
    name: 'High Row',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Rear Shoulders'],
    howToPerform: [
      'Anchor a resistance band at chest height and hold both handles.',
      'Step back until the band is under tension.',
      'Pull your elbows outward and back toward your upper ribs.',
      'Slowly return to the starting position.'
    ],
    tips: [
      'Lead with your elbows.',
      'Squeeze your shoulder blades together.',
      'Avoid shrugging your shoulders.',
      'Return slowly under control.'
    ]
  },
  'Low Row': {
    id: 'low_row',
    name: 'Low Row',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Resistance Band',
    category: 'Strength',
    target: 'Mid Back',
    primaryMuscles: ['Mid Back'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Anchor a resistance band at waist level.',
      'Hold the handles with your arms extended.',
      'Pull the handles toward your lower ribs while keeping your elbows close to your body.',
      'Slowly return to the starting position.'
    ],
    tips: [
      'Keep your chest lifted.',
      'Avoid leaning backward.',
      'Pull through your elbows.',
      'Maintain constant band tension.'
    ]
  },
  'Bent-over Dumbbell Row': {
    id: 'bent_over_dumbbell_row',
    name: 'Bent-over Dumbbell Row',
    difficulty: 'Advanced',
    location: 'Home Equipment',
    equipment: 'Adjustable Dumbbells',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Mid Back'],
    howToPerform: [
      'Hold a dumbbell in each hand and hinge forward until your torso is nearly parallel to the floor.',
      'Let your arms hang naturally beneath your shoulders.',
      'Pull the dumbbells toward your lower ribs.',
      'Lower the weights slowly to the starting position.'
    ],
    tips: [
      'Keep your back flat throughout the movement.',
      'Avoid using momentum.',
      'Squeeze your shoulder blades together.',
      'Lower the weights under control.'
    ]
  },
  'T-Bar Row': {
    id: 't_bar_row',
    name: 'T-Bar Row',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'T-Bar Row Machine',
    category: 'Strength',
    target: 'Mid Back',
    primaryMuscles: ['Mid Back'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Stand over the T-bar with your feet shoulder-width apart.',
      'Hinge forward and grip the handles firmly.',
      'Pull the weight toward your lower chest by driving your elbows backward.',
      'Lower the weight slowly to the starting position.'
    ],
    tips: [
      'Keep your spine neutral.',
      'Pull through your elbows.',
      'Avoid jerking the weight.',
      'Control every repetition.'
    ]
  },
  'Barbell Bent-over Row': {
    id: 'barbell_bent_over_row',
    name: 'Barbell Bent-over Row',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Mid Back'],
    howToPerform: [
      'Hold a barbell with an overhand grip and hinge forward at the hips.',
      'Keep your back flat and knees slightly bent.',
      'Pull the bar toward your lower ribs.',
      'Lower it slowly until your arms are fully extended.'
    ],
    tips: [
      'Maintain a neutral spine.',
      'Avoid swinging the bar.',
      'Keep your core engaged.',
      'Pull smoothly through the full range.'
    ]
  },
  'Pendlay Row': {
    id: 'pendlay_row',
    name: 'Pendlay Row',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Upper Back',
    primaryMuscles: ['Upper Back'],
    secondaryMuscles: ['Lats'],
    howToPerform: [
      'Stand over a barbell with your torso parallel to the floor.',
      'Grip the bar slightly wider than shoulder-width.',
      'Pull the bar explosively toward your lower chest.',
      'Return the bar completely to the floor before the next repetition.'
    ],
    tips: [
      'Start every repetition from a dead stop.',
      'Keep your back flat.',
      'Avoid using your legs to generate momentum.',
      'Reset your position before each lift.'
    ]
  },
  'Rack Pull': {
    id: 'rack_pull',
    name: 'Rack Pull',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell & Power Rack',
    category: 'Strength',
    target: 'Entire Posterior Chain',
    primaryMuscles: ['Entire Posterior Chain'],
    secondaryMuscles: ['Traps'],
    howToPerform: [
      'Set the barbell on safety pins just below or above knee height.',
      'Stand with your feet hip-width apart and grip the bar.',
      'Drive through your heels while extending your hips and knees.',
      'Lower the bar back to the rack under control.'
    ],
    tips: [
      'Keep the bar close to your body.',
      'Brace your core before lifting.',
      'Avoid rounding your back.',
      'Lower the weight slowly.'
    ]
  },
  'Deadlift': {
    id: 'deadlift',
    name: 'Deadlift',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Barbell',
    category: 'Strength',
    target: 'Full Back',
    primaryMuscles: ['Full Back'],
    secondaryMuscles: ['Glutes', 'Hamstrings'],
    howToPerform: [
      'Stand with your feet hip-width apart and the barbell over the middle of your feet.',
      'Grip the bar while keeping your back flat and chest lifted.',
      'Drive through your heels as you stand, keeping the bar close to your body.',
      'Lower the bar by hinging at the hips with control.'
    ],
    tips: [
      'Brace your core before every repetition.',
      'Keep the bar close to your legs.',
      'Avoid rounding your back.',
      'Lift with proper technique before increasing weight.'
    ]
  },
  'Meadows Row': {
    id: 'meadows_row',
    name: 'Meadows Row',
    difficulty: 'Advanced',
    location: 'Gym',
    equipment: 'Landmine Attachment & Barbell',
    category: 'Strength',
    target: 'Lats',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Upper Back'],
    howToPerform: [
      'Stand beside one end of a landmine barbell.',
      'Hinge forward and grip the loaded end with one hand.',
      'Pull the bar toward your hip while driving your elbow backward.',
      'Lower the weight slowly before switching sides.'
    ],
    tips: [
      'Keep your torso stable.',
      'Pull through your elbow.',
      'Avoid twisting your body.',
      'Complete equal repetitions on both sides.'
    ]
  },

  // ==========================================
  // HIPS EXERCISES
  // ==========================================
  'Hip Circles': {
    id: 'hip_circles',
    name: 'Hip Circles',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Hip Mobility',
    primaryMuscles: ['Hip Mobility'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand upright with your feet shoulder-width apart and place your hands on your hips.',
      'Slowly rotate your hips in a large circular motion.',
      'Complete several controlled circles in one direction.',
      'Reverse the direction and repeat the movement.'
    ],
    tips: [
      'Keep your upper body relaxed.',
      'Move slowly through a comfortable range of motion.',
      'Make smooth, controlled circles.',
      'Perform the same number of repetitions in both directions.'
    ]
  },
  'Hip Opener': {
    id: 'hip_opener',
    name: 'Hip Opener',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Hip Mobility',
    primaryMuscles: ['Hip Mobility'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand upright while holding onto a stable surface if needed.',
      'Lift one knee toward your chest.',
      'Rotate your knee outward in a wide circular motion to open the hip.',
      'Return to the starting position and repeat before switching legs.'
    ],
    tips: [
      'Keep your torso upright throughout the movement.',
      'Move slowly without swinging your leg.',
      'Perform the exercise on both sides evenly.',
      'Stay within a comfortable range of motion.'
    ]
  },
  'World\'s Greatest Stretch': {
    id: 'worlds_greatest_stretch',
    name: "World's Greatest Stretch",
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Full Lower Body',
    primaryMuscles: ['Full Lower Body'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Step into a deep forward lunge with one foot planted outside your hands.',
      'Keep your back leg extended while lowering your hips.',
      'Rotate your upper body toward your front leg and reach one arm toward the ceiling.',
      'Return to the starting position and repeat on the opposite side.'
    ],
    tips: [
      'Keep your front knee aligned over your foot.',
      'Move slowly between each position.',
      'Avoid bouncing while stretching.',
      'Perform evenly on both sides.'
    ]
  },
  'Butterfly Stretch': {
    id: 'butterfly_stretch',
    name: 'Butterfly Stretch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Inner Thigh',
    primaryMuscles: ['Inner Thigh'],
    secondaryMuscles: ['Hips'],
    howToPerform: [
      'Sit on the floor and bring the soles of your feet together.',
      'Hold your feet with both hands.',
      'Gently lower your knees toward the floor until you feel a stretch.',
      'Hold briefly before relaxing.'
    ],
    tips: [
      'Sit tall with a straight back.',
      'Avoid forcing your knees downward.',
      'Relax your shoulders throughout the stretch.',
      'Breathe slowly and steadily.'
    ]
  },
  'Figure Four Stretch': {
    id: 'figure_four_stretch',
    name: 'Figure Four Stretch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Glutes',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hips'],
    howToPerform: [
      'Lie on your back with both knees bent.',
      'Cross one ankle over the opposite knee to form a figure-four shape.',
      'Gently pull the supporting leg toward your chest until you feel a stretch.',
      'Hold briefly before repeating on the opposite side.'
    ],
    tips: [
      'Keep your head and shoulders relaxed.',
      'Pull gently without forcing the stretch.',
      'Breathe steadily throughout the movement.',
      'Perform the stretch equally on both sides.'
    ]
  },

  // ==========================================
  // LEGS EXERCISES
  // ==========================================
  'Standing Quad Stretch': {
    id: 'standing_quad_stretch',
    name: 'Standing Quad Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Quads',
    primaryMuscles: ['Quads'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Stand upright and hold onto a stable surface if needed for balance.',
      'Bend one knee and bring your heel toward your glutes.',
      'Hold your ankle with the same-side hand and gently pull until you feel a stretch in the front of your thigh.',
      'Hold briefly before returning to the starting position and repeat on the opposite leg.'
    ],
    tips: [
      'Keep your knees close together.',
      'Stand tall without leaning forward.',
      'Pull gently without forcing the stretch.',
      'Repeat evenly on both legs.'
    ]
  },
  'Standing Hamstring Stretch': {
    id: 'standing_hamstring_stretch',
    name: 'Standing Hamstring Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Calves'],
    howToPerform: [
      'Stand upright and place one heel slightly in front of you with your toes pointing upward.',
      'Keep your front leg straight and your back knee slightly bent.',
      'Hinge forward from your hips while keeping your back straight.',
      'Hold briefly before returning to the starting position and repeat on the opposite leg.'
    ],
    tips: [
      'Keep your back straight throughout the movement.',
      'Avoid rounding your shoulders.',
      'Stretch only until you feel comfortable tension.',
      'Perform equally on both sides.'
    ]
  },
  'Seated Hamstring Stretch': {
    id: 'seated_hamstring_stretch',
    name: 'Seated Hamstring Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Calves'],
    howToPerform: [
      'Sit on the floor with one leg extended and the other bent inward.',
      'Keep your extended leg straight with your toes pointing upward.',
      'Lean forward from your hips and reach toward your foot.',
      'Hold briefly before repeating on the opposite leg.'
    ],
    tips: [
      'Keep your back as straight as possible.',
      'Reach forward without bouncing.',
      'Stretch only within a comfortable range.',
      'Breathe steadily throughout the movement.'
    ]
  },
  'Side Lunge Stretch': {
    id: 'side_lunge_stretch',
    name: 'Side Lunge Stretch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Adductors',
    primaryMuscles: ['Adductors'],
    secondaryMuscles: ['Glutes'],
    howToPerform: [
      'Stand with your feet wider than shoulder-width apart.',
      'Shift your weight to one side while bending that knee.',
      'Keep the opposite leg straight and your foot flat on the floor.',
      'Hold briefly before returning to the center and repeating on the opposite side.'
    ],
    tips: [
      'Keep your chest upright.',
      'Ensure your bent knee tracks over your foot.',
      'Avoid forcing the stretch.',
      'Perform evenly on both sides.'
    ]
  },
  'Deep Squat Hold': {
    id: 'deep_squat_hold',
    name: 'Deep Squat Hold',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Hips',
    primaryMuscles: ['Hips'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand with your feet slightly wider than shoulder-width apart.',
      'Slowly lower yourself into a deep squat while keeping your heels on the floor.',
      'Rest your elbows against the inside of your knees and gently press them outward.',
      'Hold the position while maintaining an upright chest.'
    ],
    tips: [
      'Keep your heels in contact with the floor.',
      'Maintain a neutral spine.',
      'Avoid letting your knees collapse inward.',
      'Hold only as long as comfortable.'
    ]
  },
  'Kneeling Hip Flexor Stretch': {
    id: 'kneeling_hip_flexor_stretch',
    name: 'Kneeling Hip Flexor Stretch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Hip Flexors',
    primaryMuscles: ['Hip Flexors'],
    secondaryMuscles: ['Quads'],
    howToPerform: [
      'Begin in a kneeling lunge position with one knee on the floor and the opposite foot in front.',
      'Keep your torso upright and gently shift your hips forward.',
      'Continue until you feel a stretch at the front of the kneeling leg.',
      'Hold briefly before repeating on the opposite side.'
    ],
    tips: [
      'Keep your torso upright throughout the stretch.',
      'Avoid arching your lower back.',
      'Move your hips forward gradually.',
      'Perform the stretch equally on both sides.'
    ]
  },

  // ==========================================
  // ANKLES EXERCISES
  // ==========================================
  'Ankle Circles': {
    id: 'ankle_circles',
    name: 'Ankle Circles',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Ankles',
    primaryMuscles: ['Ankles'],
    secondaryMuscles: ['Calves'],
    howToPerform: [
      'Sit or stand comfortably with one foot lifted slightly off the ground.',
      'Slowly rotate your ankle in a large circular motion.',
      'Complete several circles in one direction.',
      'Reverse the direction and repeat before switching to the other foot.'
    ],
    tips: [
      'Move slowly and smoothly.',
      'Make the circles as large as comfortably possible.',
      'Avoid moving your entire leg.',
      'Perform evenly on both ankles.'
    ]
  },
  'Heel-to-Toe Rock': {
    id: 'heel_to_toe_rock',
    name: 'Heel-to-Toe Rock',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Ankles',
    primaryMuscles: ['Ankles'],
    secondaryMuscles: ['Calves'],
    howToPerform: [
      'Stand upright with your feet hip-width apart.',
      'Slowly rise onto your toes.',
      'Roll back onto your heels while lifting your toes off the floor.',
      'Continue rocking smoothly between both positions.'
    ],
    tips: [
      'Keep the movement controlled.',
      'Hold onto a wall if you need balance.',
      'Move through a full comfortable range.',
      'Maintain an upright posture.'
    ]
  },
  'Wall Calf Stretch': {
    id: 'wall_calf_stretch',
    name: 'Wall Calf Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'Wall',
    category: 'Stretch',
    target: 'Calves',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Achilles Tendon'],
    howToPerform: [
      'Stand facing a wall and place both hands against it.',
      'Step one foot backward while keeping the heel flat on the floor.',
      'Bend your front knee until you feel a stretch in your back calf.',
      'Hold briefly before repeating on the opposite leg.'
    ],
    tips: [
      'Keep your back heel firmly on the floor.',
      'Do not bounce during the stretch.',
      'Keep your back leg straight.',
      'Perform evenly on both legs.'
    ]
  },
  'Toe Raises': {
    id: 'toe_raises',
    name: 'Toe Raises',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Strength',
    target: 'Tibialis',
    primaryMuscles: ['Tibialis'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand upright with your feet flat on the floor.',
      'Keep your heels planted.',
      'Lift your toes as high as comfortably possible.',
      'Lower them slowly and repeat.'
    ],
    tips: [
      'Move slowly and with control.',
      'Avoid rocking your body backward.',
      'Keep your knees relaxed.',
      'Focus on lifting only your toes.'
    ]
  },
  'Dynamic Calf Stretch': {
    id: 'dynamic_calf_stretch',
    name: 'Dynamic Calf Stretch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Calves',
    primaryMuscles: ['Calves'],
    secondaryMuscles: ['Ankles'],
    howToPerform: [
      'Stand facing a wall with one foot behind the other.',
      'Bend and straighten your back knee in a slow, controlled motion.',
      'Keep your back heel in contact with the floor.',
      'Continue the movement smoothly before switching legs.'
    ],
    tips: [
      'Keep your heel on the floor throughout the exercise.',
      'Move slowly without bouncing.',
      'Maintain an upright posture.',
      'Repeat evenly on both legs.'
    ]
  },

  // ==========================================
  // WRISTS EXERCISES
  // ==========================================
  'Wrist Circles': {
    id: 'wrist_circles',
    name: 'Wrist Circles',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Wrists',
    primaryMuscles: ['Wrists'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Extend your arms comfortably in front of your body.',
      'Make a gentle fist or keep your fingers relaxed.',
      'Rotate your wrists in slow circular motions.',
      'Reverse the direction after several repetitions.'
    ],
    tips: [
      'Move through a comfortable range of motion.',
      'Keep your forearms relaxed.',
      'Rotate both wrists evenly.',
      'Avoid rushing the movement.'
    ]
  },
  'Wrist Flexor Stretch': {
    id: 'wrist_flexor_stretch',
    name: 'Wrist Flexor Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Wrists'],
    howToPerform: [
      'Extend one arm straight in front of you with your palm facing upward.',
      'Use your opposite hand to gently pull your fingers downward.',
      'Continue until you feel a stretch along the underside of your forearm.',
      'Hold briefly before repeating on the opposite arm.'
    ],
    tips: [
      'Stretch gently without forcing the wrist.',
      'Keep your elbow straight.',
      'Relax your shoulders.',
      'Perform equally on both arms.'
    ]
  },
  'Wrist Extensor Stretch': {
    id: 'wrist_extensor_stretch',
    name: 'Wrist Extensor Stretch',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Forearms',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: ['Wrists'],
    howToPerform: [
      'Extend one arm in front of you with your palm facing downward.',
      'Use your opposite hand to gently pull your fingers toward your body.',
      'Feel the stretch along the top of your forearm.',
      'Hold briefly before repeating on the opposite arm.'
    ],
    tips: [
      'Keep your elbow straight.',
      'Stretch only until you feel comfortable tension.',
      'Avoid twisting your wrist.',
      'Repeat evenly on both sides.'
    ]
  },
  'Palm Pulses': {
    id: 'palm_pulses',
    name: 'Palm Pulses',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Wrists',
    primaryMuscles: ['Wrists'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Begin on your hands and knees with your palms flat on the floor.',
      'Keep your elbows straight and your fingers pointing forward.',
      'Gently shift your body weight forward until you feel a stretch through your wrists.',
      'Rock back to the starting position and repeat slowly.'
    ],
    tips: [
      'Move slowly and under control.',
      'Do not force your wrists into pain.',
      'Keep your hands flat throughout the movement.',
      'Reduce your range if you feel discomfort.'
    ]
  },
  'Fingertip Stretch': {
    id: 'fingertip_stretch',
    name: 'Fingertip Stretch',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Stretch',
    target: 'Fingers',
    primaryMuscles: ['Fingers'],
    secondaryMuscles: ['Forearms'],
    howToPerform: [
      'Begin on your hands and knees.',
      'Lift your palms slightly so your fingertips remain in contact with the floor.',
      'Gently shift your weight forward until you feel a stretch through your fingers.',
      'Return slowly to the starting position and repeat.'
    ],
    tips: [
      'Apply pressure gradually.',
      'Keep the movement slow and controlled.',
      'Stop if you experience finger pain.',
      'Relax your shoulders throughout the exercise.'
    ]
  },

  // ==========================================
  // FULL BODY WARM-UP EXERCISES
  // ==========================================
  'Jumping Jacks': {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Cardio',
    target: 'Full Body Warm-up',
    primaryMuscles: ['Full Body Warm-up'],
    secondaryMuscles: ['Cardio'],
    howToPerform: [
      'Stand upright with your feet together and your arms at your sides.',
      'Jump while spreading your feet shoulder-width apart and raise your arms overhead.',
      'Jump again to return to the starting position.',
      'Continue with a steady, controlled rhythm.'
    ],
    tips: [
      'Land softly on the balls of your feet.',
      'Keep your knees slightly bent during landing.',
      'Maintain a steady breathing rhythm.',
      'Start slowly before increasing your pace.'
    ]
  },
  'High Knees': {
    id: 'high_knees',
    name: 'High Knees',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Cardio',
    target: 'Legs',
    primaryMuscles: ['Legs'],
    secondaryMuscles: ['Cardio'],
    howToPerform: [
      'Stand upright with your feet hip-width apart.',
      'Begin jogging in place while lifting one knee toward hip height.',
      'Alternate legs quickly while pumping your arms naturally.',
      'Continue at a comfortable pace with controlled movement.'
    ],
    tips: [
      'Keep your chest upright.',
      'Land softly on each step.',
      'Engage your core throughout the exercise.',
      'Increase speed only if you can maintain good form.'
    ]
  },
  'Butt Kicks': {
    id: 'butt_kicks',
    name: 'Butt Kicks',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Cardio',
    target: 'Hamstrings',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: ['Cardio'],
    howToPerform: [
      'Stand upright with your feet hip-width apart.',
      'Jog in place while bringing one heel toward your glutes.',
      'Alternate legs in a smooth, continuous motion.',
      'Swing your arms naturally as you move.'
    ],
    tips: [
      'Keep your torso upright.',
      'Land softly on each step.',
      'Maintain a comfortable rhythm.',
      'Avoid leaning forward excessively.'
    ]
  },
  'March in Place': {
    id: 'march_in_place',
    name: 'March in Place',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Cardio',
    target: 'Full Body',
    primaryMuscles: ['Full Body'],
    secondaryMuscles: ['Cardio'],
    howToPerform: [
      'Stand upright with your feet hip-width apart.',
      'Lift one knee while swinging the opposite arm naturally.',
      'Lower your foot and repeat with the opposite side.',
      'Continue marching with a steady rhythm.'
    ],
    tips: [
      'Maintain an upright posture.',
      'Lift your knees comfortably.',
      'Swing your arms naturally.',
      'Breathe steadily throughout the exercise.'
    ]
  },
  'Arm Swings': {
    id: 'arm_swings',
    name: 'Arm Swings',
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Shoulders',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Chest'],
    howToPerform: [
      'Stand upright with your arms extended in front of your body.',
      'Swing your arms outward until you feel your chest open.',
      'Bring your arms back across your body in a controlled motion.',
      'Continue alternating smoothly.'
    ],
    tips: [
      'Keep the movement relaxed.',
      'Avoid forcing your shoulders.',
      'Perform smooth, controlled swings.',
      'Maintain an upright posture.'
    ]
  },
  'Leg Swings': {
    id: 'leg_swings',
    name: 'Leg Swings',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Hips',
    primaryMuscles: ['Hips'],
    secondaryMuscles: ['Hamstrings'],
    howToPerform: [
      'Stand beside a wall or stable object for balance.',
      'Swing one leg forward and backward in a controlled motion.',
      'Keep your torso upright while allowing your hip to move freely.',
      'Repeat before switching to the opposite leg.'
    ],
    tips: [
      'Start with small swings and gradually increase the range.',
      'Avoid swinging too forcefully.',
      'Keep your core engaged.',
      'Perform evenly on both legs.'
    ]
  },
  'Inchworm Walkout': {
    id: 'inchworm_walkout',
    name: 'Inchworm Walkout',
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Full Body',
    primaryMuscles: ['Full Body'],
    secondaryMuscles: ['Core'],
    howToPerform: [
      'Stand upright with your feet hip-width apart.',
      'Bend forward and place your hands on the floor.',
      'Walk your hands forward into a high plank position.',
      'Walk your hands back toward your feet and return to standing.'
    ],
    tips: [
      'Keep your legs as straight as comfortably possible.',
      'Engage your core during the plank.',
      'Move slowly and under control.',
      'Avoid letting your hips sag.'
    ]
  },
  'World\'s Greatest Stretch Flow': {
    id: 'worlds_greatest_stretch_flow',
    name: "World's Greatest Stretch Flow",
    difficulty: 'Intermediate',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'Full Body',
    primaryMuscles: ['Full Body'],
    secondaryMuscles: ['Hip Flexors'],
    howToPerform: [
      'Step into a deep lunge with one foot outside your hands.',
      'Lower your hips and rotate your torso toward the front leg.',
      'Return your hand to the floor and straighten your front leg slightly for a hamstring stretch.',
      'Return to the starting position and repeat on the opposite side in one continuous flow.'
    ],
    tips: [
      'Move smoothly between each position.',
      'Focus on controlled breathing.',
      'Avoid rushing through the flow.',
      'Perform evenly on both sides.'
    ]
  }
};

export function getExerciseDetailByName(name: string): ExerciseDetailItem {
  if (EXERCISE_DETAILS_REGISTRY[name]) {
    return EXERCISE_DETAILS_REGISTRY[name];
  }

  // Normalized fallback lookup (handles smart quotes, hyphens vs spaces, case insensitivity)
  const normSearch = name.replace(/[’']/g, "'").replace(/-/g, ' ').toLowerCase().trim();
  const foundKey = Object.keys(EXERCISE_DETAILS_REGISTRY).find(k =>
    k.replace(/[’']/g, "'").replace(/-/g, ' ').toLowerCase().trim() === normSearch
  );

  if (foundKey && EXERCISE_DETAILS_REGISTRY[foundKey]) {
    return EXERCISE_DETAILS_REGISTRY[foundKey];
  }

  // Fallback for unpopulated exercises during testing
  return {
    id: name.toLowerCase().replace(/\s+/g, '_'),
    name: name,
    difficulty: 'Beginner',
    location: 'Home',
    equipment: 'None',
    category: 'Mobility',
    target: 'General Mobility',
    primaryMuscles: ['Target Muscle'],
    secondaryMuscles: [],
    howToPerform: [
      'Assume comfortable starting position.',
      'Execute movement with controlled velocity.',
      'Pause at maximum range of motion.',
      'Return smoothly to starting position.'
    ],
    tips: [
      'Maintain steady breathing throughout.',
      'Keep form controlled and avoid sudden snapping.'
    ]
  };
}

