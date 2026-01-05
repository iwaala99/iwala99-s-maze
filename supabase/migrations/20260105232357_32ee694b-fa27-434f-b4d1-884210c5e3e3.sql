-- Fix security definer views by making them SECURITY INVOKER (default)
-- Drop and recreate views without security definer

DROP VIEW IF EXISTS public.ctf_challenges_public;
DROP VIEW IF EXISTS public.leaderboard_public;

-- Recreate ctf_challenges_public as a regular view (SECURITY INVOKER is default)
CREATE VIEW public.ctf_challenges_public 
WITH (security_invoker = true)
AS
SELECT 
  id, title, description, category, difficulty, points, 
  hints, created_by, is_active, created_at, updated_at,
  expires_at, is_weekly
FROM ctf_challenges
WHERE is_active = true
AND (expires_at IS NULL OR expires_at > now());

-- Recreate leaderboard_public as a regular view
CREATE VIEW public.leaderboard_public 
WITH (security_invoker = true)
AS
SELECT 
  p.id as user_id,
  p.username,
  COALESCE(SUM(c.points), 0)::INTEGER as total_points,
  COUNT(s.id)::INTEGER as solved_count
FROM profiles p
LEFT JOIN ctf_submissions s ON s.user_id = p.id
LEFT JOIN ctf_challenges c ON c.id = s.challenge_id
GROUP BY p.id, p.username
ORDER BY total_points DESC
LIMIT 100;

-- Grant SELECT on views to authenticated users
GRANT SELECT ON public.ctf_challenges_public TO authenticated;
GRANT SELECT ON public.leaderboard_public TO authenticated;
GRANT SELECT ON public.ctf_challenges_public TO anon;
GRANT SELECT ON public.leaderboard_public TO anon;