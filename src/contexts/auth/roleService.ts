
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from './types';

export const fetchUserRole = async (userId: string): Promise<UserRole> => {
  try {
    console.log('Fetching role for user ID:', userId);
    
    if (!userId) {
      console.error('Invalid user ID provided to fetchUserRole');
      return 'user'; // Default to user role if no userId is provided
    }
    
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle(); // Using maybeSingle instead of single to avoid errors when no role is found
    
    if (error) {
      console.error('Error fetching user role:', error.message, error.details);
      return 'user';
    }
    
    if (!data) {
      console.log('No role found for user, creating default user role');
      
      // If no role exists, try to create a default 'user' role for this user
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'user' });
        
      if (insertError) {
        console.error('Error creating default user role:', insertError.message);
      } else {
        console.log('Default user role created successfully');
      }
      
      return 'user';
    }
    
    console.log('User role from database:', data.role);
    return (data.role as UserRole) || 'user';
  } catch (error) {
    console.error('Exception in fetchUserRole:', error);
    return 'user';
  }
};
