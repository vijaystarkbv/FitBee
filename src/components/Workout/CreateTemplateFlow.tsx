import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { WorkoutTemplateDay, UserWorkoutExercise } from '../../types/database.types';
import { ExerciseLibraryFlow } from './ExerciseLibrary/ExerciseLibraryFlow';

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
        const dayList = tmpl.workout_template_days || [];
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
    } catch (err) {
      console.error('Failed to create template:', err);
    } finally {
      setIsSaving(false);
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


  const handleSelectMultipleExercises = async (exerciseNames: string[]) => {
    if (!addingToDayId || !templateId) return;

    try {
      // 1. Existing exercises for this day
      const currentDayExercises = exercises.filter(e => e.template_day_id === addingToDayId);
      const existingNames = currentDayExercises
        .map(e => e.exercise?.exercise_name || e.exercise?.name)
        .filter((n): n is string => Boolean(n));

      // Determine additions and removals
      const toRemove = currentDayExercises.filter(e => {
        const name = e.exercise?.exercise_name || e.exercise?.name;
        return name && !exerciseNames.includes(name);
      });

      const toAddNames = exerciseNames.filter(n => !existingNames.includes(n));

      // Remove unselected exercises for this day
      if (toRemove.length > 0) {
        const removeIds = toRemove.map(e => e.id);
        await supabase
          .from('workout_template_exercises')
          .delete()
          .in('id', removeIds);
      }

      // Add newly selected exercises
      if (toAddNames.length > 0) {
        const { data: masterExList, error: findError } = await supabase
          .from('master_exercises')
          .select('id, exercise_name, tracking_type')
          .in('exercise_name', toAddNames);

        if (findError) throw findError;

        let startIndex = currentDayExercises.length;
        const exercisesToInsert = (masterExList || []).map((masterEx, idx) => ({
          template_day_id: addingToDayId,
          exercise_id: masterEx.id,
          order_index: startIndex + idx,
          target_sets: 3,
          target_reps: masterEx.tracking_type === 'reps' ? 10 : null,
          target_time_seconds: masterEx.tracking_type === 'timer' ? 60 : null,
        }));

        if (exercisesToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('workout_template_exercises')
            .insert(exercisesToInsert);

          if (insertError) throw insertError;
        }
      }

      await loadExercisesForTemplate(templateId);
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

      {step === 'build' && (
        <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
          {/* Top App Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1F2937', margin: 0 }}>{templateName}</h1>
            <button 
              onClick={onComplete}
              style={{
                backgroundColor: '#5C8D89',
                color: '#FFF',
                border: 'none',
                borderRadius: 20,
                padding: '8px 20px',
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer'
              }}
            >
              Finish
            </button>
          </div>

          {/* Individual Day Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {days.sort((a, b) => a.order_index - b.order_index).map(day => {
              const dayExercises = exercises.filter(e => e.template_day_id === day.id);
              const isAssigned = dayExercises.length > 0;
              
              return (
                <div 
                  key={day.id} 
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: 24, 
                    height: 76,
                    padding: '20px 24px', 
                    border: '1px solid #E8E8E6',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box'
                  }}
                >
                  {/* Left: Day Name */}
                  <span style={{ fontSize: 18, fontWeight: 600, color: '#1F2937' }}>
                    {day.day_name}
                  </span>

                  {/* Right: Circular Action Button (+ or ✓) */}
                  <button
                    onClick={() => setAddingToDayId(day.id)}
                    aria-label={isAssigned ? `${day.day_name} workout completed` : `Add workout for ${day.day_name}`}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      backgroundColor: isAssigned ? '#22C55E' : '#5C8D89',
                      color: '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: isAssigned ? '0 4px 14px rgba(34, 197, 94, 0.3)' : '0 4px 14px rgba(92, 141, 137, 0.3)',
                      transition: 'transform 200ms ease, background-color 200ms ease, box-shadow 200ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.97)';
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    {isAssigned ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'fadeInScale 200ms ease-out' }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

