
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/hooks/useNotifications';

export interface AdminProfileData {
  avatarUrl: string | null;
}

export const useAdminProfile = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { hasNotifications } = useNotifications();

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
