
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { ProductFormValues, Maker } from '@/types/product';
import MakerItem from './MakerItem';
import MakerSearch from './MakerSearch';
import { useMakerSearch, ProfileSearchResult } from './useMakerSearch';

interface MakersSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const MakersSection: React.FC<MakersSectionProps> = ({ form }) => {
  const makers = form.watch('makers') || [];
  
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    isPopoverOpen,
    setIsPopoverOpen
  } = useMakerSearch(makers);

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
    setIsPopoverOpen(false);
  };

  const handleRemoveMaker = (index: number) => {
    const makerToRemove = makers[index];
    if (makerToRemove.isCreator) return;
    
    const updatedMakers = [...makers];
    updatedMakers.splice(index, 1);
    form.setValue('makers', updatedMakers);
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
                  <MakerItem 
                    key={index}
                    maker={maker}
                    index={index}
                    onRemove={handleRemoveMaker}
                  />
                ))}
              </div>
              
              <div className="flex gap-2">
                <MakerSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  isSearching={isSearching}
                  isPopoverOpen={isPopoverOpen}
                  setIsPopoverOpen={setIsPopoverOpen}
                  onAddMaker={handleAddMaker}
                />
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
