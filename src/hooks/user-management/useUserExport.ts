
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Papa from 'papaparse';

export const useUserExport = (searchQuery: string, roleFilter: string | null) => {
  const exportUsers = async () => {
    try {
      toast.info('Preparing export...');
      
      console.log('Exporting users with filters:', { searchQuery, roleFilter });
      
      // Get all users without pagination for export
      const { data, error } = await supabase
        .rpc('get_admin_users', {
          search_text: searchQuery,
          role_filter: roleFilter,
          page_num: 1,
          page_size: 1000 // Get a large number of users
        });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast.error('No users to export');
        return;
      }
      
      // Format data for CSV (only include the fields we need)
      const csvData = data.map(user => ({
        id: user.id,
        email: user.email || '',
        username: user.username || '',
        role: user.role || 'user',
        status: 'active' // Add status field (all are active as we don't have a status column yet)
      }));
      
      // Use Papa.unparse to convert to CSV
      const csv = Papa.unparse(csvData);
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Failed to export users');
    }
  };

  return { exportUsers };
};
