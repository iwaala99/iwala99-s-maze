import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChallengeCard } from '@/components/ctf/ChallengeCard';
import { Leaderboard } from '@/components/ctf/Leaderboard';
import { useChallenges } from '@/hooks/useCTF';
import { usePathCompletion } from '@/hooks/usePathCompletion';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Eye, GitBranch, Sparkles, KeyRound, CheckCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['all', 'web', 'crypto', 'forensics', 'pwn', 'reverse', 'misc'];
const difficulties = ['all', 'easy', 'medium', 'hard', 'insane'];

// Cicada-inspired glyphs and symbols
const mysteryGlyphs = ['⊛', '◬', '⌬', '⎔', '⏣', '⌘', '⎈', '⌖'];

export default function CTF() {
  const navigate = useNavigate();
  const { challenges, loading, refetch } = useChallenges();
  const { pathStatuses, hasCompletedAnyPath, refetch: refetchPaths } = usePathCompletion();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const handleSolved = () => {
    refetch();
    refetchPaths();
  };

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
        <title>The Labyrinth | IWALA99</title>
        <meta
          name="description"
          content="Enter the labyrinth. Solve the enigmas. Prove your worth. Only the exceptional will find what lies at the end."
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
        {/* Mysterious background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            {mysteryGlyphs.map((glyph, i) => (
              <span
                key={i}
                className="absolute text-primary animate-pulse font-mono"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 2 + 1}rem`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: 0.3,
                }}
              >
                {glyph}
              </span>
            ))}
          </div>
        </div>

        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8 relative z-10">
          {/* Cryptic Header */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-primary/5 border border-primary/20 rounded-full">
              <Eye className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-xs font-mono text-primary tracking-widest uppercase">
                RECRUITMENT PROTOCOL ACTIVE
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold font-mono mb-4">
              <span className="text-muted-foreground opacity-50">3301:</span>{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-pulse">
                THE LABYRINTH
              </span>
            </h1>
            
            <p className="text-muted-foreground font-mono text-sm max-w-xl mx-auto leading-relaxed">
              <span className="text-primary">⌬</span> We are looking for highly intelligent individuals.{' '}
              <span className="text-primary">⌬</span>
              <br />
              <span className="opacity-70">
                To find them, we have devised a test. Follow the paths. Decode the enigmas.
              </span>
            </p>

            <div className="mt-6 flex items-center justify-center gap-8 text-xs font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                <span>Multiple paths converge</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-secondary" />
                <span>Only the worthy proceed</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenges Grid */}
            <div className="lg:col-span-2 space-y-8">
              {/* Filters - styled cryptically */}
              <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/20 border border-primary/10 rounded-lg">
                <span className="text-xs font-mono text-muted-foreground tracking-wider">FILTER_PROTOCOL:</span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36 font-mono text-xs bg-background/50">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="font-mono text-xs">
                        {cat === 'all' ? '◬ ALL_PATHS' : `⌬ ${cat.toUpperCase()}`}
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
                        {diff === 'all' ? '⊛ ALL_LEVELS' : `⎔ ${diff.toUpperCase()}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="ml-auto font-mono text-xs border-primary/30">
                  {filteredChallenges.length} enigma{filteredChallenges.length !== 1 ? 's' : ''}
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
                  <div className="text-4xl mb-4 opacity-50">⌬</div>
                  <p className="text-muted-foreground font-mono text-sm">
                    The labyrinth awaits its first enigmas.
                  </p>
                  <p className="text-xs text-muted-foreground/70 font-mono mt-2">
                    // AWAITING_INITIALIZATION
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
                                {mysteryGlyphs[pathIndex % mysteryGlyphs.length]}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-mono text-sm tracking-wider uppercase ${
                              isPathComplete ? 'text-secondary' : 'text-primary'
                            }`}>
                              PATH_{category.toUpperCase()}
                              {isPathComplete && ' ✓'}
                            </h3>
                            <p className="text-xs text-muted-foreground font-mono">
                              {catChallenges.length} enigma{catChallenges.length !== 1 ? 's' : ''} • {catChallenges.filter(c => c.is_solved).length} solved
                            </p>
                          </div>
                          
                          {/* Hidden link revealed when path complete */}
                          {isPathComplete && (
                            <button
                              onClick={() => navigate('/r3cru1t')}
                              className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 border border-secondary/30 rounded text-xs font-mono text-secondary hover:bg-secondary/20 transition-colors animate-pulse"
                            >
                              <KeyRound className="h-3 w-3" />
                              ACCESS_GRANTED
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
                        ⌖ ALL PATHS CONVERGE ⌖
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
              
              {/* Hidden access hint - only shows when path completed */}
              {hasCompletedAnyPath ? (
                <button
                  onClick={() => navigate('/r3cru1t')}
                  className="w-full p-4 border border-secondary/30 bg-secondary/5 rounded-lg hover:bg-secondary/10 transition-colors group"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <KeyRound className="h-4 w-4 text-secondary group-hover:animate-pulse" />
                    <span className="font-mono text-xs text-secondary">CLEARANCE_GRANTED</span>
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground">
                    // Click to access hidden transmission
                  </p>
                </button>
              ) : (
                <div className="p-4 border border-dashed border-primary/20 rounded-lg">
                  <p className="text-xs font-mono text-muted-foreground text-center leading-relaxed">
                    <span className="text-primary">PGP:</span> 0x89AB CDEF 1234 5678
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
