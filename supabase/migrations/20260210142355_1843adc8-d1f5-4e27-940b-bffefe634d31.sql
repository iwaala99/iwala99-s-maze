
-- Remove the recursive co-participants policy  
DROP POLICY IF EXISTS "Users can view co-participants" ON public.conversation_participants;

-- The "Users can view participants of their conversations" policy with user_id = auth.uid()
-- is enough for the user's own rows. For seeing OTHER participants in shared conversations,
-- we need a security definer function to avoid recursion.

CREATE OR REPLACE FUNCTION public.get_user_conversation_ids(p_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = 'public'
AS $$
  SELECT conversation_id FROM conversation_participants WHERE user_id = p_user_id;
$$;

-- Now create a non-recursive policy using the function
CREATE POLICY "Users can view co-participants"
ON public.conversation_participants
FOR SELECT
USING (
  conversation_id IN (SELECT public.get_user_conversation_ids(auth.uid()))
);
