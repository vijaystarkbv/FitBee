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
 * Returns YYYY-MM-DD string format using the centralized application clock
 */
export function getTodayDateString(): string {
  const today = clock.now();
  return today.toISOString().split('T')[0];
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
