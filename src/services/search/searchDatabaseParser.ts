import rawSearchDb from '../../../Exercise_Search_Database.md?raw';
import { getExerciseDetailByName } from '../../data/exerciseDetailData';
import { ExerciseDetailItem } from '../../types/exerciseDetail';

export interface SearchDocument {
  id: string;
  name: string;
  displayName: string;
  normalizedDisplayName: string;
  aliases: string[];
  normalizedAliases: string[];
  misspellings: string[];
  keywords: string[];
  normalizedKeywords: string[];
  intentKeywords: string[];
  normalizedIntentKeywords: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  location: 'Home' | 'Home Equipment' | 'Gym';
  equipment: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  category: string;
  detailItem: ExerciseDetailItem;
  matchReason?: string;
}

enum ParserSection {
  None,
  Display,
  Aliases,
  Misspellings,
  Keywords,
  Intent,
}

let cachedSearchDocs: ReadonlyArray<Readonly<SearchDocument>> | null = null;

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-');
}

export function parseSearchDatabase(): SearchDocument[] {
  if (cachedSearchDocs) {
    return cachedSearchDocs as SearchDocument[];
  }

  const blocks = rawSearchDb.split(/^##\s+/m).slice(1);
  const docs: SearchDocument[] = [];
  const docMap = new Map<string, SearchDocument>();

  blocks.forEach((block) => {
    const lines = block.split(/\r?\n/);
    const rawTitle = lines[0].trim();
    if (!rawTitle) return;

    const normKey = rawTitle.toLowerCase();

    let displayName = rawTitle;
    const aliases: string[] = [rawTitle];
    const misspellings: string[] = [];
    const keywords: string[] = [];
    const intentKeywords: string[] = [];

    let currentSection: ParserSection = ParserSection.None;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line === '---') continue;

      if (line === 'Display Name') { currentSection = ParserSection.Display; continue; }
      if (line === 'Aliases') { currentSection = ParserSection.Aliases; continue; }
      if (line === 'Common Misspellings') { currentSection = ParserSection.Misspellings; continue; }
      if (line === 'Keywords') { currentSection = ParserSection.Keywords; continue; }
      if (line === 'Intent Keywords') { currentSection = ParserSection.Intent; continue; }

      if (line.startsWith('- ')) {
        const val = line.substring(2).trim();
        if (!val) continue;

        switch (currentSection) {
          case ParserSection.Display:
            displayName = val;
            break;
          case ParserSection.Aliases:
            if (!aliases.includes(val)) aliases.push(val);
            break;
          case ParserSection.Misspellings:
            if (!misspellings.includes(val)) misspellings.push(val);
            break;
          case ParserSection.Keywords:
            if (!keywords.includes(val)) keywords.push(val);
            break;
          case ParserSection.Intent:
            if (!intentKeywords.includes(val)) intentKeywords.push(val);
            break;
        }
      }
    }

    // Validation
    if (!displayName) {
      console.warn(`[SearchParser Warning] Missing Display Name for block: "${rawTitle}"`);
    }

    if (docMap.has(normKey)) {
      // Merge unique metadata into existing doc
      const existing = docMap.get(normKey)!;
      aliases.forEach((a) => { if (!existing.aliases.includes(a)) existing.aliases.push(a); });
      misspellings.forEach((m) => { if (!existing.misspellings.includes(m)) existing.misspellings.push(m); });
      keywords.forEach((k) => { if (!existing.keywords.includes(k)) existing.keywords.push(k); });
      intentKeywords.forEach((ik) => { if (!existing.intentKeywords.includes(ik)) existing.intentKeywords.push(ik); });

      // Re-normalize merged fields
      existing.normalizedAliases = existing.aliases.map((a) => a.toLowerCase());
      existing.normalizedKeywords = existing.keywords.map((k) => k.toLowerCase());
      existing.normalizedIntentKeywords = existing.intentKeywords.map((ik) => ik.toLowerCase());
    } else {
      const detail = getExerciseDetailByName(rawTitle);
      const newDoc: SearchDocument = {
        id: createSlug(rawTitle),
        name: rawTitle,
        displayName,
        normalizedDisplayName: displayName.toLowerCase(),
        aliases,
        normalizedAliases: aliases.map((a) => a.toLowerCase()),
        misspellings,
        keywords,
        normalizedKeywords: keywords.map((k) => k.toLowerCase()),
        intentKeywords,
        normalizedIntentKeywords: intentKeywords.map((ik) => ik.toLowerCase()),
        difficulty: detail.difficulty,
        location: (detail.location as 'Home' | 'Home Equipment' | 'Gym') || 'Home',
        equipment: detail.equipment,
        primaryMuscles: detail.primaryMuscles,
        secondaryMuscles: detail.secondaryMuscles,
        category: detail.category,
        detailItem: detail,
      };

      docMap.set(normKey, newDoc);
      docs.push(newDoc);
    }
  });

  // Freeze cache to guarantee immutability
  cachedSearchDocs = Object.freeze(docs.map((doc) => Object.freeze({ ...doc })));

  if (import.meta.env?.DEV) {
    console.log(`[SearchParser] Parsed, validated & frozen ${docs.length} deduplicated search documents.`);
  }

  return cachedSearchDocs as SearchDocument[];
}
