import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle } from 'lucide-react';
import WorldClock from './WorldClock';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer id="about" className="relative py-16 border-t border-border">
      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-2xl text-foreground tracking-tight">
                IWALA99
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-foreground text-sm tracking-wide">
              {t('nav.resources')}
            </h4>
            <div className="space-y-3">
              <a href="#roles" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
                {t('nav.roles')}
              </a>
              <a href="#community" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
                {t('nav.community')}
              </a>
              <a href="#resources" className="block text-muted-foreground hover:text-foreground transition-colors text-sm">
                {t('nav.resources')}
              </a>
              <a 
                href="https://discord.gg/Rw2nYydFwJ" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-muted-foreground hover:text-foreground transition-colors text-sm"
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
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-md text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-300 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">Join Discord</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} IWALA99. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
