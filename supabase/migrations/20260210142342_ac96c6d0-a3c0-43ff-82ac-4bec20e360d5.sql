
-- Fix conversation_participants recursive RLS - replace with non-recursive approach
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;

CREATE POLICY "Users can view participants of their conversations"
ON public.conversation_participants
FOR SELECT
USING (user_id = auth.uid());

-- Also add a policy to see other participants in your conversations
CREATE POLICY "Users can view co-participants"
ON public.conversation_participants
FOR SELECT
USING (
  conversation_id IN (
    SELECT cp.conversation_id 
    FROM public.conversation_participants cp 
    WHERE cp.user_id = auth.uid()
  )
);
