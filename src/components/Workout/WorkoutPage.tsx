import React, { useState, useEffect, useCallback } from 'react';
import { ExerciseLibraryFlow } from './ExerciseLibrary/ExerciseLibraryFlow';
import { CreateTemplateFlow } from './CreateTemplateFlow';
import { WorkoutExecutionScreen } from './WorkoutExecutionScreen';
import { ExtraWorkoutFlow } from './ExtraWorkoutFlow';
import { DailyWalkingCard } from './DailyWalkingCard';
import { supabase } from '../../services/supabaseClient';
import { WorkoutTemplate, WorkoutTemplateDay, Profile } from '../../types/database.types';
import './ExerciseLibrary/exerciseLibrary.css';

interface WorkoutPageProps {
  profile?: Profile | null;
  onBackToHome?: () => void;
}

interface TemplateWithDays extends WorkoutTemplate {
  workout_template_days?: WorkoutTemplateDay[];
}

export const WorkoutPage: React.FC<WorkoutPageProps> = ({ profile: propProfile, onBackToHome }) => {
  const [profile, setProfile] = useState<Profile | null>(propProfile || null);
  const [inLibrary, setInLibrary] = useState(false);
  const [isExtraWorkout, setIsExtraWorkout] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const [templates, setTemplates] = useState<TemplateWithDays[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('workout_templates')
        .select(`
          *,
          workout_template_days (
            *
          )
        `)
        .eq('user_id', session.user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching templates:', error);
      }

      if (!profile) {
        const { data: profData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        if (profData) setProfile(profData as Profile);
      }

      setTemplates(data || []);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  }, [profile]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  if (inLibrary) {
    return <ExerciseLibraryFlow onBackToWorkout={() => setInLibrary(false)} />;
  }

  if (isExtraWorkout) {
    return (
      <ExtraWorkoutFlow
        onBack={() => setIsExtraWorkout(false)}
        onComplete={() => {
          setIsExtraWorkout(false);
          fetchTemplates();
        }}
      />
    );
  }

  if (isCreatingTemplate || editingTemplateId) {
    return (
      <CreateTemplateFlow
        editTemplateId={editingTemplateId || undefined}
        onBack={() => {
          setIsCreatingTemplate(false);
          setEditingTemplateId(null);
        }}
        onComplete={() => {
          setIsCreatingTemplate(false);
          setEditingTemplateId(null);
          fetchTemplates();
        }}
      />
    );
  }

  if (activeTemplateId) {
    return (
      <WorkoutExecutionScreen 
        templateId={activeTemplateId} 
        onClose={() => setActiveTemplateId(null)}
        onEditTemplate={(tmplId) => {
          setActiveTemplateId(null);
          setEditingTemplateId(tmplId);
        }}
      />
    );
  }

  return (
    <div className="exlib-container">
      {/* Back Button to Home */}
      {onBackToHome && (
        <button
          className="workout-back-btn"
          onClick={onBackToHome}
          aria-label="Back to Home"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Home</span>
        </button>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 className="exlib-title">Workout</h1>
        <p className="exlib-subtitle">Track your training and explore exercises</p>
      </div>

      {/* Primary Action Card: Exercise Library */}
      <div className="workout-entry-card" onClick={() => setInLibrary(true)} role="button" tabIndex={0}>
        <div className="workout-entry-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <circle cx="12" cy="10" r="3" />
            <path d="M12 13v4" />
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <h2 className="workout-entry-title">Exercise Library</h2>
          <p className="workout-entry-desc">Your complete exercise library, all in one place.</p>
        </div>

        <div style={{ color: '#5C8D89' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* Action Card: Extra Workout */}
      <div
        className="workout-entry-card"
        onClick={() => setIsExtraWorkout(true)}
        role="button"
        tabIndex={0}
        style={{ marginTop: 12 }}
      >
        <div className="workout-entry-icon" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>

        <div style={{ flex: 1 }}>
          <h2 className="workout-entry-title">Extra Workout</h2>
          <p className="workout-entry-desc">Log a quick one-day session without modifying your routines.</p>
        </div>

        <div style={{ color: '#4F46E5' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>

      {/* ── Daily Walking Activity Tracking ── */}
      <DailyWalkingCard profile={profile} />

      <div style={{ marginTop: 32, marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1F2937' }}>My Templates</h3>
      </div>

      {loading ? (
        <div style={{ padding: '24px', textAlign: 'center', color: '#6B7280' }}>
          Loading templates...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
          {templates.map(template => (
            <div 
              key={template.id} 
              className="workout-entry-card" 
              role="button" 
              tabIndex={0}
              onClick={() => setActiveTemplateId(template.id)}
              style={{ position: 'relative' }}
            >
              <div className="workout-entry-icon" style={{ backgroundColor: '#EEF2FF', color: '#6366F1' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>

              <div style={{ flex: 1 }}>
                <h2 className="workout-entry-title">{template.name}</h2>
                <p className="workout-entry-desc">
                  {template.workout_template_days?.length || 0} {(template.workout_template_days?.length === 1) ? 'Day' : 'Days'}
                </p>
              </div>

              {/* 3 Vertical Dots Menu Button */}
              <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => setOpenMenuId(openMenuId === template.id ? null : template.id)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: openMenuId === template.id ? '#F3F4F6' : 'transparent',
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

                {/* Dropdown Options Popup */}
                {openMenuId === template.id && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 42,
                      right: 0,
                      backgroundColor: '#FFFFFF',
                      borderRadius: 16,
                      border: '1px solid #E8E8E6',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                      padding: '8px 0',
                      width: 160,
                      zIndex: 100,
                      animation: 'fadeInUp 150ms ease-out',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        setEditingTemplateId(template.id);
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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create New Template Card - Only shown when user has no templates */}
      {templates.length === 0 && (
        <div className="workout-entry-card" style={{ border: '2px dashed #E5E7EB', backgroundColor: 'transparent', boxShadow: 'none' }} onClick={() => setIsCreatingTemplate(true)} role="button" tabIndex={0}>
          <div className="workout-entry-icon" style={{ backgroundColor: '#F3F4F6', color: '#6B7280' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <h2 className="workout-entry-title" style={{ color: '#4B5563' }}>Create New Template</h2>
            <p className="workout-entry-desc" style={{ color: '#9CA3AF' }}>Build a custom workout routine</p>
          </div>
        </div>
      )}
    </div>
  );
};
