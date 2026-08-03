import rawMarkdown from '../../FitBee_Exercise_Library.md?raw';

export interface ExerciseLibraryItem {
  id: string;
  name: string;
  category: string; // e.g. 'Stretches - Warm-up', 'Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs'
  subcategory?: string; // For Warm-up: 'Neck', 'Shoulders', 'Chest', 'Back', 'Hips', 'Legs', 'Ankles & Calves', 'Wrists', 'Full Body'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  location: 'Home' | 'Home Equipment' | 'Gym';
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
}

export interface MainCategory {
  id: string;
  title: string;
  stickerKey: string;
}

export interface WarmUpSubcategory {
  id: string;
  title: string;
  stickerKey: string;
}

export const MAIN_CATEGORIES: MainCategory[] = [
  { id: 'stretches-warmup', title: 'Stretches - Warm-up', stickerKey: 'stretches' },
  { id: 'chest', title: 'Chest', stickerKey: 'chest' },
  { id: 'back', title: 'Back', stickerKey: 'back' },
  { id: 'shoulders', title: 'Shoulders', stickerKey: 'shoulders' },
  { id: 'arms', title: 'Arms', stickerKey: 'arms' },
  { id: 'core', title: 'Core', stickerKey: 'core' },
  { id: 'legs', title: 'Legs', stickerKey: 'legs' },
];

export const WARMUP_SUBCATEGORIES: WarmUpSubcategory[] = [
  { id: 'neck', title: 'Neck', stickerKey: 'neck' },
  { id: 'shoulders', title: 'Shoulders', stickerKey: 'shoulders' },
  { id: 'chest', title: 'Chest', stickerKey: 'chest' },
  { id: 'back', title: 'Back', stickerKey: 'back' },
  { id: 'hips', title: 'Hips', stickerKey: 'hips' },
  { id: 'legs', title: 'Legs', stickerKey: 'legs' },
  { id: 'ankles-calves', title: 'Ankles & Calves', stickerKey: 'calves' },
  { id: 'wrists', title: 'Wrists', stickerKey: 'wrists' },
  { id: 'full-body', title: 'Full Body', stickerKey: 'fullbody' },
];

let cachedExercises: ExerciseLibraryItem[] | null = null;

export function parseExerciseLibrary(): ExerciseLibraryItem[] {
  if (cachedExercises) return cachedExercises;

  const lines = rawMarkdown.split(/\r?\n/);
  const items: ExerciseLibraryItem[] = [];

  let currentCategory = '';
  let currentWarmupSubcategory = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip legend and summary headers
    if (line.includes('= Home') || line.includes('= Gym') || line.includes('= Beginner')) continue;

    // Main section headers
    if (line.startsWith('# ') && !line.includes('|')) {
      const title = line.replace(/^#\s*\d*_?/, '').trim();
      if (title.includes('Warm-up') || title.includes('Mobility')) {
        currentCategory = 'Stretches - Warm-up';
        currentWarmupSubcategory = '';
      } else if (title.includes('Chest')) {
        currentCategory = 'Chest';
        currentWarmupSubcategory = '';
      } else if (title.includes('Back')) {
        currentCategory = 'Back';
        currentWarmupSubcategory = '';
      } else if (title.includes('Shoulders')) {
        currentCategory = 'Shoulders';
        currentWarmupSubcategory = '';
      } else if (title.includes('Arms')) {
        currentCategory = 'Arms';
        currentWarmupSubcategory = '';
      } else if (title.includes('Core')) {
        currentCategory = 'Core';
        currentWarmupSubcategory = '';
      } else if (title.includes('Legs')) {
        currentCategory = 'Legs';
        currentWarmupSubcategory = '';
      }
    }

    // Warm-up subcategory headers inside Warm-up tree e.g. `├── Neck/`, `├── Ankles & Calves/`
    if (currentCategory === 'Stretches - Warm-up' && (line.startsWith('├──') || line.startsWith('└──')) && line.endsWith('/') && !line.includes('🟩') && !line.includes('🟨') && !line.includes('🟥')) {
      const sub = line.replace(/^[│├└─\s]+/, '').replace('/', '').trim();
      if (['Neck', 'Shoulders', 'Chest', 'Back', 'Hips', 'Legs', 'Ankles & Calves', 'Wrists', 'Full Body'].includes(sub)) {
        currentWarmupSubcategory = sub;
      }
    }

    // Exercise entry line
    if ((line.includes('🟩') || line.includes('🟨') || line.includes('🟥')) && !line.includes('Legend') && !line.includes('=')) {
      let location: 'Home' | 'Home Equipment' | 'Gym' = 'Home';
      if (line.includes('🟩')) location = 'Home';
      else if (line.includes('🟨')) location = 'Home Equipment';
      else if (line.includes('🟥')) location = 'Gym';

      const match = line.match(/(?:🟩|🟨|🟥)\s*([^#|]+)/);
      if (match) {
        const exName = match[1].trim();

        let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner';
        let primaryMuscles: string[] = [];
        let secondaryMuscles: string[] = [];

        if (i + 1 < lines.length) {
          const nextCleanLine = lines[i + 1].replace(/^[│├└─\s]+/, '').trim();
          if (nextCleanLine.startsWith('#')) {
            const meta = nextCleanLine.substring(1).trim();
            const parts = meta.split('|');

            if (parts[0]) {
              const muscleTokens = parts[0].trim().split(',').map((m) => m.trim()).filter(Boolean);
              if (muscleTokens.length > 0) {
                primaryMuscles = [muscleTokens[0]];
                secondaryMuscles = muscleTokens.slice(1);
              }
            }

            if (parts[1]) {
              const diffPart = parts[1].trim();
              if (diffPart.includes('Intermediate') || diffPart.includes('🟡')) difficulty = 'Intermediate';
              else if (diffPart.includes('Advanced') || diffPart.includes('🔴')) difficulty = 'Advanced';
              else if (diffPart.includes('Beginner') || diffPart.includes('🟢')) difficulty = 'Beginner';
            }
          }
        }

        // Derive clean equipment string
        let equipment = 'None';
        const nameLower = exName.toLowerCase();
        if (location === 'Home') {
          if (nameLower.includes('wall')) equipment = 'Wall';
          else if (nameLower.includes('chair')) equipment = 'Chair';
          else if (nameLower.includes('doorway')) equipment = 'Doorway';
          else if (nameLower.includes('bench')) equipment = 'Bench / Chair';
          else equipment = 'Bodyweight';
        } else if (location === 'Home Equipment') {
          if (nameLower.includes('dumbbell')) equipment = 'Adjustable Dumbbells';
          else if (nameLower.includes('band')) equipment = 'Resistance Band';
          else if (nameLower.includes('pull-up') || nameLower.includes('chin-up')) equipment = 'Pull-up Bar';
          else if (nameLower.includes('gripper')) equipment = 'Hand Gripper';
          else if (nameLower.includes('ab wheel') || nameLower.includes('rollout')) equipment = 'Ab Wheel';
          else equipment = 'Home Equipment';
        } else {
          if (nameLower.includes('smith machine')) equipment = 'Smith Machine';
          else if (nameLower.includes('cable') || nameLower.includes('pulldown')) equipment = 'Cable Machine';
          else if (nameLower.includes('barbell')) equipment = 'Barbell';
          else if (nameLower.includes('pec deck') || nameLower.includes('machine')) equipment = 'Gym Machine';
          else equipment = 'Gym Equipment';
        }

        items.push({
          id: `ex_${items.length + 1}`,
          name: exName,
          category: currentCategory,
          subcategory: currentCategory === 'Stretches - Warm-up' ? currentWarmupSubcategory : undefined,
          difficulty,
          location,
          equipment,
          primaryMuscles,
          secondaryMuscles,
        });
      }
    }
  }

  cachedExercises = items;
  return items;
}

export function getFilteredExercises(
  categoryTitle: string,
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced',
  warmupSubcategoryTitle?: string
): ExerciseLibraryItem[] {
  const all = parseExerciseLibrary();
  return all.filter((item) => {
    if (item.category !== categoryTitle) return false;
    if (categoryTitle === 'Stretches - Warm-up' && warmupSubcategoryTitle) {
      if (item.subcategory !== warmupSubcategoryTitle) return false;
    }
    return item.difficulty === difficulty;
  });
}
