
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserRole = (refetch: () => void) => {
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user' | 'judge') => {
    try {
      // Check if user already has a role entry
      const { data: existingRole, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let updateError;

      // Always use upsert to either update or insert as needed
      const { error } = await supabase
        .from('user_roles')
        .upsert({ 
          user_id: userId, 
          role: newRole 
        });
      
      updateError = error;

      if (updateError) throw updateError;
      
      toast.success(`User role updated to ${newRole}`);
      refetch();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  return { handleRoleChange };
};
