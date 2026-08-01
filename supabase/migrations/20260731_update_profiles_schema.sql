-- Incremental Database Migration: Add display_name and target_weight_kg safely
-- Execute this script in your Supabase SQL Editor if initial migration has already run

-- 1. Safely add display_name column to public.profiles if not exists
alter table public.profiles 
  add column if not exists display_name text default null;

-- 2. Safely add target_weight_kg column to public.profiles if not exists
alter table public.profiles 
  add column if not exists target_weight_kg numeric(5,2) default null;

-- 3. Safely add notes column to public.workout_logs if not exists
alter table public.workout_logs 
  add column if not exists notes text default null;
