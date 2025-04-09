
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserFilters } from './useUserFilters';

const ITEMS_PER_PAGE = 10;

export const useUserFetch = () => {
  const {
    searchQuery,
    roleFilter,
    currentPage,
    setTotalPages,
  } = useUserFilters();

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

  return {
    users,
    isLoading,
    refetch,
  };
};
