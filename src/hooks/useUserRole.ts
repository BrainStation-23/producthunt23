
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';

export const useUserRole = () => {
  const [isLoadingRole, setIsLoadingRole] = useState(false);
  
  const fetchUserRole = async (userId: string): Promise<UserRole> => {
    try {
      setIsLoadingRole(true);
      console.log('Fetching role for user ID:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'user'; // Default to user if error
      } else {
        console.log('User role from database:', data?.role);
        return (data?.role as UserRole) || 'user';
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return 'user'; // Default to user if error
    } finally {
      setIsLoadingRole(false);
    }
  };

  return {
    fetchUserRole,
    isLoadingRole
  };
};
