-- ============================================================================
-- FitBee Notification System Migration
-- Migration: 20260908_notification_system.sql
-- ============================================================================

-- 1. Extend user_settings with notification category preferences & timezone
ALTER TABLE public.user_settings
  ADD COLUMN IF NOT EXISTS habit_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS food_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS workout_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS timezone TEXT NOT NULL DEFAULT 'UTC';

-- 2. Create push_subscriptions table for multi-device push endpoints
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  device_type TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on push_subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own push subscriptions" ON public.push_subscriptions;
CREATE POLICY "Users can manage own push subscriptions"
  ON public.push_subscriptions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_push_subs_user_id ON public.push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_push_subs_active ON public.push_subscriptions(is_active) WHERE is_active = true;

-- 3. Create notification_logs table for tracking, idempotency, and daily limit enforcement
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  local_date TEXT NOT NULL, -- Format: YYYY-MM-DD
  slot_time TEXT NOT NULL,  -- Format: '08:00', '12:00', '15:00', '19:00', '22:00'
  notification_state TEXT NOT NULL, -- HABIT, FOOD, WORKOUT, HABIT_FOOD, etc.
  intensity TEXT NOT NULL, -- CALM, NUDGE, CHAOS
  message_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  delivered_devices_count INT NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_date_slot UNIQUE (user_id, local_date, slot_time)
);

-- Enable RLS on notification_logs
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own notification logs" ON public.notification_logs;
CREATE POLICY "Users can view own notification logs"
  ON public.notification_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notification_logs_user_date ON public.notification_logs(user_id, local_date);

-- 4. Atomic PostgreSQL Function to enforce hard cap of 5/day and slot uniqueness
CREATE OR REPLACE FUNCTION public.check_and_record_notification(
  p_user_id UUID,
  p_local_date TEXT,
  p_slot_time TEXT,
  p_notification_state TEXT,
  p_intensity TEXT,
  p_message_id TEXT,
  p_title TEXT,
  p_body TEXT,
  p_delivered_devices INT,
  p_metadata JSONB DEFAULT '{}'::jsonb
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INT;
  v_existing_id UUID;
  v_new_id UUID;
BEGIN
  -- 1. Check if notification was already sent for this specific slot today
  SELECT id INTO v_existing_id
  FROM public.notification_logs
  WHERE user_id = p_user_id
    AND local_date = p_local_date
    AND slot_time = p_slot_time;

  IF v_existing_id IS NOT NULL THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'already_sent_for_slot',
      'existing_log_id', v_existing_id
    );
  END IF;

  -- 2. Check daily global limit (hard maximum 5 per account per local calendar day)
  SELECT COUNT(*) INTO v_count
  FROM public.notification_logs
  WHERE user_id = p_user_id
    AND local_date = p_local_date;

  IF v_count >= 5 THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'daily_limit_reached',
      'count', v_count
    );
  END IF;

  -- 3. Record the notification delivery
  INSERT INTO public.notification_logs (
    user_id,
    local_date,
    slot_time,
    notification_state,
    intensity,
    message_id,
    title,
    body,
    delivered_devices_count,
    metadata
  ) VALUES (
    p_user_id,
    p_local_date,
    p_slot_time,
    p_notification_state,
    p_intensity,
    p_message_id,
    p_title,
    p_body,
    p_delivered_devices,
    p_metadata
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'allowed', true,
    'log_id', v_new_id,
    'count', v_count + 1
  );
END;
$$;

-- Grant execution to authenticated, anon, and service_role
GRANT EXECUTE ON FUNCTION public.check_and_record_notification(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, INT, JSONB) TO authenticated, anon, service_role;

