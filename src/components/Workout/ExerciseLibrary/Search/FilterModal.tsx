import React, { useState } from 'react';
import { ActiveFilters, DynamicFiltersState, DynamicFilterOption } from '../../../../services/search/searchEngine';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFilters: ActiveFilters;
  dynamicFilters: DynamicFiltersState;
  onToggleFilter: (category: keyof ActiveFilters, value: string) => void;
  onClearAllFilters: () => void;
  totalResultCount?: number;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  activeFilters,
  dynamicFilters,
  onToggleFilter,
  onClearAllFilters,
  totalResultCount = 0,
}) => {
  const [eqSearch, setEqSearch] = useState('');
  const [musSearch, setMusSearch] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const totalActiveCount =
    activeFilters.difficulties.length +
    activeFilters.locations.length +
    activeFilters.equipment.length +
    activeFilters.muscles.length;

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const filteredEquipment = dynamicFilters.equipment.filter((opt) =>
    opt.value.toLowerCase().includes(eqSearch.toLowerCase())
  );

  const filteredMuscles = dynamicFilters.muscles.filter((opt) =>
    opt.value.toLowerCase().includes(musSearch.toLowerCase())
  );

  const renderChevron = (isCollapsed: boolean) => (
    <svg
      className={`fitbee-chevron-svg ${isCollapsed ? 'collapsed' : 'expanded'}`}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );

  return (
    <div className="fitbee-filter-overlay animate-fade-in" onClick={onClose}>
      <div
        className="fitbee-filter-modal-content animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-modal-title"
      >
        {/* Header */}
        <div className="fitbee-filter-header">
          <div>
            <h2 id="filter-modal-title" className="fitbee-filter-title">
              Filter &amp; Refine Results
            </h2>
            <p className="fitbee-filter-subtitle">
              Dynamic options based on current search matches
            </p>
          </div>
          <button
            type="button"
            className="fitbee-filter-close-btn"
            onClick={onClose}
            aria-label="Close filters"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="fitbee-filter-body">
          {/* Difficulty */}
          {dynamicFilters.difficulties.length > 0 && (
            <div className="fitbee-filter-group">
              <div className="fitbee-filter-group-header" onClick={() => toggleSection('diff')}>
                <h3 className="fitbee-filter-group-title">Difficulty</h3>
                {renderChevron(!!collapsedSections['diff'])}
              </div>
              {!collapsedSections['diff'] && (
                <div className="fitbee-filter-checkbox-grid">
                  {dynamicFilters.difficulties.map((opt: DynamicFilterOption) => {
                    const isChecked = activeFilters.difficulties.includes(opt.value);
                    return (
                      <label key={`diff_${opt.value}`} className={`fitbee-checkbox-item ${isChecked ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter('difficulties', opt.value)}
                        />
                        <span className="fitbee-checkbox-custom" />
                        <span className="fitbee-checkbox-label">
                          {opt.value} <span className="fitbee-count-badge">({opt.count})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Location */}
          {dynamicFilters.locations.length > 0 && (
            <div className="fitbee-filter-group">
              <div className="fitbee-filter-group-header" onClick={() => toggleSection('loc')}>
                <h3 className="fitbee-filter-group-title">Location</h3>
                {renderChevron(!!collapsedSections['loc'])}
              </div>
              {!collapsedSections['loc'] && (
                <div className="fitbee-filter-checkbox-grid">
                  {dynamicFilters.locations.map((opt: DynamicFilterOption) => {
                    const isChecked = activeFilters.locations.includes(opt.value);
                    return (
                      <label key={`loc_${opt.value}`} className={`fitbee-checkbox-item ${isChecked ? 'checked' : ''}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleFilter('locations', opt.value)}
                        />
                        <span className="fitbee-checkbox-custom" />
                        <span className="fitbee-checkbox-label">
                          {opt.value} <span className="fitbee-count-badge">({opt.count})</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Equipment (with Sticky In-Filter Search) */}
          {dynamicFilters.equipment.length > 0 && (
            <div className="fitbee-filter-group">
              <div className="fitbee-filter-group-header" onClick={() => toggleSection('eq')}>
                <h3 className="fitbee-filter-group-title">Equipment</h3>
                {renderChevron(!!collapsedSections['eq'])}
              </div>
              {!collapsedSections['eq'] && (
                <>
                  {dynamicFilters.equipment.length > 4 && (
                    <div className="fitbee-sticky-search-wrapper">
                      <input
                        type="text"
                        className="fitbee-filter-search-input"
                        placeholder="Search equipment..."
                        value={eqSearch}
                        onChange={(e) => setEqSearch(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="fitbee-filter-checkbox-grid">
                    {filteredEquipment.map((opt: DynamicFilterOption) => {
                      const isChecked = activeFilters.equipment.includes(opt.value);
                      return (
                        <label key={`eq_${opt.value}`} className={`fitbee-checkbox-item ${isChecked ? 'checked' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleFilter('equipment', opt.value)}
                          />
                          <span className="fitbee-checkbox-custom" />
                          <span className="fitbee-checkbox-label">
                            {opt.value} <span className="fitbee-count-badge">({opt.count})</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Target Muscles (with Sticky In-Filter Search) */}
          {dynamicFilters.muscles.length > 0 && (
            <div className="fitbee-filter-group">
              <div className="fitbee-filter-group-header" onClick={() => toggleSection('mus')}>
                <h3 className="fitbee-filter-group-title">Target Muscles</h3>
                {renderChevron(!!collapsedSections['mus'])}
              </div>
              {!collapsedSections['mus'] && (
                <>
                  {dynamicFilters.muscles.length > 4 && (
                    <div className="fitbee-sticky-search-wrapper">
                      <input
                        type="text"
                        className="fitbee-filter-search-input"
                        placeholder="Search muscles..."
                        value={musSearch}
                        onChange={(e) => setMusSearch(e.target.value)}
                      />
                    </div>
                  )}
                  <div className="fitbee-filter-checkbox-grid">
                    {filteredMuscles.map((opt: DynamicFilterOption) => {
                      const isChecked = activeFilters.muscles.includes(opt.value);
                      return (
                        <label key={`mus_${opt.value}`} className={`fitbee-checkbox-item ${isChecked ? 'checked' : ''}`}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggleFilter('muscles', opt.value)}
                          />
                          <span className="fitbee-checkbox-custom" />
                          <span className="fitbee-checkbox-label">
                            {opt.value} <span className="fitbee-count-badge">({opt.count})</span>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="fitbee-filter-footer">
          <button
            type="button"
            className="fitbee-btn-secondary"
            onClick={onClearAllFilters}
            disabled={totalActiveCount === 0}
          >
            Clear All
          </button>
          <button type="button" className="fitbee-btn-primary" onClick={onClose}>
            {totalResultCount > 0
              ? `Show ${totalResultCount} ${totalResultCount === 1 ? 'Exercise' : 'Exercises'}`
              : `Apply Filters ${totalActiveCount > 0 ? `(${totalActiveCount})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};


