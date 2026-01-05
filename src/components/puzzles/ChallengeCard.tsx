import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Lock, Users, Lightbulb, Send, EyeOff, Terminal, Binary, Fingerprint, Shield, Skull, Zap, Sparkles, Clock } from 'lucide-react';
import { CTFChallenge, useSubmitFlag } from '@/hooks/useCTF';
import CountdownTimer from '@/components/CountdownTimer';
import { useSound } from '@/contexts/SoundContext';
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

interface Particle {
  id: number;
  x: number;
  y: number;
  symbol: string;
  delay: number;
  duration: number;
  direction: number;
}

const difficultyConfig: Record<string, { color: string; label: string; glow: string }> = {
  easy: { color: 'bg-green-500/10 text-green-400 border-green-500/20', label: 'Easy', glow: 'shadow-green-500/20' },
  medium: { color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', label: 'Medium', glow: 'shadow-yellow-500/20' },
  hard: { color: 'bg-orange-500/10 text-orange-400 border-orange-500/20', label: 'Hard', glow: 'shadow-orange-500/20' },
  insane: { color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Insane', glow: 'shadow-red-500/20' },
  boss: { color: 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border-red-500/40', label: 'ΩMEGA', glow: 'shadow-red-500/40' },
};

const categoryLabels: Record<string, string> = {
  web: 'Web',
  crypto: 'Cryptography',
  forensics: 'Forensics',
  pwn: 'Exploitation',
  reverse: 'Reverse Engineering',
  misc: 'Miscellaneous',
  boss: 'Ω FINAL',
};

// Cryptic symbols for mysterious atmosphere
const crypticSymbols = ['⌬', '◈', '⟁', '⊛', '⧫', '⌘', '⎔', '⏣', '⌖', '⟐', '⧬', '⏚', '⎋', '⧉', '⟟', '⏀', '⎊', '⧊'];
const binaryStrings = ['01100110', '10110101', '01001010', '11010010', '00110011', '10101010', '01110111', '11001100'];
const celebrationSymbols = ['✦', '◆', '★', '✧', '◇', '⬡', '⬢', '◈', '✶', '✴', '✵', '⊛'];

const categoryIcons: Record<string, React.ReactNode> = {
  web: <Terminal className="h-3 w-3" />,
  crypto: <Binary className="h-3 w-3" />,
  forensics: <Fingerprint className="h-3 w-3" />,
  reverse: <Shield className="h-3 w-3" />,
  pwn: <Skull className="h-3 w-3" />,
  misc: <Zap className="h-3 w-3" />,
};

// Solved celebration overlay component
function SolvedCelebration({ show, onComplete }: { show: boolean; onComplete: () => void }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    if (show) {
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 50 + (Math.random() - 0.5) * 20,
        symbol: celebrationSymbols[Math.floor(Math.random() * celebrationSymbols.length)],
        delay: Math.random() * 0.3,
        duration: 0.8 + Math.random() * 0.5,
        direction: (i / 24) * 360,
      }));
      setParticles(newParticles);
      
      // Auto-complete after animation
      const timer = setTimeout(onComplete, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
      {/* Radial burst background */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-celebration-bg" />
      
      {/* Center glow */}
      <div className="absolute w-64 h-64 rounded-full bg-secondary/30 blur-3xl animate-celebration-glow" />
      <div className="absolute w-48 h-48 rounded-full bg-primary/20 blur-2xl animate-celebration-glow-delayed" />
      
      {/* Expanding rings */}
      <div className="absolute w-32 h-32 border-2 border-secondary/50 rounded-full animate-ring-expand" />
      <div className="absolute w-32 h-32 border-2 border-primary/40 rounded-full animate-ring-expand-delayed" />
      <div className="absolute w-32 h-32 border border-secondary/30 rounded-full animate-ring-expand-slow" />
      
      {/* Particle explosion */}
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute text-secondary animate-particle-explode"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            fontSize: `${12 + Math.random() * 16}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            '--particle-angle': `${particle.direction}deg`,
            '--particle-distance': `${100 + Math.random() * 150}px`,
          } as React.CSSProperties}
        >
          {particle.symbol}
        </span>
      ))}
      
      {/* Success message */}
      <div className="relative flex flex-col items-center animate-celebration-reveal">
        <div className="relative mb-4">
          <div className="w-20 h-20 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center animate-success-icon">
            <Check className="h-10 w-10 text-secondary" />
          </div>
          <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-secondary animate-sparkle" />
          <Sparkles className="absolute -bottom-1 -left-3 h-5 w-5 text-primary animate-sparkle-delayed" />
        </div>
        
        <h2 className="font-mono text-2xl font-bold text-secondary mb-2 glow-text animate-text-reveal">
          PUZZLE SOLVED
        </h2>
        <p className="font-mono text-sm text-muted-foreground animate-text-reveal-delayed">
          ACCESS GRANTED
        </p>
        
        {/* Scanning line */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-secondary/50 to-transparent animate-scan-line" />
        </div>
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-8 left-8 animate-corner-reveal">
        <div className="text-xs font-mono text-secondary/60">◢ VERIFIED</div>
      </div>
      <div className="absolute top-8 right-8 animate-corner-reveal-delayed">
        <div className="text-xs font-mono text-secondary/60">DECODED ◣</div>
      </div>
      <div className="absolute bottom-8 left-8 animate-corner-reveal-delayed">
        <div className="text-xs font-mono text-primary/60">◥ COMPLETE</div>
      </div>
      <div className="absolute bottom-8 right-8 animate-corner-reveal">
        <div className="text-xs font-mono text-primary/60">UNLOCKED ◤</div>
      </div>
    </div>
  );
}

export function ChallengeCard({ challenge, onSolved }: ChallengeCardProps) {
  const navigate = useNavigate();
  const [flag, setFlag] = useState('');
  const [showHints, setShowHints] = useState(false);
  const [open, setOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { submitFlag, submitting } = useSubmitFlag();
  const { toast } = useToast();
  const { user } = useAuth();
  const { playSound } = useSound();

  const config = difficultyConfig[challenge.difficulty] || difficultyConfig.easy;
  const isBoss = challenge.difficulty === 'boss';
  // Generate unique cryptic elements for each card
  const crypticElements = useMemo(() => {
    const seed = challenge.id.charCodeAt(0) + (challenge.id.charCodeAt(1) || 0);
    return {
      symbol1: crypticSymbols[seed % crypticSymbols.length],
      symbol2: crypticSymbols[(seed + 5) % crypticSymbols.length],
      symbol3: crypticSymbols[(seed + 11) % crypticSymbols.length],
      symbol4: crypticSymbols[(seed + 7) % crypticSymbols.length],
      binary: binaryStrings[seed % binaryStrings.length],
      floatDelay1: (seed % 3) * 0.5,
      floatDelay2: ((seed + 2) % 4) * 0.7,
      floatDelay3: ((seed + 1) % 5) * 0.4,
    };
  }, [challenge.id]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
    setOpen(false);
    onSolved();
    
    // Redirect to OMEGA recruitment page if boss puzzle was solved
    if (isBoss) {
      setTimeout(() => {
        navigate('/0m3g4');
      }, 500);
    }
  }, [onSolved, isBoss, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim()) return;

    playSound('click');
    const result = await submitFlag(challenge.id, flag);
    
    if (result.success) {
      setFlag('');
      setShowCelebration(true);
      playSound('success');
      toast({
        title: '✓ PUZZLE SOLVED',
        description: result.message,
        className: 'bg-secondary/20 border-secondary',
      });
    } else {
      playSound('error');
      toast({
        title: '✗ INCORRECT',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <SolvedCelebration show={showCelebration} onComplete={handleCelebrationComplete} />
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className={`
            relative cursor-pointer overflow-hidden
            transition-all duration-500 
            hover:scale-[1.02]
            group
            ${isBoss 
              ? 'border-red-500/40 bg-gradient-to-br from-red-500/10 via-background to-orange-500/10 hover:border-red-500/70 hover:shadow-lg hover:shadow-red-500/20' 
              : challenge.is_solved 
                ? 'border-secondary/30 bg-gradient-to-br from-secondary/5 via-background to-secondary/10 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10' 
                : 'bg-gradient-to-br from-background via-background to-muted/30 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'
            }
          `}>
            {/* Boss-specific pulsing border */}
            {isBoss && (
              <div className="absolute inset-0 rounded-lg border-2 border-red-500/30 animate-pulse pointer-events-none" />
            )}
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity duration-700">
              <div 
                className="absolute inset-0 animate-grid-pulse"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, hsl(var(--primary)) 1px, transparent 1px),
                    linear-gradient(to bottom, hsl(var(--primary)) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              />
            </div>

            {/* Floating cryptic symbols */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <span 
                className={`absolute text-xl animate-float transition-colors duration-500 ${isBoss ? 'text-red-500/20 group-hover:text-red-500/40' : 'text-primary/[0.08] group-hover:text-primary/20'}`}
                style={{ top: '15%', right: '8%', animationDelay: `${crypticElements.floatDelay1}s` }}
              >
                {isBoss ? 'Ω' : crypticElements.symbol1}
              </span>
              <span 
                className={`absolute text-lg animate-float-reverse transition-colors duration-500 ${isBoss ? 'text-orange-500/15 group-hover:text-orange-500/30' : 'text-primary/[0.05] group-hover:text-primary/15'}`}
                style={{ bottom: '20%', left: '5%', animationDelay: `${crypticElements.floatDelay2}s` }}
              >
                {isBoss ? '⚠' : crypticElements.symbol2}
              </span>
              <span 
                className={`absolute text-sm animate-float transition-colors duration-500 ${isBoss ? 'text-red-500/15 group-hover:text-red-500/25' : 'text-primary/[0.06] group-hover:text-primary/15'}`}
                style={{ top: '60%', right: '15%', animationDelay: `${crypticElements.floatDelay3}s` }}
              >
                {isBoss ? '☠' : crypticElements.symbol3}
              </span>
            </div>

            {/* Binary rain on right edge */}
            <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[6px] font-mono text-primary/20 tracking-[0.3em] writing-vertical">
                {crypticElements.binary}
              </span>
            </div>

            {/* Glitch scan lines */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div 
                className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-glitch-line"
                style={{ top: '25%' }}
              />
              <div 
                className="absolute h-[1px] w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent animate-glitch-line-delayed"
                style={{ top: '75%' }}
              />
            </div>

            {/* Corner tech accents */}
            <div className="absolute top-0 left-0 w-6 h-6">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/40 to-transparent group-hover:from-primary/70 transition-all" />
              <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-primary/40 to-transparent group-hover:from-primary/70 transition-all" />
            </div>
            <div className="absolute top-0 right-0 w-6 h-6">
              <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/40 to-transparent group-hover:from-primary/70 transition-all" />
              <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-primary/40 to-transparent group-hover:from-primary/70 transition-all" />
            </div>
            <div className="absolute bottom-0 left-0 w-6 h-6">
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/40 to-transparent group-hover:from-primary/70 transition-all" />
              <div className="absolute bottom-0 left-0 h-full w-[1px] bg-gradient-to-t from-primary/40 to-transparent group-hover:from-primary/70 transition-all" />
            </div>
            <div className="absolute bottom-0 right-0 w-6 h-6">
              <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/40 to-transparent group-hover:from-primary/70 transition-all" />
              <div className="absolute bottom-0 right-0 h-full w-[1px] bg-gradient-to-t from-primary/40 to-transparent group-hover:from-primary/70 transition-all" />
            </div>

            {/* Cryptic corner symbol */}
            <div className="absolute top-2 right-2 text-[10px] text-primary/20 group-hover:text-primary/40 font-mono transition-colors">
              {crypticElements.symbol4}
            </div>

            <CardHeader className="relative z-10 pb-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`
                    relative w-10 h-10 rounded border flex items-center justify-center font-mono text-sm 
                    transition-all duration-300
                    ${challenge.is_solved 
                      ? 'bg-secondary/20 border-secondary/30 text-secondary shadow-lg shadow-secondary/20' 
                      : 'bg-primary/5 border-primary/20 text-primary group-hover:bg-primary/10 group-hover:shadow-lg group-hover:shadow-primary/20'
                    }
                  `}>
                    {/* Pulsing ring on hover */}
                    <div className={`
                      absolute inset-0 rounded border opacity-0 group-hover:opacity-100 
                      ${challenge.is_solved ? 'border-secondary/50 animate-ping-slow' : 'border-primary/50 animate-ping-slow'}
                    `} />
                    {challenge.is_solved ? <Check className="h-5 w-5" /> : challenge.points}
                  </div>
                  <div>
                    <CardTitle className="text-base font-mono tracking-tight group-hover:text-primary transition-colors relative">
                      <span className="group-hover:animate-text-glitch inline-block">
                        {challenge.title}
                      </span>
                    </CardTitle>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-primary/50">{categoryIcons[challenge.category] || <Zap className="h-3 w-3" />}</span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        {categoryLabels[challenge.category] || challenge.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed font-mono">
                {challenge.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`font-mono text-[10px] ${config.color}`}>
                    {config.label}
                  </Badge>
                  {challenge.is_weekly && (
                    <Badge variant="outline" className="font-mono text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/20">
                      <Clock className="h-2.5 w-2.5 mr-1" />
                      WEEKLY
                    </Badge>
                  )}
                  <span className="font-mono text-xs text-primary group-hover:glow-text transition-all">
                    +{challenge.points} pts
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {challenge.expires_at && (
                    <CountdownTimer expiresAt={challenge.expires_at} compact />
                  )}
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                    <Users className="h-3 w-3" />
                    <span>{challenge.solved_count}</span>
                  </div>
                </div>
              </div>

              {/* Bottom glow effect on hover */}
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </CardContent>

            {/* Solved state overlay effect */}
            {challenge.is_solved && (
              <div className="absolute inset-0 border border-secondary/20 rounded-lg animate-pulse-slow pointer-events-none" />
            )}
          </Card>
        </DialogTrigger>

        <DialogContent className="sm:max-w-lg bg-background/95 backdrop-blur-xl border-primary/20 overflow-hidden">
          {/* Dialog background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          {/* Floating symbols in dialog */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <span className="absolute text-4xl text-primary/[0.03] top-4 right-4">{crypticElements.symbol1}</span>
            <span className="absolute text-3xl text-primary/[0.03] bottom-8 left-8">{crypticElements.symbol2}</span>
          </div>

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3">
              <div className={`relative w-12 h-12 rounded border flex items-center justify-center font-mono text-lg ${
                challenge.is_solved 
                  ? 'bg-secondary/20 border-secondary/30 text-secondary shadow-lg shadow-secondary/30' 
                  : 'bg-primary/10 border-primary/30 text-primary shadow-lg shadow-primary/20'
              }`}>
                {challenge.is_solved ? <Check className="h-6 w-6" /> : challenge.points}
              </div>
              <div>
                <DialogTitle className="font-mono text-lg tracking-tight text-primary">
                  {challenge.title}
                </DialogTitle>
                <div className="flex items-center gap-1.5">
                  <span className="text-primary/60">{categoryIcons[challenge.category]}</span>
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                    {categoryLabels[challenge.category] || challenge.category}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="relative z-10 space-y-4 mt-2">
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

            <div className="p-4 bg-muted/30 border border-primary/10 rounded-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-primary/30 via-primary/10 to-transparent" />
              <p className="text-sm text-muted-foreground leading-relaxed pl-2">
                {challenge.description}
              </p>
            </div>

            {challenge.hints && challenge.hints.length > 0 && (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHints(!showHints)}
                  className="text-xs text-muted-foreground font-mono hover:text-primary"
                >
                  {showHints ? (
                    <><EyeOff className="h-3 w-3 mr-2" /> Hide Hints</>
                  ) : (
                    <><Lightbulb className="h-3 w-3 mr-2" /> Show Hints ({challenge.hints.length})</>
                  )}
                </Button>
                {showHints && (
                  <ul className="mt-2 space-y-2 text-xs text-muted-foreground pl-4 animate-fade-in">
                    {challenge.hints.map((hint, i) => (
                      <li key={i} className="flex items-start gap-2 p-2 bg-muted/20 rounded border-l-2 border-primary/30">
                        <span className="text-primary font-mono">[{i + 1}]</span>
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
                    placeholder="IWALA99{enter_answer}"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    className="font-mono text-sm bg-background/50 border-primary/20 pr-20 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
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
    </>
  );
}
