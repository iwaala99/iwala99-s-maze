import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Flag, Check, Lock, Users, Lightbulb } from 'lucide-react';
import { CTFChallenge, useSubmitFlag } from '@/hooks/useCTF';
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

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/20 text-green-400 border-green-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  hard: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  insane: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const categoryIcons: Record<string, string> = {
  web: '🌐',
  crypto: '🔐',
  forensics: '🔍',
  pwn: '💀',
  reverse: '⚙️',
  misc: '🎯',
};

export function ChallengeCard({ challenge, onSolved }: ChallengeCardProps) {
  const [flag, setFlag] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [open, setOpen] = useState(false);
  const { submitFlag, submitting } = useSubmitFlag();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    const result = await submitFlag(challenge.id, flag);
    
    toast({
      title: result.success ? 'Success!' : 'Wrong Flag',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });

    if (result.success) {
      setFlag('');
      setOpen(false);
      onSolved();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 ${challenge.is_solved ? 'border-secondary/50 bg-secondary/5' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{categoryIcons[challenge.category] || '🎯'}</span>
                <CardTitle className="text-lg font-mono">
                  {challenge.title}
                </CardTitle>
              </div>
              {challenge.is_solved && (
                <Check className="h-5 w-5 text-secondary shrink-0" />
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {challenge.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>
                  {challenge.difficulty}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  {challenge.points} pts
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{challenge.solved_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-mono">
            <span>{categoryIcons[challenge.category] || '🎯'}</span>
            {challenge.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={difficultyColors[challenge.difficulty]}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline" className="font-mono">
              {challenge.points} pts
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
              <Users className="h-3 w-3" />
              <span>{challenge.solved_count} solves</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {challenge.description}
          </p>

          {challenge.hints && challenge.hints.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="text-xs text-muted-foreground"
              >
                <Lightbulb className="h-3 w-3 mr-1" />
                {showHints ? 'Hide Hints' : `Show Hints (${challenge.hints.length})`}
              </Button>
              {showHints && (
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground pl-4">
                  {challenge.hints.map((hint, i) => (
                    <li key={i} className="list-disc">{hint}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {challenge.is_solved ? (
            <div className="flex items-center gap-2 text-secondary font-mono text-sm p-3 bg-secondary/10 rounded-md border border-secondary/30">
              <Check className="h-4 w-4" />
              Challenge Completed!
            </div>
          ) : user ? (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="Enter flag..."
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="font-mono text-sm"
              />
              <Button type="submit" disabled={submitting || !flag.trim()}>
                <Flag className="h-4 w-4 mr-1" />
                Submit
              </Button>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground text-sm p-3 bg-muted/30 rounded-md">
              <Lock className="h-4 w-4" />
              Log in to submit flags
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
