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
import { Menu, X, MessageSquare, Mail, Brain, User, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useUnreadMessages();
  const { user } = useAuth();

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
            <button
              onClick={() => navigate('/puzzles')}
              className={`flex items-center gap-2 transition-colors duration-200 relative text-sm ${
                location.pathname === '/puzzles' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Puzzles</span>
              {location.pathname === '/puzzles' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-foreground" />
              )}
            </button>

            <button
              onClick={() => navigate('/chat')}
              className={`flex items-center gap-2 transition-colors duration-200 relative text-sm ${
                location.pathname === '/chat' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Chat</span>
              {location.pathname === '/chat' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-foreground" />
              )}
            </button>

            <button
              onClick={() => navigate('/feed')}
              className={`flex items-center gap-2 transition-colors duration-200 relative text-sm ${
                location.pathname === '/feed' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feed</span>
              {location.pathname === '/feed' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-foreground" />
              )}
            </button>

            <button
              onClick={() => navigate('/messages')}
              className={`flex items-center gap-2 transition-colors duration-200 relative text-sm ${
                location.pathname === '/messages' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <Mail className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span>Messages</span>
              {location.pathname === '/messages' && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-foreground" />
              )}
            </button>

            {user && (
              <button
                onClick={() => navigate('/profile')}
                className={`flex items-center gap-2 transition-colors duration-200 relative text-sm ${
                  location.pathname.startsWith('/profile') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
                {location.pathname.startsWith('/profile') && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-foreground" />
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
            
            <button
              onClick={() => {
                navigate('/puzzles');
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full text-left py-3 transition-colors duration-200 text-sm ${
                location.pathname === '/puzzles' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
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
              className={`flex items-center gap-2 w-full text-left py-3 transition-colors duration-200 text-sm ${
                location.pathname === '/feed' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Feed</span>
            </button>

            <button
              onClick={() => {
                navigate('/chat');
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full text-left py-3 transition-colors duration-200 text-sm ${
                location.pathname === '/chat' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Chat</span>
            </button>

            <button
              onClick={() => {
                navigate('/messages');
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 w-full text-left py-3 transition-colors duration-200 text-sm ${
                location.pathname === '/messages' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="relative">
                <Mail className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
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
                className={`flex items-center gap-2 w-full text-left py-3 transition-colors duration-200 text-sm ${
                  location.pathname.startsWith('/profile') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
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
