-- Fix remaining function security warnings
-- Update update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Update get_mutual_friends function
CREATE OR REPLACE FUNCTION public.get_mutual_friends(user1_id uuid, user2_id uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE
 SET search_path TO 'public'
AS $function$
  SELECT COUNT(*)::INTEGER
  FROM public.friends f1
  JOIN public.friends f2 ON f1.friend_id = f2.friend_id
  WHERE f1.user_id = user1_id 
    AND f2.user_id = user2_id 
    AND f1.status = 'accepted' 
    AND f2.status = 'accepted';
$function$;