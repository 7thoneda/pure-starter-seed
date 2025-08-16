-- Fix security warnings: Update functions to set search_path securely
-- This addresses the Function Search Path Mutable warnings

-- Update increment_user_coins function
CREATE OR REPLACE FUNCTION public.increment_user_coins(user_id uuid, amount integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_coins (user_id, balance, lifetime_earned)
  VALUES (user_id, amount, amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    balance = user_coins.balance + amount,
    lifetime_earned = user_coins.lifetime_earned + amount,
    updated_at = now();
END;
$function$;

-- Update generate_referral_code function
CREATE OR REPLACE FUNCTION public.generate_referral_code()
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$function$;

-- Update grant_referral_premium function
CREATE OR REPLACE FUNCTION public.grant_referral_premium(referrer_uuid uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.premium_subscriptions (user_id, expires_at, granted_by)
  VALUES (referrer_uuid, NOW() + INTERVAL '24 hours', 'referral');
END;
$function$;

-- Update get_login_streak function
CREATE OR REPLACE FUNCTION public.get_login_streak(user_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  streak INTEGER := 1;
  check_date DATE;
BEGIN
  -- Get the most recent claim date
  SELECT claim_date INTO check_date
  FROM public.daily_rewards
  WHERE daily_rewards.user_id = get_login_streak.user_id
  ORDER BY claim_date DESC
  LIMIT 1;
  
  -- If no previous claims, return 1
  IF check_date IS NULL THEN
    RETURN 1;
  END IF;
  
  -- Check if claim was yesterday (streak continues)
  IF check_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Get the streak from the last claim
    SELECT login_streak + 1 INTO streak
    FROM public.daily_rewards
    WHERE daily_rewards.user_id = get_login_streak.user_id
    AND claim_date = check_date;
  ELSE
    -- Streak broken, reset to 1
    streak := 1;
  END IF;
  
  RETURN streak;
END;
$function$;