import { parseSearchDatabase } from './searchDatabaseParser';

const RECENT_SEARCHES_KEY = 'fitbee_intelligent_recent_searches_v3';
const MAX_STORED_RECENT = 20;
const MAX_DISPLAY_RECENT = 8;

export interface RecentSearchEntry {
  query: string;
  type?: 'Exercise' | 'Muscle' | 'Equipment' | 'Goal' | 'General';
  count: number;
  lastSearched: number;
}

/**
 * Clean, sanitize and normalize query input
 */
function normalizeQueryText(query: string): string {
  return query
    .normalize('NFC')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 100);
}

/**
 * Read raw stored recent search entries (already sorted by frequency & timestamp)
 */
export function getRecentSearchEntries(): RecentSearchEntry[] {
  try {
    const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn('[RecentSearches] Failed to read recent searches from localStorage:', err);
    }
    return [];
  }
}

/**
 * Get top recent search queries for display (limit to MAX_DISPLAY_RECENT = 8)
 */
export function getRecentSearches(): string[] {
  return getRecentSearchEntries()
    .slice(0, MAX_DISPLAY_RECENT)
    .map((entry) => entry.query);
}

/**
 * Save / Increment recent search query with single-pass sort
 */
export function saveRecentSearch(query: string, type?: RecentSearchEntry['type']): string[] {
  const normalized = normalizeQueryText(query);
  if (!normalized || normalized.length < 2) return getRecentSearches();

  const entries = getRecentSearchEntries();
  const normKey = normalized.toLowerCase();

  const existingIdx = entries.findIndex((e) => e.query.toLowerCase() === normKey);

  if (existingIdx >= 0) {
    entries[existingIdx].count += 1;
    entries[existingIdx].lastSearched = Date.now();
    entries[existingIdx].query = normalized;
    if (type) entries[existingIdx].type = type;
  } else {
    entries.push({
      query: normalized,
      type: type || 'General',
      count: 1,
      lastSearched: Date.now(),
    });
  }

  // Single-pass sort: frequency count descending, then lastSearched timestamp descending
  entries.sort((a, b) => b.count - a.count || b.lastSearched - a.lastSearched);

  // Cap stored items at MAX_STORED_RECENT = 20
  const cappedEntries = entries.slice(0, MAX_STORED_RECENT);

  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(cappedEntries));
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn('[RecentSearches] Failed to save recent search:', err);
    }
  }

  if (import.meta.env?.DEV) {
    console.log(`[RecentSearches] Saved query "${normalized}" (Frequency: ${cappedEntries.find(e => e.query.toLowerCase() === normKey)?.count || 1})`);
  }

  return cappedEntries.slice(0, MAX_DISPLAY_RECENT).map((e) => e.query);
}

/**
 * Utility: Increment search count directly
 */
export function incrementSearchCount(query: string, type?: RecentSearchEntry['type']): string[] {
  return saveRecentSearch(query, type);
}

/**
 * Utility: Check if query is in recent history
 */
export function isRecentSearch(query: string): boolean {
  const normKey = normalizeQueryText(query).toLowerCase();
  return getRecentSearchEntries().some((e) => e.query.toLowerCase() === normKey);
}

/**
 * Remove a specific search from history
 */
export function removeRecentSearch(queryToRemove: string): string[] {
  const normKey = normalizeQueryText(queryToRemove).toLowerCase();
  const entries = getRecentSearchEntries();
  const updated = entries.filter((e) => e.query.toLowerCase() !== normKey);

  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn('[RecentSearches] Failed to remove recent search:', err);
    }
  }

  return updated.slice(0, MAX_DISPLAY_RECENT).map((e) => e.query);
}

/**
 * Clear all search history
 */
export function clearRecentSearches(): void {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (err) {
    if (import.meta.env?.DEV) {
      console.warn('[RecentSearches] Failed to clear search history:', err);
    }
  }
}

/**
 * Analytics Utility: Get top N overall searches
 */
export function getTopSearches(limit = 5): RecentSearchEntry[] {
  return getRecentSearchEntries().slice(0, limit);
}

/**
 * Analytics Utility: Get most searched muscle groups
 */
export function getMostSearchedMuscles(): string[] {
  return getRecentSearchEntries()
    .filter((e) => e.type === 'Muscle')
    .map((e) => e.query);
}

/**
 * Analytics Utility: Get most searched equipment
 */
export function getMostSearchedEquipment(): string[] {
  return getRecentSearchEntries()
    .filter((e) => e.type === 'Equipment')
    .map((e) => e.query);
}

/**
 * Dynamic Trending Searches Generator (Derived dynamically from search DB & history)
 */
export function getDynamicTrendingSearches(): string[] {
  const recentEntries = getRecentSearchEntries();
  const frequentQueries = recentEntries.slice(0, 3).map((e) => e.query);

  if (frequentQueries.length >= 3) {
    return frequentQueries;
  }

  // Fall back to top muscle groups dynamically extracted from DB
  const docs = parseSearchDatabase();
  const muscleSet = new Set<string>();
  docs.forEach((d) => {
    d.primaryMuscles.forEach((m) => { if (m && m !== 'None') muscleSet.add(m); });
  });

  const dbMuscles = Array.from(muscleSet).slice(0, 3);
  const combined = Array.from(new Set([...frequentQueries, ...dbMuscles]));
  return combined.slice(0, 3);
}

export const POPULAR_SEARCHES: string[] = [
  'Push-up',
  'Pull-up',
  'Squat',
];
