import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

const HeroSection = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'IWALA99';

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        // Keep cursor blinking after typing completes
      }
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-14">
      {/* Clean layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-background" />
      
      {/* Precise grid */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.4)_70%,hsl(var(--background))_100%)]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main content with staggered animations */}
        <div className="space-y-6">
          <p className="text-muted-foreground text-base md:text-lg font-light tracking-widest uppercase opacity-0 animate-fade-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            {t('hero.welcome')}
          </p>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tighter leading-none opacity-0 animate-fade-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            <span className="text-foreground">
              {typedText}
            </span>
            <span className={`text-muted-foreground/50 ${showCursor ? 'animate-blink' : 'opacity-0'}`}>|</span>
          </h1>

          {/* Monospace tagline with refined spacing */}
          <div className="flex items-center justify-center opacity-0 animate-fade-up" style={{ animationDelay: '0.35s', animationFillMode: 'forwards' }}>
            <p className="font-mono text-xs md:text-sm text-muted-foreground tracking-[0.25em] uppercase">
              {t('hero.subtitle')}
            </p>
          </div>
          
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-light opacity-0 animate-fade-up" style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}>
            {t('hero.tagline')}
          </p>

          {/* CTA Buttons with refined styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 opacity-0 animate-fade-up" style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}>
            <Button
              size="lg"
              onClick={() => navigate('/puzzles')}
              className="bg-foreground text-background hover:bg-foreground/90 font-display text-sm px-8 h-12 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('hero.enterMaze')}
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="border-border/80 text-foreground hover:bg-accent font-display text-sm px-8 h-12 rounded-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {t('hero.join')}
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
        >
          <div className="animate-bounce cursor-pointer opacity-40 hover:opacity-80 transition-opacity duration-300" onClick={() => navigate('/puzzles')}>
            <ChevronDown className="w-6 h-6 text-foreground mx-auto" />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
