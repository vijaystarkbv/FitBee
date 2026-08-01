import React, { useState, useEffect } from 'react';
import { supabase } from './services/supabaseClient';
import { Navbar } from './components/common/Navbar';
import { LoginForm } from './components/Auth/LoginForm';
import { OnboardingWizard } from './components/Onboarding/OnboardingWizard';
import { Dashboard } from './components/Dashboard/Dashboard';
import { NutritionCard } from './components/Nutrition/NutritionCard';
import { MealInput } from './components/Nutrition/MealInput';
import { WorkoutCard } from './components/Workout/WorkoutCard';
import { WorkoutHistoryView } from './components/Workout/WorkoutHistoryView';
import { ProgressionCard } from './components/Workout/ProgressionCard';
import { ProfileSettings } from './components/Profile/ProfileSettings';
import { Profile, NutritionLog, WeightLog, UserWorkout, UserWorkoutExercise, WorkoutLog } from './types/database.types';
import { getOrCreateTodayNutritionLog, saveMealEntry } from './services/nutritionService';
import { logWorkoutSession } from './services/workoutService';
import { getUserWeightHistory, logUserWeight } from './services/weightService';

export const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'nutrition' | 'profile'>('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Application Data States
  const [profile, setProfile] = useState<Profile | null>(null);
  const [todayNutrition, setTodayNutrition] = useState<NutritionLog | null>(null);
  const [userWorkout, setUserWorkout] = useState<UserWorkout | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<UserWorkoutExercise[]>([]);
  const [workoutHistoryLogs, setWorkoutHistoryLogs] = useState<WorkoutLog[]>([]);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);

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
      // 1. Fetch Profile
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      setProfile(prof);

      if (prof && prof.onboarding_completed) {
        // 2. Fetch Today Nutrition
        const nutLog = await getOrCreateTodayNutritionLog(userId);
        setTodayNutrition(nutLog);

        // 3. Fetch User Workout Routine
        await refreshUserWorkout(userId);

        // 4. Fetch Workout Logs History
        const { data: pastLogs } = await supabase
          .from('workout_logs')
          .select('*, workout_log_sets(*, exercises(*))')
          .eq('user_id', userId)
          .order('logged_at', { ascending: false });

        setWorkoutHistoryLogs(pastLogs || []);

        // 5. Fetch Weight Logs
        const weights = await getUserWeightHistory(userId);
        setWeightLogs(weights);
      }
    } catch (err) {
      console.error('Fetch User Data Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserWorkout = async (userId: string) => {
    const { data: uWorkout } = await supabase
      .from('user_workouts')
      .select('*, user_workout_exercises(*, exercises(*))')
      .eq('user_id', userId)
      .maybeSingle();

    if (uWorkout) {
      setUserWorkout(uWorkout);
      setWorkoutExercises(uWorkout.user_workout_exercises || []);
    }
  };

  const handleSaveMeal = async (
    rawText: string,
    foods: any[],
    totals: { calories: number; protein: number; carbs: number; fat: number }
  ) => {
    if (!session) return;
    const log = todayNutrition || (await getOrCreateTodayNutritionLog(session.user.id));
    await saveMealEntry(log.id, rawText, foods, totals);
    // Refresh nutrition log
    const updated = await getOrCreateTodayNutritionLog(session.user.id);
    setTodayNutrition(updated);
  };

  const handleSaveWorkout = async (notes: string, completedSets: any[]) => {
    if (!session || !userWorkout) return;
    await logWorkoutSession(session.user.id, userWorkout.id, notes, completedSets);
    // Refresh workout history
    fetchUserData(session.user.id);
  };

  const handleLogNewWeight = async (weightKg: number) => {
    if (!session) return;
    await logUserWeight(session.user.id, weightKg);
    const updatedWeights = await getUserWeightHistory(session.user.id);
    setWeightLogs(updatedWeights);
    if (profile) setProfile({ ...profile, weight_kg: weightKg });
  };

  /* ── Skip onboarding: redirect to home with incomplete profile ── */
  const handleSkipOnboarding = () => {
    setShowOnboarding(false);
    // Re-fetch to get the newly-created minimal profile
    if (session) fetchUserData(session.user.id);
  };

  /* ── Open onboarding from banner ── */
  const handleResumeOnboarding = () => {
    setShowOnboarding(true);
  };

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

  // 1. Not Authenticated
  if (!session) {
    return <LoginForm onSuccess={() => fetchUserData(session?.user?.id)} />;
  }

  // 2. Show onboarding (first time or resumed from banner)
  if (!profile || showOnboarding || !profile.onboarding_completed) {
    // If user previously skipped and explicitly clicked "Complete onboarding", or first-time user
    if (!profile || !profile.onboarding_completed || showOnboarding) {
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
  }

  // 3. Authenticated & Onboarding Complete -> Main Application
  return (
    <div className="min-h-screen pb-12 bg-zinc-950 text-zinc-100">
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        userEmail={session.user.email}
        onSignOut={() => supabase.auth.signOut()}
      />

      <main className="pt-4">
        {activeTab === 'dashboard' && (
          <Dashboard
            profile={profile}
            todayNutrition={todayNutrition}
            userWorkout={userWorkout}
            exerciseCount={workoutExercises.length}
            weightLogs={weightLogs}
            onOpenNutritionTab={() => setActiveTab('nutrition')}
            onOpenWorkoutTab={() => setActiveTab('workout')}
            onLogNewWeight={handleLogNewWeight}
            onResumeOnboarding={!profile.onboarding_completed ? handleResumeOnboarding : undefined}
          />
        )}

        {activeTab === 'nutrition' && (
          <div className="max-w-3xl mx-auto space-y-6 px-4 py-4">
            <h2 className="text-xl font-bold text-zinc-100">Nutrition Tracker</h2>
            <NutritionCard
              currentCalories={todayNutrition?.total_calories || 0}
              targetCalories={profile.target_calories || 2000}
              currentProtein={todayNutrition?.total_protein || 0}
              targetProtein={profile.target_protein || 120}
              currentCarbs={todayNutrition?.total_carbs || 0}
              targetCarbs={profile.target_carbs || 250}
              currentFat={todayNutrition?.total_fat || 0}
              targetFat={profile.target_fat || 55}
            />
            <div className="card-surface">
              <MealInput onSaveMeal={handleSaveMeal} />
            </div>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="max-w-3xl mx-auto space-y-6 px-4 py-4">
            <h2 className="text-xl font-bold text-zinc-100">Workout Routine & Logging</h2>
            {userWorkout && (
              <WorkoutCard
                workout={userWorkout}
                exercises={workoutExercises}
                onSaveWorkout={handleSaveWorkout}
                onRefreshWorkout={() => refreshUserWorkout(session.user.id)}
              />
            )}
            <ProgressionCard exercises={workoutExercises} userId={session.user.id} />
            <WorkoutHistoryView logs={workoutHistoryLogs} />
          </div>
        )}

        {activeTab === 'profile' && (
          <ProfileSettings
            profile={profile}
            userEmail={session.user.email}
            onProfileUpdated={() => fetchUserData(session.user.id)}
            onSignOut={() => supabase.auth.signOut()}
          />
        )}
      </main>
    </div>
  );
};

export default App;
