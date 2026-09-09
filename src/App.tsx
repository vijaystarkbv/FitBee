import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './services/supabaseClient';
import { LoginForm } from './components/Auth/LoginForm';
import { OnboardingWizard } from './components/Onboarding/OnboardingWizard';
import { HomeDashboard } from './components/Home/HomeDashboard';
import { BottomNav, NavTab } from './components/Home/BottomNav';
import { MealLogPage } from './components/Nutrition/MealLogPage';
import { WorkoutPage } from './components/Workout/WorkoutPage';
import { HabitsPage } from './components/Habits/HabitsPage';
import { DevTimeMachine } from './components/DevTools/DevTimeMachine';
import { Profile, NutritionLog, MealEntry, ParsedFoodItem } from './types/database.types';
import { getOrCreateTodayNutritionLog, saveMealEntry, getTodayMeals } from './services/nutritionService';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ProfileSettings } from './components/Profile/ProfileSettings';
import { NotificationSettings } from './components/Settings/NotificationSettings';
import { initRealtime, cleanupRealtime, REALTIME_EVENTS } from './services/realtimeService';
import { useClock } from './hooks/useClock';
import { getTodayDateString } from './utils/formatters';
import {
  isPushNotificationSupported,
  getNotificationPermissionState,
  isCurrentDeviceRegistered,
  registerPushSubscription,
} from './services/pushNotificationService';
import './components/Home/home.css';

const ACTIVE_TAB_KEY = 'fitbee_active_tab';

function getInitialTab(): NavTab {
  if (typeof window !== 'undefined') {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab') as NavTab | null;
      if (tabParam && ['home', 'workout', 'meal', 'habits', 'settings'].includes(tabParam)) {
        try {
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (_) {}
        return tabParam;
      }
      const saved = localStorage.getItem(ACTIVE_TAB_KEY) as NavTab | null;
      if (saved && ['home', 'workout', 'meal', 'habits', 'settings'].includes(saved)) {
        return saved;
      }
    } catch (_) {}
  }
  return 'home';
}

export const App: React.FC = () => {
  const { todayKey } = useClock();
  const prevDateKeyRef = useRef<string>(todayKey);

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTabState] = useState<NavTab>(getInitialTab);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const setActiveTab = (tab: NavTab) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem(ACTIVE_TAB_KEY, tab);
    } catch (_) {}
  };

  // Application Data States
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayNutrition, setTodayNutrition] = useState<NutritionLog | null>(null);
  const [todayMeals, setTodayMeals] = useState<MealEntry[]>([]);
  const [settingsSubView, setSettingsSubView] = useState<'main' | 'profile' | 'notifications'>('main');

  // React to calendar date rollover (midnight crossing, time machine jump, or waking from sleep)
  useEffect(() => {
    if (prevDateKeyRef.current !== todayKey) {
      console.log(`[FitBee] Calendar day rolled over: ${prevDateKeyRef.current} -> ${todayKey}`);
      prevDateKeyRef.current = todayKey;

      // Invalidate stale in-memory nutrition log so it is never reused across days
      setTodayNutrition(null);
      setTodayMeals([]);

      if (session?.user?.id) {
        fetchUserData(session.user.id, false);
      }
    }
  }, [todayKey, session?.user?.id]);

  // Also listen for fitbee:date_changed window event triggered by ClockService
  useEffect(() => {
    const handleDateChanged = (e: Event) => {
      const customEv = e as CustomEvent<{ oldDate: string; newDate: string }>;
      console.log('[FitBee] fitbee:date_changed event received:', customEv.detail);
      setTodayNutrition(null);
      setTodayMeals([]);
      if (session?.user?.id) {
        fetchUserData(session.user.id, false);
      }
    };
    window.addEventListener('fitbee:date_changed', handleDateChanged);
    return () => window.removeEventListener('fitbee:date_changed', handleDateChanged);
  }, [session?.user?.id]);

  // Listen for deep link events from the service worker push notification clicks
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.serviceWorker) return;
    const handleSwMessage = (e: MessageEvent) => {
      if (e.data?.type === 'FITBEE_NAVIGATE') {
        const url = String(e.data.url || '');
        if (url.includes('habits')) setActiveTab('habits');
        else if (url.includes('workout')) setActiveTab('workout');
        else if (url.includes('meal')) setActiveTab('meal');
        else if (url.includes('settings')) setActiveTab('settings');
        else setActiveTab('home');
      }
    };
    navigator.serviceWorker.addEventListener('message', handleSwMessage);
    return () => navigator.serviceWorker.removeEventListener('message', handleSwMessage);
  }, []);

  // Auto-register device if browser permission is already granted and user hasn't unregistered
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || !isPushNotificationSupported()) return;

    const checkAutoRegister = async () => {
      try {
        const perm = getNotificationPermissionState();
        const isUnregistered = localStorage.getItem('fitbee_push_unregistered_' + userId) === 'true';
        if (perm === 'granted' && !isUnregistered) {
          const isRegistered = await isCurrentDeviceRegistered();
          if (!isRegistered) {
            await registerPushSubscription(userId);
          }
        }
      } catch (err) {
        console.warn('Auto push registration check failed:', err);
      }
    };
    checkAutoRegister();
  }, [session?.user?.id]);

  useEffect(() => {
    let prevUserId: string | null = null;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        prevUserId = session.user.id;
        fetchUserData(session.user.id, true);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (session) {
        const isNewUser = session.user.id !== prevUserId;
        prevUserId = session.user.id;
        if (event === 'SIGNED_IN' && isNewUser) {
          const saved = getInitialTab();
          setActiveTabState(saved);
        }
        if (isNewUser) {
          fetchUserData(session.user.id);
        }
      } else {
        // Full clean reset on sign out to prevent cross-account leaks
        prevUserId = null;
        setProfile(null);
        setTodayNutrition(null);
        setTodayMeals([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialize and tear down Realtime subscription for cross-device synchronization
  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      cleanupRealtime();
      return;
    }

    const unsubscribe = initRealtime(userId);

    const handleDataUpdate = () => {
      fetchUserData(userId, false);
    };

    window.addEventListener(REALTIME_EVENTS.NUTRITION_UPDATED, handleDataUpdate);
    window.addEventListener(REALTIME_EVENTS.WORKOUT_UPDATED, handleDataUpdate);
    window.addEventListener(REALTIME_EVENTS.WEIGHT_UPDATED, handleDataUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener(REALTIME_EVENTS.NUTRITION_UPDATED, handleDataUpdate);
      window.removeEventListener(REALTIME_EVENTS.WORKOUT_UPDATED, handleDataUpdate);
      window.removeEventListener(REALTIME_EVENTS.WEIGHT_UPDATED, handleDataUpdate);
    };
  }, [session?.user?.id]);

  const fetchUserData = async (userId: string, isInitialLoad = false) => {
    if (isInitialLoad) setLoading(true);
    try {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      setProfile(prof);

      // Fetch today's nutrition log and meal entries using current local calendar date
      if (prof) {
        try {
          const currentToday = getTodayDateString();
          const nutLog = await getOrCreateTodayNutritionLog(userId, currentToday);
          setTodayNutrition(nutLog);

          const meals = await getTodayMeals(nutLog.id);
          setTodayMeals(meals);
        } catch (e) {
          console.warn('Could not fetch nutrition log:', e);
        }
      }
    } catch (err) {
      console.error('Fetch User Data Error:', err);
    } finally {
      if (isInitialLoad) setLoading(false);
    }
  };

  /* ── Meal saving integration (Strictly Defensive Against Stale Previous-Day Logs) ── */
  const handleSaveMeal = async (
    rawText: string,
    foods: ParsedFoodItem[],
    totals: { calories: number; protein: number; carbs: number; fat: number }
  ): Promise<MealEntry> => {
    if (!session?.user) throw new Error('User not logged in');

    const currentToday = getTodayDateString();
    let log = todayNutrition;

    // Strict defensive check: never trust a stale in-memory log across midnight
    if (!log || log.date !== currentToday || log.user_id !== session.user.id) {
      console.warn(
        `[FitBee] In-memory nutrition log is stale or missing (log date: ${log?.date}, current today: ${currentToday}). Fetching/creating current day log...`
      );
      log = await getOrCreateTodayNutritionLog(session.user.id, currentToday);
      setTodayNutrition(log);
      const refreshedMeals = await getTodayMeals(log.id);
      setTodayMeals(refreshedMeals);
    }

    // Save to DB via nutritionService
    const createdMeal = await saveMealEntry(log.id, rawText, foods, totals);

    // 1. Instantly update today's nutrition totals in memory for Home Dashboard progress rings
    setTodayNutrition((prev) => {
      if (!prev || prev.id !== log.id) return log;
      return {
        ...prev,
        total_calories: (prev.total_calories || 0) + totals.calories,
        total_protein: (prev.total_protein || 0) + totals.protein,
        total_carbs: (prev.total_carbs || 0) + totals.carbs,
        total_fat: (prev.total_fat || 0) + totals.fat,
      };
    });

    // 2. Instantly append new meal to todayMeals history in memory
    setTodayMeals((prev) => [...prev, createdMeal]);

    return createdMeal;
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
    <ErrorBoundary>
      <div className="hd-page">
      <main key={activeTab} className="fitbee-tab-content">
        {/* Home Dashboard */}
        {activeTab === 'home' && profile && (
          <HomeDashboard
            profile={profile}
            todayNutrition={todayNutrition}
            onResumeOnboarding={!profile.onboarding_completed ? handleResumeOnboarding : undefined}
            onNavigateSettings={() => {
              setActiveTab('settings');
              setSettingsSubView('profile');
            }}
          />
        )}

        {/* Log Meal Page ── Section 1-8 Implementation */}
        {activeTab === 'meal' && profile && (
          <MealLogPage
            profile={profile}
            todayNutrition={todayNutrition}
            todayMeals={todayMeals}
            onSaveMeal={handleSaveMeal}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {/* Workout Page */}
        {activeTab === 'workout' && (
          <WorkoutPage profile={profile} onBackToHome={() => setActiveTab('home')} />
        )}

        {/* Habits Page */}
        {activeTab === 'habits' && profile && (
          <HabitsPage
            profile={profile}
            todayNutrition={todayNutrition}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {/* Settings */}
        {activeTab === 'settings' && profile && (
          settingsSubView === 'profile' ? (
            <ProfileSettings
              profile={profile}
              userEmail={session.user.email || ''}
              onProfileUpdated={() => fetchUserData(session.user.id)}
              onSignOut={() => supabase.auth.signOut()}
              onBack={() => setSettingsSubView('main')}
            />
          ) : settingsSubView === 'notifications' ? (
            <NotificationSettings
              profile={profile}
              onBack={() => setSettingsSubView('main')}
            />
          ) : (
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
                onClick={() => {
                  if (!profile.onboarding_completed) {
                    handleResumeOnboarding();
                  } else {
                    setSettingsSubView('profile');
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="hd-settings-item-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <div>
                    <p className="hd-settings-item-label">Profile & Nutrition Targets</p>
                    <p className="hd-settings-item-desc">
                      {profile.onboarding_completed ? 'Update weight, customize targets & stats' : 'Tap to complete your profile'}
                    </p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>

              <div
                className="hd-settings-item"
                onClick={() => setSettingsSubView('notifications')}
                style={{ cursor: 'pointer' }}
              >
                <div className="hd-settings-item-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C8D89" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  <div>
                    <p className="hd-settings-item-label">Notifications</p>
                    <p className="hd-settings-item-desc">Reminders for habits, food & workouts</p>
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
          )
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Developer Time Machine Panel (Visible in DEV mode only) */}
      {import.meta.env.DEV && <DevTimeMachine />}
      </div>
    </ErrorBoundary>
  );
};

export default App;
