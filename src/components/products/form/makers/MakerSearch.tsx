
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandList } from '@/components/ui/command';
import MakerSearchItem from './MakerSearchItem';
import { ProfileSearchResult } from './useMakerSearch';

interface MakerSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ProfileSearchResult[];
  isSearching: boolean;
  onAddMaker: (profile: ProfileSearchResult) => void;
}

export const MakerSearch: React.FC<MakerSearchProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  onAddMaker
}) => {
  // Log current state for debugging
  console.log('Current search query:', searchQuery);
  console.log('Current search results:', searchResults);
  console.log('Is searching:', isSearching);

  return (
    <div className="space-y-2 w-full">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search makers by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 pr-4"
        />
      </div>
      
      {(searchQuery.length > 1) && (
        <div className="border rounded-md overflow-hidden bg-background">
          <Command>
            <CommandList className="max-h-[200px] overflow-y-auto">
              <CommandEmpty>
                {isSearching ? 'Searching...' : 'No users found.'}
              </CommandEmpty>
              <CommandGroup>
                {searchResults.map((profile) => (
                  <MakerSearchItem 
                    key={profile.id} 
                    profile={profile} 
                    onSelect={onAddMaker} 
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default MakerSearch;
