
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Notification {
  id: string;
  user_id: string;
  type: 'product_pending' | 'product_approved' | 'product_rejected' | 'report' | 'system';
  title: string;
  message: string;
  link: string | null;
  related_id: string | null;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Fetch notifications for the current user, most recent first
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notifications:', error);
        toast.error('Failed to load notifications');
        throw error;
      }

      // Count unread notifications
      const unread = data.filter((notification: any) => !notification.read).length;
      setUnreadCount(unread);

      return data as Notification[];
    },
    enabled: !!user,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Mark a notification as read
  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user) return false;

      const { data, error } = await supabase.rpc('mark_notification_read', {
        notification_id: notificationId
      });

      if (error) {
        console.error('Error marking notification as read:', error);
        toast.error('Failed to update notification');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    }
  });

  // Mark all notifications as read
  const markAllAsRead = useMutation({
    mutationFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase.rpc('mark_all_notifications_read');

      if (error) {
        console.error('Error marking all notifications as read:', error);
        toast.error('Failed to update notifications');
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      setUnreadCount(0);
    }
  });

  // Subscribe to new notifications in real-time
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Invalidate cache to refetch notifications
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
          
          // Update unread count
          setUnreadCount(prev => prev + 1);
          
          // Show toast notification
          const notification = payload.new as Notification;
          toast.info(notification.title, {
            description: notification.message,
            action: notification.link ? {
              label: 'View',
              onClick: () => {
                markAsRead.mutate(notification.id);
                window.location.href = notification.link!;
              }
            } : undefined
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    hasNotifications: unreadCount > 0,
    markAsRead: markAsRead.mutate,
    markAllAsRead: markAllAsRead.mutate
  };
};
