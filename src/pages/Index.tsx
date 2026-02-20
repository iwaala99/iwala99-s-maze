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
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <MatrixRain />
      <Navbar />
      <main>
        <HeroSection />
        <SecurityBanner />

        {/* Maze CTA Section */}
        <section className="py-16 relative z-10 section-reveal">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-r from-muted/30 via-background to-muted/30 p-8 md:p-14 text-center">
              {/* Subtle texture */}
              <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground) / 0.1) 2px, hsl(var(--foreground) / 0.1) 4px)',
              }} />
              <div className="relative z-10">
                <Brain className="h-8 w-8 mx-auto mb-5 text-muted-foreground animate-glow-pulse" />
                <h2 className="text-2xl md:text-3xl font-bold font-display mb-3 tracking-tight">
                  <span className="text-gradient">
                    {t('home.enterMaze')}
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
                  {t('home.mazeDesc')}
                </p>
                <Button
                  size="lg"
                  onClick={() => navigate('/puzzles')}
                  className="bg-foreground text-background hover:bg-foreground/90 font-display px-8 gap-2 h-11 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  {t('home.startChallenge')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Social Feed Section */}
        <section className="py-16 relative z-10 section-reveal">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-2 tracking-tight">
                <span className="text-gradient">
                  {t('home.networkFeed')}
                </span>
              </h2>
              <p className="text-muted-foreground text-sm">
                {t('home.feedDesc')}
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              {user ? (
                <SocialFeed />
              ) : (
                <div className="text-center py-16 border border-dashed border-border/50 rounded-xl bg-muted/10">
                  <Users className="w-10 h-10 mx-auto text-muted-foreground/40 mb-4" />
                  <p className="text-muted-foreground text-sm mb-5">
                    {t('home.joinNetwork')}
                  </p>
                  <a 
                    href="/auth" 
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-foreground text-background rounded-lg font-display text-sm hover:bg-foreground/90 transition-all duration-300 hover:-translate-y-0.5 shadow-md"
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
