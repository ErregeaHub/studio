'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Notification {
  id: number;
  recipient_id: number;
  actor_id: number;
  actor_name: string;
  actor_avatar: string;
  type: 'follow' | 'comment' | 'like';
  reference_id?: number;
  is_read: number;
  created_at: string;
}

export default function NotificationList() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications?userId=${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT'
      });
      if (res.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="h-3 w-3 fill-primary text-primary" />;
      case 'comment': return <MessageCircle className="h-3 w-3 fill-primary text-primary" />;
      case 'follow': return <UserPlus className="h-3 w-3 fill-green-500 text-green-500" />;
      default: return <Bell className="h-3 w-3" />;
    }
  };

  const getMessage = (notification: Notification) => {
    switch (notification.type) {
      case 'like': return 'liked your post';
      case 'comment': return 'commented on your post';
      case 'follow': return 'started following you';
      default: return 'interacted with you';
    }
  };

  const getLink = (notification: Notification) => {
    switch (notification.type) {
      case 'follow': return `/profile/${notification.actor_name}`;
      case 'comment': 
      case 'like': 
        return notification.reference_id ? `/media/${notification.reference_id}` : '#';
      default: return '#';
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading updates...</div>;
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center p-6">
        <div className="h-12 w-12 rounded-2xl bg-secondary/30 flex items-center justify-center mb-4 ring-1 ring-border/50">
          <Bell className="h-6 w-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-bold text-foreground">No notifications</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">When someone interacts with you, it will show up here.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] w-full p-2">
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <div 
            key={notification.id} 
            className={cn(
              "relative flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group",
              notification.is_read 
                ? "bg-transparent active:bg-secondary/20" 
                : "bg-primary/5 border border-primary/10 active:border-primary/20"
            )}
          >
            <Link href={`/profile/${notification.actor_name}`} className="relative flex-shrink-0">
              <Avatar className="h-10 w-10 border-2 border-background ring-1 ring-border/10">
                <AvatarImage src={notification.actor_avatar} />
                <AvatarFallback>{notification.actor_name?.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 shadow-sm ring-1 ring-border/10">
                {getIcon(notification.type)}
              </div>
            </Link>
            
            <div className="flex-1 min-w-0 pt-0.5">
              <Link 
                href={getLink(notification)} 
                className="block group/link"
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="text-sm leading-snug">
                  <span className="font-bold active:text-primary transition-colors">{notification.actor_name}</span>
                  <span className="text-muted-foreground ml-1">{getMessage(notification)}</span>
                </div>
                <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider mt-1 font-medium">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </Link>
            </div>

            {!notification.is_read && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full active:bg-primary/10 active:text-primary shrink-0 opacity-100 transition-opacity"
                onClick={() => markAsRead(notification.id)}
                title="Mark as read"
              >
                <Check className="h-3 w-3" />
              </Button>
            )}
            
            {!notification.is_read && (
               <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse active:hidden" />
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
