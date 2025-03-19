
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface AdminProfileData {
  avatarUrl: string | null;
  hasNotifications: boolean;
}

export const useAdminProfile = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }
        
        setAvatarUrl(data?.avatar_url || null);
        
        // Simulate notifications (in a real app, you would fetch actual notifications)
        setHasNotifications(Math.random() > 0.5);
      } catch (error) {
        console.error('Failed to fetch admin profile:', error);
      }
    };
    
    fetchAdminProfile();
  }, [user]);

  const getAdminInitials = () => {
    if (!user || !user.email) return 'A';
    return 'A' + user.email.charAt(0).toUpperCase();
  };

  return {
    avatarUrl,
    hasNotifications,
    getAdminInitials
  };
};
