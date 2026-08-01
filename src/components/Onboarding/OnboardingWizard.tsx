import React, { useState, useEffect, useCallback } from 'react';
import { OnboardingFormState, EquipmentDetail } from '../../types/fitness.types';
import { supabase } from '../../services/supabaseClient';
import { logUserWeight } from '../../services/weightService';
import { WelcomeScreen } from './WelcomeScreen';
import { NameScreen } from './NameScreen';
import { AgeScreen } from './AgeScreen';
import { GenderScreen } from './GenderScreen';
import { MeasurementsScreen } from './MeasurementsScreen';
import { TargetWeightScreen } from './TargetWeightScreen';
import { ActivityScreen } from './ActivityScreen';
import { GoalScreen } from './GoalScreen';
import { LocationEquipmentScreen } from './LocationEquipmentScreen';
import './onboarding.css';

interface OnboardingWizardProps {
  userId: string;
  onComplete: () => void;
  onSkip: () => void;
}

const TOTAL_SCREENS = 9;

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ userId, onComplete, onSkip }) => {
  const [screen, setScreen] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(true);
  const [toastFading, setToastFading] = useState(false);

  const [formData, setFormData] = useState<OnboardingFormState>({
    display_name: '',
    age: 22,
    gender: 'male',
    height_cm: 175,
    weight_kg: 70,
    target_weight_kg: 72,
    height_unit: 'cm',
    weight_unit: 'kg',
    goal: 'gain_muscle',
    activity_level: 'moderate',
    training_location: 'home',
    has_dumbbells: false,
    max_dumbbell_weight_kg: null,
    equipment: [],
    equipmentDetails: {},
    target_calories: 2500,
    target_protein: 140,
    target_carbs: 320,
    target_fat: 65,
  });

  /* ── Toast auto-dismiss ── */
  useEffect(() => {
    const fadeTimer = setTimeout(() => setToastFading(true), 2200);
    const hideTimer = setTimeout(() => setShowToast(false), 2500);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  /* ── Update helpers ── */
  const update = useCallback((updates: Partial<OnboardingFormState>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleEquipmentToggle = useCallback((name: string) => {
    setFormData((prev) => {
      const exists = prev.equipment.includes(name);
      const newEquipment = exists
        ? prev.equipment.filter((e) => e !== name)
        : [...prev.equipment, name];
      const newDetails = { ...prev.equipmentDetails };
      if (!exists) {
        newDetails[name] = newDetails[name] || {};
      }
      return { ...prev, equipment: newEquipment, equipmentDetails: newDetails };
    });
  }, []);

  const handleEquipmentDetailChange = useCallback((name: string, detail: EquipmentDetail) => {
    setFormData((prev) => ({
      ...prev,
      equipmentDetails: { ...prev.equipmentDetails, [name]: detail },
    }));
  }, []);

  /* ── Calculate macro targets (deterministic) ── */
  const calculateTargets = (data: OnboardingFormState) => {
    const { weight_kg, goal, activity_level, gender, age, height_cm } = data;

    // Mifflin-St Jeor BMR
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age + 5;
    } else {
      bmr = 10 * weight_kg + 6.25 * height_cm - 5 * age - 161;
    }

    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
    };

    let tdee = bmr * (activityMultipliers[activity_level] || 1.55);

    // Adjust for goal
    if (goal === 'gain_muscle') tdee += 300;
    else if (goal === 'lose_fat') tdee -= 400;
    // maintain_weight and improve_fitness use TDEE as-is

    const calories = Math.round(tdee);
    const protein = Math.round(weight_kg * 2.0);
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

    return { calories, protein: Math.max(protein, 80), carbs: Math.max(carbs, 100), fat: Math.max(fat, 30) };
  };

  /* ── Save profile to Supabase ── */
  const handleFinish = async () => {
    setIsLoading(true);
    try {
      const targets = calculateTargets(formData);

      // Map goal for backward compatibility with existing DB constraint
      let dbGoal: string = formData.goal;
      if (dbGoal === 'gain_muscle') dbGoal = 'gain_muscle';
      if (dbGoal === 'lose_fat') dbGoal = 'lose_fat';

      // Check if dumbbells are in equipment list
      const hasDumbbells = formData.equipment.some(
        (e) => e === 'Dumbbells' || e === 'Adjustable Dumbbells'
      );
      const maxDumbbellKg = hasDumbbells
        ? (formData.equipmentDetails['Dumbbells']?.max_weight_kg ||
           formData.equipmentDetails['Adjustable Dumbbells']?.max_weight_kg ||
           10)
        : null;

      // 1. Upsert profile
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: userId,
        updated_at: new Date().toISOString(),
        display_name: formData.display_name || null,
        age: formData.age,
        gender: formData.gender,
        height_cm: formData.height_cm,
        weight_kg: formData.weight_kg,
        target_weight_kg: formData.target_weight_kg || formData.weight_kg,
        goal: dbGoal,
        activity_level: formData.activity_level,
        training_location: formData.training_location,
        has_dumbbells: hasDumbbells,
        max_dumbbell_weight_kg: maxDumbbellKg,
        target_calories: targets.calories,
        target_protein: targets.protein,
        target_carbs: targets.carbs,
        target_fat: targets.fat,
        height_unit: formData.height_unit,
        weight_unit: formData.weight_unit,
        onboarding_completed: true,
      });

      if (profileError) throw profileError;

      // 2. Log initial weight
      await logUserWeight(userId, formData.weight_kg);

      // 3. Save equipment (if any)
      if (formData.equipment.length > 0) {
        // Delete old equipment first (in case of re-onboarding)
        await supabase.from('user_equipment').delete().eq('user_id', userId);

        const equipmentRows = formData.equipment.map((name) => ({
          user_id: userId,
          equipment_name: name,
          max_weight_kg: formData.equipmentDetails[name]?.max_weight_kg || null,
          resistance_level: formData.equipmentDetails[name]?.resistance_level || null,
        }));

        const { error: equipError } = await supabase.from('user_equipment').insert(equipmentRows);
        if (equipError) {
          console.warn('Equipment save error (non-critical):', equipError);
        }
      }

      onComplete();
    } catch (err: any) {
      console.error('Onboarding save error:', err);
      alert('Error saving your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Skip handler ── */
  const handleSkip = async () => {
    try {
      // Create a minimal profile row so the user can access the app
      await supabase.from('profiles').upsert({
        id: userId,
        updated_at: new Date().toISOString(),
        onboarding_completed: false,
        // Set defaults for required fields that have constraints
        age: 25,
        gender: 'other',
        height_cm: 170,
        weight_kg: 70,
        goal: 'improve_fitness',
        activity_level: 'moderate',
        training_location: 'none',
        target_calories: 2000,
        target_protein: 120,
        target_carbs: 250,
        target_fat: 55,
        height_unit: 'cm',
        weight_unit: 'kg',
      });
    } catch (err) {
      console.warn('Skip onboarding profile creation error:', err);
    }
    onSkip();
  };

  /* ── Progress ── */
  const progressPercent = ((screen - 1) / (TOTAL_SCREENS - 1)) * 100;

  return (
    <div className="ob-page">
      {/* Progress bar */}
      {screen > 1 && (
        <div className="ob-progress-bar">
          <div className="ob-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      )}

      {/* Skip button (only on welcome screen) */}
      {screen === 1 && (
        <button className="ob-skip-btn" onClick={handleSkip}>
          Skip
        </button>
      )}

      {/* Toast */}
      {showToast && screen === 1 && (
        <div className={`ob-toast${toastFading ? ' fade-out' : ''}`}>
          This might take a little while, but it's only a one-time process to personalize your experience.
        </div>
      )}

      {/* Screens */}
      {screen === 1 && <WelcomeScreen onBegin={() => setScreen(2)} />}
      {screen === 2 && (
        <NameScreen
          value={formData.display_name || ''}
          onChange={(name) => update({ display_name: name })}
          onNext={() => setScreen(3)}
          onBack={() => setScreen(1)}
        />
      )}
      {screen === 3 && (
        <AgeScreen
          value={formData.age}
          onChange={(age) => update({ age })}
          onNext={() => setScreen(4)}
          onBack={() => setScreen(2)}
        />
      )}
      {screen === 4 && (
        <GenderScreen
          value={formData.gender}
          onChange={(gender) => update({ gender })}
          onNext={() => setScreen(5)}
          onBack={() => setScreen(3)}
        />
      )}
      {screen === 5 && (
        <MeasurementsScreen
          heightCm={formData.height_cm}
          weightKg={formData.weight_kg}
          heightUnit={formData.height_unit}
          weightUnit={formData.weight_unit}
          onHeightChange={(cm) => update({ height_cm: cm })}
          onWeightChange={(kg) => update({ weight_kg: kg })}
          onHeightUnitChange={(u) => update({ height_unit: u })}
          onWeightUnitChange={(u) => update({ weight_unit: u })}
          onNext={() => setScreen(6)}
          onBack={() => setScreen(4)}
        />
      )}
      {screen === 6 && (
        <TargetWeightScreen
          targetWeightKg={formData.target_weight_kg || formData.weight_kg}
          weightUnit={formData.weight_unit}
          onTargetWeightChange={(kg) => update({ target_weight_kg: kg })}
          onNext={() => setScreen(7)}
          onBack={() => setScreen(5)}
        />
      )}
      {screen === 7 && (
        <ActivityScreen
          value={formData.activity_level}
          onChange={(level) => update({ activity_level: level })}
          onNext={() => setScreen(8)}
          onBack={() => setScreen(6)}
        />
      )}
      {screen === 8 && (
        <GoalScreen
          value={formData.goal}
          onChange={(goal) => update({ goal })}
          onNext={() => setScreen(9)}
          onBack={() => setScreen(7)}
        />
      )}
      {screen === 9 && (
        <LocationEquipmentScreen
          location={formData.training_location}
          onLocationChange={(loc) => update({ training_location: loc })}
          equipment={formData.equipment}
          equipmentDetails={formData.equipmentDetails}
          onEquipmentToggle={handleEquipmentToggle}
          onEquipmentDetailChange={handleEquipmentDetailChange}
          weightUnit={formData.weight_unit}
          onNext={handleFinish}
          onBack={() => setScreen(8)}
        />
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(250,250,248,0.8)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16,
        }}>
          <div className="ob-loading-dots">
            <span className="ob-loading-dot" style={{ background: 'var(--ob-primary)' }} />
            <span className="ob-loading-dot" style={{ background: 'var(--ob-primary)' }} />
            <span className="ob-loading-dot" style={{ background: 'var(--ob-primary)' }} />
          </div>
          <p style={{ color: 'var(--ob-text-secondary)', fontSize: 14, fontWeight: 500 }}>
            Setting up your profile…
          </p>
        </div>
      )}
    </div>
  );
};
