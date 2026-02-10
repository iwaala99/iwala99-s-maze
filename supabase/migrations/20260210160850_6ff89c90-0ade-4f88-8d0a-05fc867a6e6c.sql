
-- Recreate the public view WITHOUT security_invoker so all users can see challenges
-- This is safe because the view already excludes the flag_hash column
DROP VIEW IF EXISTS public.ctf_challenges_public;

CREATE VIEW public.ctf_challenges_public
WITH (security_invoker = false) AS
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

-- Grant SELECT on the view to authenticated and anon roles
GRANT SELECT ON public.ctf_challenges_public TO authenticated;
GRANT SELECT ON public.ctf_challenges_public TO anon;
