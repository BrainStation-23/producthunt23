
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url: string | null;
  role: string;
  created_at: string;
  product_count: number;
  website?: string | null;
  twitter?: string | null;
  linkedin?: string | null;
  github?: string | null;
}

interface FetchUsersParams {
  searchQuery: string;
  roleFilter: string | null;
  currentPage: number;
  setTotalPages: (pages: number) => void;
}

export const useUserFetch = ({
  searchQuery,
  roleFilter,
  currentPage,
  setTotalPages,
}: FetchUsersParams) => {
  const pageSize = 10;

  const fetchUsers = async () => {
    const { data, error } = await supabase.rpc('get_admin_users', {
      search_text: searchQuery,
      role_filter: roleFilter,
      page_num: currentPage,
      page_size: pageSize,
    });

    if (error) throw error;

    // Get total count from the first row (all rows have the same total_count)
    const totalCount = data.length > 0 ? data[0].total_count : 0;
    
    // Calculate total pages
    const totalPages = Math.ceil(totalCount / pageSize);
    setTotalPages(totalPages);

    // Fetch additional profile information for each user
    const usersWithProfiles = await Promise.all(
      data.map(async (user) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('website, twitter, linkedin, github')
          .eq('id', user.id)
          .single();
          
        return {
          ...user,
          website: profileData?.website || null,
          twitter: profileData?.twitter || null,
          linkedin: profileData?.linkedin || null,
          github: profileData?.github || null,
        };
      })
    );

    return usersWithProfiles;
  };

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery<User[]>({
    queryKey: ['users', searchQuery, roleFilter, currentPage],
    queryFn: fetchUsers,
    refetchOnWindowFocus: false,
  });

  return { users, isLoading, refetch };
};
