import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../services/supabaseClient';
import { WorkoutTemplateDay, UserWorkoutExercise } from '../../types/database.types';
import { HorizontalWheelPicker } from './HorizontalWheelPicker';
import { ExerciseDetailView } from './ExerciseDetail/ExerciseDetailView';
import { DeleteTemplateModal } from './DeleteTemplateModal';

interface WorkoutExecutionScreenProps {
  templateId: string;
  onClose: () => void;
  onEditTemplate?: (templateId: string) => void;
  onDeleteTemplate?: () => void;
}

type ScreenState = 'no_workout_today' | 'select_day' | 'workout';

interface SetRecord {
  id?: string;
  setNumber: number;
  weight: number;
  reps: number;
  timeSeconds: number;
  isCompleted: boolean;
}

const DAYS_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const WorkoutExecutionScreen: React.FC<WorkoutExecutionScreenProps> = ({ 
  templateId, 
  onClose,
  onEditTemplate,
  onDeleteTemplate
}) => {
  const [screen, setScreen] = useState<ScreenState>('select_day');
  const [days, setDays] = useState<WorkoutTemplateDay[]>([]);
  const [selectedDay, setSelectedDay] = useState<WorkoutTemplateDay | null>(null);
  const [exercises, setExercises] = useState<UserWorkoutExercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWorkoutDayName, setNextWorkoutDayName] = useState<string>('Monday');

  // Menu & Modal state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Exercise Detail Overlay
  const [selectedDetailExerciseName, setSelectedDetailExerciseName] = useState<string | null>(null);

  // Expanded Muscle Groups Accordion State
  const [expandedMuscles, setExpandedMuscles] = useState<Record<string, boolean>>({});

  // Workout logging state
  const [workoutLogId, setWorkoutLogId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [savedSetsMap, setSavedSetsMap] = useState<Record<string, SetRecord[]>>({});

  useEffect(() => {
    const fetchDaysAndCheckToday = async () => {
      try {
        const { data, error } = await supabase
          .from('workout_template_days')
          .select('*')
          .eq('template_id', templateId)
          .order('order_index', { ascending: true });

        if (error) throw error;

        const dayList = data || [];
        setDays(dayList);

        const todayIndex = new Date().getDay();
        const todayName = DAYS_ORDER[todayIndex];

        // Check if today matches a workout day
        const todayDay = dayList.find(d => {
          const name = (d.day_name || d.name || '').trim().toLowerCase();
          return name === todayName.toLowerCase();
        });

        if (todayDay) {
          await handleStartDay(todayDay);
        } else {
          // Determine next upcoming workout day
          let upcoming = '';
          for (let i = 1; i <= 7; i++) {
            const checkName = DAYS_ORDER[(todayIndex + i) % 7];
            const match = dayList.find(d => (d.day_name || d.name || '').trim().toLowerCase() === checkName.toLowerCase());
            if (match) {
              upcoming = match.day_name || match.name;
              break;
            }
          }
          setNextWorkoutDayName(upcoming || (dayList[0]?.day_name || dayList[0]?.name || 'Monday'));
          setScreen('no_workout_today');
        }
      } catch (err) {
        console.error('Error fetching template days:', err);
        setScreen('select_day');
      } finally {
        setLoading(false);
      }
    };

    fetchDaysAndCheckToday();
  }, [templateId]);

  const handleDeleteTemplate = () => {
    setIsMenuOpen(false);
    setShowDeleteModal(true);
  };

  const handleStartDay = async (day: WorkoutTemplateDay) => {
    setSelectedDay(day);
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // 1. Fetch exercises for this day
      const { data: exData, error: exError } = await supabase
        .from('workout_template_exercises')
        .select('*, master_exercises(*)')
        .eq('template_day_id', day.id)
        .order('order_index', { ascending: true });

      if (exError) console.error('Error fetching exercises for day:', exError);

      const normalized = (exData || []).map((item: any) => ({
        ...item,
        exercise: item.master_exercises || item.exercise,
      }));

      setExercises(normalized);

      // Initialize accordion expansion state (first muscle group expanded by default)
      const muscleMap: Record<string, boolean> = {};
      normalized.forEach((ex: any, idx: number) => {
        const pMuscle = ex.exercise?.primary_muscles?.[0] || 'General';
        if (idx === 0) {
          muscleMap[pMuscle] = true;
        } else if (!(pMuscle in muscleMap)) {
          muscleMap[pMuscle] = false;
        }
      });
      setExpandedMuscles(muscleMap);

      // 2. Fetch or create today's workout_log (since 12:00 AM midnight today)
      if (session?.user) {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const { data: existingLog } = await supabase
          .from('workout_logs')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('template_day_id', day.id)
          .gte('start_time', todayStart.toISOString())
          .order('start_time', { ascending: false })
          .limit(1)
          .maybeSingle();

        let activeLog = existingLog;

        if (!activeLog) {
          const now = new Date();
          const { data: newLog, error: logError } = await supabase
            .from('workout_logs')
            .insert({
              user_id: session.user.id,
              template_id: templateId,
              template_day_id: day.id,
              template_name: 'Workout Routine',
              day_name: day.day_name || day.name || 'Workout Day',
              start_time: now.toISOString(),
              status: 'in_progress'
            })
            .select()
            .single();

          if (logError) console.error('Note: workout_log error:', logError);
          activeLog = newLog;
        }

        if (activeLog) {
          setWorkoutLogId(activeLog.id);
          setStartTime(new Date(activeLog.start_time));

          // Load all saved set logs for today's workout!
          const { data: setsData } = await supabase
            .from('workout_log_sets')
            .select('*')
            .eq('workout_log_id', activeLog.id)
            .order('set_number', { ascending: true });

          if (setsData && setsData.length > 0) {
            const mapByEx: Record<string, SetRecord[]> = {};
            setsData.forEach((s: any) => {
              const exId = s.exercise_id;
              if (!mapByEx[exId]) mapByEx[exId] = [];
              mapByEx[exId].push({
                id: s.id,
                setNumber: s.set_number,
                weight: Number(s.weight_kg) || 0,
                reps: s.reps_completed || 10,
                timeSeconds: s.duration_seconds || 0,
                isCompleted: true,
              });
            });
            setSavedSetsMap(mapByEx);
          } else {
            setSavedSetsMap({});
          }
        }
      }

      setScreen('workout');
    } catch (err) {
      console.error('Failed to start workout:', err);
      setScreen('workout');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishWorkout = async () => {
    if (workoutLogId) {
      try {
        const now = new Date();
        await supabase
          .from('workout_logs')
          .update({
            end_time: now.toISOString(),
            status: 'completed',
            duration_seconds: startTime ? Math.floor((now.getTime() - startTime.getTime()) / 1000) : 0
          })
          .eq('id', workoutLogId);
      } catch (err) {
        console.error('Failed to finish workout:', err);
      }
    }
    onClose();
  };

  // Group exercises by primary muscle group
  const groupedExercises = useMemo(() => {
    const groups: { muscle: string; items: UserWorkoutExercise[] }[] = [];
    exercises.forEach((item) => {
      const pMuscle = item.exercise?.primary_muscles?.[0] || 'Other';
      let existingGroup = groups.find((g) => g.muscle.toLowerCase() === pMuscle.toLowerCase());
      if (!existingGroup) {
        existingGroup = { muscle: pMuscle, items: [] };
        groups.push(existingGroup);
      }
      existingGroup.items.push(item);
    });
    return groups;
  }, [exercises]);

  const getLocationClass = (location?: string) => {
    if (location === 'Home') return 'location-home';
    if (location === 'Home Equipment') return 'location-home-eq';
    return 'location-gym';
  };

  const getDifficultyClass = (diff?: string) => {
    if (diff === 'Beginner') return 'beginner';
    if (diff === 'Intermediate') return 'intermediate';
    return 'advanced';
  };

  if (loading) {
    return (
      <div className="exlib-container" style={{ padding: '40px 24px', textAlign: 'center', color: '#6B7280' }}>
        Loading workout details...
      </div>
    );
  }

  // Render Exercise Detail overlay if selected
  if (selectedDetailExerciseName) {
    return (
      <ExerciseDetailView
        exerciseName={selectedDetailExerciseName}
        onBack={() => setSelectedDetailExerciseName(null)}
      />
    );
  }

  // Screen: No Workout Today Minimal Screen
  if (screen === 'no_workout_today') {
    return (
      <div className="exlib-container" style={{ padding: '24px 20px', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header with Back & 3 Dots Menu */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, position: 'relative' }}>
          <button className="workout-back-btn" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* Minimal Rest Day Banner */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: '48px 24px',
            border: '1px solid #E8E8E6',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
            maxWidth: 420,
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: '#EEF2FF',
              color: '#6366F1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            No workout today
          </h1>
          <p style={{ fontSize: 15, color: '#6B7280', margin: '0 0 32px', maxWidth: 300, lineHeight: 1.5 }}>
            Your next workout is <strong>{nextWorkoutDayName}</strong>. Rest up and recover!
          </p>

          <button
            type="button"
            onClick={() => setScreen('select_day')}
            style={{
              padding: '14px 28px',
              borderRadius: 18,
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E8E8E6',
              color: '#1F2937',
              fontSize: 15,
              fontWeight: 650,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              transition: 'all 200ms ease',
            }}
          >
            View All Days
          </button>
        </div>
      </div>
    );
  }

  // Screen: Select Day Screen
  if (screen === 'select_day') {
    return (
      <div className="exlib-container" style={{ padding: '24px 20px' }}>
        <button
          className="workout-back-btn"
          onClick={onClose}
          style={{ marginBottom: 32 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>

        {/* Title Header with 3 Vertical Dots */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, position: 'relative' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1F2937', margin: 0, letterSpacing: '-0.02em' }}>Select Day</h1>
          
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: 'none',
                backgroundColor: isMenuOpen ? '#F3F4F6' : 'transparent',
                color: '#4B5563',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 150ms ease',
              }}
              aria-label="Template options"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {isMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 46,
                  right: 0,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E8E8E6',
                  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                  padding: '8px 0',
                  width: 170,
                  zIndex: 100,
                  animation: 'fadeInUp 150ms ease-out',
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onEditTemplate) onEditTemplate(templateId);
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#1F2937',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  Edit Template
                </button>

                <button
                  type="button"
                  onClick={handleDeleteTemplate}
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    textAlign: 'left',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#EF4444',
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  Delete Template
                </button>
              </div>
            )}
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>Choose which day of the routine you want to perform.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {days.map((day) => (
            <div 
              key={day.id} 
              className="workout-entry-card"
              role="button"
              tabIndex={0}
              onClick={() => handleStartDay(day)}
            >
              <div className="workout-entry-icon" style={{ backgroundColor: 'rgba(92, 141, 137, 0.12)', color: '#5C8D89' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              <div style={{ flex: 1 }}>
                <h2 className="workout-entry-title">{day.day_name || day.name}</h2>
              </div>

              <div style={{ color: '#5C8D89' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Screen: Active Workout Execution (Organized by Muscle Group Accordions)
  return (
    <div className="exlib-container" style={{ padding: '24px 20px', paddingBottom: 100 }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <button className="workout-back-btn" onClick={onClose} style={{ margin: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Quit</span>
        </button>

        <span style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>
          {selectedDay?.day_name || selectedDay?.name || 'Workout'}
        </span>

        <button 
          onClick={handleFinishWorkout}
          style={{
            backgroundColor: '#5C8D89',
            color: '#FFF',
            border: 'none',
            borderRadius: 20,
            padding: '8px 20px',
            fontWeight: 650,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(92, 141, 137, 0.3)',
          }}
        >
          Finish
        </button>
      </div>

      {groupedExercises.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6B7280' }}>
          No exercises in this workout day.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {groupedExercises.map((group) => {
            const isExpanded = expandedMuscles[group.muscle] ?? false;

            return (
              <div key={group.muscle} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Accordion Muscle Group Header Card */}
                <div
                  onClick={() => {
                    setExpandedMuscles((prev) => ({
                      ...prev,
                      [group.muscle]: !isExpanded,
                    }));
                  }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    padding: '16px 20px',
                    border: '1px solid #E8E8E6',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(92, 141, 137, 0.12)', color: '#5C8D89', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
                        <line x1="16" y1="8" x2="2" y2="22" />
                        <line x1="17.5" y1="15" x2="9" y2="15" />
                      </svg>
                    </div>

                    <div>
                      <h2 style={{ fontSize: 17, fontWeight: 700, color: '#1F2937', margin: 0 }}>{group.muscle}</h2>
                      <p style={{ fontSize: 13, color: '#6B7280', margin: '2px 0 0' }}>{group.items.length} {group.items.length === 1 ? 'Exercise' : 'Exercises'}</p>
                    </div>
                  </div>

                  <div style={{ color: '#6B7280', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms ease' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Exercises & Logging Sections (Visible when expanded) */}
                {isExpanded && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingLeft: 4, paddingRight: 4, animation: 'fadeInUp 200ms ease-out' }}>
                    {group.items.map((exItem) => (
                      <ExerciseWorkoutItem
                        key={exItem.id}
                        exerciseItem={exItem}
                        workoutLogId={workoutLogId}
                        savedSetsMap={savedSetsMap}
                        getLocationClass={getLocationClass}
                        getDifficultyClass={getDifficultyClass}
                        onOpenDetail={(name) => setSelectedDetailExerciseName(name)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showDeleteModal && (
        <DeleteTemplateModal
          templateId={templateId}
          onClose={() => setShowDeleteModal(false)}
          onDeleted={() => {
            setShowDeleteModal(false);
            if (onDeleteTemplate) onDeleteTemplate();
            else onClose();
          }}
        />
      )}
    </div>
  );
};

// ==========================================
// EXERCISE WORKOUT ITEM (REUSED CARD + LOGGING)
// ==========================================
const ExerciseWorkoutItem: React.FC<{
  exerciseItem: UserWorkoutExercise;
  workoutLogId: string | null;
  savedSetsMap: Record<string, SetRecord[]>;
  getLocationClass: (loc?: string) => string;
  getDifficultyClass: (diff?: string) => string;
  onOpenDetail: (name: string) => void;
}> = ({ exerciseItem, workoutLogId: initialWorkoutLogId, savedSetsMap, getLocationClass, getDifficultyClass, onOpenDetail }) => {
  const ex = exerciseItem.exercise;
  const exName = ex?.exercise_name || ex?.name || 'Exercise';
  const isTimer = ex?.tracking_type === 'timer';

  const [activeWorkoutLogId, setActiveWorkoutLogId] = useState<string | null>(initialWorkoutLogId);

  useEffect(() => {
    if (initialWorkoutLogId) {
      setActiveWorkoutLogId(initialWorkoutLogId);
    }
  }, [initialWorkoutLogId]);

  // State for sets (Populate from savedSetsMap if available today)
  const [sets, setSets] = useState<SetRecord[]>(() => {
    const existing = savedSetsMap[exerciseItem.exercise_id];
    if (existing && existing.length > 0) {
      return existing;
    }
    return [
      {
        setNumber: 1,
        weight: exerciseItem.default_weight_kg || 0,
        reps: exerciseItem.target_reps || 10,
        timeSeconds: 0,
        isCompleted: false,
      },
    ];
  });

  useEffect(() => {
    const existing = savedSetsMap[exerciseItem.exercise_id];
    if (existing && existing.length > 0) {
      setSets(existing);
    }
  }, [savedSetsMap, exerciseItem.exercise_id]);

  const handleAddSet = () => {
    setSets((prev) => {
      const lastSet = prev[prev.length - 1];
      const prevWeight = lastSet ? lastSet.weight : 0;
      return [
        ...prev,
        {
          setNumber: prev.length + 1,
          weight: prevWeight,
          reps: exerciseItem.target_reps || 10,
          timeSeconds: 0,
          isCompleted: false,
        },
      ];
    });
  };

  const handleUpdateSet = (index: number, updated: Partial<SetRecord>) => {
    setSets((prev) =>
      prev.map((s, idx) => (idx === index ? { ...s, ...updated } : s))
    );
  };

  const handleResetSet1 = async () => {
    const set1 = sets[0];
    if (set1 && set1.id) {
      try {
        await supabase.from('workout_log_sets').delete().eq('id', set1.id);
      } catch (err) {
        console.error('Error deleting reset set from Supabase:', err);
      }
    }

    setSets((prev) =>
      prev.map((s, idx) =>
        idx === 0 ? { setNumber: 1, weight: 0, reps: 10, timeSeconds: 0, isCompleted: false } : s
      )
    );
  };

  const handleDeleteSet = async (index: number) => {
    const setToRemove = sets[index];
    if (!setToRemove) return;

    // Delete row from Supabase if previously logged
    if (setToRemove.id) {
      try {
        await supabase.from('workout_log_sets').delete().eq('id', setToRemove.id);
      } catch (err) {
        console.error('Failed to delete set record:', err);
      }
    }

    setSets((prev) => {
      const next = prev.filter((_, idx) => idx !== index);
      return next.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    });
  };

  const handleSaveSetLog = async (index: number) => {
    const s = sets[index];
    if (!s) return;

    let targetLogId = activeWorkoutLogId;

    // Ensure workout_logs session exists
    if (!targetLogId) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const now = new Date();
        const { data: newLog, error: logErr } = await supabase
          .from('workout_logs')
          .insert({
            user_id: session?.user?.id || null,
            template_id: (exerciseItem as any).template_id || null,
            template_name: 'Workout Routine',
            day_name: 'Training Day',
            start_time: now.toISOString(),
            status: 'in_progress'
          })
          .select()
          .single();

        if (logErr) {
          console.error('Auto-create workout_log error:', logErr);
        } else if (newLog) {
          targetLogId = newLog.id;
          setActiveWorkoutLogId(newLog.id);
        }
      } catch (err) {
        console.error('Failed to auto-create workout log:', err);
      }
    }

    if (!targetLogId) {
      alert('Unable to save set: Workout session could not be initialized.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('workout_log_sets')
        .insert({
          workout_log_id: targetLogId,
          exercise_id: exerciseItem.exercise_id,
          exercise_name: exName,
          set_number: s.setNumber,
          weight_kg: s.weight,
          reps_completed: isTimer ? null : s.reps,
          duration_seconds: isTimer ? s.timeSeconds : null,
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase set insert error:', error);
        alert(`Failed to save set: ${error.message}`);
        throw error;
      }

      handleUpdateSet(index, { id: data.id, isCompleted: true });
    } catch (err) {
      console.error('Failed to save set log:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Exact Exercise Card from Exercise Library (No action icons) */}
      <div
        className="exlib-ex-card"
        style={{ cursor: 'pointer', margin: 0 }}
        onClick={() => onOpenDetail(exName)}
      >
        <div className="exlib-ex-header">
          <h3 className="exlib-ex-name">{exName}</h3>
          {ex?.difficulty && (
            <span className={`exlib-diff-pill ${getDifficultyClass(ex.difficulty)}`}>
              {ex.difficulty}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="exlib-ex-tags">
          {ex?.workout_location && (
            <span className={`exlib-tag ${getLocationClass(ex.workout_location)}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              </svg>
              {ex.workout_location}
            </span>
          )}

          {ex?.equipment_required && (
            <span className="exlib-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 12h12M4 8v8M20 8v8" />
              </svg>
              {ex.equipment_required}
            </span>
          )}
        </div>

        {/* Target Muscles */}
        {ex?.primary_muscles && ex.primary_muscles.length > 0 && (
          <p className="exlib-ex-muscles" style={{ margin: '12px 0 0' }}>
            <strong style={{ color: '#1F2937' }}>{ex.primary_muscles.join(', ')}</strong>
            {ex.secondary_muscles &&
            ex.secondary_muscles.length > 0 &&
            ex.secondary_muscles[0] !== 'None' &&
            ex.secondary_muscles[0] !== ''
              ? ` • ${ex.secondary_muscles.join(', ')}`
              : ''}
          </p>
        )}
      </div>

      {/* Compact Set Logging Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {sets.map((set, idx) => (
          <CompactSetCard
            key={`set_${set.setNumber}`}
            set={set}
            isTimer={isTimer}
            isSet1={idx === 0}
            onUpdate={(updated) => handleUpdateSet(idx, updated)}
            onResetSet1={handleResetSet1}
            onDeleteSet={() => handleDeleteSet(idx)}
            onSaveSet={() => handleSaveSetLog(idx)}
          />
        ))}

        {/* Add Set Ghost Button */}
        <button
          type="button"
          onClick={handleAddSet}
          style={{
            width: '100%',
            height: 48,
            borderRadius: 16,
            backgroundColor: '#FFFFFF',
            border: '1.5px dashed #CBD5E1',
            color: '#5C8D89',
            fontSize: 15,
            fontWeight: 650,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 200ms ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Set
        </button>
      </div>
    </div>
  );
};

// ==========================================
// COMPACT SET CARD COMPONENT
// ==========================================
const CompactSetCard: React.FC<{
  set: SetRecord;
  isTimer: boolean;
  isSet1: boolean;
  onUpdate: (updated: Partial<SetRecord>) => void;
  onResetSet1: () => void;
  onDeleteSet: () => void;
  onSaveSet: () => Promise<void>;
}> = ({ set, isTimer, isSet1, onUpdate, onResetSet1, onDeleteSet, onSaveSet }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Compact Digital Timer State
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(set.timeSeconds);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const next = prev + 1;
          onUpdate({ timeSeconds: next });
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onUpdate({ weight: isNaN(val) ? 0 : val });
  };

  const adjustWeight = (delta: number) => {
    const current = set.weight || 0;
    const next = Math.max(0, parseFloat((current + delta).toFixed(1)));
    onUpdate({ weight: next });
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    await onSaveSet();
    setIsSaving(false);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: '16px 20px',
        border: `1.5px solid ${set.isCompleted ? '#86EFAC' : '#E8E8E6'}`,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        animation: 'fadeInUp 200ms ease-out',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Set Header: Title & Right Action Icon (Reset or Delete) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#1F2937' }}>
            Set {set.setNumber}
          </span>
          {set.isCompleted && (
            <span style={{ fontSize: 12, fontWeight: 650, color: '#16A34A', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: 10 }}>
              ✓ Saved to Database
            </span>
          )}
        </div>

        {/* Top-Right Control: Reset for Set 1, Trash Delete for Set 2+ */}
        {isSet1 ? (
          <button
            type="button"
            onClick={onResetSet1}
            style={{ border: 'none', backgroundColor: 'transparent', color: '#6B7280', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}
            title="Reset Set 1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setIsDeleting(true);
              setTimeout(() => onDeleteSet(), 150);
            }}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              color: isDeleting ? '#EF4444' : '#9CA3AF',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              transition: 'color 150ms ease',
            }}
            title="Delete Set"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        )}
      </div>

      {/* Inputs: Vertically Stacked to Prevent Any Horizontal Overflow */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: '100%', minWidth: 0 }}>
        {/* Weight Field (Allows Decimals + Circular - / + buttons) */}
        <div style={{ width: '100%' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>
            Weight (kg)
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <button
              type="button"
              onClick={() => adjustWeight(-2.5)}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                color: '#4B5563',
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              -
            </button>

            <input
              type="number"
              step="0.5"
              value={set.weight || ''}
              onChange={handleWeightChange}
              placeholder="0"
              style={{
                flex: 1,
                height: 44,
                borderRadius: 14,
                border: '1.5px solid #E5E7EB',
                padding: '0 12px',
                fontSize: 16,
                fontWeight: 650,
                color: '#1F2937',
                textAlign: 'center',
                outline: 'none',
              }}
            />

            <button
              type="button"
              onClick={() => adjustWeight(2.5)}
              style={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                color: '#4B5563',
                fontSize: 18,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Reps OR Timer Field */}
        <div style={{ width: '100%', minWidth: 0 }}>
          {isTimer ? (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>
                Duration
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    flex: 1,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#5C8D89',
                    fontFamily: 'monospace',
                  }}
                >
                  {formatTime(timerSeconds)}
                </div>

                <button
                  type="button"
                  onClick={() => setTimerRunning(!timerRunning)}
                  style={{
                    padding: '8px 16px',
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: timerRunning ? '#FEE2E2' : '#EFF3F2',
                    color: timerRunning ? '#EF4444' : '#5C8D89',
                    border: 'none',
                    fontSize: 14,
                    fontWeight: 650,
                    cursor: 'pointer',
                  }}
                >
                  {timerRunning ? 'Pause' : 'Start'}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: 6 }}>
                Reps
              </label>
              <div style={{ width: '100%', minWidth: 0, overflow: 'hidden' }}>
                <HorizontalWheelPicker
                  value={set.reps}
                  onChange={(val) => onUpdate({ reps: val })}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Set Button with Visual Feedback & Unclickable State */}
      <button
        type="button"
        disabled={set.isCompleted || isSaving}
        onClick={handleSaveClick}
        style={{
          width: '100%',
          height: 44,
          borderRadius: 14,
          backgroundColor: set.isCompleted ? '#DCFCE7' : (isSaving ? '#E5E7EB' : '#5C8D89'),
          color: set.isCompleted ? '#16A34A' : (isSaving ? '#6B7280' : '#FFFFFF'),
          border: `1.5px solid ${set.isCompleted ? '#86EFAC' : 'transparent'}`,
          fontSize: 14,
          fontWeight: 650,
          cursor: (set.isCompleted || isSaving) ? 'default' : 'pointer',
          transition: 'all 200ms ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {set.isCompleted ? (
          <>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Saved to Database</span>
          </>
        ) : isSaving ? (
          <span>Saving to Supabase...</span>
        ) : (
          <span>Complete Set {set.setNumber}</span>
        )}
      </button>
    </div>
  );
};
