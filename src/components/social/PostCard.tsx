import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import CommentsSection from './CommentsSection';

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

interface PostCardProps {
  post: Post;
  onDelete: () => void;
}

const categoryColors: Record<string, string> = {
  general: 'bg-muted/50 text-muted-foreground',
  tools: 'bg-primary/20 text-primary',
  ctf: 'bg-secondary/20 text-secondary',
  news: 'bg-destructive/20 text-destructive',
  jobs: 'bg-green-500/20 text-green-400',
  learning: 'bg-blue-500/20 text-blue-400',
  writeups: 'bg-purple-500/20 text-purple-400',
};

const categoryLabels: Record<string, string> = {
  general: 'General',
  tools: 'Tools',
  ctf: 'CTF',
  news: 'News',
  jobs: 'Jobs',
  learning: 'Learning',
  writeups: 'Write-up',
};

const PostCard = ({ post, onDelete }: PostCardProps) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(post.comments_count);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfLiked();
    }
  }, [user, post.id]);

  const checkIfLiked = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .maybeSingle();
    
    setLiked(!!data);
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Log in to like posts');
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      if (liked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        
        setLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await supabase
          .from('post_likes')
          .insert({ post_id: post.id, user_id: user.id });
        
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!user || user.id !== post.user_id) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;
      
      toast.success('Post deleted');
      onDelete();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <div className="terminal-border card-hover bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-mono font-bold">
                {post.profiles?.username?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
            <div>
              <p className="font-mono text-primary font-medium">
                @{post.profiles?.username || 'unknown'}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-mono ${categoryColors[post.category] || categoryColors.general}`}>
              {categoryLabels[post.category] || post.category}
            </span>
            
            {user?.id === post.user_id && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <p className="text-foreground whitespace-pre-wrap break-words">
            {post.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t border-primary/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`gap-2 ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
            {likesCount}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="gap-2 text-muted-foreground hover:text-primary"
          >
            <MessageCircle className="w-4 h-4" />
            {commentsCount}
          </Button>
        </div>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentsSection 
          postId={post.id} 
          onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
          onCommentDeleted={() => setCommentsCount((prev) => prev - 1)}
        />
      )}
    </div>
  );
};

export default PostCard;
