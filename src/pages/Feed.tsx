import Navbar from '@/components/Navbar';
import MatrixRain from '@/components/MatrixRain';
import SocialFeed from '@/components/social/SocialFeed';
import { Shield, Users } from 'lucide-react';
import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Feed = () => {
  const { t } = useLanguage();

  useEffect(() => {
    document.title = 'IWALA99 | Cyber Feed';
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden">
      <MatrixRain />
      <Navbar />
      
      <main className="relative z-10 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4">
              <Users className="w-8 h-8 text-primary animate-glow-pulse" />
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
              {t('feed.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('feed.subtitle')}
            </p>
          </div>

          {/* Social Feed */}
          <SocialFeed />
        </div>
      </main>
    </div>
  );
};

export default Feed;
