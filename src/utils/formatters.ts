import { clock } from '../services/clock';

/**
 * Formats a number with standard thousand separators
 */
export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat().format(val);
}

/**
 * Capitalizes string words
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Formats Date object to local YYYY-MM-DD string format
 */
export function formatDateKey(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns YYYY-MM-DD string format for today using the centralized application clock
 */
export function getTodayDateString(): string {
  return formatDateKey(clock.now());
}

/**
 * Formats date string into readable text (e.g., "Jul 31, 2026")
 */
export function formatDateReadable(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
