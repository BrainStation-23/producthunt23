
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
    isSearching
  } = useMakerSearch(makers);

  const handleAddMaker = (profile: ProfileSearchResult) => {
    if (makers.some(maker => maker.id === profile.id)) return;
    
    // Ensure we have a valid email for the maker (required by form validation)
    const email = profile.email || `${profile.username || 'user'}@example.com`;
    
    console.log('Adding maker profile:', profile);
    
    form.setValue('makers', [
      ...makers, 
      { 
        id: profile.id, 
        email: email, 
        isCreator: false,
        username: profile.username,
        avatar_url: profile.avatar_url
      }
    ], { shouldValidate: true });
    
    setSearchQuery('');
  };

  const handleRemoveMaker = (index: number) => {
    const makerToRemove = makers[index];
    if (makerToRemove.isCreator) return;
    
    const updatedMakers = [...makers];
    updatedMakers.splice(index, 1);
    form.setValue('makers', updatedMakers, { shouldValidate: true });
  };

  console.log('Current makers in MakersSection:', makers);

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
              
              <div className="space-y-4 mt-4">
                <MakerSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  searchResults={searchResults}
                  isSearching={isSearching}
                  onAddMaker={handleAddMaker}
                />
                
                <div className="flex flex-wrap gap-3">
                  {makers.map((maker, index) => (
                    <MakerItem 
                      key={index}
                      maker={maker}
                      index={index}
                      onRemove={handleRemoveMaker}
                    />
                  ))}
                </div>
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
