import React from 'react';
import { SearchDocument } from '../../../../services/search/searchDatabaseParser';
import { ActiveFilters, escapeRegExp } from '../../../../services/search/searchEngine';

interface SearchResultsViewProps {
  query: string;
  suggestedTerm?: string;
  results: SearchDocument[];
  activeFilters: ActiveFilters;
  onOpenFilterModal: () => void;
  onRemoveFilterChip: (category: keyof ActiveFilters, value: string) => void;
  onSelectExercise: (exerciseName: string) => void;
  onClearSearch: () => void;
  mode?: 'browse' | 'select';
  selectedExercises?: string[];
  onToggleSelect?: (exerciseName: string) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (exerciseName: string) => void;
  otherDaysExercises?: Record<string, string[]>;
}

const DIFFICULTY_CLASS: Record<string, string> = {
  Beginner: 'beginner',
  Intermediate: 'intermediate',
  Advanced: 'advanced',
};

const LOCATION_CLASS: Record<string, string> = {
  Home: 'location-home',
  'Home Equipment': 'location-home-eq',
  Gym: 'location-gym',
};

/**
 * Safely highlight search term in title
 */
function renderHighlightedTitle(text: string, query: string) {
  if (!query.trim()) return text;
  const escaped = escapeRegExp(query.trim());
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

  return parts.map((part, i) =>
    part.toLowerCase() === query.trim().toLowerCase() ? (
      <mark key={`hl_${i}`} className="fitbee-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/**
 * Clean SVG icon for Match Reasons (No Emojis)
 */
function renderMatchReasonIcon(reason: string) {
  if (reason.includes('Muscle')) {
    return (
      <svg className="fitbee-reason-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3F6F6B" strokeWidth="2.2">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
        <line x1="16" y1="8" x2="2" y2="22" />
      </svg>
    );
  }
  if (reason.includes('Equipment')) {
    return (
      <svg className="fitbee-reason-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B47806" strokeWidth="2.2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }
  if (reason.includes('Intent')) {
    return (
      <svg className="fitbee-reason-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2.2">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    );
  }
  return (
    <svg className="fitbee-reason-svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="2.2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  query,
  suggestedTerm,
  results,
  activeFilters,
  onOpenFilterModal,
  onRemoveFilterChip,
  onSelectExercise,
  onClearSearch,
  mode = 'browse',
  selectedExercises = [],
  onToggleSelect,
  favorites = new Set(),
  onToggleFavorite,
  otherDaysExercises = {},
}) => {
  const activeChips: { category: keyof ActiveFilters; label: string }[] = [];

  activeFilters.difficulties.forEach((val: string) => activeChips.push({ category: 'difficulties', label: val }));
  activeFilters.locations.forEach((val: string) => activeChips.push({ category: 'locations', label: val }));
  activeFilters.equipment.forEach((val: string) => activeChips.push({ category: 'equipment', label: val }));
  activeFilters.muscles.forEach((val: string) => activeChips.push({ category: 'muscles', label: val }));

  return (
    <div className="fitbee-search-results-container animate-fade-in">
      {/* Search Header Bar: Summary & Filter Trigger */}
      <div className="fitbee-search-results-header">
        <div>
          <div className="fitbee-results-meta">
            <span className="fitbee-results-count-badge">
              {results.length} {results.length === 1 ? 'exercise found' : 'exercises found'}
            </span>
            {query && (
              <span className="fitbee-results-query-label">
                Results for <strong>&quot;{query}&quot;</strong>
              </span>
            )}
          </div>

          {/* Fuzzy suggestion correction note */}
          {suggestedTerm && suggestedTerm.toLowerCase() !== query.toLowerCase() && (
            <p className="fitbee-fuzzy-note">
              Showing results for <strong>&quot;{suggestedTerm}&quot;</strong> (Searched for &quot;{query}&quot;)
            </p>
          )}
        </div>

        {/* Filter / Sort Button */}
        <button
          type="button"
          className={`fitbee-filter-trigger-btn ${activeChips.length > 0 ? 'active' : ''}`}
          onClick={onOpenFilterModal}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          <span>Filters</span>
          {activeChips.length > 0 && <span className="fitbee-filter-count">{activeChips.length}</span>}
        </button>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="fitbee-active-chips-bar">
          {activeChips.map((chip) => (
            <span key={`${chip.category}_${chip.label}`} className="fitbee-filter-chip">
              {chip.label}
              <button
                type="button"
                className="fitbee-chip-remove"
                onClick={() => onRemoveFilterChip(chip.category, chip.label)}
                aria-label={`Remove filter ${chip.label}`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Exercise Cards Grid with Staggered Animations & Match Reasons */}
      {results.length > 0 ? (
        <div className="exlib-card-grid fitbee-stagger-grid">
          {results.map((doc, idx) => {
            const isSelected = selectedExercises.includes(doc.name);
            const isFav = favorites.has(doc.name);

            return (
              <div
                key={`search_res_${doc.id}`}
                className={`exlib-ex-card animate-slide-up ${mode === 'select' ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (mode === 'select' && onToggleSelect) {
                    onToggleSelect(doc.name);
                  } else {
                    onSelectExercise(doc.name);
                  }
                }}
                style={{ animationDelay: `${Math.min(idx * 35, 350)}ms`, position: 'relative' }}
              >
                {/* Cross-Day Warning Label */}
                {mode === 'select' && otherDaysExercises[doc.name] && otherDaysExercises[doc.name].length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#D97706' }}>
                      Already selected for {otherDaysExercises[doc.name].join(', ')}
                    </span>
                  </div>
                )}

                {/* Header: Name & Difficulty */}
                <div className="exlib-ex-header">
                  <h3 className="exlib-ex-name">{renderHighlightedTitle(doc.displayName, query)}</h3>
                  <span className={`exlib-diff-pill ${DIFFICULTY_CLASS[doc.difficulty] || 'beginner'}`}>
                    {doc.difficulty}
                  </span>
                </div>

                {/* Match Reason Pill (Clean SVG Icon + Class) */}
                {doc.matchReason && query && (
                  <div className="fitbee-match-reason-wrapper">
                    <span className="fitbee-match-reason-pill">
                      {renderMatchReasonIcon(doc.matchReason)}
                      {doc.matchReason}
                    </span>
                  </div>
                )}

                {/* Tags: Location & Equipment */}
                <div className="exlib-ex-tags">
                  <span className={`exlib-tag ${LOCATION_CLASS[doc.location] || 'location-home'}`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    </svg>
                    {doc.location}
                  </span>

                  <span className="exlib-tag fitbee-equipment-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B47806" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    {doc.equipment}
                  </span>
                </div>

                {/* Target Muscles & Icon */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 12 }}>
                  {doc.primaryMuscles.length > 0 && (
                    <p className="exlib-ex-muscles" style={{ margin: 0, flex: 1 }}>
                      <strong className="fitbee-primary-muscle-text">{doc.primaryMuscles.join(', ')}</strong>
                      {doc.secondaryMuscles &&
                      doc.secondaryMuscles.length > 0 &&
                      doc.secondaryMuscles[0] !== 'None' &&
                      doc.secondaryMuscles[0] !== ''
                        ? ` • ${doc.secondaryMuscles.join(', ')}`
                        : ''}
                    </p>
                  )}

                  {mode === 'select' ? (
                    <button
                      type="button"
                      className={`exlib-select-btn ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleSelect) onToggleSelect(doc.name);
                      }}
                      aria-label={isSelected ? 'Deselect exercise' : 'Select exercise'}
                    >
                      {isSelected ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`exlib-fav-btn ${isFav ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleFavorite) onToggleFavorite(doc.name);
                      }}
                      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? '#EAB308' : 'none'} stroke={isFav ? '#EAB308' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="fitbee-search-empty-state">
          <div className="fitbee-empty-icon-circle">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3 className="fitbee-empty-title">No matches found</h3>
          <p className="fitbee-empty-subtitle">
            Try searching for another exercise, muscle group (e.g. &quot;Biceps&quot;, &quot;Lower Back&quot;) or equipment (e.g. &quot;Dumbbell&quot;, &quot;Pull-up Bar&quot;).
          </p>
          <button type="button" className="fitbee-btn-secondary" onClick={onClearSearch}>
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
};




