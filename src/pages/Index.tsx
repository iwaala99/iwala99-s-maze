import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import MatrixRain from '@/components/MatrixRain';
import HeroSection from '@/components/HeroSection';
import SecurityBanner from '@/components/SecurityBanner';
import Footer from '@/components/Footer';
import SocialFeed from '@/components/social/SocialFeed';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';
import { Users, Brain, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

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

        {/* Maze CTA Section */}
        <section className="py-12 relative z-10">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-secondary/5 p-8 md:p-12 text-center">
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground) / 0.1) 2px, hsl(var(--foreground) / 0.1) 4px)',
              }} />
              <div className="relative z-10">
                <Brain className="h-10 w-10 mx-auto mb-4 text-primary animate-pulse" />
                <h2 className="text-2xl md:text-3xl font-bold font-mono mb-3">
                  <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                    {t('home.enterMaze')}
                  </span>
                </h2>
                <p className="text-muted-foreground font-mono text-sm max-w-md mx-auto mb-6">
                  {t('home.mazeDesc')}
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate('/puzzles')}
                  className="bg-foreground text-background hover:bg-foreground/90 font-mono px-8 gap-2"
                >
                  {t('home.startChallenge')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Social Feed Section */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold font-mono mb-2">
                <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                  {t('home.networkFeed')}
                </span>
              </h2>
              <p className="text-muted-foreground font-mono text-sm">
                {t('home.feedDesc')}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {user ? (
                <SocialFeed />
              ) : (
                <div className="text-center py-16 border border-dashed border-secondary/20 rounded-lg bg-muted/10">
                  <Users className="w-12 h-12 mx-auto text-secondary/50 mb-4" />
                  <p className="text-muted-foreground font-mono text-sm mb-4">
                    {t('home.joinNetwork')}
                  </p>
                  <a 
                    href="/auth" 
                    className="inline-flex items-center gap-2 px-6 py-2 bg-secondary/20 border border-secondary/30 rounded font-mono text-sm text-secondary hover:bg-secondary/30 transition-colors"
                  >
                    {t('home.joinNow')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
