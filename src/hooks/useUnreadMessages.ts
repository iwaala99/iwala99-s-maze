import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUnreadMessages = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadByConversation, setUnreadByConversation] = useState<Record<string, number>>({});

  const fetchUnreadCounts = async () => {
    if (!user) {
      setUnreadCount(0);
      setUnreadByConversation({});
      return;
    }

    try {
      // Get all conversations the user is part of
      const { data: participantData } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (!participantData || participantData.length === 0) {
        setUnreadCount(0);
        setUnreadByConversation({});
        return;
      }

      const conversationIds = participantData.map(p => p.conversation_id);

      // Get unread messages (messages not sent by user and not read)
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id, conversation_id')
        .in('conversation_id', conversationIds)
        .neq('sender_id', user.id)
        .is('read_at', null);

      if (!unreadMessages) {
        setUnreadCount(0);
        setUnreadByConversation({});
        return;
      }

      // Count by conversation
      const countByConv: Record<string, number> = {};
      unreadMessages.forEach(msg => {
        countByConv[msg.conversation_id] = (countByConv[msg.conversation_id] || 0) + 1;
      });

      setUnreadByConversation(countByConv);
      setUnreadCount(unreadMessages.length);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  const markAsRead = async (conversationId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read_at', null);

      // Refresh counts
      fetchUnreadCounts();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCounts();

    if (!user) return;

    // Subscribe to new messages for real-time updates
    const channel = supabase
      .channel('unread-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          // Only update if the message is not from the current user
          if (payload.new.sender_id !== user.id) {
            fetchUnreadCounts();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { unreadCount, unreadByConversation, markAsRead, refetch: fetchUnreadCounts };
};
