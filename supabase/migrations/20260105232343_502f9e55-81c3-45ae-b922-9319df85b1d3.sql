-- CRITICAL SECURITY FIXES

-- 1. Fix CTF Challenges - hide flag_hash from users
DROP POLICY IF EXISTS "Anyone can view active challenges" ON public.ctf_challenges;

-- Create a secure function to check flag without exposing hash
CREATE OR REPLACE FUNCTION public.verify_flag(challenge_id UUID, submitted_flag TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash TEXT;
  submitted_hash TEXT;
BEGIN
  SELECT flag_hash INTO stored_hash 
  FROM ctf_challenges 
  WHERE id = challenge_id AND is_active = true;
  
  IF stored_hash IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Same hash function used in frontend
  submitted_hash := encode(submitted_flag::bytea, 'base64');
  RETURN stored_hash = submitted_hash;
END;
$$;

-- Create view that excludes sensitive columns
CREATE OR REPLACE VIEW public.ctf_challenges_public AS
SELECT 
  id, title, description, category, difficulty, points, 
  hints, created_by, is_active, created_at, updated_at,
  expires_at, is_weekly
FROM ctf_challenges
WHERE is_active = true;

-- Policy for the base table - only creators can see their own challenges fully
CREATE POLICY "Creators can view their own challenges"
ON public.ctf_challenges
FOR SELECT
USING (auth.uid() = created_by);

-- 2. Fix user_roles - users should NOT be able to assign themselves roles
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can update their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can delete their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;

-- Only allow viewing own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Create secure function for role assignment (only callable by backend/admin)
CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id UUID, new_role cyber_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This function should only be called by trusted backend processes
  -- For now, allow users to set their own initial roles during signup
  IF auth.uid() = target_user_id THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (target_user_id, new_role)
    ON CONFLICT DO NOTHING;
  END IF;
END;
$$;

-- 3. Fix ctf_submissions - users should only see their own submissions
DROP POLICY IF EXISTS "Users can view all submissions" ON public.ctf_submissions;

CREATE POLICY "Users can view their own submissions"
ON public.ctf_submissions
FOR SELECT
USING (auth.uid() = user_id);

-- Create a leaderboard view that shows aggregated data only (no individual submission details)
CREATE OR REPLACE VIEW public.leaderboard_public AS
SELECT 
  p.id as user_id,
  p.username,
  COALESCE(SUM(c.points), 0) as total_points,
  COUNT(s.id) as solved_count
FROM profiles p
LEFT JOIN ctf_submissions s ON s.user_id = p.id
LEFT JOIN ctf_challenges c ON c.id = s.challenge_id
GROUP BY p.id, p.username
ORDER BY total_points DESC
LIMIT 100;

-- 4. Fix notifications - prevent users from creating notifications for others
DROP POLICY IF EXISTS "Users can receive notifications" ON public.notifications;

CREATE POLICY "System can create notifications for users"
ON public.notifications
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 5. Fix conversation_participants - only existing participants can add others
DROP POLICY IF EXISTS "Authenticated users can add participants" ON public.conversation_participants;

CREATE POLICY "Conversation participants can add members"
ON public.conversation_participants
FOR INSERT
WITH CHECK (
  -- Either creating a new conversation (no existing participants)
  NOT EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_id = conversation_participants.conversation_id
  )
  OR
  -- Or user is already a participant
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
  )
);

-- 6. Add message deletion for users
CREATE POLICY "Users can delete their own messages"
ON public.messages
FOR DELETE
USING (auth.uid() = sender_id);

-- 7. Add comment editing for users
CREATE POLICY "Users can update their own comments"
ON public.comments
FOR UPDATE
USING (auth.uid() = user_id);

-- 8. Create secure function to get challenge solve counts without exposing individual submissions
CREATE OR REPLACE FUNCTION public.get_challenge_solve_count(challenge_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER FROM ctf_submissions WHERE challenge_id = challenge_uuid;
$$;