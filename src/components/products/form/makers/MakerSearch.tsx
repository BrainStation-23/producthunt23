
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList
} from '@/components/ui/command';
import MakerSearchItem from './MakerSearchItem';

interface ProfileSearchResult {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
}

interface MakerSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: ProfileSearchResult[];
  isSearching: boolean;
  isPopoverOpen: boolean;
  setIsPopoverOpen: (isOpen: boolean) => void;
  onAddMaker: (profile: ProfileSearchResult) => void;
}

export const MakerSearch: React.FC<MakerSearchProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  isSearching,
  isPopoverOpen,
  setIsPopoverOpen,
  onAddMaker
}) => {
  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full justify-start"
          onClick={() => setIsPopoverOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          <span>Add Maker</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]" align="start" side="bottom" sideOffset={8}>
        <Command>
          <CommandInput 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9"
          />
          <CommandList>
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
      </PopoverContent>
    </Popover>
  );
};

export default MakerSearch;
