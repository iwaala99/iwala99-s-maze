import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLeaderboard } from '@/hooks/useCTF';
import { Skeleton } from '@/components/ui/skeleton';

const rankGlyphs = ['⬡', '⬢', '⬣'];

export function Leaderboard() {
  const { leaderboard, loading } = useLeaderboard();

  if (loading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-b from-background to-muted/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-mono text-sm tracking-wider">
            <span className="text-primary">◬</span>
            CIPHER_BREAKERS
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
            <span className="text-primary">◬</span>
            CIPHER_BREAKERS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground text-center py-8 font-mono">
            // AWAITING_FIRST_SOLVER
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-background to-muted/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-mono text-sm tracking-wider">
          <span className="text-primary">◬</span>
          CIPHER_BREAKERS
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
                <span className={`font-mono ${
                  index === 0 ? 'text-yellow-400' : 
                  index === 1 ? 'text-gray-400' : 'text-amber-600'
                }`}>
                  {rankGlyphs[index]}
                </span>
              ) : (
                <span className="text-[10px] font-mono text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-mono text-xs truncate">{entry.username}</p>
              <p className="text-[10px] text-muted-foreground font-mono">
                {entry.solved_count} enigma{entry.solved_count !== 1 ? 's' : ''}
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
