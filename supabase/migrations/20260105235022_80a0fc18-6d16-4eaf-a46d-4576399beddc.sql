-- Add policy to allow everyone to view active challenges (for the public view to work)
CREATE POLICY "Anyone can view active challenges"
ON public.ctf_challenges
FOR SELECT
USING (is_active = true);