-- Security enhancement: Restrict virtual gifts access to authenticated users only
-- This prevents unauthorized users from scraping monetization strategy

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Virtual gifts are viewable by everyone" ON public.virtual_gifts;

-- Create new policy that requires authentication
CREATE POLICY "Authenticated users can view virtual gifts" 
ON public.virtual_gifts 
FOR SELECT 
TO authenticated
USING (true);

-- Add comment for documentation
COMMENT ON POLICY "Authenticated users can view virtual gifts" ON public.virtual_gifts IS 
'Restricts virtual gifts access to authenticated users only to protect monetization strategy from unauthorized scraping.';