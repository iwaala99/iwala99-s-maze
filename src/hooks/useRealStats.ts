import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlatformStats {
  totalUsers: number;
  totalChallenges: number;
  totalSolved: number;
  activeChallenges: number;
  loading: boolean;
}

export function useRealStats(): PlatformStats {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalChallenges: 0,
    totalSolved: 0,
    activeChallenges: 0,
    loading: true,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        // Get total users
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        // Get total challenges from public view
        const { count: challengeCount } = await supabase
          .from('ctf_challenges_public')
          .select('*', { count: 'exact', head: true });

        // Get active challenges (not expired)
        const { count: activeCount } = await supabase
          .from('ctf_challenges_public')
          .select('*', { count: 'exact', head: true })
          .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

        // Get total submissions (solved puzzles) - use RPC for aggregation
        const { data: leaderboard } = await supabase
          .from('leaderboard_public')
          .select('solved_count');

        const totalSolved = leaderboard?.reduce((sum, entry) => sum + (entry.solved_count || 0), 0) || 0;

        setStats({
          totalUsers: userCount || 0,
          totalChallenges: challengeCount || 0,
          totalSolved,
          activeChallenges: activeCount || 0,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    }

    fetchStats();
  }, []);

  return stats;
}
