import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChallengeCard } from '@/components/ctf/ChallengeCard';
import { Leaderboard } from '@/components/ctf/Leaderboard';
import { useChallenges } from '@/hooks/useCTF';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Flag, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = ['all', 'web', 'crypto', 'forensics', 'pwn', 'reverse', 'misc'];
const difficulties = ['all', 'easy', 'medium', 'hard', 'insane'];

export default function CTF() {
  const { challenges, loading, refetch } = useChallenges();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filteredChallenges = challenges.filter((c) => {
    if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
    if (difficultyFilter !== 'all' && c.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <>
      <Helmet>
        <title>CTF Challenges | IWALA99</title>
        <meta
          name="description"
          content="Test your hacking skills with Capture The Flag challenges. Solve puzzles, earn points, and climb the leaderboard."
        />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-1 container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Flag className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CTF Challenges
              </h1>
            </div>
            <p className="text-muted-foreground">
              Test your skills. Capture the flags. Climb the leaderboard.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenges Grid */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Filter:</span>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((diff) => (
                      <SelectItem key={diff} value={diff}>
                        {diff === 'all' ? 'All Levels' : diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="ml-auto font-mono">
                  {filteredChallenges.length} challenge{filteredChallenges.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              {/* Challenge Cards */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-40" />
                  ))}
                </div>
              ) : filteredChallenges.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No challenges available yet.</p>
                  <p className="text-sm">Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredChallenges.map((challenge) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onSolved={refetch}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar - Leaderboard */}
            <div className="space-y-6">
              <Leaderboard />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
