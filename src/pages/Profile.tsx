import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, Shield, Trophy, Target, Brain, Edit2, Save, X,
  Calendar, Award, Zap, Lock, MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  rank: string;
  total_points: number;
  badges: string[];
  created_at: string;
}

interface UserStats {
  solvedCount: number;
  totalPoints: number;
  rank: number;
}

const rankConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  initiate: { label: 'Initiate', color: 'text-muted-foreground', icon: <User className="h-4 w-4" /> },
  apprentice: { label: 'Apprentice', color: 'text-blue-400', icon: <Shield className="h-4 w-4" /> },
  operative: { label: 'Operative', color: 'text-green-400', icon: <Target className="h-4 w-4" /> },
  specialist: { label: 'Specialist', color: 'text-yellow-400', icon: <Zap className="h-4 w-4" /> },
  elite: { label: 'Elite', color: 'text-orange-400', icon: <Award className="h-4 w-4" /> },
  master: { label: 'Master', color: 'text-red-400', icon: <Trophy className="h-4 w-4" /> },
  omega: { label: 'ΩMEGA', color: 'text-secondary', icon: <Brain className="h-4 w-4" /> },
};

const badgeConfig: Record<string, { label: string; color: string }> = {
  first_blood: { label: 'First Blood', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  path_complete: { label: 'Path Complete', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
  speed_demon: { label: 'Speed Demon', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  omega_cleared: { label: 'ΩMEGA Cleared', color: 'bg-secondary/20 text-secondary border-secondary/30' },
  weekly_champion: { label: 'Weekly Champion', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

export default function Profile() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<UserStats>({ solvedCount: 0, totalPoints: 0, rank: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState('');

  const isOwnProfile = !userId || userId === user?.id;
  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (!targetUserId) {
      if (!user) navigate('/auth');
      return;
    }

    async function fetchProfile() {
      setLoading(true);

      // Fetch profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error || !profileData) {
        toast({ title: 'Profile not found', variant: 'destructive' });
        navigate('/');
        return;
      }

      setProfile(profileData as ProfileData);
      setEditBio(profileData.bio || '');

      // Fetch stats
      const { data: submissions } = await supabase
        .from('ctf_submissions')
        .select(`
          challenge_id,
          ctf_challenges!inner(points)
        `)
        .eq('user_id', targetUserId);

      const totalPoints = submissions?.reduce((sum: number, s: any) => sum + s.ctf_challenges.points, 0) || 0;
      const solvedCount = submissions?.length || 0;

      // Get rank position
      const { data: allSubmissions } = await supabase
        .from('ctf_submissions')
        .select(`
          user_id,
          ctf_challenges!inner(points)
        `);

      const userPoints: Record<string, number> = {};
      allSubmissions?.forEach((s: any) => {
        userPoints[s.user_id] = (userPoints[s.user_id] || 0) + s.ctf_challenges.points;
      });

      const sortedUsers = Object.entries(userPoints)
        .sort(([, a], [, b]) => b - a)
        .map(([id]) => id);

      const rankPosition = sortedUsers.indexOf(targetUserId) + 1;

      setStats({ solvedCount, totalPoints, rank: rankPosition || solvedCount > 0 ? rankPosition : 0 });
      setLoading(false);
    }

    fetchProfile();
  }, [targetUserId, user, navigate, toast]);

  const handleSaveBio = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({ bio: editBio })
      .eq('id', user.id);

    if (error) {
      toast({ title: 'Failed to update bio', variant: 'destructive' });
      return;
    }

    setProfile(prev => prev ? { ...prev, bio: editBio } : null);
    setEditing(false);
    toast({ title: 'Bio updated' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) return null;

  const rankInfo = rankConfig[profile.rank] || rankConfig.initiate;

  return (
    <>
      <Helmet>
        <title>{profile.username} | IWALA99</title>
        <meta name="description" content={`${profile.username}'s profile on IWALA99`} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />

        <main className="flex-1 pt-20 pb-8">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Profile Header */}
            <Card className="mb-6 border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <Avatar className="w-24 h-24 border-2 border-primary/30">
                    <AvatarFallback className="text-3xl font-mono bg-primary/10 text-primary">
                      {profile.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold font-mono text-foreground">
                        {profile.username}
                      </h1>
                      <Badge variant="outline" className={`${rankInfo.color} border-current/30`}>
                        {rankInfo.icon}
                        <span className="ml-1">{rankInfo.label}</span>
                      </Badge>
                    </div>

                    {editing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          placeholder="Write something about yourself..."
                          className="max-w-lg"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={handleSaveBio}>
                            <Save className="h-4 w-4 mr-1" /> Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                            <X className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground max-w-lg">
                        {profile.bio || (isOwnProfile ? 'Click edit to add a bio...' : 'No bio yet')}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {isOwnProfile && !editing && (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  )}

                  {!isOwnProfile && user && (
                    <Button variant="outline" size="sm" onClick={() => navigate('/messages')}>
                      <MessageSquare className="h-4 w-4 mr-1" /> Message
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="border-primary/20">
                <CardContent className="p-4 text-center">
                  <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                  <div className="text-2xl font-bold font-mono text-foreground">
                    {stats.totalPoints}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">POINTS</div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="p-4 text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold font-mono text-foreground">
                    {stats.solvedCount}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">SOLVED</div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/20">
                <CardContent className="p-4 text-center">
                  <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold font-mono text-foreground">
                    {stats.rank > 0 ? `#${stats.rank}` : '-'}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">RANK</div>
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            <Card className="mb-6 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg font-mono flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {profile.badges && profile.badges.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.badges.map(badge => {
                      const config = badgeConfig[badge] || { label: badge, color: 'bg-muted text-muted-foreground' };
                      return (
                        <Badge key={badge} variant="outline" className={config.color}>
                          {config.label}
                        </Badge>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-mono">No badges earned yet</p>
                    <p className="text-xs opacity-70">Solve puzzles to earn badges</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
