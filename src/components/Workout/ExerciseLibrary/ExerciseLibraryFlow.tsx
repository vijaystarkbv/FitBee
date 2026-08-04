import React, { useState } from 'react';
import { MainCategory, WarmUpSubcategory } from '../../../utils/exerciseLibraryParser';
import { MuscleGroupSelectionScreen } from './MuscleGroupSelectionScreen';
import { WarmUpSubcategoryScreen } from './WarmUpSubcategoryScreen';
import { DifficultySelectionScreen, DifficultyLevel } from './DifficultySelectionScreen';
import { ExerciseListScreen } from './ExerciseListScreen';
import { ExerciseDetailView } from '../ExerciseDetail/ExerciseDetailView';
import './exerciseLibrary.css';

type ScreenStep = 'main' | 'warmup_subcategories' | 'difficulty' | 'exercise_list' | 'exercise_detail';

interface ExerciseLibraryFlowProps {
  onBackToWorkout: () => void;
}

export const ExerciseLibraryFlow: React.FC<ExerciseLibraryFlowProps> = ({ onBackToWorkout }) => {
  const [screen, setScreen] = useState<ScreenStep>('main');
  const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<WarmUpSubcategory | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [selectedExerciseName, setSelectedExerciseName] = useState<string | null>(null);

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
    setScreen('exercise_detail');
  };

  // Back button handling
  const handleBack = () => {
    if (screen === 'exercise_detail') {
      setScreen('exercise_list');
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
    <>
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

      {screen === 'exercise_detail' && selectedExerciseName && (
        <ExerciseDetailView
          exerciseName={selectedExerciseName}
          onBack={handleBack}
        />
      )}
    </>
  );
};
