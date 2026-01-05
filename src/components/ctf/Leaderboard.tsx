import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useCTF';
import { Skeleton } from '@/components/ui/skeleton';

const rankIcons = [
  <Trophy key="1" className="h-5 w-5 text-yellow-400" />,
  <Medal key="2" className="h-5 w-5 text-gray-400" />,
  <Award key="3" className="h-5 w-5 text-amber-600" />,
];

export function Leaderboard() {
  const { leaderboard, loading } = useLeaderboard();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-mono">
            <Trophy className="h-5 w-5 text-primary" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-mono">
            <Trophy className="h-5 w-5 text-primary" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No solves yet. Be the first!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-mono">
          <Trophy className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.user_id}
            className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
              index < 3 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30'
            }`}
          >
            <div className="w-8 flex justify-center">
              {index < 3 ? (
                rankIcons[index]
              ) : (
                <span className="text-sm font-mono text-muted-foreground">
                  #{index + 1}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-sm truncate">{entry.username}</p>
              <p className="text-xs text-muted-foreground">
                {entry.solved_count} challenge{entry.solved_count !== 1 ? 's' : ''} solved
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-primary">
                {entry.total_points}
              </p>
              <p className="text-xs text-muted-foreground">points</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
