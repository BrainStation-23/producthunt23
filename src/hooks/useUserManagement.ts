
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Papa from 'papaparse';

const ITEMS_PER_PAGE = 10;

interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
}

export const useUserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Function to fetch users using our database function
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_admin_users', {
          search_text: searchQuery,
          role_filter: roleFilter,
          page_num: currentPage,
          page_size: ITEMS_PER_PAGE
        });

      if (error) throw error;

      if (!data) {
        return [];
      }

      // Set total pages based on the total_count returned from the function
      if (data.length > 0) {
        const totalCount = data[0].total_count;
        setTotalPages(Math.ceil(totalCount / ITEMS_PER_PAGE));
      } else {
        setTotalPages(1);
      }

      return data.map(user => ({
        id: user.id,
        email: user.email || '',
        username: user.username || user.email?.split('@')[0] || 'User',
        avatar_url: user.avatar_url,
        role: user.role || 'user',
        created_at: user.created_at,
        product_count: user.product_count
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      throw error;
    }
  };

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['adminUsers', searchQuery, roleFilter, currentPage],
    queryFn: fetchUsers
  });

  const exportUsers = async () => {
    try {
      toast.info('Preparing export...');
      
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    refetch();
  };

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

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole })
          .eq('user_id', userId);
        
        updateError = error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: newRole });
        
        updateError = error;
      }

      if (updateError) throw updateError;
      
      toast.success(`User role updated to ${newRole}`);
      refetch();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

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

  return {
    users,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    handleSearch,
    handleRoleChange,
    deleteUser,
    exportUsers,
    refetch,
  };
};
