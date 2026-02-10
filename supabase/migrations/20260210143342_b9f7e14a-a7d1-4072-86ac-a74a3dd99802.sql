
-- ============================================================
-- SECURITY HARDENING MIGRATION
-- ============================================================

-- 1. PROFILES: Require authentication to view (prevent anonymous scraping)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 2. POSTS: Require authentication to view
DROP POLICY IF EXISTS "Anyone can view posts" ON public.posts;
CREATE POLICY "Authenticated users can view posts"
ON public.posts FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 3. COMMENTS: Require authentication to view
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
CREATE POLICY "Authenticated users can view comments"
ON public.comments FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 4. POST_LIKES: Require authentication to view
DROP POLICY IF EXISTS "Anyone can view likes" ON public.post_likes;
CREATE POLICY "Authenticated users can view likes"
ON public.post_likes FOR SELECT
USING (auth.uid() IS NOT NULL);

-- 5. USER_ROLES: Remove dangerous self-assignment policy
-- Users should NOT be able to freely insert roles - only via the secure assign_user_role function
DROP POLICY IF EXISTS "Users can insert their own roles" ON public.user_roles;

-- 6. Update assign_user_role function to be the ONLY way to assign roles
-- It already uses SECURITY DEFINER, so it bypasses RLS safely
-- Restrict to only allow initial role assignment (no role exists yet)
CREATE OR REPLACE FUNCTION public.assign_user_role(target_user_id uuid, new_role cyber_role)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow users to set their OWN roles during signup
  IF auth.uid() = target_user_id THEN
    -- Only allow if user has no roles yet (prevents privilege escalation)
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = target_user_id) THEN
      INSERT INTO user_roles (user_id, role)
      VALUES (target_user_id, new_role)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
END;
$$;

-- 7. Add bio length validation trigger on profiles
CREATE OR REPLACE FUNCTION public.validate_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  -- Sanitize bio: limit length and strip potential script tags
  IF NEW.bio IS NOT NULL THEN
    IF length(NEW.bio) > 500 THEN
      RAISE EXCEPTION 'Bio must be less than 500 characters';
    END IF;
    -- Strip script tags at DB level as defense-in-depth
    NEW.bio := regexp_replace(NEW.bio, '<script[^>]*>.*?</script>', '', 'gi');
    NEW.bio := regexp_replace(NEW.bio, '<[^>]+>', '', 'g');
  END IF;
  
  -- Validate username
  IF NEW.username IS NOT NULL THEN
    IF length(NEW.username) > 30 THEN
      RAISE EXCEPTION 'Username must be less than 30 characters';
    END IF;
    IF NEW.username !~ '^[a-zA-Z0-9_]+$' THEN
      RAISE EXCEPTION 'Username can only contain letters, numbers, and underscores';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_profile_before_update ON public.profiles;
CREATE TRIGGER validate_profile_before_update
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.validate_profile_update();

-- 8. Add content validation trigger on posts
CREATE OR REPLACE FUNCTION public.validate_post_content()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF length(NEW.content) > 2000 THEN
    RAISE EXCEPTION 'Post content must be less than 2000 characters';
  END IF;
  -- Strip HTML tags as defense-in-depth
  NEW.content := regexp_replace(NEW.content, '<script[^>]*>.*?</script>', '', 'gi');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_post_before_insert ON public.posts;
CREATE TRIGGER validate_post_before_insert
BEFORE INSERT OR UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.validate_post_content();

-- 9. Add content validation trigger on comments
CREATE OR REPLACE FUNCTION public.validate_comment_content()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF length(NEW.content) > 500 THEN
    RAISE EXCEPTION 'Comment must be less than 500 characters';
  END IF;
  NEW.content := regexp_replace(NEW.content, '<script[^>]*>.*?</script>', '', 'gi');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_comment_before_insert ON public.comments;
CREATE TRIGGER validate_comment_before_insert
BEFORE INSERT OR UPDATE ON public.comments
FOR EACH ROW
EXECUTE FUNCTION public.validate_comment_content();
