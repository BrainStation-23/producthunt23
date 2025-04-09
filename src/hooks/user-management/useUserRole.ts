
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserRole = (refetch: () => void) => {
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user' | 'judge') => {
    try {
      console.log(`Updating role for user ${userId} to ${newRole}`);
      
      const { error } = await supabase
        .rpc('assign_user_role', { 
          user_id: userId, // Keep using user_id to match the TypeScript types
          role_name: newRole 
        });
      
      if (error) {
        console.error('Error updating user role:', error);
        toast.error(`Failed to update user role: ${error.message}`);
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
