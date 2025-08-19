-- Security fix: Resolve RLS policy self-reference in group_rooms table
-- This prevents potential infinite recursion issues

-- Create security definer function to get user group membership
CREATE OR REPLACE FUNCTION public.get_user_group_membership(check_user_id UUID, check_group_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.group_members 
    WHERE user_id = check_user_id 
    AND group_id = check_group_id 
    AND status = 'accepted'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop existing problematic policy
DROP POLICY IF EXISTS "Group members can view rooms" ON public.group_rooms;

-- Create new policy using the security definer function
CREATE POLICY "Group members can view rooms" 
ON public.group_rooms 
FOR SELECT 
USING (public.get_user_group_membership(auth.uid(), group_id));

-- Add comment for documentation
COMMENT ON FUNCTION public.get_user_group_membership(UUID, UUID) IS 
'Security definer function to check group membership without RLS self-reference issues.';