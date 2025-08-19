-- Fix search path security for existing functions
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  RETURN UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
END;
$$;

CREATE OR REPLACE FUNCTION public.grant_referral_premium(referrer_uuid UUID)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.premium_subscriptions (user_id, expires_at, granted_by)
  VALUES (referrer_uuid, NOW() + INTERVAL '24 hours', 'referral');
END;
$$;