import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categories = [
  { value: 'general', label: 'General Discussion' },
  { value: 'tools', label: 'Tools & Scripts' },
  { value: 'ctf', label: 'CTF Challenges' },
  { value: 'news', label: 'Security News' },
  { value: 'jobs', label: 'Job Opportunities' },
  { value: 'learning', label: 'Learning Resources' },
  { value: 'writeups', label: 'Write-ups' },
];

interface CreatePostProps {
  onPostCreated: () => void;
}

const CreatePost = ({ onPostCreated }: CreatePostProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to post');
      return;
    }

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    if (content.length > 2000) {
      toast.error('Post must be less than 2000 characters');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: content.trim(),
          category,
        });

      if (error) throw error;

      setContent('');
      setCategory('general');
      toast.success('Post shared with the network!');
      onPostCreated();
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="terminal-border bg-card/50 backdrop-blur-sm p-6 rounded-lg text-center">
        <p className="text-muted-foreground">Log in to share with the network</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="terminal-border bg-card/50 backdrop-blur-sm p-6 rounded-lg space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share intel, tools, or start a discussion..."
        className="bg-muted/50 border-primary/30 focus:border-primary text-foreground min-h-[100px] resize-none"
        maxLength={2000}
      />
      
      <div className="flex items-center justify-between gap-4">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[200px] bg-muted/50 border-primary/30">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-card border-primary/30">
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {content.length}/2000
          </span>
          <Button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="glow-box bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreatePost;
