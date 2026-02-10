
-- Fix leaderboard view to not use security_invoker so all users can see rankings
DROP VIEW IF EXISTS public.leaderboard_public;

CREATE VIEW public.leaderboard_public
WITH (security_invoker = false) AS
SELECT 
  p.id AS user_id,
  p.username,
  (COALESCE(sum(c.points), 0)::bigint)::integer AS total_points,
  (count(s.id))::integer AS solved_count
FROM profiles p
LEFT JOIN ctf_submissions s ON s.user_id = p.id
LEFT JOIN ctf_challenges c ON c.id = s.challenge_id
GROUP BY p.id, p.username
ORDER BY (COALESCE(sum(c.points), 0)::bigint)::integer DESC
LIMIT 100;

GRANT SELECT ON public.leaderboard_public TO authenticated;
GRANT SELECT ON public.leaderboard_public TO anon;
