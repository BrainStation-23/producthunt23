
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useUserDelete = (refetch: () => void) => {
  const deleteUser = async (userId: string) => {
    try {
      // Fix: Correctly access the session by destructuring the data property
      const { data, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !data.session?.access_token) {
        toast.error('Authentication required');
        return false;
      }

      const { data: deleteData, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { user_id: userId },
        headers: {
          Authorization: `Bearer ${data.session.access_token}`
        }
      });

      if (error) {
        console.error('Error deleting user:', error);
        toast.error(`Failed to delete user: ${error.message}`);
        return false;
      }
      
      toast.success('User deleted successfully');
      refetch();
      return true;
    } catch (error: any) {
      console.error('Error in deleteUser:', error);
      toast.error(`Failed to delete user: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  return { deleteUser };
};
