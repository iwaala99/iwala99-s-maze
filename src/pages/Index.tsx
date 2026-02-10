import Navbar from '@/components/Navbar';
import MatrixRain from '@/components/MatrixRain';
import HeroSection from '@/components/HeroSection';
import SecurityBanner from '@/components/SecurityBanner';
import Footer from '@/components/Footer';
import SocialFeed from '@/components/social/SocialFeed';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { MessageSquare, Users } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

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
        
        {/* Social Feed Section */}
        <section className="py-16 relative z-10">
          <div className="container mx-auto px-4">
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
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
