
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from './types';

export const fetchUserRole = async (userId: string): Promise<UserRole> => {
  try {
    console.log('Fetching role for user ID:', userId);
    
    if (!userId) {
      console.error('Invalid user ID provided to fetchUserRole');
      return 'user'; // Default to user role if no userId is provided
    }
    
    // Direct SQL query to fetch the role to avoid potential RLS issues
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching user role:', error.message, error.details);
      return 'user';
    }
    
    if (!data) {
      console.log('No role found for user, returning default user role');
      return 'user';
    }
    
    console.log('User role from database:', data.role);
    return (data.role as UserRole) || 'user';
  } catch (error) {
    console.error('Exception in fetchUserRole:', error);
    return 'user';
  }
};
