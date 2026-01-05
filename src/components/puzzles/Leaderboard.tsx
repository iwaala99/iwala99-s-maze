import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeaderboard } from '@/hooks/useCTF';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award } from 'lucide-react';

export function Leaderboard() {
  const { leaderboard, loading } = useLeaderboard();

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-b from-background to-muted/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-mono text-sm tracking-wider">
            <Trophy className="h-4 w-4 text-primary" />
            TOP SOLVERS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card className="border-primary/20 bg-gradient-to-b from-background to-muted/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-mono text-sm tracking-wider">
            <Trophy className="h-4 w-4 text-primary" />
            TOP SOLVERS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground text-center py-8 font-mono">
            No solvers yet. Be the first!
          </p>
        </CardContent>
      </Card>
    );
  }

  const rankIcons = [
    <Trophy key="1" className="h-4 w-4 text-yellow-400" />,
    <Medal key="2" className="h-4 w-4 text-gray-400" />,
    <Award key="3" className="h-4 w-4 text-amber-600" />,
  ];

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-background to-muted/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-mono text-sm tracking-wider">
          <Trophy className="h-4 w-4 text-primary" />
          TOP SOLVERS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.user_id}
            className={`flex items-center gap-3 p-3 rounded transition-colors ${
              index < 3 
                ? 'bg-primary/5 border border-primary/10' 
                : 'hover:bg-muted/30'
            }`}
          >
            <div className="w-6 flex justify-center">
              {index < 3 ? (
                rankIcons[index]
              ) : (
                <span className="text-[10px] font-mono text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs truncate">{entry.username}</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {entry.solved_count} puzzle{entry.solved_count !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs font-bold text-primary">
                {entry.total_points}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
