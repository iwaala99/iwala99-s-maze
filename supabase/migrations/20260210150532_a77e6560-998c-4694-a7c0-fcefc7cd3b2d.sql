
-- Enable pgcrypto for SHA-256 hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update all existing flag_hash values from base64 to SHA-256
-- Step: decode base64 -> get original flag text -> SHA-256 hash it
UPDATE ctf_challenges
SET flag_hash = encode(digest(convert_from(decode(flag_hash, 'base64'), 'UTF8'), 'sha256'), 'hex');

-- Replace verify_flag function to use SHA-256
CREATE OR REPLACE FUNCTION public.verify_flag(challenge_id uuid, submitted_flag text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  
  -- Use SHA-256 cryptographic hashing
  submitted_hash := encode(digest(submitted_flag, 'sha256'), 'hex');
  RETURN stored_hash = submitted_hash;
END;
$function$;
