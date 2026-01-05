import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Globe, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

const stats = [
  { 
    icon: Users, 
    valueKey: '10K+',
    labelEn: 'Security Professionals',
    labelAr: 'محترف أمني',
    labelDarija: 'محترف سيكيوريتي',
  },
  { 
    icon: Globe, 
    valueKey: '50+',
    labelEn: 'Countries',
    labelAr: 'دولة',
    labelDarija: 'بلاد',
  },
  { 
    icon: Zap, 
    valueKey: '1000+',
    labelEn: 'Daily Discussions',
    labelAr: 'نقاش يومي',
    labelDarija: 'نقاش كل يوم',
  },
  { 
    icon: Award, 
    valueKey: '500+',
    labelEn: 'Certifications Shared',
    labelAr: 'شهادة مشتركة',
    labelDarija: 'شهادة متشاركة',
  },
];

const CommunitySection = () => {
  const { t, language } = useLanguage();

  const getLabel = (stat: typeof stats[0]) => {
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

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="terminal-border bg-card/50 backdrop-blur-sm p-6 rounded-lg text-center hover:glow-box transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3 animate-glow-pulse" />
                <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.valueKey}
                </div>
                <div className="text-muted-foreground text-sm">
                  {getLabel(stat)}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <Button
            size="lg"
            className="glow-box bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg px-12 py-6"
          >
            {t('hero.join')}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
