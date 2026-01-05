-- Ensure ctf_challenges base table is not directly accessible
-- Drop existing policy and create a more restrictive one
DROP POLICY IF EXISTS "Creators can view their own challenges" ON public.ctf_challenges;

-- Only allow authenticated users who created the challenge to view it fully
-- Everyone else should use the public view
CREATE POLICY "Only creators can access challenge details"
ON public.ctf_challenges
FOR SELECT
USING (auth.uid() = created_by);

-- Add UPDATE policy for creators
CREATE POLICY "Creators can update challenges"
ON public.ctf_challenges
FOR UPDATE
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Add DELETE policy for creators
CREATE POLICY "Creators can delete challenges"
ON public.ctf_challenges
FOR DELETE
USING (auth.uid() = created_by);

-- Add conversation management policies
CREATE POLICY "Participants can update conversations"
ON public.conversations
FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM conversation_participants
  WHERE conversation_id = conversations.id
  AND user_id = auth.uid()
));

CREATE POLICY "Participants can leave conversations"
ON public.conversation_participants
FOR DELETE
USING (user_id = auth.uid());