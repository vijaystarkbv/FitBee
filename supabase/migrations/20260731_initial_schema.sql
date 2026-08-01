-- FitBee Database Schema Migration (Version 3)
-- Execute this SQL in your Supabase SQL Editor

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- 2. Profiles Table (Stores core user biometrics, targets, and unit preferences)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  display_name text default null,
  age integer not null check (age > 0),
  gender text not null check (gender in ('male', 'female', 'other')),
  height_cm numeric(5,2) not null check (height_cm > 0),
  weight_kg numeric(5,2) not null check (weight_kg > 0),
  target_weight_kg numeric(5,2) default null,
  goal text not null check (goal in ('gain_weight', 'lose_weight')),
  activity_level text not null check (activity_level in ('sedentary', 'light', 'moderate', 'active')),
  training_location text not null check (training_location in ('home', 'gym')),
  has_dumbbells boolean default false,
  max_dumbbell_weight_kg numeric(5,2) default null,
  target_calories integer not null,
  target_protein integer not null,
  target_carbs integer not null,
  target_fat integer not null,
  height_unit text default 'cm' check (height_unit in ('cm', 'ft')),
  weight_unit text default 'kg' check (weight_unit in ('kg', 'lbs')),
  onboarding_completed boolean default false
);

-- 3. Dedicated User Settings (Architecture Preparation for Future Expansion)
create table if not exists public.user_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  theme text default 'dark' check (theme in ('dark', 'light', 'system')),
  notifications_enabled boolean default false,
  language text default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Weight History Tracking Table
create table if not exists public.weight_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  logged_at timestamp with time zone default timezone('utc'::text, now()) not null,
  weight_kg numeric(5,2) not null check (weight_kg > 0)
);

-- 5. Exercises Library
create table if not exists public.exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  category text not null check (category in ('chest', 'back', 'legs', 'shoulders', 'arms', 'core')),
  equipment_required text not null check (equipment_required in ('none', 'dumbbell', 'gym_machine', 'barbell')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Master Workout Templates
create table if not exists public.workout_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location_type text not null check (location_type in ('home', 'gym')),
  requires_dumbbells boolean default false,
  description text
);

create table if not exists public.template_exercises (
  id uuid default gen_random_uuid() primary key,
  template_id uuid references public.workout_templates(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  order_index integer not null,
  default_sets integer default 3,
  default_reps integer default 10
);

-- 7. Personalized User Workouts
create table if not exists public.user_workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.user_workout_exercises (
  id uuid default gen_random_uuid() primary key,
  user_workout_id uuid references public.user_workouts(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  order_index integer not null,
  target_sets integer default 3,
  target_reps integer default 12,
  target_weight_kg numeric(5,2) default 0
);

-- 8. Workout Logs & Exercise Notes
create table if not exists public.workout_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  user_workout_id uuid references public.user_workouts(id) on delete set null,
  logged_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text default null
);

create table if not exists public.workout_log_sets (
  id uuid default gen_random_uuid() primary key,
  workout_log_id uuid references public.workout_logs(id) on delete cascade not null,
  exercise_id uuid references public.exercises(id) on delete cascade not null,
  set_number integer not null,
  reps_completed integer not null check (reps_completed >= 0),
  weight_kg numeric(5,2) not null check (weight_kg >= 0)
);

-- 9. Daily Nutrition Logs & Meal Entries
create table if not exists public.nutrition_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null default CURRENT_DATE,
  total_calories integer default 0,
  total_protein integer default 0,
  total_carbs integer default 0,
  total_fat integer default 0,
  unique(user_id, date)
);

create table if not exists public.meal_entries (
  id uuid default gen_random_uuid() primary key,
  nutrition_log_id uuid references public.nutrition_logs(id) on delete cascade not null,
  raw_text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  calories integer not null,
  protein integer not null,
  carbs integer not null,
  fat integer not null,
  parsed_breakdown jsonb not null
);

-- 10. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.weight_logs enable row level security;
alter table public.user_workouts enable row level security;
alter table public.user_workout_exercises enable row level security;
alter table public.workout_logs enable row level security;
alter table public.workout_log_sets enable row level security;
alter table public.nutrition_logs enable row level security;
alter table public.meal_entries enable row level security;

-- 11. Create Security Policies (Authenticated Users access their own rows)
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

create policy "Users can view own weight logs" on public.weight_logs for select using (auth.uid() = user_id);
create policy "Users can insert own weight logs" on public.weight_logs for insert with check (auth.uid() = user_id);

create policy "Users can view own user_workouts" on public.user_workouts for select using (auth.uid() = user_id);
create policy "Users can insert own user_workouts" on public.user_workouts for insert with check (auth.uid() = user_id);

create policy "Users can view own workout logs" on public.workout_logs for select using (auth.uid() = user_id);
create policy "Users can insert own workout logs" on public.workout_logs for insert with check (auth.uid() = user_id);

create policy "Users can view own nutrition logs" on public.nutrition_logs for select using (auth.uid() = user_id);
create policy "Users can insert/update own nutrition logs" on public.nutrition_logs for all using (auth.uid() = user_id);

create policy "Users can view exercises" on public.exercises for select using (true);
create policy "Users can view workout templates" on public.workout_templates for select using (true);
create policy "Users can view template exercises" on public.template_exercises for select using (true);

-- 12. Seed Master Exercise Library
insert into public.exercises (name, category, equipment_required) values
  ('Push-ups', 'chest', 'none'),
  ('Bodyweight Squats', 'legs', 'none'),
  ('Lunges', 'legs', 'none'),
  ('Plank', 'core', 'none'),
  ('Dumbbell Floor Press', 'chest', 'dumbbell'),
  ('Dumbbell Bicep Curl', 'arms', 'dumbbell'),
  ('Dumbbell Goblet Squat', 'legs', 'dumbbell'),
  ('Dumbbell Shoulder Press', 'shoulders', 'dumbbell'),
  ('Dumbbell Bent-over Row', 'back', 'dumbbell'),
  ('Lat Pulldown', 'back', 'gym_machine'),
  ('Leg Press', 'legs', 'gym_machine'),
  ('Barbell Bench Press', 'chest', 'barbell'),
  ('Barbell Deadlift', 'back', 'barbell'),
  ('Barbell Squat', 'legs', 'barbell')
on conflict (name) do nothing;
