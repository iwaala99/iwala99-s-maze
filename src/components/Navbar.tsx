import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import CompactTime from './CompactTime';
import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';
import SoundControls from './SoundControls';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, MessageSquare, Mail, Brain, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useUnreadMessages();
  const { user } = useAuth();
  const { t, isRTL } = useLanguage();

  const navItems = [
    { path: '/puzzles', label: t('nav.puzzles'), icon: Brain },
    { path: '/chat', label: t('nav.aiChat'), icon: Bot },
    { path: '/feed', label: t('nav.feed'), icon: MessageSquare },
    { path: '/messages', label: t('nav.messages'), icon: Mail, badge: unreadCount },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/60 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-200"
          >
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              IWALA99
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map(({ path, label, icon: Icon, badge }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 relative text-sm py-1 transition-colors duration-200 ${
                  location.pathname === path 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {badge != null && badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span className="font-medium">{label}</span>
                {location.pathname === path && (
                  <span className={`absolute -bottom-[17px] ${isRTL ? 'right-0' : 'left-0'} w-full h-[2px] bg-foreground rounded-full transition-all duration-300`} />
                )}
              </button>
            ))}

            {user && (
              <button
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 relative text-sm py-1 transition-colors duration-200 ${
                  location.pathname.startsWith('/profile') 
                    ? 'text-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="font-medium">{t('nav.profile')}</span>
                {location.pathname.startsWith('/profile') && (
                  <span className={`absolute -bottom-[17px] ${isRTL ? 'right-0' : 'left-0'} w-full h-[2px] bg-foreground rounded-full transition-all duration-300`} />
                )}
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            <div className="hidden lg:block">
              <CompactTime />
            </div>
            {user && <NotificationBell />}
            <SoundControls />
            <ThemeToggle />
            <UserMenu />
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground h-9 w-9"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-3 border-t border-border/60 animate-fade-up space-y-1">
            <div className="mb-3 pb-3 border-b border-border/40">
              <CompactTime />
            </div>
            
            {navItems.map(({ path, label, icon: Icon, badge }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                  location.pathname === path 
                    ? 'text-foreground bg-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {badge != null && badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span className="font-medium">{label}</span>
              </button>
            ))}

            {user && (
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm transition-all duration-200 ${
                  location.pathname.startsWith('/profile') 
                    ? 'text-foreground bg-accent' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="font-medium">{t('nav.profile')}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
