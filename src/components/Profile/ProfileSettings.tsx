import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Profile, NutritionProgressUpdate } from '../../types/database.types';
import { supabase } from '../../services/supabaseClient';
import { clock } from '../../services/clock';
import {
  createTargetVersion,
  recordProgressUpdate,
  getRecentProgressUpdates,
  updateProgressAction,
  calculateLiveCaloriePreview,
  evaluateLiveMacroSuitability,
  validateMacroCalorieConsistency,
  ensureTargetMatchesGoalInvariants,
} from '../../services/nutritionTargetService';
import {
  recommendLongitudinalTargets,
  calculateDeterministicTargets,
  LongitudinalRecommendationResult,
} from '../../services/geminiService';
import { getStatementsFromIds } from '../../services/nutritionStatementLibrary';
import { calculateWeeklyAdherenceSummaries } from '../../services/nutritionHistoryService';

interface ProfileSettingsProps {
  profile: Profile;
  userEmail: string;
  onProfileUpdated: () => void;
  onSignOut?: () => void;
  onBack?: () => void;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  userEmail,
  onProfileUpdated,
  onSignOut,
  onBack,
}) => {
  // ── Form State ──
  const [displayName, setDisplayName] = useState<string>(profile.display_name || '');
  const [sex, setSex] = useState<string>((profile.gender || 'male').toLowerCase());
  const [age, setAge] = useState<number>(profile.age || 25);
  const [heightCm, setHeightCm] = useState<number>(profile.height_cm || 170);
  const [weightKg, setWeightKg] = useState<number>(profile.weight_kg || 70);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(profile.target_weight_kg || profile.weight_kg || 70);
  const [goal, setGoal] = useState<string>(profile.goal || 'maintain_weight');
  const [activityLevel, setActivityLevel] = useState<string>(profile.activity_level || 'moderate');
  const [heightUnit] = useState<'cm' | 'ft'>(profile.height_unit || 'cm');
  const [weightUnit] = useState<'kg' | 'lbs'>(profile.weight_unit || 'kg');

  // ── Active Target & Editor State ──
  const [activeCalories, setActiveCalories] = useState<number>(profile.target_calories || 2000);
  const [activeProtein, setActiveProtein] = useState<number>(profile.target_protein || 120);
  const [activeCarbs, setActiveCarbs] = useState<number>(profile.target_carbs || 250);
  const [activeFat, setActiveFat] = useState<number>(profile.target_fat || 55);

  // Manual editor inputs
  const [isEditingTargets, setIsEditingTargets] = useState<boolean>(false);
  const [editCalories, setEditCalories] = useState<number>(profile.target_calories || 2000);
  const [editProtein, setEditProtein] = useState<number>(profile.target_protein || 120);
  const [editCarbs, setEditCarbs] = useState<number>(profile.target_carbs || 250);
  const [editFat, setEditFat] = useState<number>(profile.target_fat || 55);

  // ── Gemini Recommendation & History State ──
  const [pendingRecommendation, setPendingRecommendation] = useState<LongitudinalRecommendationResult | null>(null);
  const [recentUpdates, setRecentUpdates] = useState<NutritionProgressUpdate[]>([]);
  const [latestProgressId, setLatestProgressId] = useState<string | null>(null);
  const [isGeneratingRec, setIsGeneratingRec] = useState<boolean>(false);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // ── Weight History Modal State ──
  const [isWeightHistoryModalOpen, setIsWeightHistoryModalOpen] = useState<boolean>(false);
  const [allHistoryUpdates, setAllHistoryUpdates] = useState<NutritionProgressUpdate[]>([]);
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(null);

  // Load recent check-in updates (limit 6 for longitudinal context)
  const loadUpdates = useCallback(async () => {
    if (!profile.id) return;
    try {
      const updates = await getRecentProgressUpdates(profile.id, 6);
      setRecentUpdates(updates);
    } catch (err) {
      console.error('Failed to load recent check-ins:', err);
    }
  }, [profile.id]);

  // Load all check-in updates for weight history graph (limit 50)
  const loadAllHistoryUpdates = useCallback(async () => {
    if (!profile.id) return;
    try {
      const updates = await getRecentProgressUpdates(profile.id, 50);
      setAllHistoryUpdates(updates);
    } catch (err) {
      console.error('Failed to load all history updates:', err);
    }
  }, [profile.id]);

  useEffect(() => {
    loadUpdates();
  }, [loadUpdates]);

  useEffect(() => {
    if (isWeightHistoryModalOpen) {
      loadAllHistoryUpdates();
    }
  }, [isWeightHistoryModalOpen, loadAllHistoryUpdates]);

  // Sync state if profile prop changes & enforce goal invariants
  useEffect(() => {
    setDisplayName(profile.display_name || '');
    setSex((profile.gender || 'male').toLowerCase());
    setAge(profile.age || 25);
    setHeightCm(profile.height_cm || 170);
    setWeightKg(profile.weight_kg || 70);
    setTargetWeightKg(profile.target_weight_kg || profile.weight_kg || 70);
    setGoal(profile.goal || 'maintain_weight');
    setActivityLevel(profile.activity_level || 'moderate');

    const currentTargets = {
      calories: profile.target_calories || 2000,
      protein: profile.target_protein || 120,
      carbs: profile.target_carbs || 250,
      fat: profile.target_fat || 55,
    };

    // Guarantee that targets never contradict the profile's fitness goal direction
    const invariantCheck = ensureTargetMatchesGoalInvariants(currentTargets, {
      goal: profile.goal || 'maintain_weight',
      gender: profile.gender || undefined,
      sex: profile.gender || undefined,
      age: profile.age || undefined,
      height_cm: profile.height_cm || undefined,
      weight_kg: profile.weight_kg || undefined,
      target_weight_kg: profile.target_weight_kg || undefined,
      activity_level: profile.activity_level || undefined,
    });
    const resolvedTargets = {
      calories: invariantCheck.calories,
      protein: invariantCheck.protein,
      carbs: invariantCheck.carbs,
      fat: invariantCheck.fat,
    };

    setActiveCalories(resolvedTargets.calories);
    setActiveProtein(resolvedTargets.protein);
    setActiveCarbs(resolvedTargets.carbs);
    setActiveFat(resolvedTargets.fat);
    setEditCalories(resolvedTargets.calories);
    setEditProtein(resolvedTargets.protein);
    setEditCarbs(resolvedTargets.carbs);
    setEditFat(resolvedTargets.fat);

    // If targets were repaired to resolve a contradiction, persist repair to DB
    if (invariantCheck.wasRepaired && profile.id) {
      (async () => {
        try {
          await supabase
            .from('profiles')
            .update({
              target_calories: resolvedTargets.calories,
              target_protein: resolvedTargets.protein,
              target_carbs: resolvedTargets.carbs,
              target_fat: resolvedTargets.fat,
              updated_at: clock.now().toISOString(),
            })
            .eq('id', profile.id);
          await createTargetVersion(profile.id, resolvedTargets, 'system_invariant_repair');
        } catch (err: any) {
          console.warn('Failed to persist invariant repair:', err);
        }
      })();
    }
  }, [profile]);

  // ── Live Previews for Active Target Card ──
  const activeTargetPreview = useMemo(() => {
    return calculateLiveCaloriePreview(activeCalories, {
      weight_kg: weightKg,
      height_cm: heightCm,
      age,
      gender: sex,
      activity_level: activityLevel,
      goal,
    });
  }, [activeCalories, weightKg, heightCm, age, sex, activityLevel, goal]);

  // ── Live Previews for Manual Target Editor ──
  const liveCaloriePreview = useMemo(() => {
    return calculateLiveCaloriePreview(editCalories, {
      weight_kg: weightKg,
      height_cm: heightCm,
      age,
      gender: sex,
      activity_level: activityLevel,
      goal,
    });
  }, [editCalories, weightKg, heightCm, age, sex, activityLevel, goal]);

  const liveMacroSuitability = useMemo(() => {
    return evaluateLiveMacroSuitability(
      { protein: editProtein, carbs: editCarbs, fat: editFat },
      editCalories,
      { weight_kg: weightKg, goal }
    );
  }, [editProtein, editCarbs, editFat, weightKg, editCalories, goal]);

  const liveConsistency = useMemo(() => {
    return validateMacroCalorieConsistency(editCalories, {
      protein: editProtein,
      carbs: editCarbs,
      fat: editFat,
    });
  }, [editCalories, editProtein, editCarbs, editFat]);

  // ── Auto-balance Helpers ──
  const handleAutoBalanceCarbs = () => {
    const remainingCal = editCalories - (editProtein * 4) - (editFat * 9);
    const balancedCarbs = Math.max(0, Math.round(remainingCal / 4));
    setEditCarbs(balancedCarbs);
  };

  const handleSyncCaloriesToMacros = () => {
    const sum = (editProtein * 4) + (editCarbs * 4) + (editFat * 9);
    setEditCalories(Math.round(sum / 10) * 10);
  };

  // ── 1. Save Profile Changes (Triggers Recalculation if Goal/Activity/Weight Changed) ──
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    setFeedback(null);

    const previousWeight = profile.weight_kg || 70;
    const cleanWeight = Math.min(300, Math.max(30, Math.round((Number(weightKg) || 70) * 10) / 10));
    const cleanTargetWeight = Math.min(300, Math.max(30, Math.round((Number(targetWeightKg) || 70) * 10) / 10));
    const cleanHeight = Math.min(250, Math.max(100, Math.round((Number(heightCm) || 170) * 10) / 10));
    const cleanAge = Math.min(120, Math.max(12, Math.round(Number(age) || 25)));

    setWeightKg(cleanWeight);
    setTargetWeightKg(cleanTargetWeight);
    setHeightCm(cleanHeight);
    setAge(cleanAge);

    const isWeightChanged = Math.abs(cleanWeight - previousWeight) >= 0.1;
    const isGoalChanged = goal !== (profile.goal || 'maintain_weight');
    const isActivityChanged = activityLevel !== (profile.activity_level || 'moderate');

    try {
      // Build profile update object
      const profileUpdates: any = {
        display_name: displayName || null,
        gender: sex,
        age: cleanAge,
        height_cm: cleanHeight,
        weight_kg: cleanWeight,
        target_weight_kg: cleanTargetWeight,
        goal,
        activity_level: activityLevel,
        height_unit: heightUnit,
        weight_unit: weightUnit,
        updated_at: clock.now().toISOString(),
      };

      // If fitness goal or activity level changed, recalculate targets to align with goal!
      if (isGoalChanged || isActivityChanged) {
        const newBaseline = calculateDeterministicTargets({
          gender: sex as any,
          age: cleanAge,
          height_cm: cleanHeight,
          weight_kg: cleanWeight,
          target_weight_kg: cleanTargetWeight,
          goal: goal as any,
          activity_level: activityLevel as any,
        });

        profileUpdates.target_calories = newBaseline.calories;
        profileUpdates.target_protein = newBaseline.protein;
        profileUpdates.target_carbs = newBaseline.carbs;
        profileUpdates.target_fat = newBaseline.fat;

        setActiveCalories(newBaseline.calories);
        setActiveProtein(newBaseline.protein);
        setActiveCarbs(newBaseline.carbs);
        setActiveFat(newBaseline.fat);
        setEditCalories(newBaseline.calories);
        setEditProtein(newBaseline.protein);
        setEditCarbs(newBaseline.carbs);
        setEditFat(newBaseline.fat);

        if (profile.id) {
          await createTargetVersion(profile.id, newBaseline, 'system_recalculation');
        }
      }

      // 1. Update profiles table
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', profile.id);

      if (error) throw error;

      // 2. If weight changed, trigger longitudinal recalibration event!
      if (isWeightChanged) {
        setIsGeneratingRec(true);

        const currentActiveCal = profileUpdates.target_calories || activeCalories;
        const currentActiveProt = profileUpdates.target_protein || activeProtein;
        const currentActiveCarb = profileUpdates.target_carbs || activeCarbs;
        const currentActiveFat = profileUpdates.target_fat || activeFat;

        // Record progress update event
        const progressUpdate = await recordProgressUpdate({
          user_id: profile.id,
          weight: cleanWeight,
          previous_weight: previousWeight,
          target_calories_at_time: currentActiveCal,
          target_protein_at_time: currentActiveProt,
          target_carbs_at_time: currentActiveCarb,
          target_fat_at_time: currentActiveFat,
          target_source_at_time: 'user_override',
        });

        setLatestProgressId(progressUpdate.id);
        await loadUpdates();
        await loadAllHistoryUpdates();

        // Determine evaluation period: from earliest recent update (or 14 days ago) up to today
        const todayStr = progressUpdate.recorded_at
          ? progressUpdate.recorded_at.split('T')[0]
          : clock.now().toISOString().split('T')[0];

        let startPeriodStr = '';
        if (recentUpdates && recentUpdates.length > 0) {
          const sorted = [...recentUpdates].sort(
            (a, b) =>
              new Date(a.recorded_at || a.date || '').getTime() -
              new Date(b.recorded_at || b.date || '').getTime()
          );
          const earliest = sorted[0];
          startPeriodStr = earliest.recorded_at
            ? earliest.recorded_at.split('T')[0]
            : (earliest.date || todayStr);
        }

        if (!startPeriodStr || startPeriodStr === todayStr) {
          const d = new Date(todayStr + 'T00:00:00');
          d.setDate(d.getDate() - 14);
          startPeriodStr = d.toISOString().split('T')[0];
        }

        // Calculate weekly adherence summaries for this period
        const adherenceHistory = await calculateWeeklyAdherenceSummaries(
          profile.id,
          startPeriodStr,
          todayStr,
          profile
        );

        if (import.meta.env.DEV) {
          console.log('[FitBee] Gemini Nutrition Adherence Context:', {
            period: `${startPeriodStr} to ${todayStr}`,
            weeksCount: adherenceHistory.length,
            adherenceHistory,
          });
        }

        // Call Gemini for longitudinal recommendation
        const recommendation = await recommendLongitudinalTargets({
          profile: {
            sex,
            age: cleanAge,
            height: cleanHeight,
            current_weight: cleanWeight,
            target_weight: cleanTargetWeight,
            goal,
            activity_level: activityLevel,
          },
          active_target: {
            calories: currentActiveCal,
            protein_g: currentActiveProt,
            carbs_g: currentActiveCarb,
            fat_g: currentActiveFat,
            source: 'gemini_recommendation',
          },
          recent_updates: [
            ...recentUpdates.map((u) => ({
              date: u.recorded_at ? u.recorded_at.split('T')[0] : (u.date || clock.now().toISOString().split('T')[0]),
              weight: Number(u.weight_kg ?? u.weight ?? 70),
              previous_weight: u.previous_weight_kg ?? u.previous_weight ?? undefined,
              target_calories_at_time: Number(u.active_target_calories ?? u.target_calories_at_time ?? 2000),
              target_protein_at_time: Number(u.active_target_protein ?? u.target_protein_at_time ?? 120),
              target_carbs_at_time: Number(u.active_target_carbs ?? u.target_carbs_at_time ?? 250),
              target_fat_at_time: Number(u.active_target_fat ?? u.target_fat_at_time ?? 55),
              target_source_at_time: u.target_source_at_time || 'gemini_recommendation',
              user_action: u.user_action,
            })),
            {
              date: progressUpdate.recorded_at ? progressUpdate.recorded_at.split('T')[0] : clock.now().toISOString().split('T')[0],
              weight: Number(progressUpdate.weight_kg ?? progressUpdate.weight ?? cleanWeight),
              previous_weight: progressUpdate.previous_weight_kg ?? progressUpdate.previous_weight ?? previousWeight,
              target_calories_at_time: Number(progressUpdate.active_target_calories ?? progressUpdate.target_calories_at_time ?? currentActiveCal),
              target_protein_at_time: Number(progressUpdate.active_target_protein ?? progressUpdate.target_protein_at_time ?? currentActiveProt),
              target_carbs_at_time: Number(progressUpdate.active_target_carbs ?? progressUpdate.target_carbs_at_time ?? currentActiveCarb),
              target_fat_at_time: Number(progressUpdate.active_target_fat ?? progressUpdate.target_fat_at_time ?? currentActiveFat),
            },
          ],
          adherence_history: adherenceHistory,
        });

        setPendingRecommendation(recommendation);
        setIsGeneratingRec(false);
        setFeedback({
          type: 'success',
          message: '✓ Weight update saved! FitBee generated a new nutrition recommendation below.',
        });
      } else if (isGoalChanged || isActivityChanged) {
        setFeedback({
          type: 'success',
          message: '✓ Goal updated! Nutrition targets recalibrated to match your new fitness goal.',
        });
      } else {
        setFeedback({
          type: 'success',
          message: '✓ Profile updated successfully.',
        });
      }

      onProfileUpdated();
    } catch (err: any) {
      console.error('Save profile error:', err);
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to update profile.',
      });
      setIsGeneratingRec(false);
    } finally {
      setIsSavingProfile(false);
    }
  };

  // ── 2. Accept Recommendation ──
  const handleAcceptRecommendation = async () => {
    if (!pendingRecommendation || !profile.id) return;

    try {
      const newTargets = {
        calories: pendingRecommendation.recommended_calories,
        protein: pendingRecommendation.recommended_protein_g,
        carbs: pendingRecommendation.recommended_carbs_g,
        fat: pendingRecommendation.recommended_fat_g,
      };

      // Create new immutable target version
      await createTargetVersion(profile.id, newTargets, 'gemini_recommendation');

      // Update local and profile state
      setActiveCalories(newTargets.calories);
      setActiveProtein(newTargets.protein);
      setActiveCarbs(newTargets.carbs);
      setActiveFat(newTargets.fat);
      setEditCalories(newTargets.calories);
      setEditProtein(newTargets.protein);
      setEditCarbs(newTargets.carbs);
      setEditFat(newTargets.fat);

      // Record action on progress update
      if (latestProgressId) {
        await updateProgressAction(latestProgressId, 'accepted_recommendation');
      }

      setPendingRecommendation(null);
      setFeedback({
        type: 'success',
        message: '✓ Recommendation applied! Your new targets are now active.',
      });
      onProfileUpdated();
    } catch (err: any) {
      console.error('Accept recommendation error:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to apply recommendation.' });
    }
  };

  // ── 3. Keep Current Targets ──
  const handleKeepCurrent = async () => {
    if (latestProgressId) {
      await updateProgressAction(latestProgressId, 'kept_previous');
    }
    setPendingRecommendation(null);
    setFeedback({
      type: 'success',
      message: 'Kept your current nutrition targets.',
    });
  };

  // ── 4. Customize from Recommendation ──
  const handleCustomizeFromRecommendation = () => {
    if (pendingRecommendation) {
      setEditCalories(pendingRecommendation.recommended_calories);
      setEditProtein(pendingRecommendation.recommended_protein_g);
      setEditCarbs(pendingRecommendation.recommended_carbs_g);
      setEditFat(pendingRecommendation.recommended_fat_g);
    }
    setIsEditingTargets(true);
  };

  // ── 5. Save Custom Manual Target ──
  const handleSaveCustomTarget = async () => {
    if (!profile.id) return;

    try {
      const customTargets = {
        calories: editCalories,
        protein: editProtein,
        carbs: editCarbs,
        fat: editFat,
      };

      // Create new target version with user_override
      await createTargetVersion(profile.id, customTargets, 'user_override');

      setActiveCalories(customTargets.calories);
      setActiveProtein(customTargets.protein);
      setActiveCarbs(customTargets.carbs);
      setActiveFat(customTargets.fat);

      if (latestProgressId) {
        await updateProgressAction(latestProgressId, 'customized');
      }

      setIsEditingTargets(false);
      setPendingRecommendation(null);
      setFeedback({
        type: 'success',
        message: '✓ Custom targets saved! Active as of today.',
      });
      onProfileUpdated();
    } catch (err: any) {
      console.error('Save custom target error:', err);
      setFeedback({ type: 'error', message: err.message || 'Failed to save targets.' });
    }
  };

  // Predefined statement human-readable details
  const recommendationStatements = useMemo(() => {
    if (!pendingRecommendation) return [];
    return getStatementsFromIds(pendingRecommendation.statement_ids);
  }, [pendingRecommendation]);

  // ── SVG Weight Graph Calculations ──
  const graphData = useMemo(() => {
    // Collect all chronological entries
    const points: Array<{ date: string; weight: number; target: number; delta?: number; raw: NutritionProgressUpdate }> = [];

    // Reverse allHistoryUpdates to ensure chronological (oldest to newest)
    const list = [...allHistoryUpdates];
    list.forEach((u) => {
      const w = Number(u.weight_kg ?? u.weight ?? 0);
      const prevW = u.previous_weight_kg ?? u.previous_weight;
      const d = prevW !== undefined ? w - prevW : undefined;
      const dateStr = u.recorded_at ? u.recorded_at.split('T')[0] : (u.date || '');
      if (w > 0) {
        points.push({
          date: dateStr,
          weight: w,
          target: targetWeightKg,
          delta: d,
          raw: u,
        });
      }
    });

    // If no updates in DB but current weight exists, provide single point
    if (points.length === 0 && weightKg > 0) {
      points.push({
        date: clock.now().toISOString().split('T')[0],
        weight: weightKg,
        target: targetWeightKg,
        raw: {} as any,
      });
    }

    if (points.length === 0) {
      return { isEmpty: true, points: [], targetY: 105, minY: 50, maxY: 100, coords: [] };
    }

    const weights = points.map((p) => p.weight);
    weights.push(targetWeightKg);

    const minWeight = Math.min(...weights);
    const maxWeight = Math.max(...weights);
    const buffer = Math.max(1.5, (maxWeight - minWeight) * 0.15);
    const minY = Math.floor(minWeight - buffer);
    const maxY = Math.ceil(maxWeight + buffer);
    const yRange = Math.max(1, maxY - minY);

    // SVG coordinate space: width 460, height 210
    // Padding: left 45, right 25, top 25, bottom 35
    const left = 45;
    const right = 435;
    const top = 25;
    const bottom = 175;
    const plotW = right - left;
    const plotH = bottom - top;

    const targetY = top + ((maxY - targetWeightKg) / yRange) * plotH;

    const coords = points.map((p, idx) => {
      const x = points.length === 1 ? left + plotW / 2 : left + (idx / (points.length - 1)) * plotW;
      const y = top + ((maxY - p.weight) / yRange) * plotH;
      return { ...p, x, y, idx };
    });

    const polylineStr = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
    const areaStr = coords.length > 1
      ? `${polylineStr} ${coords[coords.length - 1].x.toFixed(1)},${bottom} ${coords[0].x.toFixed(1)},${bottom}`
      : '';

    return {
      isEmpty: false,
      points,
      targetY,
      minY,
      maxY,
      coords,
      polylineStr,
      areaStr,
      left,
      right,
      top,
      bottom,
      plotW,
      plotH,
    };
  }, [allHistoryUpdates, weightKg, targetWeightKg]);

  return (
    <div
      style={{
        maxWidth: 520,
        margin: '0 auto',
        padding: '20px 16px 100px',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
      }}
    >
      {/* ── Top Bar ── */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            fontSize: 13,
            fontWeight: 600,
            color: '#5C8D89',
            cursor: 'pointer',
            padding: '2px 0 14px',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Settings
        </button>
      )}

      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1F2937', margin: '0 0 4px', letterSpacing: '-0.3px' }}>
          Profile & Nutrition Targets
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', margin: 0, lineHeight: 1.4 }}>
          Manage your body metrics, track periodic weight check-ins, and evolve your nutrition targets.
          {userEmail && <span style={{ display: 'block', marginTop: 2, fontSize: 11, color: '#9CA3AF' }}>{userEmail}</span>}
        </p>
      </div>

      {/* ── Feedback Message ── */}
      {feedback && (
        <div
          style={{
            marginBottom: 14,
            padding: '9px 12px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            background: feedback.type === 'success' ? '#ECFDF5' : '#FEF2F2',
            border: `1px solid ${feedback.type === 'success' ? '#A7F3D0' : '#FECACA'}`,
            color: feedback.type === 'success' ? '#065F46' : '#991B1B',
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* ── 1. ACTIVE NUTRITION TARGET CARD ── */}
      <div
        className="hd-card"
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E5E7EB',
          padding: '16px 18px',
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#5C8D89' }}>
              Active Target
            </span>
            <h3 style={{ margin: '2px 0 0', fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
              {activeCalories} <span style={{ fontSize: 13, fontWeight: 500, color: '#6B7280' }}>kcal / day</span>
            </h3>

            {/* Live Subtitle Badge matching authoritative goal invariants */}
            {activeTargetPreview && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: activeTargetPreview.isMismatch ? '#FEE2E2' : '#E0F2FE',
                    color: activeTargetPreview.isMismatch ? '#991B1B' : '#0369A1',
                    border: `1px solid ${activeTargetPreview.isMismatch ? '#FECACA' : '#BAE6FD'}`,
                  }}
                >
                  {activeTargetPreview.paceLabel}
                </span>
                <span style={{ fontSize: 12, color: '#6B7280' }}>
                  Est. TDEE: {activeTargetPreview.tdee} kcal ({activeTargetPreview.dailySurplusDeficit >= 0 ? '+' : ''}{activeTargetPreview.dailySurplusDeficit} kcal/day)
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsEditingTargets(!isEditingTargets)}
            style={{
              padding: '5px 10px',
              borderRadius: 8,
              border: '1px solid #5C8D89',
              background: isEditingTargets ? '#5C8D89' : '#FFFFFF',
              color: isEditingTargets ? '#FFFFFF' : '#5C8D89',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {isEditingTargets ? 'Cancel Edit' : 'Customize Targets'}
          </button>
        </div>

        {/* Macro Chips */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 10px', textAlign: 'center', border: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Protein</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', marginTop: 1 }}>{activeProtein}g</div>
          </div>
          <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 10px', textAlign: 'center', border: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Carbs</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', marginTop: 1 }}>{activeCarbs}g</div>
          </div>
          <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '8px 10px', textAlign: 'center', border: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>Fat</span>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', marginTop: 1 }}>{activeFat}g</div>
          </div>
        </div>

        {/* ── DYNAMIC MANUAL MACRO EDITOR (Expandable) ── */}
        {isEditingTargets && (
          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: '1px solid #E5E7EB',
            }}
          >
            <h4 style={{ fontSize: 13, fontWeight: 700, color: '#1F2937', margin: '0 0 10px' }}>
              Custom Target Editor
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  id="fitbee-edit-calories-input"
                  value={editCalories}
                  onChange={(e) => setEditCalories(Math.max(800, Number(e.target.value) || 0))}
                  style={{
                    width: '100%',
                    padding: '7px 9px',
                    borderRadius: 6,
                    border: '1px solid #D1D5DB',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1F2937',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
                  Protein (g)
                </label>
                <input
                  type="number"
                  id="fitbee-edit-protein-input"
                  value={editProtein}
                  onChange={(e) => setEditProtein(Math.max(20, Number(e.target.value) || 0))}
                  style={{
                    width: '100%',
                    padding: '7px 9px',
                    borderRadius: 6,
                    border: '1px solid #D1D5DB',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1F2937',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
                  Carbs (g)
                </label>
                <input
                  type="number"
                  id="fitbee-edit-carbs-input"
                  value={editCarbs}
                  onChange={(e) => setEditCarbs(Math.max(20, Number(e.target.value) || 0))}
                  style={{
                    width: '100%',
                    padding: '7px 9px',
                    borderRadius: 6,
                    border: '1px solid #D1D5DB',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1F2937',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
                  Fat (g)
                </label>
                <input
                  type="number"
                  id="fitbee-edit-fat-input"
                  value={editFat}
                  onChange={(e) => setEditFat(Math.max(10, Number(e.target.value) || 0))}
                  style={{
                    width: '100%',
                    padding: '7px 9px',
                    borderRadius: 6,
                    border: '1px solid #D1D5DB',
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#1F2937',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Live Calorie & Weight Change Preview */}
            <div
              style={{
                background: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                padding: '10px 12px',
                marginBottom: 10,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                  Projected Pace:
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: liveCaloriePreview.isMismatch ? '#FEE2E2' : '#E0F2FE',
                    color: liveCaloriePreview.isMismatch ? '#991B1B' : '#0369A1',
                  }}
                >
                  {liveCaloriePreview.paceLabel}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.4 }}>
                Est. TDEE: <strong>{liveCaloriePreview.tdee} kcal</strong> ({liveCaloriePreview.dailySurplusDeficit >= 0 ? '+' : ''}{liveCaloriePreview.dailySurplusDeficit} kcal/day). Estimated bodyweight change: <strong>~{liveCaloriePreview.estimatedMonthlyChangeKg} kg / month</strong>.
              </div>
            </div>

            {/* Dynamic Macro Suitability Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 6,
                  background: liveMacroSuitability.protein.isOptimal ? '#ECFDF5' : '#FEF3C7',
                  color: liveMacroSuitability.protein.isOptimal ? '#065F46' : '#92400E',
                  border: `1px solid ${liveMacroSuitability.protein.isOptimal ? '#A7F3D0' : '#FDE68A'}`,
                }}
              >
                Protein: {liveMacroSuitability.protein.gPerKg} g/kg ({liveMacroSuitability.protein.label})
              </span>

              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 6,
                  background: liveMacroSuitability.fat.isOptimal ? '#ECFDF5' : '#FEF3C7',
                  color: liveMacroSuitability.fat.isOptimal ? '#065F46' : '#92400E',
                  border: `1px solid ${liveMacroSuitability.fat.isOptimal ? '#A7F3D0' : '#FDE68A'}`,
                }}
              >
                Fat: {liveMacroSuitability.fat.percentage}% of calories ({liveMacroSuitability.fat.label})
              </span>

              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 6,
                  background: liveMacroSuitability.carbs.isOptimal ? '#ECFDF5' : '#FEF3C7',
                  color: liveMacroSuitability.carbs.isOptimal ? '#065F46' : '#92400E',
                  border: `1px solid ${liveMacroSuitability.carbs.isOptimal ? '#A7F3D0' : '#FDE68A'}`,
                }}
              >
                Carbs: {liveMacroSuitability.carbs.label}
              </span>
            </div>

            {/* Mathematical Consistency Warning / Info */}
            <div
              style={{
                fontSize: 11,
                padding: '7px 10px',
                borderRadius: 8,
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: liveConsistency.isValid ? '#F0FDF4' : '#FFFBEB',
                border: `1px solid ${liveConsistency.isValid ? '#BBF7D0' : '#FDE68A'}`,
                color: liveConsistency.isValid ? '#15803D' : '#B45309',
              }}
            >
              <span>{liveConsistency.message}</span>
              {!liveConsistency.isValid && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={handleAutoBalanceCarbs}
                    style={{
                      padding: '2px 7px',
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 4,
                      background: '#D97706',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Balance Carbs
                  </button>
                  <button
                    type="button"
                    onClick={handleSyncCaloriesToMacros}
                    style={{
                      padding: '2px 7px',
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 4,
                      background: '#4B5563',
                      color: '#FFFFFF',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Sync Cals
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={handleSaveCustomTarget}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: '#5C8D89',
                  color: '#FFFFFF',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Save As Active Target
              </button>
              <button
                type="button"
                onClick={() => setIsEditingTargets(false)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 8,
                  background: '#F3F4F6',
                  color: '#374151',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 2. GEMINI RECALIBRATION CARD (When Weight Update Occurs) ── */}
      {isGeneratingRec && (
        <div
          style={{
            background: '#F0FDFA',
            border: '1px solid #CCFBF1',
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            textAlign: 'center',
            color: '#0F766E',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <div style={{ fontSize: 18, marginBottom: 4 }}>✨</div>
          FitBee AI is evaluating your progress and recalibrating nutrition recommendations...
        </div>
      )}

      {pendingRecommendation && !isGeneratingRec && (
        <div
          id="fitbee-gemini-recalibration-card"
          style={{
            background: '#F0FDFA',
            border: '2px solid #5C8D89',
            borderRadius: 14,
            padding: 16,
            marginBottom: 16,
            boxShadow: '0 4px 12px rgba(92, 141, 137, 0.12)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>✨</span>
            <div>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#134E4A' }}>
                FitBee Recommended Recalibration
              </h3>
              <p style={{ margin: 0, fontSize: 11, color: '#0F766E' }}>
                Based on your latest weight check-in and trajectory history
              </p>
            </div>
          </div>

          {/* Recommended Numbers */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 10,
              padding: 12,
              border: '1px solid #CCFBF1',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#374151' }}>Recommended Calories:</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: '#5C8D89' }}>
                {pendingRecommendation.recommended_calories} <span style={{ fontSize: 11, fontWeight: 500 }}>kcal</span>
              </span>
            </div>

            <div style={{ display: 'flex', gap: 10, fontSize: 11, color: '#4B5563' }}>
              <span>Protein: <strong>{pendingRecommendation.recommended_protein_g}g</strong></span>
              <span>•</span>
              <span>Carbs: <strong>{pendingRecommendation.recommended_carbs_g}g</strong></span>
              <span>•</span>
              <span>Fat: <strong>{pendingRecommendation.recommended_fat_g}g</strong></span>
            </div>
          </div>

          {/* Mapped Predefined Statements (Zero Hallucinations, 100% Deterministic Text) */}
          <div style={{ marginBottom: 14 }}>
            <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: '#0F766E' }}>
              FitBee Assessment:
            </span>
            <div style={{ marginTop: 5, display: 'flex', flexDirection: 'column', gap: 5 }}>
              {recommendationStatements.map((stmt) => (
                <div
                  key={stmt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 6,
                    fontSize: 11,
                    color: '#134E4A',
                    lineHeight: 1.4,
                  }}
                >
                  <span style={{ color: '#5C8D89', fontWeight: 700 }}>•</span>
                  <span>{stmt.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              type="button"
              id="fitbee-accept-rec-btn"
              onClick={handleAcceptRecommendation}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: 8,
                background: '#5C8D89',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Use Recommendation
            </button>
            <button
              type="button"
              onClick={handleCustomizeFromRecommendation}
              style={{
                padding: '9px 10px',
                borderRadius: 8,
                background: '#CCFBF1',
                color: '#0F766E',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Customize
            </button>
            <button
              type="button"
              onClick={handleKeepCurrent}
              style={{
                padding: '9px 10px',
                borderRadius: 8,
                background: '#F3F4F6',
                color: '#4B5563',
                fontSize: 12,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Keep Current
            </button>
          </div>
        </div>
      )}

      {/* ── 3. EDITABLE PROFILE & WEIGHT SECTION ── */}
      <div
        className="hd-card"
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E5E7EB',
          padding: '16px 18px',
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', margin: '0 0 14px' }}>
          Body Stats & Goal Settings
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 12 }}>
          {/* Display Name */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
              Display Name
            </label>
            <input
              type="text"
              id="fitbee-display-name-input"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: '1px solid #D1D5DB',
                fontSize: 13,
                color: '#1F2937',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Biological Sex */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
              Biological Sex
            </label>
            <select
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: '1px solid #D1D5DB',
                fontSize: 13,
                color: '#1F2937',
                background: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Age */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
              Age (years)
            </label>
            <input
              type="number"
              value={age}
              min={12}
              max={100}
              onChange={(e) => setAge(Math.max(12, Number(e.target.value) || 25))}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: '1px solid #D1D5DB',
                fontSize: 13,
                color: '#1F2937',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Height */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
              Height (cm)
            </label>
            <input
              type="number"
              value={heightCm}
              min={100}
              max={250}
              onChange={(e) => setHeightCm(Math.max(100, Number(e.target.value) || 170))}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: '1px solid #D1D5DB',
                fontSize: 13,
                color: '#1F2937',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Current Weight (Check-in Trigger) */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#5C8D89', marginBottom: 3 }}>
              Current Weight (kg) ★
            </label>
            <input
              type="number"
              step="0.1"
              id="fitbee-current-weight-input"
              value={weightKg}
              min={30}
              max={300}
              onChange={(e) => setWeightKg(Math.max(30, Number(e.target.value) || 70))}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: '2px solid #5C8D89',
                fontSize: 13,
                fontWeight: 700,
                color: '#1F2937',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Target Goal Weight */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
              Target Goal Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={targetWeightKg}
              min={30}
              max={300}
              onChange={(e) => setTargetWeightKg(Math.max(30, Number(e.target.value) || 70))}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: '1px solid #D1D5DB',
                fontSize: 13,
                color: '#1F2937',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Goal Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
              Fitness Goal
            </label>
            <select
              id="fitbee-goal-select"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: '1px solid #D1D5DB',
                fontSize: 13,
                color: '#1F2937',
                background: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            >
              <option value="lose_fat">Lose Fat & Lean Down</option>
              <option value="gain_muscle">Build Muscle (Hypertrophy)</option>
              <option value="maintain_weight">Maintain Weight</option>
              <option value="improve_fitness">Improve Fitness & Energy</option>
            </select>
          </div>

          {/* Activity Level Dropdown */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#4B5563', marginBottom: 3 }}>
              Daily Activity Level
            </label>
            <select
              value={activityLevel}
              onChange={(e) => setActivityLevel(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px',
                borderRadius: 7,
                border: '1px solid #D1D5DB',
                fontSize: 13,
                color: '#1F2937',
                background: '#FFFFFF',
                boxSizing: 'border-box',
              }}
            >
              <option value="sedentary">Sedentary (Desk work, little exercise)</option>
              <option value="light">Lightly Active (1–3 training days / week)</option>
              <option value="moderate">Moderately Active (3–5 training days / week)</option>
              <option value="active">Very Active (6–7 intense training days / week)</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          id="fitbee-save-profile-btn"
          onClick={handleSaveProfile}
          disabled={isSavingProfile}
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: 8,
            background: '#5C8D89',
            color: '#FFFFFF',
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: isSavingProfile ? 'not-allowed' : 'pointer',
            opacity: isSavingProfile ? 0.7 : 1,
            transition: 'all 0.15s ease',
          }}
        >
          {isSavingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
        </button>
      </div>

      {/* ── 4. RECENT CHECK-IN TRAJECTORY HISTORY ── */}
      <div
        className="hd-card"
        style={{
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid #E5E7EB',
          padding: '16px 18px',
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: recentUpdates.length > 0 ? 12 : 6 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1F2937', margin: 0 }}>
            Recent Weight Check-ins ({recentUpdates.length})
          </h3>
          <button
            type="button"
            id="fitbee-view-weight-history-btn"
            onClick={() => setIsWeightHistoryModalOpen(true)}
              style={{
                padding: '5px 10px',
                borderRadius: 7,
                border: '1px solid #5C8D89',
                background: '#F0FDFA',
                color: '#0F766E',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                transition: 'all 0.15s ease',
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
              View Weight Check-History
            </button>
          </div>

        {recentUpdates.length === 0 ? (
          <div style={{ padding: '6px 0', fontSize: 12, color: '#6B7280' }}>
            No recent check-ins logged. Enter your current weight in Body Stats above to log a check-in.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recentUpdates.map((u, idx) => {
              const currentWeight = u.weight_kg ?? u.weight ?? 0;
              const prevWeight = u.previous_weight_kg ?? u.previous_weight;
              const delta = prevWeight !== undefined ? currentWeight - prevWeight : 0;
              return (
                <div
                  key={u.id || idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: 7,
                    background: '#F9FAFB',
                    border: '1px solid #F3F4F6',
                    fontSize: 11,
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 600, color: '#1F2937' }}>{u.date}</span>
                    <span style={{ color: '#6B7280', marginLeft: 8 }}>
                      Target: {u.target_calories_at_time} kcal
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: '#1F2937' }}>{currentWeight} kg</span>
                    {prevWeight !== undefined && (
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: 10,
                          color: delta < 0 ? '#059669' : delta > 0 ? '#D97706' : '#6B7280',
                        }}
                      >
                        {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)} kg
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 5. WEIGHT CHECK-IN HISTORY MODAL ── */}
      {isWeightHistoryModalOpen && (
        <div
          id="fitbee-weight-history-modal-backdrop"
          onClick={() => setIsWeightHistoryModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(31, 41, 55, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
            animation: 'fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            id="fitbee-weight-history-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: 24,
              width: '100%',
              maxWidth: 480,
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: 24,
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.14)',
              border: '1px solid #E8E8E6',
              animation: 'scaleIn 220ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1F2937', margin: 0 }}>
                  Weight Check-In History
                </h2>
                <p style={{ fontSize: 12, color: '#6B7280', margin: '2px 0 0' }}>
                  Progress trajectory and target adjustments over time
                </p>
              </div>

              <button
                type="button"
                id="fitbee-close-weight-history-modal"
                onClick={() => setIsWeightHistoryModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6B7280',
                  cursor: 'pointer',
                  padding: 4,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Quick Metrics Header Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 8,
                background: '#F9FAFB',
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid #F3F4F6',
                marginBottom: 16,
              }}
            >
              <div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Current</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>{weightKg} kg</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#2563EB', fontWeight: 600, textTransform: 'uppercase' }}>Target Goal</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#2563EB' }}>{targetWeightKg} kg</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>Check-ins</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1F2937' }}>
                  {graphData.points.length} entries
                </div>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 12,
                border: '1px solid #E5E7EB',
                padding: '12px 10px',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, padding: '0 6px' }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>
                  Weight Trajectory vs Goal
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#5C8D89', fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#5C8D89' }} />
                    Weight
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#3B82F6', fontWeight: 600 }}>
                    <span style={{ width: 12, height: 2, background: '#3B82F6', borderTop: '1px dashed #3B82F6' }} />
                    Target ({targetWeightKg} kg)
                  </span>
                </div>
              </div>

              <div style={{ width: '100%', overflowX: 'auto' }}>
                <svg
                  viewBox="0 0 460 210"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                >
                  <defs>
                    <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5C8D89" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#5C8D89" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Empty state when 0 points */}
                  {graphData.isEmpty && (
                    <g>
                      <rect x="45" y="25" width="390" height="150" fill="#F9FAFB" rx="8" stroke="#E5E7EB" strokeDasharray="4 4" />
                      <text x="240" y="95" textAnchor="middle" fill="#6B7280" fontSize="13" fontWeight="600">
                        No weight check-ins recorded yet
                      </text>
                      <text x="240" y="115" textAnchor="middle" fill="#9CA3AF" fontSize="11">
                        Enter your weight in Profile Settings to record your first entry
                      </text>
                    </g>
                  )}

                  {!graphData.isEmpty && (
                    <g>
                      {/* Grid Lines */}
                      <line x1="45" y1="25" x2="435" y2="25" stroke="#F3F4F6" strokeWidth="1" />
                      <line x1="45" y1="100" x2="435" y2="100" stroke="#F3F4F6" strokeWidth="1" />
                      <line x1="45" y1="175" x2="435" y2="175" stroke="#E5E7EB" strokeWidth="1" />

                      {/* Y-axis Labels */}
                      <text x="38" y="29" textAnchor="end" fill="#9CA3AF" fontSize="10" fontWeight="500">
                        {graphData.maxY}
                      </text>
                      <text x="38" y="104" textAnchor="end" fill="#9CA3AF" fontSize="10" fontWeight="500">
                        {Math.round((graphData.maxY + graphData.minY) / 2)}
                      </text>
                      <text x="38" y="179" textAnchor="end" fill="#9CA3AF" fontSize="10" fontWeight="500">
                        {graphData.minY}
                      </text>

                      {/* Target Weight Dashed Reference Line (Blue #3B82F6) */}
                      {graphData.targetY >= 20 && graphData.targetY <= 180 && (
                        <g id="fitbee-svg-target-line">
                          <line
                            x1="45"
                            y1={graphData.targetY}
                            x2="435"
                            y2={graphData.targetY}
                            stroke="#3B82F6"
                            strokeWidth="1.75"
                            strokeDasharray="5 4"
                          />
                          <rect
                            x="355"
                            y={graphData.targetY - 18}
                            width="80"
                            height="15"
                            rx="4"
                            fill="#EFF6FF"
                            stroke="#BFDBFE"
                            strokeWidth="0.8"
                          />
                          <text
                            x="395"
                            y={graphData.targetY - 7}
                            textAnchor="middle"
                            fill="#1D4ED8"
                            fontSize="9"
                            fontWeight="700"
                          >
                            Goal: {targetWeightKg} kg
                          </text>
                        </g>
                      )}

                      {/* Gradient Filled Area (when 2+ points) */}
                      {graphData.coords.length > 1 && (
                        <polygon
                          points={graphData.areaStr}
                          fill="url(#weightAreaGrad)"
                        />
                      )}

                      {/* Connecting Line (when 2+ points) */}
                      {graphData.coords.length > 1 && (
                        <polyline
                          points={graphData.polylineStr}
                          fill="none"
                          stroke="#5C8D89"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Single Point / Multiple Points */}
                      {graphData.coords.map((c, i) => {
                        const isSelected = selectedPointIndex === i;
                        return (
                          <g
                            key={i}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedPointIndex(isSelected ? null : i)}
                          >
                            {/* Selected Point Ring */}
                            {isSelected && (
                              <circle
                                cx={c.x}
                                cy={c.y}
                                r="9"
                                fill="none"
                                stroke="#5C8D89"
                                strokeWidth="2"
                                opacity="0.4"
                              />
                            )}

                            {/* Data Point Dot */}
                            <circle
                              cx={c.x}
                              cy={c.y}
                              r={graphData.coords.length === 1 ? '6' : '4.5'}
                              fill="#5C8D89"
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />

                            {/* X-axis Date Labels */}
                            <text
                              x={c.x}
                              y="193"
                              textAnchor="middle"
                              fill="#6B7280"
                              fontSize="9.5"
                              fontWeight={isSelected ? '700' : '500'}
                            >
                              {c.date.slice(5)}
                            </text>

                            {/* Tooltip / Value on Point */}
                            {(isSelected || graphData.coords.length === 1) && (
                              <g>
                                <rect
                                  x={c.x - 30}
                                  y={c.y - 26}
                                  width="60"
                                  height="18"
                                  rx="4"
                                  fill="#1F2937"
                                />
                                <text
                                  x={c.x}
                                  y={c.y - 14}
                                  textAnchor="middle"
                                  fill="#FFFFFF"
                                  fontSize="10"
                                  fontWeight="700"
                                >
                                  {c.weight} kg
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Historical Check-ins Log List */}
            <h3 style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 8px' }}>
              Check-In History Records ({graphData.points.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
              {allHistoryUpdates.length === 0 ? (
                <div style={{ padding: '12px', textAlign: 'center', color: '#9CA3AF', fontSize: 12 }}>
                  No historical records logged yet.
                </div>
              ) : (
                allHistoryUpdates.map((u, idx) => {
                  const currentWeight = u.weight_kg ?? u.weight ?? 0;
                  const prevWeight = u.previous_weight_kg ?? u.previous_weight;
                  const delta = prevWeight !== undefined ? currentWeight - prevWeight : null;
                  const dateStr = u.recorded_at ? u.recorded_at.split('T')[0] : (u.date || 'Check-in');

                  return (
                    <div
                      key={u.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        background: '#F9FAFB',
                        borderRadius: 8,
                        border: '1px solid #F3F4F6',
                        fontSize: 12,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: '#1F2937' }}>
                          {dateStr}
                        </div>
                        <div style={{ fontSize: 11, color: '#6B7280' }}>
                          Active Target: <strong>{u.active_target_calories || u.target_calories_at_time || 2000} kcal</strong>
                          {u.user_action && (
                            <span style={{ marginLeft: 6, color: '#059669', fontWeight: 500 }}>
                              ({u.user_action.replace(/_/g, ' ')})
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: '#1F2937' }}>
                          {currentWeight} kg
                        </div>
                        {delta !== null && (
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: delta < 0 ? '#059669' : delta > 0 ? '#D97706' : '#6B7280',
                            }}
                          >
                            {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)} kg
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Note Guarantee: view-only history modal */}
            <div
              style={{
                marginTop: 14,
                padding: '8px 10px',
                borderRadius: 8,
                background: '#F0FDF4',
                border: '1px solid #DCFCE7',
                fontSize: 11,
                color: '#166534',
                lineHeight: 1.4,
              }}
            >
              🔒 <strong>Historical Record:</strong> Tracking weight and target revisions does not alter your saved meal plans, intake logs, or workout records.
            </div>

            {/* Done Button */}
            <button
              type="button"
              onClick={() => setIsWeightHistoryModalOpen(false)}
              style={{
                width: '100%',
                marginTop: 14,
                padding: '9px 14px',
                borderRadius: 8,
                background: '#5C8D89',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── Sign Out ── */}
      {onSignOut && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button
            type="button"
            onClick={onSignOut}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 12,
              fontWeight: 600,
              color: '#DC2626',
              cursor: 'pointer',
              padding: '6px 12px',
            }}
          >
            Sign Out of FitBee
          </button>
        </div>
      )}
    </div>
  );
};
