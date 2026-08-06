import React from 'react';
import { SuggestionItem, escapeRegExp } from '../../../../services/search/searchEngine';
import { getDynamicTrendingSearches } from '../../../../services/search/recentSearches';

interface SuggestionsDropdownProps {
  query: string;
  suggestions: SuggestionItem[];
  recentSearches: string[];
  selectedIndex: number;
  onSelectSuggestion: (text: string) => void;
  onRemoveRecentSearch: (text: string) => void;
}

export const SuggestionsDropdown: React.FC<SuggestionsDropdownProps> = ({
  query,
  suggestions,
  recentSearches,
  selectedIndex,
  onSelectSuggestion,
  onRemoveRecentSearch,
}) => {
  const isQueryEmpty = query.trim().length === 0;
  const trendingTags = getDynamicTrendingSearches();

  // Highlight query substring inside suggestion text
  const renderHighlightedText = (text: string, q: string) => {
    const trimmedQ = q.trim();
    if (!trimmedQ) return text;
    try {
      const regex = new RegExp(`(${escapeRegExp(trimmedQ)})`, 'gi');
      const parts = text.split(regex);
      return parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={`hl_${i}`} className="fitbee-sug-highlight">
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  // Clean SVG icons for item types (Zero Emojis)
  const renderItemIcon = (type: SuggestionItem['type']) => {
    switch (type) {
      case 'Exercise':
        return (
          <svg className="sug-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="2.2">
            <path d="M6.5 6.5h11M6.5 17.5h11M4 9v6M20 8v8M2 11v2M22 11v2" />
          </svg>
        );
      case 'Muscle':
        return (
          <svg className="sug-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3F6F6B" strokeWidth="2.2">
            <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
            <line x1="16" y1="8" x2="2" y2="22" />
          </svg>
        );
      case 'Equipment':
        return (
          <svg className="sug-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B47806" strokeWidth="2.2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        );
      default:
        return (
          <svg className="sug-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        );
    }
  };

  return (
    <div className="fitbee-sug-dropdown animate-fade-down">
      {isQueryEmpty ? (
        <div className="fitbee-sug-sections">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="fitbee-sug-section">
              <div className="fitbee-sug-section-title">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Recent Searches
              </div>
              <ul className="fitbee-sug-list">
                {recentSearches.map((item: string, idx: number) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <li
                      key={`recent_${idx}_${item}`}
                      className={`fitbee-sug-item ${isSelected ? 'active' : ''}`}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onSelectSuggestion(item);
                      }}
                    >
                      <span className="fitbee-sug-text">
                        <svg className="sug-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                          <polyline points="1 4 1 10 7 10" />
                          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                        </svg>
                        {item}
                      </span>
                      <button
                        type="button"
                        className="fitbee-sug-remove-btn"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onRemoveRecentSearch(item);
                        }}
                        aria-label={`Remove ${item} from recent searches`}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Trending Searches (Clean SVG Icon, No Emojis, No Static Popular) */}
          <div className="fitbee-sug-section">
            <div className="fitbee-sug-section-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              Trending
            </div>
            <div className="fitbee-popular-tags">
              {trendingTags.map((tag: string, tIdx: number) => (
                <button
                  key={`trend_${tIdx}_${tag}`}
                  type="button"
                  className="fitbee-popular-chip"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onSelectSuggestion(tag);
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="2.2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Single Unified Ranked Suggestions List (Raycast / Command Palette Style) */
        <div className="fitbee-sug-sections">
          {suggestions.length > 0 ? (
            <ul className="fitbee-sug-list">
              {suggestions.map((sug, idx) => {
                const isSelected = selectedIndex === idx;
                const badgeLabel =
                  sug.type === 'Exercise'
                    ? 'Exercise'
                    : sug.count && sug.count > 0
                    ? `${sug.type} • ${sug.count} exercises`
                    : sug.type;

                return (
                  <li
                    key={sug.id}
                    className={`fitbee-sug-item ${isSelected ? 'active' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectSuggestion(sug.targetQuery);
                    }}
                  >
                    <span className="fitbee-sug-text">
                      {renderItemIcon(sug.type)}
                      {renderHighlightedText(sug.text, query)}
                    </span>
                    <span className={`fitbee-sug-type-badge sug-badge-${sug.type.toLowerCase()}`}>
                      {badgeLabel}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="fitbee-sug-empty">
              No direct live suggestions for &quot;{query}&quot;. Press <kbd>Enter</kbd> to search all fields.
            </div>
          )}
        </div>
      )}

      {/* Keyboard Hint Footer */}
      <div className="fitbee-sug-footer">
        <span><kbd className="fitbee-sug-kbd">↑</kbd> <kbd className="fitbee-sug-kbd">↓</kbd> Navigate</span>
        <span><kbd className="fitbee-sug-kbd">↵</kbd> Search</span>
        <span><kbd className="fitbee-sug-kbd">Esc</kbd> Close</span>
      </div>
    </div>
  );
};
