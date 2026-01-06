import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { useUnreadMessages } from '@/hooks/useUnreadMessages';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import CompactTime from './CompactTime';
import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';
import SoundControls from './SoundControls';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, Shield, Terminal, MessageSquare, Mail, Brain, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useUnreadMessages();
  const { user } = useAuth();


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
            
            <button
              onClick={() => navigate('/puzzles')}
              className={`flex items-center gap-2 transition-colors duration-300 relative group ${
                location.pathname === '/puzzles' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Puzzles</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                location.pathname === '/puzzles' ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </button>

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

            {user && (
              <button
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 transition-colors duration-300 relative group ${
                  location.pathname.startsWith('/profile') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                  location.pathname.startsWith('/profile') ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
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
              <CompactTime />
            </div>
            
            
            <button
              onClick={() => {
                navigate('/puzzles');
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full text-left py-3 transition-colors duration-300 ${
                location.pathname === '/puzzles' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Puzzles</span>
            </button>

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

            {user && (
              <button
                onClick={() => {
                  navigate('/profile');
                  setIsOpen(false);
                }}
                className={`flex items-center gap-2 w-full text-left py-3 transition-colors duration-300 ${
                  location.pathname.startsWith('/profile') ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;