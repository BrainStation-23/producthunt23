
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
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const searchProfiles = async () => {
      if (!searchQuery || searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }
      
      setIsSearching(true);
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, email, avatar_url')
          .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
          .limit(5);
          
        if (error) throw error;
        
        const filteredData = data?.filter(profile => 
          !makers.some(maker => maker.id === profile.id)
        ) || [];
        
        setSearchResults(filteredData);
      } catch (error) {
        console.error('Error searching profiles:', error);
      } finally {
        setIsSearching(false);
      }
    };
    
    const debounceTimer = setTimeout(searchProfiles, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, makers]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isPopoverOpen,
    setIsPopoverOpen
  };
};

export default useMakerSearch;
