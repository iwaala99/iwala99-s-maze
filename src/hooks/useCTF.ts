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
    
    // Fetch all challenges including boss
    const { data: challengesData, error } = await supabase
      .from('ctf_challenges')
      .select('*')
      .eq('is_active', true)
      .order('points', { ascending: true });

    if (error) {
      console.error('Error fetching challenges:', error);
      setLoading(false);
      return;
    }

    // Separate boss puzzle from regular challenges
    const regularChallenges = challengesData?.filter(c => c.difficulty !== 'boss') || [];
    const boss = challengesData?.find(c => c.difficulty === 'boss') || null;

    // Fetch submission counts for each challenge
    const { data: submissionCounts } = await supabase
      .from('ctf_submissions')
      .select('challenge_id');

    // Fetch user's solved challenges if logged in
    let userSolvedIds: string[] = [];
    if (user) {
      const { data: userSolved } = await supabase
        .from('ctf_submissions')
        .select('challenge_id')
        .eq('user_id', user.id);
      
      userSolvedIds = userSolved?.map(s => s.challenge_id) || [];
    }

    // Count submissions per challenge
    const countMap: Record<string, number> = {};
    submissionCounts?.forEach(s => {
      countMap[s.challenge_id] = (countMap[s.challenge_id] || 0) + 1;
    });

    const enrichedChallenges = regularChallenges.map(c => ({
      ...c,
      solved_count: countMap[c.id] || 0,
      is_solved: userSolvedIds.includes(c.id)
    }));

    // Check if user has completed all insane challenges
    const insaneChallenges = enrichedChallenges.filter(c => c.difficulty === 'insane');
    const allInsaneSolved = insaneChallenges.length > 0 && 
      insaneChallenges.every(c => c.is_solved);
    
    setHasUnlockedBoss(allInsaneSolved);

    // Enrich boss puzzle if it exists
    if (boss) {
      setBossPuzzle({
        ...boss,
        solved_count: countMap[boss.id] || 0,
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

    // Get all submissions with challenge points
    const { data: submissions, error } = await supabase
      .from('ctf_submissions')
      .select(`
        user_id,
        challenge_id,
        ctf_challenges!inner(points)
      `);

    if (error) {
      console.error('Error fetching leaderboard:', error);
      setLoading(false);
      return;
    }

    // Get all profiles
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username');

    const profileMap: Record<string, string> = {};
    profiles?.forEach(p => {
      profileMap[p.id] = p.username;
    });

    // Aggregate points per user
    const userStats: Record<string, { points: number; count: number }> = {};
    submissions?.forEach((s: any) => {
      if (!userStats[s.user_id]) {
        userStats[s.user_id] = { points: 0, count: 0 };
      }
      userStats[s.user_id].points += s.ctf_challenges.points;
      userStats[s.user_id].count += 1;
    });

    const leaderboardData: LeaderboardEntry[] = Object.entries(userStats)
      .map(([user_id, stats]) => ({
        user_id,
        username: profileMap[user_id] || 'Unknown',
        total_points: stats.points,
        solved_count: stats.count
      }))
      .sort((a, b) => b.total_points - a.total_points)
      .slice(0, 20);

    setLeaderboard(leaderboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to realtime updates
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

    // Get the challenge to verify the flag
    const { data: challenge, error: fetchError } = await supabase
      .from('ctf_challenges')
      .select('flag_hash')
      .eq('id', challengeId)
      .maybeSingle();

    if (fetchError || !challenge) {
      setSubmitting(false);
      return { success: false, message: 'Challenge not found' };
    }

    // Simple hash comparison (in production, use proper hashing)
    const flagHash = btoa(flag.trim().toLowerCase());
    
    if (flagHash !== challenge.flag_hash) {
      setSubmitting(false);
      return { success: false, message: 'Incorrect flag. Try again!' };
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
