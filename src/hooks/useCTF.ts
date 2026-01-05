import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface CTFChallenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  points: number;
  hints: string[];
  created_by: string | null;
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
  is_weekly: boolean;
  solved_count?: number;
  is_solved?: boolean;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  total_points: number;
  solved_count: number;
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<CTFChallenge[]>([]);
  const [bossPuzzle, setBossPuzzle] = useState<CTFChallenge | null>(null);
  const [hasUnlockedBoss, setHasUnlockedBoss] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchChallenges = async () => {
    setLoading(true);
    
    // Fetch challenges from public view (excludes flag_hash for security)
    const { data: challengesData, error } = await supabase
      .from('ctf_challenges_public')
      .select('*')
      .order('points', { ascending: true });

    if (error) {
      console.error('Error fetching challenges:', error);
      setLoading(false);
      return;
    }

    // Separate boss puzzle from regular challenges
    const regularChallenges = challengesData?.filter(c => c.difficulty !== 'boss') || [];
    const boss = challengesData?.find(c => c.difficulty === 'boss') || null;

    // Fetch user's solved challenges if logged in
    let userSolvedIds: string[] = [];
    if (user) {
      const { data: userSolved } = await supabase
        .from('ctf_submissions')
        .select('challenge_id')
        .eq('user_id', user.id);
      
      userSolvedIds = userSolved?.map(s => s.challenge_id) || [];
    }

    // Get solve counts using secure function
    const enrichedChallenges = await Promise.all(
      regularChallenges.map(async (c) => {
        const { data: countData } = await supabase
          .rpc('get_challenge_solve_count', { challenge_uuid: c.id });
        
        return {
          ...c,
          hints: c.hints || [],
          solved_count: countData || 0,
          is_solved: userSolvedIds.includes(c.id)
        };
      })
    );

    // Check if user has completed all insane challenges
    const insaneChallenges = enrichedChallenges.filter(c => c.difficulty === 'insane');
    const allInsaneSolved = insaneChallenges.length > 0 && 
      insaneChallenges.every(c => c.is_solved);
    
    setHasUnlockedBoss(allInsaneSolved);

    // Enrich boss puzzle if it exists
    if (boss) {
      const { data: bossCount } = await supabase
        .rpc('get_challenge_solve_count', { challenge_uuid: boss.id });
      
      setBossPuzzle({
        ...boss,
        hints: boss.hints || [],
        solved_count: bossCount || 0,
        is_solved: userSolvedIds.includes(boss.id)
      });
    }

    setChallenges(enrichedChallenges);
    setLoading(false);
  };

  useEffect(() => {
    fetchChallenges();
  }, [user]);

  return { 
    challenges, 
    bossPuzzle, 
    hasUnlockedBoss, 
    loading, 
    refetch: fetchChallenges 
  };
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);

    // Use secure public view for leaderboard
    const { data, error } = await supabase
      .from('leaderboard_public')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
      return;
    }

    setLeaderboard(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to realtime updates on submissions
    const channel = supabase
      .channel('ctf-leaderboard')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'ctf_submissions' },
        () => fetchLeaderboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { leaderboard, loading, refetch: fetchLeaderboard };
}

export function useSubmitFlag() {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const submitFlag = async (challengeId: string, flag: string): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'You must be logged in to submit flags' };
    }

    setSubmitting(true);

    // Use secure server-side verification
    const { data: isCorrect, error: verifyError } = await supabase
      .rpc('verify_flag', { 
        challenge_id: challengeId, 
        submitted_flag: flag.trim().toLowerCase() 
      });

    if (verifyError) {
      setSubmitting(false);
      return { success: false, message: 'Verification failed' };
    }
    
    if (!isCorrect) {
      setSubmitting(false);
      return { success: false, message: 'Incorrect flag. Try again.' };
    }

    // Check if already solved
    const { data: existing } = await supabase
      .from('ctf_submissions')
      .select('id')
      .eq('challenge_id', challengeId)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      setSubmitting(false);
      return { success: true, message: 'You already solved this challenge!' };
    }

    // Record the submission
    const { error: insertError } = await supabase
      .from('ctf_submissions')
      .insert({ challenge_id: challengeId, user_id: user.id });

    setSubmitting(false);

    if (insertError) {
      return { success: false, message: 'Error recording submission' };
    }

    return { success: true, message: 'Correct! Challenge solved!' };
  };

  return { submitFlag, submitting };
}
