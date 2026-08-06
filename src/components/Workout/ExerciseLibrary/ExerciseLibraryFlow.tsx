import React, { useState, useEffect, useCallback } from 'react';
import { MainCategory, WarmUpSubcategory } from '../../../utils/exerciseLibraryParser';
import { MuscleGroupSelectionScreen } from './MuscleGroupSelectionScreen';
import { WarmUpSubcategoryScreen } from './WarmUpSubcategoryScreen';
import { DifficultySelectionScreen, DifficultyLevel } from './DifficultySelectionScreen';
import { ExerciseListScreen } from './ExerciseListScreen';
import { ExerciseDetailView } from '../ExerciseDetail/ExerciseDetailView';
import { SearchBar } from './Search/SearchBar';
import { SuggestionsDropdown } from './Search/SuggestionsDropdown';
import { FilterModal } from './Search/FilterModal';
import { SearchResultsView } from './Search/SearchResultsView';
import {
  executeSearch,
  getLiveSuggestions,
  ActiveFilters,
  SuggestionItem,
  SearchResultsResponse,
} from '../../../services/search/searchEngine';
import {
  getRecentSearches,
  saveRecentSearch,
  removeRecentSearch,
} from '../../../services/search/recentSearches';
import './exerciseLibrary.css';

type ScreenStep =
  | 'main'
  | 'warmup_subcategories'
  | 'difficulty'
  | 'exercise_list'
  | 'search_results'
  | 'exercise_detail';

interface ExerciseLibraryFlowProps {
  onBackToWorkout: () => void;
}

export const ExerciseLibraryFlow: React.FC<ExerciseLibraryFlowProps> = ({ onBackToWorkout }) => {
  const [screen, setScreen] = useState<ScreenStep>('main');
  const [previousScreen, setPreviousScreen] = useState<ScreenStep>('main');

  const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<WarmUpSubcategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [selectedExerciseName, setSelectedExerciseName] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSearchQuery, setActiveSearchQuery] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [liveSuggestions, setLiveSuggestions] = useState<SuggestionItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedSugIndex, setSelectedSugIndex] = useState<number>(-1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);

  // Active Filter state
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    difficulties: [],
    locations: [],
    equipment: [],
    muscles: [],
  });

  // Current Search Response
  const [searchResponse, setSearchResponse] = useState<SearchResultsResponse | null>(null);

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Update live suggestions when typing (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        setLiveSuggestions(getLiveSuggestions(searchQuery, 6));
      } else {
        setLiveSuggestions([]);
      }
      setSelectedSugIndex(-1);
    }, 120);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Execute search when activeSearchQuery or activeFilters change in search_results mode
  useEffect(() => {
    if (screen === 'search_results') {
      const resp = executeSearch(activeSearchQuery, activeFilters);
      setSearchResponse(resp);
    }
  }, [screen, activeSearchQuery, activeFilters]);

  // Submit Search (Enter, Search Button, or Suggestion selection)
  const handlePerformSearch = useCallback(
    (queryToSearch: string) => {
      const trimmed = queryToSearch.trim();
      if (!trimmed) return;

      const updatedRecent = saveRecentSearch(trimmed);
      setRecentSearches(updatedRecent);

      setSearchQuery(trimmed);
      setActiveSearchQuery(trimmed);
      setIsInputFocused(false);
      setLiveSuggestions([]);
      setPreviousScreen(screen);
      setScreen('search_results');
    },
    [screen]
  );

  // Key navigation for suggestions
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isQueryEmpty = searchQuery.trim().length === 0;
    const itemsCount = isQueryEmpty ? recentSearches.length : liveSuggestions.length;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (itemsCount > 0) {
        setSelectedSugIndex((prev) => (prev + 1) % itemsCount);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (itemsCount > 0) {
        setSelectedSugIndex((prev) => (prev - 1 + itemsCount) % itemsCount);
      }
    } else if (e.key === 'Escape') {
      setIsInputFocused(false);
    } else if (e.key === 'Enter' && selectedSugIndex >= 0) {
      e.preventDefault();
      if (isQueryEmpty && recentSearches[selectedSugIndex]) {
        handlePerformSearch(recentSearches[selectedSugIndex]);
      } else if (!isQueryEmpty && liveSuggestions[selectedSugIndex]) {
        handlePerformSearch(liveSuggestions[selectedSugIndex].targetQuery);
      }
    }
  };

  // Select main category
  const handleSelectCategory = (cat: MainCategory) => {
    setSelectedCategory(cat);
    if (cat.title === 'Stretches - Warm-up') {
      setScreen('warmup_subcategories');
    } else {
      setSelectedSubcategory(null);
      setScreen('difficulty');
    }
  };

  // Select warmup subcategory
  const handleSelectSubcategory = (sub: WarmUpSubcategory) => {
    setSelectedSubcategory(sub);
    setScreen('difficulty');
  };

  // Select difficulty level
  const handleSelectDifficulty = (diff: DifficultyLevel) => {
    setSelectedDifficulty(diff);
    setScreen('exercise_list');
  };

  // Select specific exercise
  const handleSelectExercise = (exerciseName: string) => {
    setSelectedExerciseName(exerciseName);
    setPreviousScreen(screen);
    setScreen('exercise_detail');
  };

  // Filter Toggles
  const handleToggleFilter = (category: keyof ActiveFilters, value: string) => {
    setActiveFilters((prev) => {
      const currentArr = prev[category];
      const exists = currentArr.includes(value);
      const updated = exists ? currentArr.filter((item) => item !== value) : [...currentArr, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleClearAllFilters = () => {
    setActiveFilters({
      difficulties: [],
      locations: [],
      equipment: [],
      muscles: [],
    });
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveSearchQuery('');
    setActiveFilters({
      difficulties: [],
      locations: [],
      equipment: [],
      muscles: [],
    });
    setScreen('main');
  };

  // Back button handling
  const handleBack = () => {
    if (screen === 'exercise_detail') {
      setScreen(previousScreen === 'search_results' ? 'search_results' : 'exercise_list');
    } else if (screen === 'search_results') {
      setScreen('main');
    } else if (screen === 'exercise_list') {
      setScreen('difficulty');
    } else if (screen === 'difficulty') {
      if (selectedCategory?.title === 'Stretches - Warm-up') {
        setScreen('warmup_subcategories');
      } else {
        setScreen('main');
      }
    } else if (screen === 'warmup_subcategories') {
      setScreen('main');
    } else {
      onBackToWorkout();
    }
  };

  return (
    <div className="fitbee-search-flow-wrapper">
      {/* Global Search Header (Shown on Main & Search Results) */}
      {(screen === 'main' || screen === 'search_results') && (
        <div className="fitbee-global-search-container">
          <div className="fitbee-search-relative-box">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearchSubmit={handlePerformSearch}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => {
                // Short delay to allow click on suggestions
                setTimeout(() => setIsInputFocused(false), 200);
              }}
              onKeyDown={handleSearchKeyDown}
            />

            {/* Live Suggestions & Recent/Popular Dropdown */}
            {isInputFocused && (
              <SuggestionsDropdown
                query={searchQuery}
                suggestions={liveSuggestions}
                recentSearches={recentSearches}
                selectedIndex={selectedSugIndex}
                onSelectSuggestion={handlePerformSearch}
                onRemoveRecentSearch={(toRemove) => {
                  const updated = removeRecentSearch(toRemove);
                  setRecentSearches(updated);
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Screen Steps */}
      {screen === 'main' && (
        <MuscleGroupSelectionScreen
          onSelectCategory={handleSelectCategory}
          onBackToWorkout={onBackToWorkout}
        />
      )}

      {screen === 'warmup_subcategories' && (
        <WarmUpSubcategoryScreen
          onSelectSubcategory={handleSelectSubcategory}
          onBack={handleBack}
        />
      )}

      {screen === 'difficulty' && selectedCategory && (
        <DifficultySelectionScreen
          categoryTitle={selectedCategory.title}
          subcategoryTitle={selectedSubcategory?.title}
          onSelectDifficulty={handleSelectDifficulty}
          onBack={handleBack}
        />
      )}

      {screen === 'exercise_list' && selectedCategory && selectedDifficulty && (
        <ExerciseListScreen
          categoryTitle={selectedCategory.title}
          subcategoryTitle={selectedSubcategory?.title}
          difficulty={selectedDifficulty}
          onBack={handleBack}
          onSelectExercise={handleSelectExercise}
        />
      )}

      {screen === 'search_results' && searchResponse && (
        <SearchResultsView
          query={activeSearchQuery}
          suggestedTerm={searchResponse.suggestedTerm}
          results={searchResponse.results}
          activeFilters={activeFilters}
          onOpenFilterModal={() => setIsFilterModalOpen(true)}
          onRemoveFilterChip={handleToggleFilter}
          onSelectExercise={handleSelectExercise}
          onClearSearch={handleClearSearch}
        />
      )}

      {screen === 'exercise_detail' && selectedExerciseName && (
        <ExerciseDetailView
          exerciseName={selectedExerciseName}
          onBack={handleBack}
        />
      )}

      {/* Dynamic Filter Modal / Bottom Sheet */}
      {searchResponse && (
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          activeFilters={activeFilters}
          dynamicFilters={searchResponse.dynamicFilters}
          onToggleFilter={handleToggleFilter}
          onClearAllFilters={handleClearAllFilters}
          totalResultCount={searchResponse.filteredCount}
        />
      )}
    </div>
  );
};

