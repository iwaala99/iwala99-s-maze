import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Lock, Users, Lightbulb, Send, EyeOff } from 'lucide-react';
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

const difficultyConfig: Record<string, { color: string; label: string }> = {
  easy: { color: 'bg-green-500/10 text-green-400 border-green-500/20', label: 'Easy' },
  medium: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', label: 'Medium' },
  hard: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: 'Hard' },
  insane: { color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Insane' },
};

const categoryLabels: Record<string, string> = {
  web: 'Web',
  crypto: 'Cryptography',
  forensics: 'Forensics',
  pwn: 'Exploitation',
  reverse: 'Reverse Engineering',
  misc: 'Miscellaneous',
};

export function ChallengeCard({ challenge, onSolved }: ChallengeCardProps) {
  const [flag, setFlag] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [open, setOpen] = useState(false);
  const { submitFlag, submitting } = useSubmitFlag();
  const { toast } = useToast();
  const { user } = useAuth();

  const config = difficultyConfig[challenge.difficulty] || difficultyConfig.easy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    const result = await submitFlag(challenge.id, flag);
    
    toast({
      title: result.success ? 'PUZZLE SOLVED' : 'INCORRECT',
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
        <Card className={`cursor-pointer transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 group ${
          challenge.is_solved 
            ? 'border-secondary/30 bg-secondary/5' 
            : 'bg-gradient-to-br from-background to-muted/20'
        }`}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded border flex items-center justify-center font-mono text-sm transition-colors ${
                  challenge.is_solved 
                    ? 'bg-secondary/20 border-secondary/30 text-secondary' 
                    : 'bg-primary/5 border-primary/20 text-primary group-hover:bg-primary/10'
                }`}>
                  {challenge.is_solved ? <Check className="h-5 w-5" /> : challenge.points}
                </div>
                <div>
                  <CardTitle className="text-base font-mono tracking-tight">
                    {challenge.title}
                  </CardTitle>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    {categoryLabels[challenge.category] || challenge.category}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {challenge.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`font-mono text-[10px] ${config.color}`}>
                  {config.label}
                </Badge>
                <span className="font-mono text-xs text-primary">
                  +{challenge.points} pts
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                <Users className="h-3 w-3" />
                <span>{challenge.solved_count}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-lg border-primary/20">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded border flex items-center justify-center font-mono text-lg ${
              challenge.is_solved 
                ? 'bg-secondary/20 border-secondary/30 text-secondary' 
                : 'bg-primary/10 border-primary/30 text-primary'
            }`}>
              {challenge.is_solved ? <Check className="h-6 w-6" /> : challenge.points}
            </div>
            <div>
              <DialogTitle className="font-mono text-lg tracking-tight">
                {challenge.title}
              </DialogTitle>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                {categoryLabels[challenge.category] || challenge.category}
              </span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`font-mono text-xs ${config.color}`}>
              {config.label}
            </Badge>
            <Badge variant="outline" className="font-mono text-xs">
              +{challenge.points} pts
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto font-mono">
              <Users className="h-3 w-3" />
              <span>{challenge.solved_count} solved</span>
            </div>
          </div>

          <div className="p-4 bg-muted/30 border border-primary/10 rounded-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {challenge.description}
            </p>
          </div>

          {challenge.hints && challenge.hints.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHints(!showHints)}
                className="text-xs text-muted-foreground font-mono"
              >
                {showHints ? (
                  <><EyeOff className="h-3 w-3 mr-2" /> Hide Hints</>
                ) : (
                  <><Lightbulb className="h-3 w-3 mr-2" /> Show Hints ({challenge.hints.length})</>
                )}
              </Button>
              {showHints && (
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground pl-4">
                  {challenge.hints.map((hint, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{hint}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {challenge.is_solved ? (
            <div className="flex items-center gap-2 text-secondary font-mono text-sm p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <Check className="h-4 w-4" />
              <span>Puzzle Completed</span>
            </div>
          ) : user ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Input
                  placeholder="Enter answer..."
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="font-mono text-sm bg-background/50 border-primary/20 pr-20"
                />
                <Button 
                  type="submit" 
                  disabled={submitting || !flag.trim()}
                  size="sm"
                  className="absolute right-1 top-1 h-7 font-mono text-xs"
                >
                  <Send className="h-3 w-3 mr-1" />
                  Submit
                </Button>
              </div>
            </form>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground text-sm p-4 bg-muted/30 rounded-lg font-mono border border-primary/10">
              <Lock className="h-4 w-4" />
              <span>Log in to submit answers</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
