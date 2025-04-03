
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

export interface ProfileSearchResult {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
}

export const useMakerSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ProfileSearchResult[]>([]);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const searchProfiles = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, username, avatar_url')
        .or(`username.ilike.%${query}%, email.ilike.%${query}%`)
        .limit(5);
      
      if (error) {
        console.error('Error searching profiles:', error);
        throw error;
      }
      
      console.log('Search results:', data);
      setSearchResults(data || []);
    } catch (error) {
      console.error('Failed to search profiles:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // When debounced search term changes, perform search
  const updateSearchResults = useCallback(async () => {
    searchProfiles(debouncedSearchTerm);
  }, [debouncedSearchTerm, searchProfiles]);
  
  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    updateSearchResults
  };
};
