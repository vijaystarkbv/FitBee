-- Migration: Add streak freeze support to public.profiles
-- Supports tracking freeze inventory, used frozen dates, and milestones awarded

alter table public.profiles
  add column if not exists streak_freeze_count integer default 0,
  add column if not exists frozen_dates text[] default '{}',
  add column if not exists streak_milestones_awarded integer default 0;

comment on column public.profiles.streak_freeze_count is 'Number of available streak freezes earned by milestones (1 per 25 days)';
comment on column public.profiles.frozen_dates is 'Array of YYYY-MM-DD date strings where a streak freeze was consumed';
comment on column public.profiles.streak_milestones_awarded is 'Number of 25-day streak milestone freeze rewards granted so far';
