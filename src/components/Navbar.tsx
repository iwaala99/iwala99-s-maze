import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import LanguageSwitcher from './LanguageSwitcher';
import MoroccoTime from './MoroccoTime';
import UserMenu from './UserMenu';
import { Menu, X, Shield, Terminal, MessageSquare, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useUnreadMessages();

  const isHomePage = location.pathname === '/';

  const homeNavItems = [
    { key: 'nav.home', href: '#home' },
    { key: 'nav.roles', href: '#roles' },
    { key: 'nav.community', href: '#community' },
    { key: 'nav.resources', href: '#resources' },
    { key: 'nav.about', href: '#about' },
  ];

  const scrollToSection = (href: string) => {
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-primary animate-glow-pulse" />
              <Terminal className="w-4 h-4 text-secondary absolute -bottom-1 -right-1" />
            </div>
            <span className="font-display font-bold text-xl text-primary glow-text">
              IWALA99
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isHomePage && homeNavItems.map((item) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.href)}
                className="text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                {t(item.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            
            <button
              onClick={() => navigate('/feed')}
              className={`flex items-center gap-2 transition-colors duration-300 relative group ${
                location.pathname === '/feed' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feed</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                location.pathname === '/feed' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>

            <button
              onClick={() => navigate('/messages')}
              className={`flex items-center gap-2 transition-colors duration-300 relative group ${
                location.pathname === '/messages' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <div className="relative">
                <Mail className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span>Messages</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                location.pathname === '/messages' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              <MoroccoTime />
            </div>
            <UserMenu />
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-primary"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary/20 animate-fade-up">
            <div className="mb-4">
              <MoroccoTime />
            </div>
            
            {isHomePage && homeNavItems.map((item, index) => (
              <button
                key={item.key}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left py-3 text-muted-foreground hover:text-primary transition-colors duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {t(item.key)}
              </button>
            ))}
            
            <button
              onClick={() => {
                navigate('/feed');
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full text-left py-3 transition-colors duration-300 ${
                location.pathname === '/feed' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Cyber Feed</span>
            </button>

            <button
              onClick={() => {
                navigate('/messages');
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full text-left py-3 transition-colors duration-300 ${
                location.pathname === '/messages' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <div className="relative">
                <Mail className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span>Messages</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;