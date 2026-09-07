import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../services/supabaseClient';
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
  mode?: 'browse' | 'select';
  onSelectForTemplate?: (exerciseName: string) => void;
  onSelectMultipleForTemplate?: (exerciseNames: string[]) => void;
  initialSelectedExercises?: string[];
  otherDaysExercises?: Record<string, string[]>;
  maxSelection?: number;
}

export const ExerciseLibraryFlow: React.FC<ExerciseLibraryFlowProps> = ({ 
  onBackToWorkout,
  mode = 'browse',
  onSelectForTemplate,
  onSelectMultipleForTemplate,
  initialSelectedExercises = [],
  otherDaysExercises = {},
  maxSelection,
}) => {
  const [screen, setScreen] = useState<ScreenStep>('main');
  const [previousScreen, setPreviousScreen] = useState<ScreenStep>('main');

  const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<WarmUpSubcategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [selectedExerciseName, setSelectedExerciseName] = useState<string | null>(null);

  // Selection state for Selection Mode
  const [selectedExercises, setSelectedExercises] = useState<string[]>(initialSelectedExercises);
  const [showReviewSlide, setShowReviewSlide] = useState<boolean>(false);

  const handleContinueSelection = () => {
    if (selectedExercises.length > 0) {
      setShowReviewSlide(true);
    }
  };

  const handleConfirmSaveSelection = () => {
    if (onSelectMultipleForTemplate) {
      onSelectMultipleForTemplate(selectedExercises);
    } else if (onSelectForTemplate && selectedExercises.length > 0) {
      onSelectForTemplate(selectedExercises[0]);
    }
    setShowReviewSlide(false);
  };

  // Favorites state for Browse Mode
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

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

  // Load recent searches and favorites on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches());

    const fetchFavorites = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data } = await supabase
          .from('exercise_favorites')
          .select('exercise_id, master_exercises(exercise_name)')
          .eq('user_id', session.user.id);
        
        if (data) {
          const favSet = new Set<string>();
          data.forEach((item: any) => {
            if (item.master_exercises?.exercise_name) {
              favSet.add(item.master_exercises.exercise_name);
            }
          });
          setFavorites(favSet);
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    };

    fetchFavorites();
  }, []);

  const handleToggleFavorite = async (exerciseName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const isFav = favorites.has(exerciseName);
      setFavorites((prev) => {
        const next = new Set(prev);
        if (isFav) next.delete(exerciseName);
        else next.add(exerciseName);
        return next;
      });

      const { data: masterEx } = await supabase
        .from('master_exercises')
        .select('id')
        .eq('exercise_name', exerciseName)
        .single();

      if (masterEx) {
        if (isFav) {
          await supabase
            .from('exercise_favorites')
            .delete()
            .eq('user_id', session.user.id)
            .eq('exercise_id', masterEx.id);
        } else {
          await supabase
            .from('exercise_favorites')
            .insert({
              user_id: session.user.id,
              exercise_id: masterEx.id,
            });
        }
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleToggleSelectExercise = (exerciseName: string) => {
    setSelectedExercises((prev) => {
      if (prev.includes(exerciseName)) {
        return prev.filter((name) => name !== exerciseName);
      }
      if (maxSelection && prev.length >= maxSelection) {
        alert(`You can select a maximum of ${maxSelection} exercises.`);
        return prev;
      }
      return [...prev, exerciseName];
    });
  };

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
          mode={mode}
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

      {/* Step 4: Exercise List */}
      {screen === 'exercise_list' && selectedCategory && selectedDifficulty && (
        <ExerciseListScreen
          categoryTitle={selectedCategory.title}
          subcategoryTitle={selectedSubcategory?.title}
          difficulty={selectedDifficulty}
          onSelectExercise={handleSelectExercise}
          onBack={handleBack}
          mode={mode}
          selectedExercises={selectedExercises}
          onToggleSelect={handleToggleSelectExercise}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          otherDaysExercises={otherDaysExercises}
        />
      )}

      {/* Search Results Screen */}
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
          mode={mode}
          selectedExercises={selectedExercises}
          onToggleSelect={handleToggleSelectExercise}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          otherDaysExercises={otherDaysExercises}
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

      {/* Sticky Bottom Selection Bar (Selection Mode Only) */}
      {mode === 'select' && selectedExercises.length > 0 && screen !== 'exercise_detail' && !showReviewSlide && (
        <div className="fitbee-bottom-selection-bar">
          <div className="fitbee-selection-bar-info">
            <div className="fitbee-selection-bar-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span>
              {maxSelection
                ? `${selectedExercises.length} / ${maxSelection} Exercises Selected`
                : `${selectedExercises.length} ${selectedExercises.length === 1 ? 'Exercise Selected' : 'Exercises Selected'}`}
            </span>
          </div>

          <button
            type="button"
            className="fitbee-selection-bar-btn"
            onClick={handleContinueSelection}
          >
            Continue
          </button>
        </div>
      )}

      {/* Selected Exercises Review Slide Modal */}
      {showReviewSlide && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            animation: 'fadeIn 200ms ease-out',
          }}
          onClick={() => setShowReviewSlide(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 520,
              backgroundColor: '#FAFAF8',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              padding: '28px 24px 32px',
              boxShadow: '0 -12px 48px rgba(0,0,0,0.15)',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Grab Handle */}
            <div style={{ width: 36, height: 5, borderRadius: 3, backgroundColor: '#E5E7EB', margin: '0 auto 20px' }} />

            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>
              Selected Exercises
            </h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px' }}>
              Review the exercises chosen for this workout day.
            </p>

            {/* List of Selected Exercises */}
            <div 
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 12, 
                marginBottom: 24,
                paddingRight: 4
              }}
            >
              {selectedExercises.map((exName, index) => (
                <div
                  key={exName + index}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '16px 20px',
                    border: '1px solid #E8E8E6',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 600, color: '#1F2937' }}>
                    {exName}
                  </span>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: 'rgba(92, 141, 137, 0.12)', color: '#5C8D89', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Save Button */}
            <button
              type="button"
              onClick={handleConfirmSaveSelection}
              style={{
                width: '100%',
                height: 54,
                borderRadius: 18,
                backgroundColor: '#5C8D89',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 650,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(92, 141, 137, 0.3)',
                transition: 'all 200ms ease',
              }}
            >
              Save Exercises
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
