import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Terminal, MessageCircle } from 'lucide-react';
import WorldClock from './WorldClock';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="about" className="relative py-16 border-t border-primary/20">
      <div className="absolute inset-0 matrix-bg opacity-20" />
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-primary animate-glow-pulse" />
              <Terminal className="w-5 h-5 text-secondary" />
              <span className="font-display font-bold text-2xl text-primary glow-text">
                IWALA99
              </span>
            </div>
            <p className="text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-primary">
              {t('nav.resources')}
            </h4>
            <div className="space-y-2">
              <a href="#roles" className="block text-muted-foreground hover:text-primary transition-colors">
                {t('nav.roles')}
              </a>
              <a href="#community" className="block text-muted-foreground hover:text-primary transition-colors">
                {t('nav.community')}
              </a>
              <a href="#resources" className="block text-muted-foreground hover:text-primary transition-colors">
                {t('nav.resources')}
              </a>
              <a 
                href="https://discord.gg/Rw2nYydFwJ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-primary transition-colors"
              >
                Discord Server
              </a>
            </div>
          </div>

          {/* Time & Social */}
          <div className="space-y-6 md:col-span-3 lg:col-span-1">
            <WorldClock />
            
            <div className="flex gap-4">
              <a
                href="https://discord.gg/Rw2nYydFwJ"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
                className="flex items-center gap-2 p-3 terminal-border text-muted-foreground hover:text-primary hover:glow-box transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Join Discord</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-primary/20 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} IWALA99. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;