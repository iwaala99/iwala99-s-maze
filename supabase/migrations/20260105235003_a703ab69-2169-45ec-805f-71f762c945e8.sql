-- Drop and recreate the public view with proper access
DROP VIEW IF EXISTS public.ctf_challenges_public;

CREATE VIEW public.ctf_challenges_public AS
SELECT 
  id,
  title,
  description,
  category,
  difficulty,
  points,
  hints,
  is_weekly,
  expires_at,
  created_at,
  updated_at,
  is_active,
  created_by
FROM public.ctf_challenges
WHERE is_active = true;

-- Grant SELECT access to everyone (including anonymous users)
GRANT SELECT ON public.ctf_challenges_public TO anon, authenticated;