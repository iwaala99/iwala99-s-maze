import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut } from 'lucide-react';

interface Profile {
  username: string;
}

interface UserRole {
  role: string;
}

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      // Fetch profile
      supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setProfile(data);
        });

      // Fetch roles
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .then(({ data }) => {
          if (data) {
            setRoles(data.map((r: UserRole) => r.role));
          }
        });
    }
  }, [user]);

  if (!user) {
    return (
      <Button
        variant="ghost"
        onClick={() => navigate('/auth')}
        className="gap-2 text-foreground hover:bg-accent"
      >
        <User className="w-4 h-4" />
        <span className="hidden sm:inline text-sm">Join</span>
      </Button>
    );
  }

  const formatRole = (role: string) => {
    return role.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="gap-2 text-foreground hover:bg-accent">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline font-mono text-sm">
            {profile?.username || 'User'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-card border-border backdrop-blur-sm min-w-[200px]"
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-foreground">{profile?.username}</p>
          {roles.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {roles.slice(0, 2).map((role) => (
                <span
                  key={role}
                  className="text-xs px-2 py-0.5 bg-muted text-muted-foreground rounded-full"
                >
                  {formatRole(role)}
                </span>
              ))}
              {roles.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{roles.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
