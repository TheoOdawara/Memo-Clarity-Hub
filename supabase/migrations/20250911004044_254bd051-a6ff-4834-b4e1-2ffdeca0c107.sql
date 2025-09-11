-- Remove the overly permissive policy that allows anyone to view all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Keep the secure policy that only allows users to view their own profiles
-- This policy already exists: "Select own profile" with expression (auth.uid() = user_id)

-- Add a comment to document the security decision
COMMENT ON TABLE public.profiles IS 'User profiles table - users can only view their own profile for privacy and security';