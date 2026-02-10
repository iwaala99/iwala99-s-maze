
-- Add message content length validation at DB level
CREATE OR REPLACE FUNCTION public.validate_message_content()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  IF length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Message must be less than 5000 characters';
  END IF;
  IF length(trim(NEW.content)) = 0 THEN
    RAISE EXCEPTION 'Message cannot be empty';
  END IF;
  -- Strip script tags
  NEW.content := regexp_replace(NEW.content, '<script[^>]*>.*?</script>', '', 'gi');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_message_before_insert ON public.messages;
CREATE TRIGGER validate_message_before_insert
BEFORE INSERT OR UPDATE ON public.messages
FOR EACH ROW
EXECUTE FUNCTION public.validate_message_content();
