import React, { useState } from 'react';
import { Bell, Check, Trash2, Brain, Trophy, MessageSquare, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

const typeIcons: Record<string, React.ReactNode> = {
  new_puzzle: <Brain className="h-4 w-4 text-primary" />,
  level_up: <Trophy className="h-4 w-4 text-yellow-500" />,
  recruitment: <Lock className="h-4 w-4 text-secondary" />,
  solved: <Sparkles className="h-4 w-4 text-green-500" />,
  message: <MessageSquare className="h-4 w-4 text-blue-500" />,
};

const typeColors: Record<string, string> = {
  new_puzzle: 'border-l-primary',
  level_up: 'border-l-yellow-500',
  recruitment: 'border-l-secondary',
  solved: 'border-l-green-500',
  message: 'border-l-blue-500',
};

function NotificationItem({ 
  notification, 
  onRead, 
  onDelete 
}: { 
  notification: Notification; 
  onRead: () => void; 
  onDelete: () => void;
}) {
  const isUnread = !notification.read_at;

  return (
    <div 
      className={`
        p-3 border-l-2 ${typeColors[notification.type] || 'border-l-muted'}
        ${isUnread ? 'bg-primary/5' : 'bg-transparent'}
        hover:bg-muted/50 transition-colors cursor-pointer group
      `}
      onClick={onRead}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {typeIcons[notification.type] || <Bell className="h-4 w-4 text-muted-foreground" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-foreground truncate">
              {notification.title}
            </span>
            {isUnread && (
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {notification.message}
          </p>
          <span className="text-[10px] text-muted-foreground/60 font-mono mt-1 block">
            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-all"
        >
          <Trash2 className="h-3 w-3 text-destructive" />
        </button>
      </div>
    </div>
  );
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-primary"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 bg-background/95 backdrop-blur-lg border-primary/20" 
        align="end"
      >
        <div className="flex items-center justify-between p-3 border-b border-primary/10">
          <h3 className="font-mono text-sm font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-80">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-mono">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-primary/5">
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                  onDelete={() => deleteNotification(notification.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
