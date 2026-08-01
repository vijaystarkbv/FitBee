import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { LoginForm } from './components/Auth/LoginForm';
import { OnboardingWizard } from './components/Onboarding/OnboardingWizard';
import { HomeDashboard } from './components/Home/HomeDashboard';
import { BottomNav, NavTab } from './components/Home/BottomNav';
import { MealInput } from './components/Nutrition/MealInput';
import { Profile, NutritionLog } from './types/database.types';
import { getOrCreateTodayNutritionLog, saveMealEntry } from './services/nutritionService';
import './components/Home/home.css';

export const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Application Data States
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayNutrition, setTodayNutrition] = useState<NutritionLog | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    setLoading(true);
    try {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      setProfile(prof);

      // Fetch today's nutrition log (even for skipped users, so the tracker works)
      if (prof) {
        try {
          const nutLog = await getOrCreateTodayNutritionLog(userId);
          setTodayNutrition(nutLog);
        } catch (e) {
          console.warn('Could not fetch nutrition log:', e);
        }
      }
    } catch (err) {
      console.error('Fetch User Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  /* ── Meal saving (existing MealInput integration) ── */
  const handleSaveMeal = async (
    rawText: string,
    foods: any[],
    totals: { calories: number; protein: number; carbs: number; fat: number }
  ) => {
    if (!session) return;
    const log = todayNutrition || (await getOrCreateTodayNutritionLog(session.user.id));
    await saveMealEntry(log.id, rawText, foods, totals);
    const updated = await getOrCreateTodayNutritionLog(session.user.id);
    setTodayNutrition(updated);
    // Return to home after saving so user sees updated rings
    setActiveTab('home');
  };

  /* ── Skip onboarding ── */
  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    if (session) fetchUserData(session.user.id);
  };

  /* ── Resume onboarding from banner ── */
  const handleResumeOnboarding = () => {
    setShowOnboarding(true);
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FAFAF8', color: '#5C8D89', fontFamily: "'Inter', sans-serif", fontWeight: 600,
      }}>
        Loading FitBee...
      </div>
    );
  }

  /* ── 1. Not Authenticated ── */
  if (!session) {
    return <LoginForm onSuccess={() => { /* auth state change will handle */ }} />;
  }

  /* ── 2. Onboarding ── */
  // Show wizard ONLY when: (a) no profile exists yet, or (b) user explicitly clicked "resume"
  if (!profile || showOnboarding) {
    return (
      <OnboardingWizard
        userId={session.user.id}
        onComplete={() => {
          setShowOnboarding(false);
          fetchUserData(session.user.id);
        }}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  /* ── 3. Main Application ── */
  return (
    <div className="hd-page">
      {/* Home Dashboard */}
      {activeTab === 'home' && profile && (
        <HomeDashboard
          profile={profile}
          todayNutrition={todayNutrition}
          onResumeOnboarding={!profile.onboarding_completed ? handleResumeOnboarding : undefined}
          onNavigateSettings={() => setActiveTab('settings')}
        />
      )}

      {/* Log Meal page — shows the existing MealInput with Gemini integration */}
      {activeTab === 'meal' && profile && (
        <div className="hd-page" style={{ paddingTop: 0 }}>
          {/* Back button to home */}
          <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 24px 0' }}>
            <button
              onClick={() => setActiveTab('home')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
                color: '#6B7280', padding: 0, marginBottom: 16,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>

          {/* Nutrition Summary */}
          <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 24px' }}>
            <div className="hd-card" style={{ marginBottom: 20 }}>
              <h2 className="hd-card-title" style={{ marginBottom: 12 }}>Nutrition Tracker</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8, textAlign: 'center' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
                    {todayNutrition?.total_calories || 0}
                  </div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>
                    / {profile.target_calories || 2000} kcal
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
                    {todayNutrition?.total_protein || 0}
                  </div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>
                    / {profile.target_protein || 120} g P
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
                    {todayNutrition?.total_carbs || 0}
                  </div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>
                    / {profile.target_carbs || 250} g C
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#1F2937' }}>
                    {todayNutrition?.total_fat || 0}
                  </div>
                  <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>
                    / {profile.target_fat || 55} g F
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Existing MealInput with Gemini integration */}
          <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 24px 100px' }}>
            <div className="hd-card">
              <h2 className="hd-card-title">+ Log Meal</h2>
              <p className="hd-card-subtitle" style={{ marginBottom: 16 }}>
                Describe your meal in natural language
              </p>
              <MealInput onSaveMeal={handleSaveMeal} />
            </div>
          </div>
        </div>
      )}

      {/* Workout placeholder */}
      {activeTab === 'workout' && (
        <div className="hd-placeholder-page">
          <div className="hd-placeholder-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 12h12M4 8v8M20 8v8M2 10v4M22 10v4" />
            </svg>
          </div>
          <h2 className="hd-placeholder-title">Today's Workout</h2>
          <p className="hd-placeholder-subtitle">
            Your personalized workout routine will appear here.
            <br />Coming soon.
          </p>
        </div>
      )}

      {/* Settings */}
      {activeTab === 'settings' && profile && (
        <div style={{ maxWidth: 520, margin: '0 auto', padding: '20px 24px 100px' }}>
          {/* Back button */}
          <button
            onClick={() => setActiveTab('home')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
              color: '#6B7280', padding: 0, marginBottom: 20,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <h2 style={{
            fontSize: 22, fontWeight: 700, color: '#1F2937',
            fontFamily: "'Inter', sans-serif", margin: '0 0 24px',
          }}>
            Settings
          </h2>

          {/* Profile summary */}
          <div className="hd-card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: '50%', background: '#F3F4F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 600, color: '#5C8D89',
              }}>
                {(profile.display_name || 'U')[0].toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1F2937' }}>
                  {profile.display_name || 'FitBee User'}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Settings items */}
          <div className="hd-card">
            <div
              className="hd-settings-item"
              onClick={!profile.onboarding_completed ? handleResumeOnboarding : undefined}
              style={!profile.onboarding_completed ? {} : { cursor: 'default', opacity: 0.5 }}
            >
              <div className="hd-settings-item-left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <div>
                  <p className="hd-settings-item-label">Profile & Onboarding</p>
                  <p className="hd-settings-item-desc">
                    {profile.onboarding_completed ? 'Completed' : 'Tap to complete your profile'}
                  </p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>

            <div className="hd-settings-item" style={{ cursor: 'default', opacity: 0.5 }}>
              <div className="hd-settings-item-left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <div>
                  <p className="hd-settings-item-label">Notifications</p>
                  <p className="hd-settings-item-desc">Coming soon</p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>

            <div className="hd-settings-item" style={{ borderBottom: 'none', cursor: 'default', opacity: 0.5 }}>
              <div className="hd-settings-item-left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <div>
                  <p className="hd-settings-item-label">Privacy & Data</p>
                  <p className="hd-settings-item-desc">Coming soon</p>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </div>

          {/* Sign Out */}
          <button
            className="hd-signout-btn"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
    </div>
  );
};

export default App;
