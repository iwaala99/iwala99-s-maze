import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, User, MessageSquare } from 'lucide-react';
import { useStartConversation } from '@/hooks/useMessages';
import { toast } from 'sonner';

interface UserSearchProps {
  onConversationStarted: (conversationId: string) => void;
}

interface SearchResult {
  id: string;
  username: string;
}

const UserSearch = ({ onConversationStarted }: UserSearchProps) => {
  const { user } = useAuth();
  const { startConversation } = useStartConversation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [starting, setStarting] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim() || !user) return;

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .ilike('username', `%${query}%`)
        .neq('id', user.id)
        .limit(10);

      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleStartConversation = async (userId: string) => {
    setStarting(userId);
    try {
      const conversationId = await startConversation(userId);
      if (conversationId) {
        onConversationStarted(conversationId);
        setQuery('');
        setResults([]);
        toast.success('Conversation started!');
      } else {
        toast.error('Failed to start conversation');
      }
    } catch (error) {
      toast.error('Failed to start conversation');
    } finally {
      setStarting(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4 border-b border-border">
      <div className="flex gap-2 mb-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search users..."
          className="flex-1 bg-muted/50 border-border"
        />
        <Button 
          onClick={handleSearch} 
          variant="outline"
          disabled={searching || !query.trim()}
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((result) => (
            <div
              key={result.id}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-sm">{result.username}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleStartConversation(result.id)}
                disabled={starting === result.id}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && !searching && (
        <p className="text-sm text-muted-foreground text-center py-2">
          No users found
        </p>
      )}
    </div>
  );
};

export default UserSearch;
