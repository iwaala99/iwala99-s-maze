import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTypingIndicator = (conversationId: string | null) => {
  const { user } = useAuth();
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [otherTypingUsername, setOtherTypingUsername] = useState<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const sendTypingIndicator = useCallback(() => {
    if (!conversationId || !user || !channelRef.current) return;

    channelRef.current.track({
      user_id: user.id,
      typing: true,
      timestamp: Date.now()
    });

    // Clear typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (channelRef.current) {
        channelRef.current.track({
          user_id: user.id,
          typing: false,
          timestamp: Date.now()
        });
      }
    }, 3000);
  }, [conversationId, user]);

  const stopTyping = useCallback(() => {
    if (!channelRef.current || !user) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    channelRef.current.track({
      user_id: user.id,
      typing: false,
      timestamp: Date.now()
    });
  }, [user]);

  useEffect(() => {
    if (!conversationId || !user) return;

    const channel = supabase.channel(`typing-${conversationId}`, {
      config: { presence: { key: user.id } }
    });

    channelRef.current = channel;

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        let foundTyping = false;
        let typingUser: string | null = null;

        Object.entries(state).forEach(([key, presences]) => {
          if (key !== user.id) {
            const presence = (presences as any[])[0];
            if (presence?.typing) {
              foundTyping = true;
              // Fetch username
              supabase
                .from('profiles')
                .select('username')
                .eq('id', key)
                .single()
                .then(({ data }) => {
                  if (data) {
                    setOtherTypingUsername(data.username);
                  }
                });
            }
          }
        });

        setIsOtherTyping(foundTyping);
        if (!foundTyping) {
          setOtherTypingUsername(null);
        }
      })
      .subscribe();

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [conversationId, user]);

  return { isOtherTyping, otherTypingUsername, sendTypingIndicator, stopTyping };
};
