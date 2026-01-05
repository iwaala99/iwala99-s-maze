import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useConversations, useMessages, Conversation } from '@/hooks/useMessages';
import ConversationList from '@/components/messages/ConversationList';
import MessageThread from '@/components/messages/MessageThread';
import UserSearch from '@/components/messages/UserSearch';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Messages = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { conversations, loading: convLoading, refetch } = useConversations();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const { messages, loading: msgLoading, sendMessage } = useMessages(selectedConversation);
  const [showMobileThread, setShowMobileThread] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleSelectConversation = (id: string) => {
    setSelectedConversation(id);
    setShowMobileThread(true);
  };

  const handleConversationStarted = (conversationId: string) => {
    refetch();
    setSelectedConversation(conversationId);
    setShowMobileThread(true);
  };

  const getOtherUsername = () => {
    const conv = conversations.find(c => c.id === selectedConversation);
    if (!conv) return 'Unknown';
    const other = conv.participants.find(p => p.user_id !== user?.id);
    return other?.profile.username || 'Unknown';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto px-4 h-[calc(100vh-12rem)]">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-display">Messages</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[calc(100%-4rem)]">
            {/* Conversation List - Hidden on mobile when thread is open */}
            <div className={`md:col-span-1 bg-card rounded-xl border border-border overflow-hidden ${showMobileThread ? 'hidden md:block' : ''}`}>
              <UserSearch onConversationStarted={handleConversationStarted} />
              <div className="h-[calc(100%-5rem)]">
                <ConversationList
                  conversations={conversations}
                  selectedId={selectedConversation}
                  onSelect={handleSelectConversation}
                  loading={convLoading}
                />
              </div>
            </div>

            {/* Message Thread */}
            <div className={`md:col-span-2 bg-card rounded-xl border border-border overflow-hidden ${!showMobileThread ? 'hidden md:block' : ''}`}>
              {selectedConversation ? (
                <>
                  <div className="md:hidden p-2 border-b border-border">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowMobileThread(false)}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </div>
                  <div className="h-full md:h-full" style={{ height: showMobileThread ? 'calc(100% - 3rem)' : '100%' }}>
                    <MessageThread
                      messages={messages}
                      loading={msgLoading}
                      onSendMessage={sendMessage}
                      otherUsername={getOtherUsername()}
                    />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-lg">Select a conversation</p>
                  <p className="text-sm">Or search for a user to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;
