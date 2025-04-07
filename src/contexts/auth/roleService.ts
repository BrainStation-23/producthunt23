
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from './types';

export const fetchUserRole = async (userId: string): Promise<UserRole> => {
  try {
    console.log('Fetching role for user ID:', userId);
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    } else {
      console.log('User role from database:', data?.role);
      return (data?.role as UserRole) || 'user';
    }
  } catch (error) {
    console.error('Error in fetchUserRole:', error);
    return 'user';
  }
};
