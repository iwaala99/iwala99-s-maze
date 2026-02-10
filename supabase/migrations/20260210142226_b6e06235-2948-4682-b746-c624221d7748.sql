
-- Fix: Allow users to insert their own roles via the assign_user_role function
-- The function is SECURITY DEFINER so it bypasses RLS, but direct inserts also need a policy
CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Fix: conversation_participants recursive RLS policy
-- The existing SELECT policy references itself causing infinite recursion
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;

CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants
FOR SELECT
USING (user_id = auth.uid() OR conversation_id IN (
  SELECT conversation_id FROM public.conversation_participants WHERE user_id = auth.uid()
));
