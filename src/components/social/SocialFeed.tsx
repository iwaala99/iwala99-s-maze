import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import CreatePost from './CreatePost';
import PostCard from './PostCard';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Post {
  id: string;
  content: string;
  category: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
  };
}

const categories = [
  { value: 'all', label: 'All Posts' },
  { value: 'general', label: 'General' },
  { value: 'tools', label: 'Tools & Scripts' },
  { value: 'ctf', label: 'CTF Challenges' },
  { value: 'news', label: 'Security News' },
  { value: 'jobs', label: 'Jobs' },
  { value: 'learning', label: 'Learning' },
  { value: 'writeups', label: 'Write-ups' },
];

const SocialFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('posts-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedCategory]);

  const fetchPosts = async () => {
    try {
      let query = supabase
        .from('posts')
        .select(`
          id,
          content,
          category,
          likes_count,
          comments_count,
          created_at,
          user_id,
          profiles (username)
        `)
        .order('created_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data as Post[] || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <CreatePost onPostCreated={fetchPosts} />

      {/* Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-muted/50 border-primary/30">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-card border-primary/30">
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={fetchPosts}
          className="text-muted-foreground hover:text-primary"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="terminal-border bg-card/50 backdrop-blur-sm p-12 rounded-lg text-center">
          <p className="text-muted-foreground mb-2">No posts yet</p>
          <p className="text-sm text-muted-foreground/60">
            Be the first to share something with the network!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onDelete={fetchPosts} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialFeed;
