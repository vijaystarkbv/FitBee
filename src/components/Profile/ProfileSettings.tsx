import React, { useState } from 'react';
import { Profile } from '../../types/database.types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { UnitToggle } from '../common/UnitToggle';
import { NumericInput } from '../common/NumericInput';
import { supabase } from '../../services/supabaseClient';

interface ProfileSettingsProps {
  profile: Profile;
  userEmail: string;
  onProfileUpdated: () => void;
  onSignOut: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  userEmail,
  onProfileUpdated,
  onSignOut,
}) => {
  const [displayName, setDisplayName] = useState<string>(profile.display_name || '');
  const [age, setAge] = useState<number>(profile.age || 25);
  const [heightCm, setHeightCm] = useState<number>(profile.height_cm || 170);
  const [weightKg, setWeightKg] = useState<number>(profile.weight_kg || 70);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(profile.target_weight_kg || profile.weight_kg || 70);
  const [targetCalories, setTargetCalories] = useState<number>(profile.target_calories || 2000);
  const [targetProtein, setTargetProtein] = useState<number>(profile.target_protein || 120);
  const [targetCarbs, setTargetCarbs] = useState<number>(profile.target_carbs || 250);
  const [targetFat, setTargetFat] = useState<number>(profile.target_fat || 55);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(profile.height_unit || 'cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>(profile.weight_unit || 'kg');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName || null,
          age,
          height_cm: heightCm,
          weight_kg: weightKg,
          target_weight_kg: targetWeightKg,
          target_calories: targetCalories,
          target_protein: targetProtein,
          target_carbs: targetCarbs,
          target_fat: targetFat,
          height_unit: heightUnit,
          weight_unit: weightUnit,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      setSaveFeedback('✓ Profile updated successfully!');
      onProfileUpdated();
    } catch (err: any) {
      console.error(err);
      setSaveFeedback(`Error: ${err.message || 'Failed to update profile'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-6 px-4">
      <Card title="Profile & Account Settings">
        <div className="space-y-4">
          {saveFeedback && (
            <div
              className={`p-3 rounded-lg text-xs font-semibold ${
                saveFeedback.startsWith('✓')
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {saveFeedback}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Account Email</label>
            <input type="text" disabled value={userEmail} className="input-field opacity-60 cursor-not-allowed" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumericInput
              label="Age (12 - 80)"
              value={age}
              onChange={setAge}
              min={12}
              max={80}
            />

            <NumericInput
              label="Height (cm)"
              value={heightCm}
              onChange={setHeightCm}
              min={100}
              max={250}
              unit="cm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumericInput
              label="Current Weight (kg)"
              value={weightKg}
              onChange={setWeightKg}
              min={30}
              max={300}
              unit="kg"
            />

            <NumericInput
              label="Target Goal Weight (kg)"
              value={targetWeightKg}
              onChange={setTargetWeightKg}
              min={30}
              max={300}
              unit="kg"
            />
          </div>

          {/* Unit Display Preferences */}
          <div className="pt-3 border-t border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold text-zinc-200">Display Unit Preferences</h4>
            <div className="grid grid-cols-2 gap-3">
              <UnitToggle
                label="Height Unit"
                value={heightUnit}
                onChange={setHeightUnit}
                options={[
                  { value: 'cm', label: 'cm' },
                  { value: 'ft', label: 'ft' },
                ]}
              />
              <UnitToggle
                label="Weight Unit"
                value={weightUnit}
                onChange={setWeightUnit}
                options={[
                  { value: 'kg', label: 'kg' },
                  { value: 'lbs', label: 'lbs' },
                ]}
              />
            </div>
          </div>

          {/* Target Macro Preferences */}
          <div className="pt-3 border-t border-zinc-800 space-y-3">
            <h4 className="text-xs font-bold text-zinc-200">Daily Nutrition Targets</h4>
            <div className="grid grid-cols-2 gap-3">
              <NumericInput
                label="Calories (kcal)"
                value={targetCalories}
                onChange={setTargetCalories}
                min={800}
                max={10000}
                unit="kcal"
              />

              <NumericInput
                label="Protein (g)"
                value={targetProtein}
                onChange={setTargetProtein}
                min={20}
                max={500}
                unit="g"
              />

              <NumericInput
                label="Carbs (g)"
                value={targetCarbs}
                onChange={setTargetCarbs}
                min={20}
                max={1000}
                unit="g"
              />

              <NumericInput
                label="Fat (g)"
                value={targetFat}
                onChange={setTargetFat}
                min={10}
                max={300}
                unit="g"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <Button onClick={handleSave} isLoading={isSaving} className="w-2/3">
              Save Profile Changes
            </Button>
            <Button variant="secondary" onClick={onSignOut} className="w-1/3">
              Sign Out
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
