import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import puzzlesBg from '@/assets/puzzles-bg.png';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChallengeCard } from '@/components/puzzles/ChallengeCard';
import { Leaderboard } from '@/components/puzzles/Leaderboard';
import { useChallenges } from '@/hooks/useCTF';
import { usePathCompletion } from '@/hooks/usePathCompletion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Brain, GitBranch, Zap, KeyRound, CheckCircle, Skull, Lock, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['all', 'web', 'crypto', 'forensics', 'pwn', 'reverse', 'misc'];
const difficulties = ['all', 'easy', 'medium', 'hard', 'insane'];

export default function Puzzles() {
  const navigate = useNavigate();
  const { challenges, bossPuzzle, hasUnlockedBoss, loading, refetch } = useChallenges();
  const { pathStatuses, hasCompletedAnyPath, refetch: refetchPaths } = usePathCompletion();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const handleSolved = () => {
    refetch();
    refetchPaths();
  };

  // Count insane challenges for progress
  const insaneChallenges = challenges.filter(c => c.difficulty === 'insane');
  const solvedInsane = insaneChallenges.filter(c => c.is_solved).length;

  const filteredChallenges = challenges.filter((c) => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
    return true;
  });

  // Group challenges by category for branching paths visualization
  const groupedByCategory = filteredChallenges.reduce((acc, challenge) => {
    if (!acc[challenge.category]) acc[challenge.category] = [];
    acc[challenge.category].push(challenge);
    return acc;
  }, {} as Record<string, typeof filteredChallenges>);

  return (
    <>
      <Helmet>
        <title>The Maze | IWALA99</title>
        <meta
          name="description"
          content="Enter the maze. Solve the puzzles. Prove your worth. Only the exceptional will find what lies at the end."
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Background image */}
        <div 
          className="fixed inset-0 pointer-events-none bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${puzzlesBg})` }}
        />
        {/* Dark gradient overlay */}
        <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
        {/* Vignette effect */}
        <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_hsl(var(--background))_70%)]" />
        {/* Scanline effect */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground) / 0.1) 2px, hsl(var(--foreground) / 0.1) 4px)',
          }}
        />
        {/* Subtle noise texture */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full">
              <Brain className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs font-mono text-primary tracking-widest uppercase">
                RECRUITMENT ACTIVE
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-mono mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                THE MAZE
              </span>
            </h1>
            
            <p className="text-muted-foreground font-mono text-sm max-w-xl mx-auto leading-relaxed">
              We seek highly intelligent individuals.
              <br />
              <span className="opacity-70">
                Follow the paths. Decode the puzzles. Prove your worth.
              </span>
            </p>

            <div className="mt-6 flex items-center justify-center gap-8 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                <span>Multiple paths converge</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-secondary" />
                <span>Only the worthy proceed</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenges Grid */}
            <div className="lg:col-span-2 space-y-8">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/20 border border-primary/10 rounded-lg">
                <span className="text-xs font-mono text-muted-foreground tracking-wider">FILTER:</span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36 font-mono text-xs bg-background/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="font-mono text-xs">
                        {cat === 'all' ? 'ALL PATHS' : cat.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-36 font-mono text-xs bg-background/50">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff} className="font-mono text-xs">
                        {diff === 'all' ? 'ALL LEVELS' : diff.toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="ml-auto font-mono text-xs border-primary/30">
                  {filteredChallenges.length} puzzle{filteredChallenges.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Branching Paths Visualization */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-40" />
                  ))}
                </div>
              ) : filteredChallenges.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-primary/20 rounded-lg">
                  <div className="text-4xl mb-4 opacity-50">
                    <Brain className="w-12 h-12 mx-auto text-primary/50" />
                  </div>
                  <p className="text-muted-foreground font-mono text-sm">
                    The maze awaits its first puzzles.
                  </p>
                  <p className="text-xs text-muted-foreground/70 font-mono mt-2">
                    // COMING SOON
                  </p>
                </div>
              ) : categoryFilter === 'all' && Object.keys(groupedByCategory).length > 1 ? (
                // Show branching paths when viewing all categories
                <div className="space-y-8">
                  {Object.entries(groupedByCategory).map(([category, catChallenges], pathIndex) => {
                    const pathStatus = pathStatuses.find(p => p.category === category);
                    const isPathComplete = pathStatus?.isComplete || false;
                    
                    return (
                      <div key={category} className="relative">
                        {/* Path header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isPathComplete 
                              ? 'bg-secondary/20 border border-secondary/50' 
                              : 'bg-primary/10 border border-primary/30'
                          }`}>
                            {isPathComplete ? (
                              <CheckCircle className="h-4 w-4 text-secondary" />
                            ) : (
                              <span className="text-primary font-mono text-xs">
                                {pathIndex + 1}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-mono text-sm tracking-wider uppercase ${
                              isPathComplete ? 'text-secondary' : 'text-primary'
                            }`}>
                              {category.toUpperCase()} PATH
                              {isPathComplete && ' ✓'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-mono">
                              {catChallenges.length} puzzle{catChallenges.length !== 1 ? 's' : ''} • {catChallenges.filter(c => c.is_solved).length} solved
                            </p>
                          </div>
                          
                          {/* Hidden link revealed when path complete */}
                          {isPathComplete && (
                            <button
                              onClick={() => navigate('/r3cru1t')}
                              className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/30 rounded text-xs font-mono text-secondary hover:bg-secondary/20 transition-colors animate-pulse"
                            >
                              <KeyRound className="h-3 w-3" />
                              ACCESS GRANTED
                            </button>
                          )}
                          
                          {/* Connecting line to next path */}
                          {pathIndex < Object.keys(groupedByCategory).length - 1 && !isPathComplete && (
                            <div className="flex-1 h-px bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
                          )}
                        </div>
                        
                        {/* Challenges in this path */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                          {catChallenges.map((challenge) => (
                            <ChallengeCard
                              key={challenge.id}
                              challenge={challenge}
                              onSolved={handleSolved}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Convergence point hint */}
                  <div className="relative flex items-center justify-center py-8">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    </div>
                    <div className="relative px-4 py-2 bg-background border border-primary/20 rounded-full">
                      <span className="text-xs font-mono text-muted-foreground">
                        ALL PATHS CONVERGE
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                // Standard grid when filtering
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onSolved={handleSolved}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - Leaderboard */}
            <div className="space-y-6">
              <Leaderboard />

              {/* Boss Puzzle Section */}
              {insaneChallenges.length > 0 && (
                <div className={`
                  relative p-4 rounded-lg border overflow-hidden
                  ${hasUnlockedBoss 
                    ? 'border-red-500/50 bg-gradient-to-br from-red-500/10 via-background to-orange-500/10' 
                    : 'border-primary/20 bg-muted/20'
                  }
                `}>
                  {/* Animated background for unlocked state */}
                  {hasUnlockedBoss && (
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-transparent to-orange-500/20 animate-pulse" />
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Skull className={`h-5 w-5 ${hasUnlockedBoss ? 'text-red-400 animate-pulse' : 'text-muted-foreground'}`} />
                      <span className={`font-mono text-xs uppercase tracking-wider ${hasUnlockedBoss ? 'text-red-400' : 'text-muted-foreground'}`}>
                        FINAL CHALLENGE
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] font-mono text-muted-foreground mb-1">
                        <span>INSANE PUZZLES</span>
                        <span>{solvedInsane}/{insaneChallenges.length}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-500 ${hasUnlockedBoss ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-primary/50'}`}
                          style={{ width: `${insaneChallenges.length > 0 ? (solvedInsane / insaneChallenges.length) * 100 : 0}%` }}
                        />
                      </div>
                    </div>

                    {hasUnlockedBoss && bossPuzzle ? (
                      <div className="space-y-3">
                        <p className="text-xs font-mono text-red-400/80">
                          ⚠ OMEGA CLEARANCE UNLOCKED
                        </p>
                        <ChallengeCard
                          challenge={bossPuzzle}
                          onSolved={handleSolved}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground/50" />
                        <p className="text-[10px] font-mono text-muted-foreground">
                          Complete all INSANE puzzles<br />
                          to unlock the final challenge
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Hidden access hint - only shows when path completed */}
              {hasCompletedAnyPath ? (
                <button
                  onClick={() => navigate('/r3cru1t')}
                  className="w-full p-4 border border-secondary/30 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors group"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <KeyRound className="h-4 w-4 text-secondary group-hover:animate-pulse" />
                    <span className="font-mono text-xs text-secondary">CLEARANCE GRANTED</span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    // Click to access hidden transmission
                  </p>
                </button>
              ) : (
                <div className="p-4 border border-dashed border-primary/20 rounded-lg">
                  <p className="text-xs font-mono text-muted-foreground text-center leading-relaxed">
                    <span className="text-primary">IWALA99</span>
                    <br />
                    <span className="opacity-50">
                      // Complete a path to unlock secrets
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
