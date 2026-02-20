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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity"
          >
            <span className="font-display font-bold text-xl text-foreground tracking-tight">
              IWALA99
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ path, label, icon: Icon, badge }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 transition-colors duration-200 relative text-sm ${
                  location.pathname === path ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {badge != null && badge > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span>{label}</span>
                {location.pathname === path && (
                  <span className={`absolute -bottom-1 ${isRTL ? 'right-0' : 'left-0'} w-full h-0.5 bg-foreground`} />
                )}
              </button>
            ))}

            {user && (
              <button
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 transition-colors duration-200 relative text-sm ${
                  location.pathname.startsWith('/profile') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t('nav.profile')}</span>
                {location.pathname.startsWith('/profile') && (
                  <span className={`absolute -bottom-1 ${isRTL ? 'right-0' : 'left-0'} w-full h-0.5 bg-foreground`} />
                )}
              </button>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
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
              className="md:hidden text-foreground"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-up">
            <div className="mb-4">
              <CompactTime />
            </div>
            
            {navItems.map(({ path, label, icon: Icon, badge }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path);
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-${isRTL ? 'right' : 'left'} py-3 transition-colors duration-200 text-sm ${
                  location.pathname === path ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className="relative">
                  <Icon className="w-4 h-4" />
                  {badge != null && badge > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </div>
                <span>{label}</span>
              </button>
            ))}

            {user && (
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-${isRTL ? 'right' : 'left'} py-3 transition-colors duration-200 text-sm ${
                  location.pathname.startsWith('/profile') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t('nav.profile')}</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
