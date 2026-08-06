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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
          </svg>
          Filter &amp; Sort
          {activeChips.length > 0 && <span className="fitbee-chip-badge">{activeChips.length}</span>}
        </button>
      </div>

      {/* Active Filter Chips */}
      {activeChips.length > 0 && (
        <div className="fitbee-filter-chips-bar">
          <span className="fitbee-chips-label">Active Filters:</span>
          {activeChips.map((chip, idx) => (
            <span key={`chip_${idx}_${chip.label}`} className="fitbee-filter-chip">
              {chip.label}
              <button
                type="button"
                className="fitbee-chip-remove"
                onClick={() => onRemoveFilterChip(chip.category, chip.label)}
                aria-label={`Remove ${chip.label} filter`}
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
          {results.map((doc, idx) => (
            <div
              key={`search_res_${doc.id}`}
              className="exlib-ex-card animate-slide-up"
              onClick={() => onSelectExercise(doc.name)}
              style={{ animationDelay: `${Math.min(idx * 35, 350)}ms` }}
            >
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

              {/* Target Muscles */}
              {doc.primaryMuscles.length > 0 && (
                <p className="exlib-ex-muscles">
                  <strong className="fitbee-primary-muscle-text">{doc.primaryMuscles.join(', ')}</strong>
                  {doc.secondaryMuscles &&
                  doc.secondaryMuscles.length > 0 &&
                  doc.secondaryMuscles[0] !== 'None' &&
                  doc.secondaryMuscles[0] !== ''
                    ? ` • ${doc.secondaryMuscles.join(', ')}`
                    : ''}
                </p>
              )}
            </div>
          ))}
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


