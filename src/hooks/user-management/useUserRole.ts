
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserRole = (refetch: () => void) => {
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user' | 'judge') => {
    try {
      console.log(`Updating role for user ${userId} to ${newRole}`);
      
      // Since we've added a unique constraint to the user_id column,
      // we can simply use upsert which will either:
      // - Insert a new role if the user doesn't have one
      // - Update the existing role if the user already has one
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: newRole 
        });
      
      if (error) {
        console.error('Error updating user role:', error);
        throw error;
      }
      
      toast.success(`User role updated to ${newRole}`);
      refetch();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  return { handleRoleChange };
};
