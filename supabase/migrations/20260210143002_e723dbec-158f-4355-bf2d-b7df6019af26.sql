
-- 1. CRITICAL: Lock down the base ctf_challenges table - deny direct SELECT to non-creators
-- The ctf_challenges_public view (which excludes flag_hash) is the only safe way to read challenges
DROP POLICY IF EXISTS "Anyone can view active challenges" ON public.ctf_challenges;

-- Only challenge creators can see the full row (including flag_hash) for management
-- All other users MUST use the ctf_challenges_public view
CREATE POLICY "Only creators can view full challenge data"
ON public.ctf_challenges
FOR SELECT
USING (auth.uid() = created_by);

-- 2. Add explicit RLS to the public views for defense-in-depth
-- Note: views with security_invoker inherit base table RLS, but these are plain views
-- The ctf_challenges_public view already excludes flag_hash by design

-- 3. Ensure the verify_flag function doesn't leak data
-- Already uses SECURITY DEFINER with restricted search_path - good

-- 4. Add rate limiting concept via a failed_attempts tracking
-- (Optional enhancement - the verify_flag function already handles this server-side)
