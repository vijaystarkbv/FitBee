import Fuse from 'fuse.js';
import { parseSearchDatabase, SearchDocument } from './searchDatabaseParser';
import { getRecentSearchEntries } from './recentSearches';

export interface ActiveFilters {
  difficulties: string[]; // e.g. ['Beginner', 'Intermediate']
  locations: string[];    // e.g. ['Home', 'Gym']
  equipment: string[];    // e.g. ['Dumbbells', 'Pull-up Bar']
  muscles: string[];      // e.g. ['Biceps', 'Forearms']
}

export interface DynamicFilterOption {
  value: string;
  count: number;
}

export interface DynamicFiltersState {
  difficulties: DynamicFilterOption[];
  locations: DynamicFilterOption[];
  equipment: DynamicFilterOption[];
  muscles: DynamicFilterOption[];
}

export interface SuggestionItem {
  id: string;
  text: string;
  type: 'Exercise' | 'Muscle' | 'Equipment' | 'Goal';
  targetQuery: string;
  count?: number;
  score?: number;
}

export interface SearchResultsResponse {
  query: string;
  suggestedTerm?: string;
  totalCount: number;
  filteredCount: number;
  results: SearchDocument[];
  dynamicFilters: DynamicFiltersState;
  implicitFiltersApplied?: Partial<ActiveFilters>;
}

export enum QueryType {
  Exercise = 'Exercise',
  Muscle = 'Muscle',
  Equipment = 'Equipment',
  Intent = 'Intent',
  Abbreviation = 'Abbreviation',
  Structured = 'Structured',
  General = 'General',
}

/**
 * Named Score Constants (Normalized Scale: 0 to 100)
 */
export const SCORE = {
  EXACT_NAME_MATCH: 100,
  EXACT_ALIAS_MATCH: 90,
  ABBREVIATION_MATCH: 85,
  PREFIX_NAME_MATCH: 70,
  PHRASE_MATCH_BONUS: 35,
  WORD_BOUNDARY_MATCH: 50,
  PRIMARY_MUSCLE_MATCH: 45,
  EQUIPMENT_MATCH: 40,
  INTENT_KEYWORD_MATCH: 40,
  SECONDARY_MUSCLE_MATCH: 25,
  TOKEN_COVERAGE_MATCH: 15,
  GENERAL_KEYWORD_MATCH: 10,
  MINIMUM_SCORE_THRESHOLD: 25,
} as const;

/**
 * Reusable Stop Words Set (Change 5)
 */
export const STOP_WORDS = new Set([
  'exercise', 'workout', 'for', 'to', 'my', 'the', 'a', 'an', 'best', 'good',
  'easy', 'hard', 'please', 'show', 'find', 'give', 'need', 'i', 'want', 'day',
]);

/**
 * Search Engine Limits (Zero Magic Numbers)
 */
export const SEARCH_LIMITS = {
  MAX_SUGGESTIONS: 8,
  MIN_CANDIDATE_POOL: 10,
  MAX_FALLBACK_CANDIDATES: 25,
  FUSE_MAX_DISTANCE: 100,
  STRICT_FUSE_THRESHOLD: 0.20,
} as const;

/**
 * Safe Regex Escaper
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Information-Preserving Synonym Dictionary
 */
export const SYNONYM_MAP: Record<string, string> = {
  'stretches': 'stretch',
  'stretching': 'stretch',
  'workouts': 'workout',
  'exercises': 'exercise',
  'pushups': 'push-up',
  'pushup': 'push-up',
  'pullups': 'pull-up',
  'pullup': 'pull-up',
  'squats': 'squat',
  'rear delts': 'rear deltoids shoulders rear delts',
  'front delts': 'front deltoids shoulders front delts',
  'delts': 'deltoids shoulders delts',
  'pecs': 'pectoralis chest pecs',
  'lats': 'latissimus dorsi back lats',
  'traps': 'trapezius upper back traps',
  'abs': 'abdominals core abs',
  'quads': 'quadriceps legs quads',
  'hammies': 'hamstrings legs hammies',
  'glutes': 'gluteus hips glutes',
};

export function normalizeQueryWithSynonyms(query: string): string {
  let qNorm = query.toLowerCase().trim();
  Object.keys(SYNONYM_MAP).forEach((syn) => {
    const target = SYNONYM_MAP[syn];
    const regex = new RegExp(`\\b${escapeRegExp(syn)}\\b`, 'gi');
    qNorm = qNorm.replace(regex, target);
  });
  return qNorm;
}

let cachedMuscles: Set<string> | null = null;
let cachedEquipment: Set<string> | null = null;
let cachedIntentKeywords: Set<string> | null = null;
let cachedAbbreviations: Set<string> | null = null;

export function getDynamicMuscles(docs: SearchDocument[]): Set<string> {
  if (cachedMuscles) return cachedMuscles;
  const set = new Set<string>();
  docs.forEach((d) => {
    d.primaryMuscles.forEach((m) => { if (m && m !== 'None') set.add(m); });
    d.secondaryMuscles.forEach((m) => { if (m && m !== 'None') set.add(m); });
  });
  cachedMuscles = set;
  return set;
}

export function getDynamicEquipment(docs: SearchDocument[]): Set<string> {
  if (cachedEquipment) return cachedEquipment;
  const set = new Set<string>();
  docs.forEach((d) => {
    if (d.equipment && d.equipment !== 'None') set.add(d.equipment);
  });
  cachedEquipment = set;
  return set;
}

export function getDynamicIntentKeywords(docs: SearchDocument[]): Set<string> {
  if (cachedIntentKeywords) return cachedIntentKeywords;
  const set = new Set<string>();
  docs.forEach((d) => {
    d.intentKeywords.forEach((ik) => { if (ik) set.add(ik.toLowerCase()); });
  });
  cachedIntentKeywords = set;
  return set;
}

export function getDynamicAbbreviations(docs: SearchDocument[]): Set<string> {
  if (cachedAbbreviations) return cachedAbbreviations;
  const set = new Set<string>();
  docs.forEach((d) => {
    d.aliases.forEach((a) => {
      const trimmed = a.trim();
      if (trimmed.length <= 5 || /^[A-Z0-9\s-]+$/.test(trimmed)) {
        set.add(trimmed.toLowerCase());
      }
    });
  });
  cachedAbbreviations = set;
  return set;
}

/**
 * Filter non-informative stop words
 */
export function filterStopWords(tokens: string[]): string[] {
  return tokens.filter((t) => t.length > 0 && !STOP_WORDS.has(t.toLowerCase()));
}

/**
 * Parse Structured Searches (e.g. "home chest", "beginner dumbbell", "advanced triceps")
 */
export function parseImplicitStructuredQuery(query: string, docs: SearchDocument[]): {
  implicitDifficulties: string[];
  implicitLocations: string[];
  implicitEquipment: string[];
  implicitMuscles: string[];
  implicitIntents: string[];
  cleanQuery: string;
} {
  const qLower = query.toLowerCase().trim();
  const rawTokens = qLower.split(/\s+/);
  const tokens = filterStopWords(rawTokens);

  const implicitDifficulties: string[] = [];
  const implicitLocations: string[] = [];
  const implicitEquipment: string[] = [];
  const implicitMuscles: string[] = [];
  const implicitIntents: string[] = [];
  const remainingTokens: string[] = [];

  const muscles = getDynamicMuscles(docs);
  const equipment = getDynamicEquipment(docs);
  const intentKeywords = getDynamicIntentKeywords(docs);

  tokens.forEach((t) => {
    // Difficulty concept matching (including synonyms easy/hard)
    if (['beginner', 'easy', 'simple', 'starter'].includes(t)) {
      implicitDifficulties.push('Beginner');
    } else if (['intermediate', 'medium', 'moderate'].includes(t)) {
      implicitDifficulties.push('Intermediate');
    } else if (['advanced', 'hard', 'tough', 'pro'].includes(t)) {
      implicitDifficulties.push('Advanced');
    } else if (t === 'home') {
      implicitLocations.push('Home');
      implicitLocations.push('Home Equipment');
    } else if (t === 'gym') {
      implicitLocations.push('Gym');
    } else {
      let matchedEq = false;
      let matchedMus = false;
      let matchedIntent = false;

      // Intent / Goal Concept Matching (dynamic + synonyms)
      if (['stretch', 'stretches', 'stretching', 'warmup', 'warm up', 'rehab', 'posture', 'mobility', 'fat loss', 'strength', 'cardio'].includes(t)) {
        implicitIntents.push(t);
        matchedIntent = true;
      } else {
        Array.from(intentKeywords).forEach((ik) => {
          if (ik.includes(t) || t.includes(ik)) {
            implicitIntents.push(ik);
            matchedIntent = true;
          }
        });
      }

      Array.from(equipment).forEach((eq) => {
        if (eq.toLowerCase().includes(t)) {
          implicitEquipment.push(eq);
          matchedEq = true;
        }
      });

      Array.from(muscles).forEach((m) => {
        if (m.toLowerCase().includes(t)) {
          implicitMuscles.push(m);
          matchedMus = true;
        }
      });

      if (!matchedEq && !matchedMus && !matchedIntent) {
        remainingTokens.push(t);
      }
    }
  });

  return {
    implicitDifficulties: Array.from(new Set(implicitDifficulties)),
    implicitLocations: Array.from(new Set(implicitLocations)),
    implicitEquipment: Array.from(new Set(implicitEquipment)),
    implicitMuscles: Array.from(new Set(implicitMuscles)),
    implicitIntents: Array.from(new Set(implicitIntents)),
    cleanQuery: remainingTokens.join(' '),
  };
}

/**
 * Intelligent Query Type Detection
 */
export function detectQueryType(query: string, docs: SearchDocument[]): QueryType {
  const qLower = normalizeQueryWithSynonyms(query);
  if (!qLower) return QueryType.General;

  const abbrevs = getDynamicAbbreviations(docs);
  if (abbrevs.has(qLower)) return QueryType.Abbreviation;

  const structured = parseImplicitStructuredQuery(query, docs);
  if (
    structured.implicitDifficulties.length > 0 ||
    structured.implicitLocations.length > 0 ||
    structured.implicitIntents.length > 0 ||
    (structured.implicitEquipment.length > 0 && structured.implicitMuscles.length > 0)
  ) {
    return QueryType.Structured;
  }

  const muscles = getDynamicMuscles(docs);
  if (Array.from(muscles).some((m) => m.toLowerCase() === qLower || (qLower.length >= 4 && qLower.includes(m.toLowerCase())))) {
    return QueryType.Muscle;
  }

  const equipment = getDynamicEquipment(docs);
  if (Array.from(equipment).some((e) => e.toLowerCase() === qLower || (qLower.length >= 4 && qLower.includes(e.toLowerCase())))) {
    return QueryType.Equipment;
  }

  const intents = getDynamicIntentKeywords(docs);
  if (Array.from(intents).some((ik) => ik === qLower || ik.includes(qLower))) {
    return QueryType.Intent;
  }

  if (docs.some((d) => d.displayName.toLowerCase().startsWith(qLower) || d.aliases.some((a) => a.toLowerCase().startsWith(qLower)))) {
    return QueryType.Exercise;
  }

  return QueryType.General;
}

/**
 * Adaptive Fuse Search Engine Instances
 */
const engineInstances: Partial<Record<QueryType, Fuse<SearchDocument>>> = {};

export function getSearchEngine(qType: QueryType): Fuse<SearchDocument> {
  if (engineInstances[qType]) {
    return engineInstances[qType]!;
  }

  const allDocs = parseSearchDatabase();
  let keys: { name: string; weight: number }[] = [];
  let threshold: number = SEARCH_LIMITS.STRICT_FUSE_THRESHOLD;

  switch (qType) {
    case QueryType.Exercise:
      keys = [
        { name: 'displayName', weight: 18 },
        { name: 'name', weight: 18 },
        { name: 'aliases', weight: 14 },
      ];
      threshold = 0.18;
      break;
    case QueryType.Muscle:
      keys = [
        { name: 'primaryMuscles', weight: 18 },
        { name: 'secondaryMuscles', weight: 12 },
        { name: 'displayName', weight: 8 },
      ];
      threshold = 0.22;
      break;
    case QueryType.Equipment:
      keys = [
        { name: 'equipment', weight: 18 },
        { name: 'displayName', weight: 10 },
      ];
      threshold = 0.22;
      break;
    case QueryType.Abbreviation:
      keys = [
        { name: 'aliases', weight: 20 },
        { name: 'displayName', weight: 15 },
      ];
      threshold = 0.12;
      break;
    case QueryType.Structured:
    default:
      keys = [
        { name: 'displayName', weight: 12 },
        { name: 'name', weight: 12 },
        { name: 'aliases', weight: 10 },
        { name: 'primaryMuscles', weight: 8 },
        { name: 'equipment', weight: 8 },
      ];
      threshold = 0.20;
      break;
  }

  const fuse = new Fuse(allDocs, {
    keys,
    threshold,
    distance: SEARCH_LIMITS.FUSE_MAX_DISTANCE,
    minMatchCharLength: 2,
    ignoreLocation: true,
    includeScore: true,
  });

  engineInstances[qType] = fuse;
  return fuse;
}

// 9-tier hierarchy rank (Used strictly as a TIE-BREAKER only!)
const HIERARCHY_MAP: Record<string, number> = {
  'Beginner_Home': 1,
  'Beginner_Home Equipment': 2,
  'Beginner_Gym': 3,
  'Intermediate_Home': 4,
  'Intermediate_Home Equipment': 5,
  'Intermediate_Gym': 6,
  'Advanced_Home': 7,
  'Advanced_Home Equipment': 8,
  'Advanced_Gym': 9,
};

export function getHierarchyRank(doc: SearchDocument): number {
  const key = `${doc.difficulty}_${doc.location}`;
  return HIERARCHY_MAP[key] || 99;
}

/**
 * Unified Single Ranked Live Suggestions List (Command Palette / Raycast Style)
 */
export function getLiveSuggestions(query: string, limit: number = SEARCH_LIMITS.MAX_SUGGESTIONS): SuggestionItem[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const qLower = normalizeQueryWithSynonyms(trimmed);
  const allDocs = parseSearchDatabase();
  const recentEntries = getRecentSearchEntries();

  const dynamicMuscles = getDynamicMuscles(allDocs);
  const dynamicEquipment = getDynamicEquipment(allDocs);

  const candidates: SuggestionItem[] = [];
  const seenTexts = new Set<string>();

  const getRecentCount = (text: string): number => {
    const found = recentEntries.find((e) => e.query.toLowerCase() === text.toLowerCase());
    return found ? found.count : 0;
  };

  // 1. Exact & Prefix Match Exercise Display Names
  allDocs.forEach((doc) => {
    const nameLower = doc.displayName.toLowerCase();
    let matchScore = 0;

    if (nameLower === qLower) matchScore = 100;
    else if (nameLower.startsWith(qLower)) matchScore = 80;
    else if (nameLower.includes(qLower)) matchScore = 50;

    if (matchScore > 0 && !seenTexts.has(nameLower)) {
      seenTexts.add(nameLower);
      candidates.push({
        id: `sug_ex_${doc.id}`,
        text: doc.displayName,
        type: 'Exercise',
        targetQuery: doc.displayName,
        count: getRecentCount(doc.displayName),
        score: matchScore + getRecentCount(doc.displayName) * 5,
      });
    }
  });

  // 2. Fuzzy Fuse search for typos in suggestions
  if (candidates.length < 4) {
    const fuseEngine = getSearchEngine(QueryType.Exercise);
    const fuseResults = fuseEngine.search(trimmed);
    fuseResults.forEach((r: { item: SearchDocument; score?: number }) => {
      const nameLower = r.item.displayName.toLowerCase();
      if (!seenTexts.has(nameLower)) {
        seenTexts.add(nameLower);
        const fuseScore = (1 - (r.score || 0)) * 40;
        candidates.push({
          id: `sug_fuzzy_${r.item.id}`,
          text: r.item.displayName,
          type: 'Exercise',
          targetQuery: r.item.displayName,
          count: getRecentCount(r.item.displayName),
          score: fuseScore,
        });
      }
    });
  }

  // 3. Muscle Group Matches
  dynamicMuscles.forEach((mus) => {
    const musLower = mus.toLowerCase();
    if ((musLower.startsWith(qLower) || musLower.includes(qLower)) && !seenTexts.has(musLower)) {
      seenTexts.add(musLower);
      const count = allDocs.filter((d) =>
        [...d.primaryMuscles, ...d.secondaryMuscles].some((m) => m.toLowerCase() === musLower)
      ).length;

      candidates.push({
        id: `sug_mus_${mus}`,
        text: mus,
        type: 'Muscle',
        targetQuery: mus,
        count,
        score: 60 + (musLower.startsWith(qLower) ? 20 : 0),
      });
    }
  });

  // 4. Equipment Matches
  dynamicEquipment.forEach((eq) => {
    const eqLower = eq.toLowerCase();
    if ((eqLower.startsWith(qLower) || eqLower.includes(qLower)) && !seenTexts.has(eqLower)) {
      seenTexts.add(eqLower);
      const count = allDocs.filter((d) => d.equipment.toLowerCase().includes(eqLower)).length;

      candidates.push({
        id: `sug_eq_${eq}`,
        text: eq,
        type: 'Equipment',
        targetQuery: eq,
        count,
        score: 55 + (eqLower.startsWith(qLower) ? 20 : 0),
      });
    }
  });

  candidates.sort((a, b) => (b.score || 0) - (a.score || 0) || (b.count || 0) - (a.count || 0));
  return candidates.slice(0, limit);
}

/**
 * CHANGE 1: Soft Multipliers (Coverage influences ranking, NEVER hard rejects)
 */
export function getCoverageMultiplier(coverage: number): number {
  if (coverage >= 1.0) return 1.20;  // Strong boost
  if (coverage >= 0.75) return 1.05; // Medium boost
  if (coverage >= 0.50) return 0.90; // Small boost
  if (coverage >= 0.25) return 0.75; // Slight penalty
  return 0.60;                       // Soft penalty (Never 0.00 hard rejection!)
}

/**
 * CHANGE 3: Smooth Composite Confidence
 */
export function calculateRealConfidence(
  coverage: number,
  fuseScore: number | undefined,
  isExactOrPhrase: boolean,
  hasMatchedIntent: boolean,
  isTitleMatch: boolean
): number {
  const coverageComponent = coverage * 25;
  const fuseComponent = fuseScore !== undefined ? (1 - Math.min(fuseScore, 0.5)) * 35 : 20;
  const titleComponent = isExactOrPhrase ? 25 : (isTitleMatch ? 18 : 5);
  const intentComponent = hasMatchedIntent ? 15 : 0;

  return Math.min(100, Math.round(coverageComponent + fuseComponent + titleComponent + intentComponent));
}

/**
 * Regex-based Token Frequency Counting
 */
function countTokenOccurrences(text: string, token: string): number {
  if (token.length < 2) return 0;
  try {
    const escaped = escapeRegExp(token.toLowerCase());
    const matches = text.match(new RegExp(escaped, 'gi'));
    return matches ? Math.min(matches.length, 4) : 0;
  } catch {
    return 0;
  }
}

/**
 * Smart Readable Ranking Pipeline
 */
function calculateDocRelevance(
  doc: SearchDocument,
  q: string,
  _qType: QueryType,
  allDocs: SearchDocument[],
  fuseScore?: number
): {
  score: number;
  matchedReasons: string[];
  matchReason: string;
  confidence: number;
  coverage: number;
  isExactOrPhrase: boolean;
  hasMatchedIntent: boolean;
  isTitleMatch: boolean;
} {
  const qLower = normalizeQueryWithSynonyms(q);
  const escapedQ = escapeRegExp(qLower);
  const rawTokens = qLower.split(/\s+/);
  const tokens = filterStopWords(rawTokens);

  let baseScore = 0;
  let isExactOrPhrase = false;
  let isTitleMatch = false;
  let hasMatchedIntent = false;
  const matchedReasons: string[] = [];

  const allNames = [doc.displayName, doc.name, ...doc.aliases].map((s) => s.toLowerCase());
  const docFullText = `${doc.displayName} ${doc.name} ${doc.aliases.join(' ')} ${doc.equipment} ${doc.primaryMuscles.join(' ')} ${doc.secondaryMuscles.join(' ')} ${doc.intentKeywords.join(' ')} ${doc.keywords.join(' ')}`.toLowerCase();

  // --- 1. DETECT CONCEPTS IN QUERY ---
  const structured = parseImplicitStructuredQuery(q, allDocs);
  let totalConcepts = 0;
  let matchedConcepts = 0;

  if (structured.implicitMuscles.length > 0) {
    totalConcepts++;
    const docMusclesLower = [...doc.primaryMuscles, ...doc.secondaryMuscles].map((m) => m.toLowerCase());
    if (structured.implicitMuscles.some((m) => docMusclesLower.includes(m.toLowerCase()))) matchedConcepts++;
  }
  if (structured.implicitIntents.length > 0) {
    totalConcepts++;
    const docIntentsLower = doc.intentKeywords.map((ik) => ik.toLowerCase());
    const matchesIntentInKeywords = structured.implicitIntents.some((ik) => docIntentsLower.some((dik) => dik.includes(ik.toLowerCase()) || ik.toLowerCase().includes(dik)));
    const matchesIntentInText = structured.implicitIntents.some((ik) => docFullText.includes(ik.toLowerCase()));

    if (matchesIntentInKeywords || matchesIntentInText) matchedConcepts++;
  }
  if (structured.implicitEquipment.length > 0) {
    totalConcepts++;
    const docEqNorm = doc.equipment.toLowerCase();
    if (structured.implicitEquipment.some((eq) => docEqNorm.includes(eq.toLowerCase()))) matchedConcepts++;
  }
  if (structured.implicitDifficulties.length > 0) {
    totalConcepts++;
    if (structured.implicitDifficulties.includes(doc.difficulty)) matchedConcepts++;
  }
  if (structured.implicitLocations.length > 0) {
    totalConcepts++;
    if (structured.implicitLocations.includes(doc.location)) matchedConcepts++;
  }

  // Coverage ratio
  const coverage = totalConcepts > 0 ? matchedConcepts / totalConcepts : 1.0;

  // --- 2. CHANGE 5: EXERCISE NAME MATCHING (HEAVY WEIGHT) ---
  if (doc.displayName.toLowerCase() === qLower || doc.name.toLowerCase() === qLower) {
    baseScore += SCORE.EXACT_NAME_MATCH;
    isExactOrPhrase = true;
    isTitleMatch = true;
    matchedReasons.push('Exact Name');
  } else if (doc.aliases.some((a) => a.toLowerCase() === qLower)) {
    baseScore += SCORE.EXACT_ALIAS_MATCH;
    isExactOrPhrase = true;
    isTitleMatch = true;
    matchedReasons.push('Alias');
  } else if (allNames.some((n) => n === qLower)) {
    baseScore += SCORE.PHRASE_MATCH_BONUS;
    isExactOrPhrase = true;
    isTitleMatch = true;
    matchedReasons.push('Exact Phrase');
  } else if (allNames.some((n) => n.startsWith(qLower))) {
    baseScore += SCORE.PREFIX_NAME_MATCH;
    isTitleMatch = true;
    matchedReasons.push('Exercise Name');
  } else if (tokens.length > 0 && tokens.some((t) => allNames.some((n) => n.includes(t)))) {
    baseScore += SCORE.WORD_BOUNDARY_MATCH;
    isTitleMatch = true;
    matchedReasons.push('Exercise Name');
  }

  // --- 3. WORD BOUNDARY & MUSCLE MATCHING ---
  try {
    const wordBoundaryRegex = new RegExp(`\\b${escapedQ}\\b`, 'i');
    if (allNames.some((n) => wordBoundaryRegex.test(n))) {
      baseScore += SCORE.WORD_BOUNDARY_MATCH;
      isTitleMatch = true;
    }
  } catch {
    if (allNames.some((n) => n.includes(qLower))) {
      baseScore += SCORE.WORD_BOUNDARY_MATCH;
      isTitleMatch = true;
    }
  }

  const matchedPrimary = doc.primaryMuscles.find((m) => tokens.some((t) => m.toLowerCase().includes(t)));
  const matchedSecondary = doc.secondaryMuscles.find((m) => tokens.some((t) => m.toLowerCase().includes(t)));
  if (matchedPrimary) {
    baseScore += SCORE.PRIMARY_MUSCLE_MATCH;
    matchedReasons.push(`${matchedPrimary}`);
  } else if (matchedSecondary) {
    baseScore += SCORE.SECONDARY_MUSCLE_MATCH;
    matchedReasons.push(`${matchedSecondary}`);
  }

  // --- 4. EQUIPMENT MATCHING ---
  const matchedEq = tokens.find((t) => doc.equipment.toLowerCase().includes(t));
  if (matchedEq || (qLower.includes('dumbbell') && doc.equipment.toLowerCase().includes('dumbbell'))) {
    baseScore += SCORE.EQUIPMENT_MATCH;
    matchedReasons.push(`${doc.equipment}`);
  }

  // --- 5. INTENT PRIORITY ---
  const matchedIntentKey = doc.intentKeywords.find((ik) => tokens.some((t) => ik.toLowerCase().includes(t) || t.includes(ik.toLowerCase())));
  const matchesIntentText = tokens.some((t) => docFullText.includes(t));

  if (matchedIntentKey || matchesIntentText) {
    baseScore += SCORE.INTENT_KEYWORD_MATCH;
    hasMatchedIntent = true;
    if (matchedIntentKey) matchedReasons.push(`${matchedIntentKey}`);
  }

  // --- 6. TOKEN FREQUENCY BONUS ---
  if (tokens.length > 0) {
    let freqCount = 0;
    tokens.forEach((t) => {
      freqCount += countTokenOccurrences(docFullText, t);
    });
    baseScore += Math.min(freqCount * 4, 16);
  }

  // --- 7. HEAVY ASYMMETRIC MISMATCH PENALTIES ---
  let penalties = 0;

  // Muscle Mismatch Penalty (Only if title doesn't match!)
  if (structured.implicitMuscles.length > 0 && !isTitleMatch) {
    const docMusclesLower = [...doc.primaryMuscles, ...doc.secondaryMuscles].map((m) => m.toLowerCase());
    const matchesMus = structured.implicitMuscles.some((m) => docMusclesLower.includes(m.toLowerCase()));
    if (!matchesMus) {
      penalties += 40;
    }
  }

  // Intent / Goal Mismatch Penalty (Only if title doesn't match!)
  if (structured.implicitIntents.length > 0 && !isTitleMatch) {
    const docIntentsLower = doc.intentKeywords.map((ik) => ik.toLowerCase());
    const matchesIntentInKeywords = structured.implicitIntents.some((ik) => docIntentsLower.some((dik) => dik.includes(ik.toLowerCase()) || ik.toLowerCase().includes(dik)));
    const matchesIntentInText = structured.implicitIntents.some((ik) => docFullText.includes(ik.toLowerCase()));

    if (!matchesIntentInKeywords && !matchesIntentInText) {
      penalties += 25;
    }
  }

  // Equipment Mismatch Penalty (Only if title doesn't match!)
  if (structured.implicitEquipment.length > 0 && !isTitleMatch) {
    const docEqNorm = doc.equipment.toLowerCase();
    const matchesEq = structured.implicitEquipment.some((eq) => docEqNorm.includes(eq.toLowerCase()));
    if (!matchesEq) {
      penalties += 20;
    }
  }

  // Difficulty Mismatch Penalty
  if (structured.implicitDifficulties.length > 0 && !isTitleMatch) {
    if (!structured.implicitDifficulties.includes(doc.difficulty)) {
      penalties += 10;
    }
  }

  // Location Mismatch Penalty
  if (structured.implicitLocations.length > 0 && !isTitleMatch) {
    if (!structured.implicitLocations.includes(doc.location)) {
      penalties += 10;
    }
  }

  // Raw score after penalties
  let rawScore = Math.max(0, baseScore - penalties);

  // Real composite confidence calculation
  const confidence = calculateRealConfidence(coverage, fuseScore, isExactOrPhrase, hasMatchedIntent, isTitleMatch);

  let cleanReason = 'Matched by Exercise Name';
  if (matchedReasons.length > 0) {
    cleanReason = `Matched by ${matchedReasons.slice(0, 2).join(' • ')}`;
  }

  return { score: rawScore, matchedReasons, matchReason: cleanReason, confidence, coverage, isExactOrPhrase, hasMatchedIntent, isTitleMatch };
}

/**
 * Execute Search (Soft Fail Graceful Rejection & Relevance Ranking)
 */
export function executeSearch(query: string, filters: ActiveFilters): SearchResultsResponse {
  const allDocs = parseSearchDatabase();
  const trimmed = query.trim();

  let matchedDocs: SearchDocument[] = [];
  let suggestedTerm: string | undefined;

  if (!trimmed || trimmed === '*') {
    matchedDocs = [...allDocs];
  } else {
    const qLower = normalizeQueryWithSynonyms(trimmed);

    // Check fuzzy correction in misspellings
    for (const doc of allDocs) {
      if (doc.misspellings.some((m) => m.toLowerCase() === qLower)) {
        if (qLower === 'nuck') suggestedTerm = 'Neck';
        else if (qLower === 'dumbel') suggestedTerm = 'Dumbbell';
        else suggestedTerm = doc.displayName;
        break;
      }
    }

    const qType = detectQueryType(trimmed, allDocs);
    const engine = getSearchEngine(qType);
    const fuseResults = engine.search(trimmed);

    const candidateDocsMap = new Map<string, { doc: SearchDocument; fuseScore?: number }>();

    fuseResults.forEach((r) => {
      if (r.score !== undefined && r.score <= 0.25) {
        candidateDocsMap.set(r.item.id, { doc: r.item, fuseScore: r.score });
      }
    });

    // Fallback candidates: Ensure title/name matching exercises are ALWAYS included as candidates
    const rawTokens = qLower.split(/\s+/);
    const tokens = filterStopWords(rawTokens);
    allDocs.forEach((doc) => {
      if (candidateDocsMap.has(doc.id)) return;
      const searchableText = `${doc.displayName} ${doc.aliases.join(' ')} ${doc.equipment} ${doc.primaryMuscles.join(' ')} ${doc.intentKeywords.join(' ')} ${doc.keywords.join(' ')}`.toLowerCase();

      if (tokens.length > 0 && tokens.some((t) => searchableText.includes(t))) {
        candidateDocsMap.set(doc.id, { doc });
      }
    });

    // Rescore candidates using pipeline
    const scoredDocs: { doc: SearchDocument; score: number; matchReason: string; confidence: number }[] = [];

    candidateDocsMap.forEach(({ doc, fuseScore }) => {
      let { score, matchReason, confidence, coverage, isExactOrPhrase, hasMatchedIntent, isTitleMatch } = calculateDocRelevance(doc, trimmed, qType, allDocs, fuseScore);

      if (fuseScore !== undefined) {
        score += (1 - fuseScore) * 15;
      }

      const coverageMult = getCoverageMultiplier(coverage);
      const finalScore = score * coverageMult;

      // CHANGE 4: REJECT ONLY WHEN EVERYTHING IS WEAK (SOFT FAIL)
      // Accept if exact match OR title match OR intent match OR high fuse score (<= 0.18) OR score >= 20
      const isStrongMatch = isExactOrPhrase || isTitleMatch || hasMatchedIntent || (fuseScore !== undefined && fuseScore <= 0.18);
      const isWeakUnrelated = !isStrongMatch && (fuseScore === undefined || fuseScore > 0.18) && finalScore < 20;

      if (!isWeakUnrelated && finalScore > 0) {
        scoredDocs.push({
          doc: { ...doc, matchReason },
          score: finalScore,
          matchReason,
          confidence,
        });
      }
    });

    // Sort strictly by relevance score descending
    scoredDocs.sort((a, b) => b.score - a.score || getHierarchyRank(a.doc) - getHierarchyRank(b.doc));

    matchedDocs = scoredDocs.map((item) => item.doc);

    if (import.meta.env?.DEV) {
      console.log(`[SearchEngine] Query: "${trimmed}" | QueryType: ${qType} | Fuse Results: ${fuseResults.length} | Scored: ${scoredDocs.length} | Final Results: ${matchedDocs.length}`);
    }
  }

  // Dynamic Filters Calculation
  const diffCountMap = new Map<string, number>();
  const locCountMap = new Map<string, number>();
  const eqCountMap = new Map<string, number>();
  const musCountMap = new Map<string, number>();

  matchedDocs.forEach((doc) => {
    if (doc.difficulty) diffCountMap.set(doc.difficulty, (diffCountMap.get(doc.difficulty) || 0) + 1);
    if (doc.location) locCountMap.set(doc.location, (locCountMap.get(doc.location) || 0) + 1);
    if (doc.equipment) eqCountMap.set(doc.equipment, (eqCountMap.get(doc.equipment) || 0) + 1);

    const muscles = Array.from(new Set([...doc.primaryMuscles, ...doc.secondaryMuscles]));
    muscles.forEach((mus) => {
      if (mus && mus !== 'None') musCountMap.set(mus, (musCountMap.get(mus) || 0) + 1);
    });
  });

  const dynamicFilters: DynamicFiltersState = {
    difficulties: ['Beginner', 'Intermediate', 'Advanced']
      .filter((d) => (diffCountMap.get(d) || 0) > 0)
      .map((d) => ({ value: d, count: diffCountMap.get(d)! })),
    locations: ['Home', 'Home Equipment', 'Gym']
      .filter((l) => (locCountMap.get(l) || 0) > 0)
      .map((l) => ({ value: l, count: locCountMap.get(l)! })),
    equipment: Array.from(eqCountMap.keys())
      .sort((a, b) => (eqCountMap.get(b) || 0) - (eqCountMap.get(a) || 0))
      .map((eq) => ({ value: eq, count: eqCountMap.get(eq)! })),
    muscles: Array.from(musCountMap.keys())
      .sort((a, b) => (musCountMap.get(b) || 0) - (musCountMap.get(a) || 0))
      .map((m) => ({ value: m, count: musCountMap.get(m)! })),
  };

  // Apply Active Filters
  let filteredDocs = matchedDocs.filter((doc) => {
    if (filters.difficulties.length > 0 && !filters.difficulties.includes(doc.difficulty)) {
      return false;
    }
    if (filters.locations.length > 0 && !filters.locations.includes(doc.location)) {
      return false;
    }
    if (filters.equipment.length > 0) {
      const docEqNorm = doc.equipment.toLowerCase();
      const matchesEq = filters.equipment.some((eq) => {
        const eqNorm = eq.toLowerCase();
        return docEqNorm === eqNorm || docEqNorm.includes(eqNorm) || eqNorm.includes(docEqNorm);
      });
      if (!matchesEq) return false;
    }
    if (filters.muscles.length > 0) {
      const docMusclesLower = [...doc.primaryMuscles, ...doc.secondaryMuscles].map((m) => m.toLowerCase());
      const hasMuscle = filters.muscles.some((m) => docMusclesLower.includes(m.toLowerCase()));
      if (!hasMuscle) return false;
    }
    return true;
  });

  return {
    query: trimmed,
    suggestedTerm,
    totalCount: matchedDocs.length,
    filteredCount: filteredDocs.length,
    results: filteredDocs,
    dynamicFilters,
  };
}




