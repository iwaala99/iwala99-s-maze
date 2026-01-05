-- Create CTF challenges table
CREATE TABLE public.ctf_challenges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'misc',
  difficulty TEXT NOT NULL DEFAULT 'easy',
  points INTEGER NOT NULL DEFAULT 100,
  flag_hash TEXT NOT NULL,
  hints TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES public.profiles(id),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CTF submissions table (tracks who solved what)
CREATE TABLE public.ctf_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID NOT NULL REFERENCES public.ctf_challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  solved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

-- Enable RLS
ALTER TABLE public.ctf_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ctf_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenges (public read, admin create)
CREATE POLICY "Anyone can view active challenges"
ON public.ctf_challenges
FOR SELECT
USING (is_active = true);

CREATE POLICY "Authenticated users can create challenges"
ON public.ctf_challenges
FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Creators can update their challenges"
ON public.ctf_challenges
FOR UPDATE
USING (auth.uid() = created_by);

-- RLS policies for submissions
CREATE POLICY "Users can view all submissions"
ON public.ctf_submissions
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can submit solutions"
ON public.ctf_submissions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at on challenges
CREATE TRIGGER update_ctf_challenges_updated_at
BEFORE UPDATE ON public.ctf_challenges
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for submissions (for live leaderboard)
ALTER PUBLICATION supabase_realtime ADD TABLE public.ctf_submissions;