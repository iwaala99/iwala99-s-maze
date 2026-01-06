import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
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

  const scrollToMaze = () => {
    const element = document.querySelector('#maze');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
      
      {/* Subtle grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground) / 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground) / 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main content */}
        <div className="mb-8 animate-fade-up">
          <p className="text-muted-foreground text-lg md:text-xl mb-4 font-light tracking-wide">
            {t('hero.welcome')}
          </p>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="text-foreground">
              {typedText}
            </span>
            <span className="animate-blink text-muted-foreground">_</span>
          </h1>

          {/* Professional tagline */}
          <div className="h-12 flex items-center justify-center mb-6">
            <p className="font-mono text-sm md:text-base text-muted-foreground tracking-wider">
              Intelligence. Precision. Excellence.
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
            {t('hero.tagline')}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <Button
            size="lg"
            onClick={scrollToMaze}
            className="bg-foreground text-background hover:bg-foreground/90 font-display text-base px-8 py-6 transition-all duration-300"
          >
            Enter the Maze
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/auth')}
            className="border-border text-foreground hover:bg-accent font-display text-base px-8 py-6"
          >
            {t('hero.join')}
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity" onClick={scrollToMaze}>
          <ChevronDown className="w-8 h-8 text-foreground mx-auto" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
