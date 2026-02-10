import Navbar from '@/components/Navbar';
import MatrixRain from '@/components/MatrixRain';
import HeroSection from '@/components/HeroSection';
import SecurityBanner from '@/components/SecurityBanner';
import Footer from '@/components/Footer';
import { ChallengeCard } from '@/components/puzzles/ChallengeCard';
import { Leaderboard } from '@/components/puzzles/Leaderboard';
import SocialFeed from '@/components/social/SocialFeed';
import { useChallenges } from '@/hooks/useCTF';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { Brain, MessageSquare, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { challenges, loading, refetch } = useChallenges();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('maze');

  useEffect(() => {
    document.title = 'IWALA99 | Cybersecurity Community Hub';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'IWALA99 - The ultimate hub for ethical hackers, SOC analysts, penetration testers, and cybersecurity professionals worldwide.');
    }
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden scanline">
      <MatrixRain />
      <Navbar />
      <main>
        <HeroSection />
        <SecurityBanner />
        
        {/* Main Content Section */}
        <section id="maze" className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-muted/30 border border-primary/20">
                <TabsTrigger 
                  value="maze" 
                  className="font-mono text-sm data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  THE MAZE
                </TabsTrigger>
                <TabsTrigger 
                  value="social" 
                  className="font-mono text-sm data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  FEED
                </TabsTrigger>
              </TabsList>

              <TabsContent value="maze" className="mt-0">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold font-mono mb-2">
                    <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                      ENTER THE MAZE
                    </span>
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm">
                    Prove your worth. Solve the puzzles. Join the elite.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Challenges Grid */}
                  <div className="lg:col-span-2">
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <Skeleton key={i} className="h-40" />
                        ))}
                      </div>
                    ) : challenges.length === 0 ? (
                      <div className="text-center py-16 border border-dashed border-primary/20 rounded-lg bg-muted/10">
                        <Brain className="w-12 h-12 mx-auto text-primary/50 mb-4" />
                        <p className="text-muted-foreground font-mono text-sm">
                          The maze awaits its first puzzles.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {challenges.slice(0, 12).map((challenge) => (
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
                  <div>
                    <Leaderboard />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social" className="mt-0">
                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold font-mono mb-2">
                    <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                      NETWORK FEED
                    </span>
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm">
                    Connect with the community. Share knowledge. Stay informed.
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  {user ? (
                    <SocialFeed />
                  ) : (
                    <div className="text-center py-16 border border-dashed border-secondary/20 rounded-lg bg-muted/10">
                      <Users className="w-12 h-12 mx-auto text-secondary/50 mb-4" />
                      <p className="text-muted-foreground font-mono text-sm mb-4">
                        Join the network to access the feed
                      </p>
                      <a 
                        href="/auth" 
                        className="inline-flex items-center gap-2 px-6 py-2 bg-secondary/20 border border-secondary/30 rounded font-mono text-sm text-secondary hover:bg-secondary/30 transition-colors"
                      >
                        JOIN NOW
                      </a>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
