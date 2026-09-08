import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { WorkoutTemplateDay, UserWorkoutExercise } from '../../types/database.types';
import { ExerciseLibraryFlow } from './ExerciseLibrary/ExerciseLibraryFlow';
import { recordTemplateVersion } from '../../services/workoutTemplateVersionService';

interface CreateTemplateFlowProps {
  onBack: () => void;
  onComplete: () => void;
  editTemplateId?: string;
}

type WizardStep = 'name' | 'days' | 'choose_method' | 'build';

const DAYS_OF_WEEK = [
  { id: 'Sunday', label: 'SUN' },
  { id: 'Monday', label: 'MON' },
  { id: 'Tuesday', label: 'TUE' },
  { id: 'Wednesday', label: 'WED' },
  { id: 'Thursday', label: 'THU' },
  { id: 'Friday', label: 'FRI' },
  { id: 'Saturday', label: 'SAT' },
];

export const CreateTemplateFlow: React.FC<CreateTemplateFlowProps> = ({ onBack, onComplete, editTemplateId }) => {
  const [step, setStep] = useState<WizardStep>(editTemplateId ? 'build' : 'name');
  const [templateName, setTemplateName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [templateId, setTemplateId] = useState<string | null>(editTemplateId || null);
  const [days, setDays] = useState<WorkoutTemplateDay[]>([]);
  const [exercises, setExercises] = useState<UserWorkoutExercise[]>([]);

  // State for Add Exercise flow
  const [addingToDayId, setAddingToDayId] = useState<string | null>(null);
  // State for Day View (viewing & managing a specific day's exercises)
  const [selectedDayForEdit, setSelectedDayForEdit] = useState<WorkoutTemplateDay | null>(null);
  // State for Add/Remove Days modal
  const [showDaySelectorModal, setShowDaySelectorModal] = useState<boolean>(false);
  const [tempSelectedDays, setTempSelectedDays] = useState<string[]>([]);
  const [isSavingDays, setIsSavingDays] = useState<boolean>(false);

  // State for inline renaming template
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>('');
  const [isSavingName, setIsSavingName] = useState<boolean>(false);

  const handleSaveTemplateName = async () => {
    if (!templateId || !editedName.trim()) {
      setIsEditingName(false);
      return;
    }
    setIsSavingName(true);
    try {
      const trimmed = editedName.trim();
      const { error } = await supabase
        .from('workout_templates')
        .update({ name: trimmed })
        .eq('id', templateId);
      if (error) throw error;
      setTemplateName(trimmed);
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to update template name:', err);
    } finally {
      setIsSavingName(false);
    }
  };

  // If editing an existing template, load its data
  useEffect(() => {
    if (!editTemplateId) return;

    const loadExistingTemplate = async () => {
      try {
        const { data: tmpl, error: tmplErr } = await supabase
          .from('workout_templates')
          .select('*, workout_template_days(*)')
          .eq('id', editTemplateId)
          .single();

        if (tmplErr) throw tmplErr;

        setTemplateName(tmpl.name);
        const dayList = (tmpl.workout_template_days || []).sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0));
        setDays(dayList);
        setSelectedDays(dayList.map((d: any) => d.day_name || d.name));
        setTemplateId(editTemplateId);
        setStep('build');

        await loadExercisesForTemplate(editTemplateId);
      } catch (err) {
        console.error('Failed to load existing template for edit:', err);
      }
    };

    loadExistingTemplate();
  }, [editTemplateId]);

  const handleNextFromName = () => {
    if (templateName.trim()) {
      setStep('days');
    }
  };

  const handleCreateTemplateAndProceed = async () => {
    setIsSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      // 1. Create the template
      const { data: templateData, error: templateError } = await supabase
        .from('workout_templates')
        .insert({
          user_id: session.user.id,
          name: templateName.trim(),
          template_type: 'user',
        })
        .select()
        .single();

      if (templateError) throw templateError;

      // 2. Create the days
      const daysToInsert = selectedDays.map((dayName, index) => ({
        template_id: templateData.id,
        day_name: dayName,
        order_index: index,
        is_enabled: true
      }));

      const { data: createdDays, error: daysError } = await supabase
        .from('workout_template_days')
        .insert(daysToInsert)
        .select();

      if (daysError) throw daysError;

      setTemplateId(templateData.id);
      setDays(createdDays);
      setStep('choose_method');
      await syncTemplateVersionSnapshot(templateData.id);
    } catch (err) {
      console.error('Failed to create template:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const syncTemplateVersionSnapshot = async (tmplId: string) => {
    try {
      const { data: tmpl } = await supabase
        .from('workout_templates')
        .select('id, user_id')
        .eq('id', tmplId)
        .single();
      if (!tmpl || !tmpl.user_id) return;

      const { data: dayList } = await supabase
        .from('workout_template_days')
        .select('id, day_name, is_enabled, order_index')
        .eq('template_id', tmplId)
        .order('order_index', { ascending: true });

      const dayIds = (dayList || []).map((d: any) => d.id);
      let exList: any[] = [];
      if (dayIds.length > 0) {
        const { data: exercisesData } = await supabase
          .from('workout_template_exercises')
          .select('id, template_day_id, exercise_id, order_index, target_sets, target_reps, target_time_seconds, default_weight_kg')
          .in('template_day_id', dayIds)
          .order('order_index', { ascending: true });
        exList = exercisesData || [];
      }

      const scheduledDays = (dayList || [])
        .filter((d: any) => d.is_enabled && d.day_name)
        .map((d: any) => d.day_name.trim());

      const daysConfig = (dayList || []).map((d: any) => ({
        id: d.id,
        day_name: d.day_name,
        is_enabled: d.is_enabled,
        order_index: d.order_index,
        exercises: exList
          .filter((e: any) => e.template_day_id === d.id)
          .map((e: any) => ({
            id: e.id,
            exercise_id: e.exercise_id,
            order_index: e.order_index,
            target_sets: e.target_sets,
            target_reps: e.target_reps,
            target_time_seconds: e.target_time_seconds,
            default_weight_kg: e.default_weight_kg,
          })),
      }));

      await recordTemplateVersion(
        tmplId,
        tmpl.user_id,
        new Date().toISOString(),
        scheduledDays,
        daysConfig
      );
    } catch (err) {
      console.warn('Error recording template version snapshot:', err);
    }
  };

  const loadExercisesForTemplate = async (tmplId: string) => {
    // 1. Get day IDs for this template
    const { data: dayList } = await supabase
      .from('workout_template_days')
      .select('id')
      .eq('template_id', tmplId);

    const dayIds = (dayList || []).map(d => d.id);
    if (dayIds.length === 0) {
      setExercises([]);
      return;
    }

    // 2. Get exercises belonging to these days
    const { data, error } = await supabase
      .from('workout_template_exercises')
      .select('*, master_exercises(*)')
      .in('template_day_id', dayIds)
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching template exercises:', error);
    } else {
      const normalized = (data || []).map((item: any) => ({
        ...item,
        exercise: item.master_exercises || item.exercise,
      }));
      setExercises(normalized);
    }
  };

  useEffect(() => {
    if (step === 'build' && templateId) {
      loadExercisesForTemplate(templateId);
    }
  }, [step, templateId]);

  // Remove an individual exercise from a template day
  const handleRemoveExerciseFromDay = async (exerciseTemplateId: string) => {
    try {
      await supabase
        .from('workout_template_exercises')
        .delete()
        .eq('id', exerciseTemplateId);

      if (templateId) {
        await loadExercisesForTemplate(templateId);
      }
    } catch (err) {
      console.error('Failed to remove exercise from day:', err);
    }
  };

  // Save changes from Add/Remove Days modal
  const handleSaveAddRemoveDays = async () => {
    if (!templateId) return;
    setIsSavingDays(true);
    try {
      const currentDayNames = days.map(d => d.day_name || d.name || '');
      const addedNames = tempSelectedDays.filter(name => !currentDayNames.includes(name));
      const removedDays = days.filter(d => !tempSelectedDays.includes(d.day_name || d.name || ''));

      // 1. Remove deselected days
      if (removedDays.length > 0) {
        const removedIds = removedDays.map(d => d.id);
        await supabase
          .from('workout_template_exercises')
          .delete()
          .in('template_day_id', removedIds);

        await supabase
          .from('workout_template_days')
          .delete()
          .in('id', removedIds);
      }

      // 2. Add newly selected days
      if (addedNames.length > 0) {
        let maxOrder = days.length > 0 ? Math.max(...days.map(d => d.order_index ?? 0)) : 0;
        const toInsert = addedNames.map((dayName, idx) => ({
          template_id: templateId,
          day_name: dayName,
          order_index: maxOrder + 1 + idx,
          is_enabled: true,
        }));

        await supabase
          .from('workout_template_days')
          .insert(toInsert);
      }

      // 3. Reload days and exercises
      const { data: updatedDays } = await supabase
        .from('workout_template_days')
        .select('*')
        .eq('template_id', templateId)
        .order('order_index', { ascending: true });

      const sortedDays = (updatedDays || []).sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0));
      setDays(sortedDays);
      setSelectedDays(sortedDays.map((d: any) => d.day_name || d.name || ''));
      await loadExercisesForTemplate(templateId);
      await syncTemplateVersionSnapshot(templateId);

      // If the currently edited day was removed, exit day view
      if (selectedDayForEdit && !tempSelectedDays.includes(selectedDayForEdit.day_name || selectedDayForEdit.name || '')) {
        setSelectedDayForEdit(null);
      }

      setShowDaySelectorModal(false);
    } catch (err) {
      console.error('Failed to update template days:', err);
      alert('Failed to update days. Please try again.');
    } finally {
      setIsSavingDays(false);
    }
  };

  const handleSelectMultipleExercises = async (exerciseNames: string[]) => {
    if (!addingToDayId || !templateId) return;

    try {
      // 1. Existing exercises for this day
      const currentDayExercises = exercises.filter(e => e.template_day_id === addingToDayId);
      const existingNames = currentDayExercises
        .map(e => (e.exercise?.exercise_name || e.exercise?.name || '').trim())
        .filter((n): n is string => Boolean(n));

      // Determine additions and removals
      const toRemove = currentDayExercises.filter(e => {
        const name = (e.exercise?.exercise_name || e.exercise?.name || '').trim().toLowerCase();
        return name && !exerciseNames.some(en => en.trim().toLowerCase() === name);
      });

      const toAddNames = exerciseNames.filter(n => !existingNames.some(en => en.toLowerCase() === n.trim().toLowerCase()));

      // Remove unselected exercises for this day
      if (toRemove.length > 0) {
        const removeIds = toRemove.map(e => e.id);
        await supabase
          .from('workout_template_exercises')
          .delete()
          .in('id', removeIds);
      }

      // Add newly selected exercises (deduplicating to avoid multiple rows from master_exercises)
      const uniqueToAdd = Array.from(new Set(toAddNames.map(n => n.trim()).filter(Boolean)));
      if (uniqueToAdd.length > 0) {
        const { data: masterExList, error: findError } = await supabase
          .from('master_exercises')
          .select('id, exercise_name, tracking_type')
          .in('exercise_name', uniqueToAdd);

        if (findError) throw findError;

        // Index master exercises by lowercase name to ensure 1 DB row per exercise
        const exMap = new Map<string, any>();
        (masterExList || []).forEach((ex) => {
          const key = (ex.exercise_name || '').trim().toLowerCase();
          if (key && !exMap.has(key)) {
            exMap.set(key, ex);
          }
        });

        let startIndex = currentDayExercises.length;
        const exercisesToInsert: any[] = [];

        uniqueToAdd.forEach((name) => {
          const masterEx = exMap.get(name.toLowerCase());
          if (masterEx) {
            exercisesToInsert.push({
              template_day_id: addingToDayId,
              exercise_id: masterEx.id,
              order_index: startIndex++,
              target_sets: 3,
              target_reps: masterEx.tracking_type === 'reps' ? 10 : null,
              target_time_seconds: masterEx.tracking_type === 'timer' ? 60 : null,
            });
          }
        });

        if (exercisesToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('workout_template_exercises')
            .insert(exercisesToInsert);

          if (insertError) throw insertError;
        }
      }

      await loadExercisesForTemplate(templateId);
      await syncTemplateVersionSnapshot(templateId);
    } catch (err) {
      console.error('Failed to update template day exercises:', err);
    } finally {
      setAddingToDayId(null);
    }
  };

  if (addingToDayId) {
    const currentDayExercises = exercises
      .filter(e => e.template_day_id === addingToDayId)
      .map(e => e.exercise?.exercise_name || e.exercise?.name)
      .filter((name): name is string => Boolean(name));

    const otherDaysExercisesMap: Record<string, string[]> = {};
    exercises.forEach(e => {
      if (e.template_day_id !== addingToDayId) {
        const dayObj = days.find(d => d.id === e.template_day_id);
        const dayName = dayObj?.day_name || 'Another day';
        const exName = e.exercise?.exercise_name || e.exercise?.name;
        if (exName) {
          if (!otherDaysExercisesMap[exName]) {
            otherDaysExercisesMap[exName] = [];
          }
          if (!otherDaysExercisesMap[exName].includes(dayName)) {
            otherDaysExercisesMap[exName].push(dayName);
          }
        }
      }
    });

    return (
      <ExerciseLibraryFlow 
        onBackToWorkout={() => setAddingToDayId(null)}
        mode="select"
        onSelectMultipleForTemplate={handleSelectMultipleExercises}
        initialSelectedExercises={currentDayExercises}
        otherDaysExercises={otherDaysExercisesMap}
      />
    );
  }

  return (
    <div className="exlib-container" style={{ padding: '24px 20px' }}>
      {step !== 'build' && (
        <button
          className="workout-back-btn"
          onClick={() => {
            if (step === 'days') setStep('name');
            else onBack();
          }}
          style={{ marginBottom: 32 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
      )}

      {step === 'name' && (
        <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1F2937', marginBottom: 12 }}>Name your routine</h1>
          <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 32 }}>Give your new workout template a memorable name.</p>
          
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="e.g., Push Pull Legs"
            style={{
              width: '100%',
              height: 54,
              borderRadius: 16,
              border: '1.5px solid #E5E7EB',
              padding: '0 16px',
              fontSize: 16,
              marginBottom: 32,
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#5C8D89';
              e.target.style.boxShadow = '0 0 0 4px rgba(92,141,137,0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5E7EB';
              e.target.style.boxShadow = 'none';
            }}
            autoFocus
          />

          <button
            onClick={handleNextFromName}
            disabled={!templateName.trim()}
            style={{
              width: '100%',
              height: 54,
              borderRadius: 18,
              backgroundColor: templateName.trim() ? '#5C8D89' : '#D1D5DB',
              color: '#FFF',
              fontSize: 16,
              fontWeight: 600,
              border: 'none',
              cursor: templateName.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
          >
            Next
          </button>
        </div>
      )}

      {step === 'days' && (
        <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Select your workout days</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px' }}>Choose the days you usually train.</p>
          
          {/* Days Selection Card Container */}
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              borderRadius: 24, 
              padding: '24px 20px', 
              border: '1px solid #E8E8E6', 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
              marginBottom: 32 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
              {DAYS_OF_WEEK.map(day => {
                const isSelected = selectedDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDays(prev => prev.filter(d => d !== day.id));
                      } else {
                        setSelectedDays(prev => [...prev, day.id]);
                      }
                    }}
                    style={{
                      flex: 1,
                      height: 52,
                      borderRadius: 14,
                      border: `1.5px solid ${isSelected ? '#5C8D89' : '#E8E8E6'}`,
                      backgroundColor: isSelected ? 'rgba(92, 141, 137, 0.12)' : '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                      boxShadow: isSelected ? '0 4px 14px rgba(92, 141, 137, 0.2)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 650, color: isSelected ? '#5C8D89' : '#4B5563' }}>
                      {day.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={handleCreateTemplateAndProceed}
            disabled={isSaving || selectedDays.length === 0}
            style={{
              width: '100%',
              height: 54,
              borderRadius: 18,
              backgroundColor: (isSaving || selectedDays.length === 0) ? '#D1D5DB' : '#5C8D89',
              color: '#FFF',
              fontSize: 16,
              fontWeight: 600,
              border: 'none',
              cursor: (isSaving || selectedDays.length === 0) ? 'not-allowed' : 'pointer',
              boxShadow: (isSaving || selectedDays.length === 0) ? 'none' : '0 4px 14px rgba(92, 141, 137, 0.3)',
              transition: 'all 200ms ease',
            }}
          >
            {isSaving ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      )}

      {step === 'choose_method' && (
        <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Choose Build Method</h1>
          <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 28px' }}>How would you like to build this routine?</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              onClick={() => setStep('build')}
              role="button"
              tabIndex={0}
              className="exlib-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: '20px 24px',
                border: '1px solid #E8E8E6',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              <div className="exlib-sticker" style={{ backgroundColor: 'rgba(92, 141, 137, 0.12)', color: '#5C8D89' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 650, color: '#1F2937', margin: '0 0 4px' }}>Recommended Full Body</h3>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Start with a proven full-body routine.</p>
              </div>

              <div className="exlib-card-chevron">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>

            <div
              onClick={() => setStep('build')}
              role="button"
              tabIndex={0}
              className="exlib-card"
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 24,
                padding: '20px 24px',
                border: '1px solid #E8E8E6',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
            >
              <div className="exlib-sticker" style={{ backgroundColor: '#EFF3F2', color: '#466761' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 18, fontWeight: 650, color: '#1F2937', margin: '0 0 4px' }}>Create My Own</h3>
                <p style={{ fontSize: 13, color: '#6B7280', margin: 0 }}>Build your routine from scratch.</p>
              </div>

              <div className="exlib-card-chevron">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'build' && selectedDayForEdit && (
        <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          {/* Day Detail Header */}
          <button
            className="workout-back-btn"
            onClick={() => setSelectedDayForEdit(null)}
            style={{ marginBottom: 24 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to Routine</span>
          </button>

          {(() => {
            const currentDayExercises = exercises.filter(e => e.template_day_id === selectedDayForEdit.id);
            const dayDisplayName = selectedDayForEdit.day_name || selectedDayForEdit.name || 'Workout Day';

            return (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <div>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                      {dayDisplayName}
                    </h1>
                    <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
                      {currentDayExercises.length} {currentDayExercises.length === 1 ? 'exercise' : 'exercises'} configured
                    </p>
                  </div>

                  <button
                    onClick={() => setAddingToDayId(selectedDayForEdit.id)}
                    style={{
                      backgroundColor: '#5C8D89',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: 20,
                      padding: '9px 18px',
                      fontWeight: 650,
                      fontSize: 14,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 4px 14px rgba(92, 141, 137, 0.3)',
                      transition: 'transform 150ms ease, box-shadow 150ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Exercise</span>
                  </button>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 650, color: '#4B5563', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Existing Exercises
                  </span>
                </div>

                {/* Exercises List for Selected Day */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {currentDayExercises.length === 0 ? (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 24,
                        padding: '44px 24px',
                        border: '1px solid #E8E8E6',
                        textAlign: 'center',
                        color: '#6B7280',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                      }}
                    >
                      <div style={{ width: 54, height: 54, borderRadius: '50%', backgroundColor: 'rgba(92, 141, 137, 0.1)', color: '#5C8D89', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </div>
                      <h3 style={{ fontSize: 17, fontWeight: 650, color: '#1F2937', margin: '0 0 6px' }}>
                        No exercises for {dayDisplayName} yet
                      </h3>
                      <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 20px', maxWidth: 300, marginLeft: 'auto', marginRight: 'auto' }}>
                        Add exercises from the Exercise Library to build your routine for this day.
                      </p>
                      <button
                        onClick={() => setAddingToDayId(selectedDayForEdit.id)}
                        style={{
                          backgroundColor: '#5C8D89',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: 16,
                          padding: '10px 22px',
                          fontWeight: 650,
                          fontSize: 14,
                          cursor: 'pointer',
                          boxShadow: '0 4px 14px rgba(92, 141, 137, 0.25)',
                        }}
                      >
                        + Add Exercises
                      </button>
                    </div>
                  ) : (
                    currentDayExercises.map((exItem) => {
                      const ex = exItem.exercise;
                      const exName = ex?.exercise_name || ex?.name || 'Exercise';
                      const pMuscle = ex?.primary_muscles?.[0] || 'General';
                      const equip = ex?.equipment_required || 'Bodyweight';

                      return (
                        <div
                          key={exItem.id}
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 20,
                            padding: '16px 20px',
                            border: '1px solid #E8E8E6',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ fontSize: 16, fontWeight: 650, color: '#1F2937', margin: '0 0 6px' }}>
                              {exName}
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              <span style={{ fontSize: 12, fontWeight: 500, color: '#5C8D89', backgroundColor: 'rgba(92, 141, 137, 0.1)', padding: '2px 8px', borderRadius: 8 }}>
                                {pMuscle}
                              </span>
                              <span style={{ fontSize: 12, color: '#6B7280' }}>
                                {equip}
                              </span>
                              <span style={{ fontSize: 12, color: '#D1D5DB' }}>•</span>
                              <span style={{ fontSize: 12, fontWeight: 500, color: '#4B5563' }}>
                                {exItem.target_sets || 3} sets × {exItem.target_reps ? `${exItem.target_reps} reps` : `${exItem.target_time_seconds || 60}s`}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRemoveExerciseFromDay(exItem.id)}
                            title={`Remove ${exName}`}
                            aria-label={`Remove ${exName}`}
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              border: 'none',
                              backgroundColor: '#FEF2F2',
                              color: '#EF4444',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              flexShrink: 0,
                              transition: 'background-color 150ms ease',
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {step === 'build' && !selectedDayForEdit && (
        <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          {/* Top App Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ flex: 1, marginRight: 16 }}>
              {isEditingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveTemplateName();
                      if (e.key === 'Escape') setIsEditingName(false);
                    }}
                    autoFocus
                    placeholder="Template name"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#1F2937',
                      border: '1.5px solid #5C8D89',
                      borderRadius: 10,
                      padding: '4px 10px',
                      outline: 'none',
                      width: '100%',
                      maxWidth: 260,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSaveTemplateName}
                    disabled={isSavingName}
                    style={{
                      backgroundColor: '#5C8D89',
                      color: '#FFF',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 12px',
                      fontSize: 13,
                      fontWeight: 650,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isSavingName ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6B7280',
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 2px' }}>
                  <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>{templateName}</h1>
                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(templateName);
                      setIsEditingName(true);
                    }}
                    title="Rename Template"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 4,
                      cursor: 'pointer',
                      color: '#6B7280',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 6,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </button>
                </div>
              )}
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>Click a day to view or edit exercises.</p>
            </div>
            <button 
              onClick={onComplete}
              style={{
                backgroundColor: '#5C8D89',
                color: '#FFF',
                border: 'none',
                borderRadius: 20,
                padding: '8px 22px',
                fontWeight: 650,
                fontSize: 14,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(92, 141, 137, 0.3)',
              }}
            >
              Finish
            </button>
          </div>

          {/* Subheader with Add/Remove Days Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 650, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Scheduled Days ({days.length})
            </span>

            <button
              type="button"
              onClick={() => {
                setTempSelectedDays(days.map(d => d.day_name || d.name || ''));
                setShowDaySelectorModal(true);
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #5C8D89',
                color: '#5C8D89',
                borderRadius: 16,
                padding: '6px 14px',
                fontSize: 13,
                fontWeight: 650,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 150ms ease',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add / Remove Days</span>
            </button>
          </div>

          {/* Individual Day Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {days.sort((a, b) => a.order_index - b.order_index).map(day => {
              const dayExercises = exercises.filter(e => e.template_day_id === day.id);
              const isAssigned = dayExercises.length > 0;
              
              return (
                <div 
                  key={day.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedDayForEdit(day)}
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: 22, 
                    padding: '18px 22px', 
                    border: '1px solid #E8E8E6',
                    boxShadow: '0 6px 24px rgba(0, 0, 0, 0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'all 180ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#5C8D89';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E8E8E6';
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {/* Left: Day Name & Exercise Count */}
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 650, color: '#1F2937', margin: '0 0 4px' }}>
                      {day.day_name}
                    </h3>
                    <p style={{ fontSize: 13, color: isAssigned ? '#5C8D89' : '#9CA3AF', fontWeight: isAssigned ? 550 : 400, margin: 0 }}>
                      {dayExercises.length} {dayExercises.length === 1 ? 'Exercise' : 'Exercises'}
                    </p>
                  </div>

                  {/* Right: Badge & Chevron */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {isAssigned && (
                      <span style={{ fontSize: 12, backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16A34A', fontWeight: 600, padding: '3px 9px', borderRadius: 10 }}>
                        Configured
                      </span>
                    )}
                    <div style={{ color: '#9CA3AF' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add/Remove Days Modal */}
          {showDaySelectorModal && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(4px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
              }}
            >
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 24,
                  padding: '28px 24px',
                  maxWidth: 440,
                  width: '100%',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                  border: '1px solid #E8E8E6',
                  animation: 'scaleUp 200ms ease-out',
                }}
              >
                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1F2937', margin: '0 0 6px' }}>
                  Add / Remove Days
                </h2>
                <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px', lineHeight: 1.4 }}>
                  Select the weekdays you want in your routine. Existing exercises on retained days will remain intact.
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 28 }}>
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = tempSelectedDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (tempSelectedDays.length <= 1) {
                              alert('You must have at least one day in your routine.');
                              return;
                            }
                            setTempSelectedDays(prev => prev.filter(d => d !== day.id));
                          } else {
                            setTempSelectedDays(prev => [...prev, day.id]);
                          }
                        }}
                        style={{
                          flex: 1,
                          height: 52,
                          borderRadius: 14,
                          border: `1.5px solid ${isSelected ? '#5C8D89' : '#E8E8E6'}`,
                          backgroundColor: isSelected ? 'rgba(92, 141, 137, 0.12)' : '#FFFFFF',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                          transform: isSelected ? 'scale(1.04)' : 'scale(1)',
                        }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700, color: isSelected ? '#5C8D89' : '#4B5563' }}>
                          {day.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setShowDaySelectorModal(false)}
                    style={{
                      flex: 1,
                      height: 48,
                      borderRadius: 16,
                      border: '1.5px solid #E5E7EB',
                      backgroundColor: '#FFFFFF',
                      color: '#4B5563',
                      fontSize: 15,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSavingDays}
                    onClick={handleSaveAddRemoveDays}
                    style={{
                      flex: 1,
                      height: 48,
                      borderRadius: 16,
                      border: 'none',
                      backgroundColor: '#5C8D89',
                      color: '#FFFFFF',
                      fontSize: 15,
                      fontWeight: 650,
                      cursor: isSavingDays ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 14px rgba(92, 141, 137, 0.3)',
                    }}
                  >
                    {isSavingDays ? 'Saving...' : 'Save Days'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

