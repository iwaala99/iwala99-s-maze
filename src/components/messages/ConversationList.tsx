import { useAuth } from '@/contexts/AuthContext';
import { Conversation } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading: boolean;
}

const ConversationList = ({ conversations, selectedId, onSelect, loading }: ConversationListProps) => {
  const { user } = useAuth();

  const getOtherParticipant = (conv: Conversation) => {
    const other = conv.participants.find(p => p.user_id !== user?.id);
    return other?.profile.username || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-4">
        <MessageSquare className="w-12 h-12 mb-2 opacity-50" />
        <p className="text-center text-sm">No conversations yet</p>
        <p className="text-center text-xs mt-1">Start chatting with other members!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-1 p-2">
        {conversations.map((conv) => (
          <button
            key={conv.id}
            onClick={() => onSelect(conv.id)}
            className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all ${
              selectedId === conv.id
                ? 'bg-primary/20 border border-primary/50'
                : 'hover:bg-muted/50 border border-transparent'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-medium text-foreground truncate">
                {getOtherParticipant(conv)}
              </p>
              {conv.last_message && (
                <p className="text-sm text-muted-foreground truncate">
                  {conv.last_message.sender_id === user?.id ? 'You: ' : ''}
                  {conv.last_message.content}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
              </p>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ConversationList;
