-- Fix critical security vulnerability: RLS policies with 'true' conditions
-- This migration updates overly permissive RLS policies to properly restrict data access

-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Users can insert own entries" ON public.diary_entries;
DROP POLICY IF EXISTS "Users can read own entries" ON public.diary_entries;
DROP POLICY IF EXISTS "Users can update own entries" ON public.diary_entries;

DROP POLICY IF EXISTS "Users can insert own analytics" ON public.mood_analytics;
DROP POLICY IF EXISTS "Users can read own analytics" ON public.mood_analytics;

DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;

-- Create secure RLS policies for diary_entries
-- Note: These tables use bigint user_id, so we need to handle the auth mapping properly
CREATE POLICY "Users can insert their own diary entries" 
ON public.diary_entries 
FOR INSERT 
WITH CHECK (
  -- Allow insert only if user_id matches the authenticated user's ID
  -- Since this uses bigint user_id, we'll need proper mapping
  user_id::text = (auth.uid())::text OR 
  -- Fallback: allow if user_id matches a user record they own
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = diary_entries.user_id 
    AND users.id::text = (auth.uid())::text
  )
);

CREATE POLICY "Users can read their own diary entries" 
ON public.diary_entries 
FOR SELECT 
USING (
  user_id::text = (auth.uid())::text OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = diary_entries.user_id 
    AND users.id::text = (auth.uid())::text
  )
);

CREATE POLICY "Users can update their own diary entries" 
ON public.diary_entries 
FOR UPDATE 
USING (
  user_id::text = (auth.uid())::text OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = diary_entries.user_id 
    AND users.id::text = (auth.uid())::text
  )
);

-- Create secure RLS policies for mood_analytics
CREATE POLICY "Users can insert their own mood analytics" 
ON public.mood_analytics 
FOR INSERT 
WITH CHECK (
  user_id::text = (auth.uid())::text OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = mood_analytics.user_id 
    AND users.id::text = (auth.uid())::text
  )
);

CREATE POLICY "Users can read their own mood analytics" 
ON public.mood_analytics 
FOR SELECT 
USING (
  user_id::text = (auth.uid())::text OR
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = mood_analytics.user_id 
    AND users.id::text = (auth.uid())::text
  )
);

-- Create secure RLS policies for users table
-- This table appears to store additional user data beyond auth.users
CREATE POLICY "Users can insert their own user data" 
ON public.users 
FOR INSERT 
WITH CHECK (id::text = (auth.uid())::text);

CREATE POLICY "Users can read their own user data" 
ON public.users 
FOR SELECT 
USING (id::text = (auth.uid())::text);

CREATE POLICY "Users can update their own user data" 
ON public.users 
FOR UPDATE 
USING (id::text = (auth.uid())::text);

-- Add comments for documentation
COMMENT ON POLICY "Users can read their own diary entries" ON public.diary_entries IS 
'Restricts diary entry access to the owner only. Fixed from overly permissive true condition.';

COMMENT ON POLICY "Users can read their own mood analytics" ON public.mood_analytics IS 
'Restricts mood analytics access to the owner only. Fixed from overly permissive true condition.';

COMMENT ON POLICY "Users can read their own user data" ON public.users IS 
'Restricts user data access to the owner only. Fixed from overly permissive true condition.';