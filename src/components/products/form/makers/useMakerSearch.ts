
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Maker } from '@/types/product';

export interface ProfileSearchResult {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
}

export const useMakerSearch = (makers: Maker[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProfileSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchProfiles = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      
      try {
        // Use ILIKE for case-insensitive partial matching
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, email, avatar_url')
          .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(5);
          
        if (error) {
          console.error('Error in search query:', error);
          throw error;
        }
        
        // Log search results for debugging
        console.log('Search query:', searchQuery);
        console.log('Search results:', data);
        
        // Filter out makers that are already added
        const filteredData = data?.filter(profile => 
          !makers.some(maker => maker.id === profile.id)
        ) || [];
        
        setSearchResults(filteredData);
      } catch (error) {
        console.error('Error searching profiles:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    // Clear any previous timer to prevent race conditions
    const debounceTimer = setTimeout(searchProfiles, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, makers]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching
  };
};

export default useMakerSearch;
