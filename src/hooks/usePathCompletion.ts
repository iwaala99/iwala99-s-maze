import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface PathStatus {
  category: string;
  totalChallenges: number;
  solvedChallenges: number;
  isComplete: boolean;
  secretCode?: string;
}

// Generate a deterministic "secret code" based on category
const generateSecretCode = (category: string, userId: string): string => {
  const base = btoa(`${category}-${userId.slice(0, 8)}`).replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
  return base.toUpperCase();
};

export function usePathCompletion() {
  const [pathStatuses, setPathStatuses] = useState<PathStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [completedPaths, setCompletedPaths] = useState<string[]>([]);
  const { user } = useAuth();

  const fetchPathStatuses = async () => {
    if (!user) {
      setPathStatuses([]);
      setCompletedPaths([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Get all active challenges grouped by category
    const { data: challenges, error: challengesError } = await supabase
      .from('ctf_challenges')
      .select('id, category')
      .eq('is_active', true);

    if (challengesError) {
      console.error('Error fetching challenges:', challengesError);
      setLoading(false);
      return;
    }

    // Get user's solved challenges
    const { data: submissions, error: submissionsError } = await supabase
      .from('ctf_submissions')
      .select('challenge_id')
      .eq('user_id', user.id);

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      setLoading(false);
      return;
    }

    const solvedIds = new Set(submissions?.map(s => s.challenge_id) || []);

    // Group by category and calculate completion
    const categoryMap: Record<string, { total: number; solved: number }> = {};
    
    challenges?.forEach(challenge => {
      if (!categoryMap[challenge.category]) {
        categoryMap[challenge.category] = { total: 0, solved: 0 };
      }
      categoryMap[challenge.category].total++;
      if (solvedIds.has(challenge.id)) {
        categoryMap[challenge.category].solved++;
      }
    });

    const statuses: PathStatus[] = Object.entries(categoryMap)
      .filter(([_, stats]) => stats.total > 0) // Only paths with challenges
      .map(([category, stats]) => {
        const isComplete = stats.solved === stats.total && stats.total > 0;
        return {
          category,
          totalChallenges: stats.total,
          solvedChallenges: stats.solved,
          isComplete,
          secretCode: isComplete ? generateSecretCode(category, user.id) : undefined,
        };
      });

    setPathStatuses(statuses);
    setCompletedPaths(statuses.filter(s => s.isComplete).map(s => s.category));
    setLoading(false);
  };

  useEffect(() => {
    fetchPathStatuses();
  }, [user]);

  const hasCompletedAnyPath = completedPaths.length > 0;
  const hasCompletedAllPaths = pathStatuses.length > 0 && pathStatuses.every(p => p.isComplete);

  return {
    pathStatuses,
    completedPaths,
    hasCompletedAnyPath,
    hasCompletedAllPaths,
    loading,
    refetch: fetchPathStatuses,
  };
}

// Validate if user has access to recruitment page
export function useRecruitmentAccess() {
  const { hasCompletedAnyPath, completedPaths, loading } = usePathCompletion();
  
  return {
    hasAccess: hasCompletedAnyPath,
    completedPaths,
    loading,
  };
}
