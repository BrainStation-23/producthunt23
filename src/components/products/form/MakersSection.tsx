import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { X, UserPlus, Search } from 'lucide-react';
import { ProductFormValues, Maker } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MakersSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

interface ProfileSearchResult {
  id: string;
  email: string | null;
  username: string | null;
  avatar_url: string | null;
}

const MakersSection: React.FC<MakersSectionProps> = ({ form }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProfileSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const makers = form.watch('makers') || [];

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

  const handleAddMaker = (profile: ProfileSearchResult) => {
    if (makers.some(maker => maker.id === profile.id)) return;
    
    form.setValue('makers', [
      ...makers, 
      { 
        id: profile.id, 
        email: profile.email || profile.username || '', 
        isCreator: false,
        username: profile.username,
        avatar_url: profile.avatar_url
      }
    ]);
    
    setSearchQuery('');
    setSearchResults([]);
    setIsPopoverOpen(false);
  };

  const handleRemoveMaker = (index: number) => {
    const makerToRemove = makers[index];
    if (makerToRemove.isCreator) return;
    
    const updatedMakers = [...makers];
    updatedMakers.splice(index, 1);
    form.setValue('makers', updatedMakers);
  };

  const getInitials = (maker: Maker) => {
    const displayName = maker.username || maker.email;
    if (!displayName) return '?';
    
    if (displayName.includes('@')) {
      return displayName.split('@')[0].substring(0, 2).toUpperCase();
    }
    
    return displayName.substring(0, 2).toUpperCase();
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <FormField
          control={form.control}
          name="makers"
          render={() => (
            <FormItem>
              <FormLabel>Product Makers</FormLabel>
              <FormDescription>
                Add all the people involved in making this product. You cannot remove yourself as the creator.
              </FormDescription>
              
              <div className="flex flex-wrap gap-3 mt-4 mb-4">
                {makers.map((maker, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 bg-secondary p-2 rounded-md"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={maker.avatar_url || ''} alt={maker.username || maker.email} />
                      <AvatarFallback>{getInitials(maker)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{maker.username || maker.email}</span>
                    {!maker.isCreator && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 rounded-full" 
                        onClick={() => handleRemoveMaker(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    {maker.isCreator && (
                      <span className="text-xs bg-primary text-primary-foreground px-1 py-0.5 rounded">Creator</span>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
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
                            <CommandItem
                              key={profile.id}
                              onSelect={() => handleAddMaker(profile)}
                              className="flex items-center gap-2 py-2"
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={profile.avatar_url || ''} alt={profile.username || profile.email || ''} />
                                <AvatarFallback>
                                  {(profile.username || profile.email || '').substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium">{profile.username || profile.email}</span>
                                {profile.username && profile.email && (
                                  <span className="text-xs text-muted-foreground">{profile.email}</span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default MakersSection;
