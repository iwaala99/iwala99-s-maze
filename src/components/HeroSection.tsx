import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Shield, Terminal, ChevronDown, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const fullText = 'IWALA99';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const scrollToRoles = () => {
    const element = document.querySelector('#roles');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 matrix-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Animated grid */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main logo */}
        <div className="mb-8 animate-fade-up">
          <div className="inline-flex items-center justify-center gap-4 mb-6">
            <Shield className="w-16 h-16 md:w-24 md:h-24 text-primary animate-float" />
            <Terminal className="w-12 h-12 md:w-16 md:h-16 text-secondary animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <p className="text-muted-foreground text-lg md:text-xl mb-2">
            {t('hero.welcome')}
          </p>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-9xl font-black mb-4">
            <span className="text-gradient glow-text">
              {typedText}
            </span>
            <span className="animate-blink text-primary">_</span>
          </h1>

          {/* Scary Slogan */}
          <div className="h-12 flex items-center justify-center mb-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-secondary animate-glow-pulse" />
              <p className="font-mono text-sm md:text-lg text-secondary">
                // We are always watching.
              </p>
            </div>
          </div>
          
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t('hero.tagline')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="glow-box bg-primary text-primary-foreground hover:bg-primary/90 font-display text-lg px-8 py-6 group"
          >
            <span className="group-hover:animate-glitch">{t('hero.join')}</span>
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={scrollToRoles}
            className="border-secondary text-secondary hover:bg-secondary/10 font-display text-lg px-8 py-6"
          >
            {t('hero.explore')}
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce cursor-pointer" onClick={scrollToRoles}>
          <ChevronDown className="w-8 h-8 text-primary mx-auto" />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
