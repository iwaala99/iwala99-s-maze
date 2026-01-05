import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRealStats } from '@/hooks/useRealStats';
import { Users, Brain, Target, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const CommunitySection = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const stats = useRealStats();

  const statsConfig = [
    { 
      icon: Users, 
      getValue: () => stats.totalUsers,
      labelEn: 'Operatives',
      labelAr: 'العملاء',
      labelDarija: 'العملاء',
    },
    { 
      icon: Brain, 
      getValue: () => stats.totalChallenges,
      labelEn: 'Active Puzzles',
      labelAr: 'الألغاز النشطة',
      labelDarija: 'الألغاز النشطة',
    },
    { 
      icon: Target, 
      getValue: () => stats.totalSolved,
      labelEn: 'Puzzles Solved',
      labelAr: 'الألغاز المحلولة',
      labelDarija: 'الألغاز المحلولة',
    },
    { 
      icon: Zap, 
      getValue: () => stats.activeChallenges,
      labelEn: 'Live Challenges',
      labelAr: 'التحديات الحية',
      labelDarija: 'التحديات الحية',
    },
  ];

  const getLabel = (stat: typeof statsConfig[0]) => {
    if (language === 'ar') return stat.labelAr;
    if (language === 'darija') return stat.labelDarija;
    return stat.labelEn;
  };

  return (
    <section id="community" className="relative py-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient mb-4 animate-fade-up">
            {t('community.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {t('community.subtitle')}
          </p>
        </div>

        {/* Stats grid - Real data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {statsConfig.map((stat, index) => {
            const Icon = stat.icon;
            const value = stat.getValue();
            return (
              <div
                key={index}
                className="terminal-border bg-card/50 backdrop-blur-sm p-6 rounded-lg text-center hover:glow-box transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2 font-mono">
                  {stats.loading ? (
                    <Skeleton className="h-10 w-16 mx-auto" />
                  ) : (
                    value
                  )}
                </div>
                <div className="text-muted-foreground text-sm font-mono">
                  {getLabel(stat)}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Button
            size="lg"
            onClick={() => navigate('/puzzles')}
            className="glow-box bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg px-12 py-6"
          >
            Enter The Maze
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/feed')}
            className="border-secondary text-secondary hover:bg-secondary/10 font-display text-lg px-12 py-6"
          >
            View Feed
          </Button>
        </div>

        {/* Hidden clue for puzzle hunters */}
        <div className="mt-16 text-center">
          <p className="text-[10px] text-muted-foreground/30 font-mono select-none" data-clue="1">
            {/* Base64: "The path begins where the matrix ends" */}
            VGhlIHBhdGggYmVnaW5zIHdoZXJlIHRoZSBtYXRyaXggZW5kcw==
          </p>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
