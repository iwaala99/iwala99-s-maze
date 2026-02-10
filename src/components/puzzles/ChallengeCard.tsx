import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Lightbulb, Clock } from 'lucide-react';
import { CTFChallenge, useSubmitFlag } from '@/hooks/useCTF';
import CountdownTimer from '@/components/CountdownTimer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ChallengeCardProps {
  challenge: CTFChallenge;
  onSolved: () => void;
}

const difficultyConfig: Record<string, { color: string; label: string }> = {
  easy: { color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20', label: 'Easy' },
  medium: { color: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20', label: 'Medium' },
  hard: { color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20', label: 'Hard' },
  insane: { color: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20', label: 'Insane' },
  extreme: { color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/40', label: '☠ EXTREME' },
  boss: { color: 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/40', label: 'FINAL' },
};

const categoryLabels: Record<string, string> = {
  web: 'Web',
  crypto: 'Crypto',
  forensics: 'Forensics',
  pwn: 'Pwn',
  reverse: 'Reverse',
  misc: 'Misc',
  boss: 'Final',
};

export function ChallengeCard({ challenge, onSolved }: ChallengeCardProps) {
  const navigate = useNavigate();
  const [flag, setFlag] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [open, setOpen] = useState(false);
  const { submitFlag, submitting } = useSubmitFlag();
  const { toast } = useToast();
  const { user } = useAuth();

  const config = difficultyConfig[challenge.difficulty] || difficultyConfig.easy;
  const isBoss = challenge.difficulty === 'boss';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    const result = await submitFlag(challenge.id, flag);
    
    if (result.success) {
      setFlag('');
      setOpen(false);
      onSolved();
      toast({
        title: '✓ Correct!',
        description: `+${challenge.points} points`,
      });
      
      if (isBoss) {
        setTimeout(() => navigate('/0m3g4'), 500);
      }
    } else {
      toast({
        title: '✗ Wrong flag',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className={`
          cursor-pointer transition-all hover:shadow-md
          ${challenge.is_solved 
            ? 'border-secondary/40 bg-secondary/5' 
            : 'hover:border-primary/40'
          }
        `}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`
                  w-10 h-10 rounded border flex items-center justify-center font-mono text-sm
                  ${challenge.is_solved 
                    ? 'bg-secondary/20 border-secondary/30 text-secondary' 
                    : 'bg-muted border-border text-foreground'
                  }
                `}>
                  {challenge.is_solved ? <Check className="h-5 w-5" /> : challenge.points}
                </div>
                <div>
                  <CardTitle className="text-base font-medium">
                    {challenge.title}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {categoryLabels[challenge.category] || challenge.category}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {challenge.description}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${config.color}`}>
                {config.label}
              </Badge>
              {challenge.is_weekly && challenge.expires_at && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <CountdownTimer expiresAt={challenge.expires_at} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {challenge.title}
            <Badge variant="outline" className={`text-xs ${config.color}`}>
              {config.label}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{categoryLabels[challenge.category]}</span>
            <span>{challenge.points} pts</span>
          </div>

          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{challenge.description}</p>
          </div>

          {challenge.hints && challenge.hints.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="text-xs"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                {showHints ? 'Hide hints' : `Show ${challenge.hints.length} hint(s)`}
              </Button>
              
              {showHints && (
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground pl-4">
                  {challenge.hints.map((hint, i) => (
                    <li key={i} className="list-disc">{hint}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {challenge.is_solved ? (
            <div className="p-3 bg-secondary/10 border border-secondary/30 rounded text-center text-secondary text-sm">
              ✓ Already solved
            </div>
          ) : user ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="IWALA99{...}"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="font-mono"
              />
              <Button type="submit" disabled={submitting || !flag.trim()}>
                {submitting ? 'Checking...' : 'Submit'}
              </Button>
            </form>
          ) : (
            <div className="p-3 bg-muted rounded text-center text-sm text-muted-foreground">
              Sign in to submit flags
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
