
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProductFormValues, Maker } from '@/types/product';
import MakerItem from './MakerItem';
import MakerSearch from './MakerSearch';
import { useMakerSearch, ProfileSearchResult } from './useMakerSearch';

interface MakersSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const MakersSection: React.FC<MakersSectionProps> = ({ form }) => {
  const makers = form.watch('makers') || [];
  const hasCreator = makers.some(maker => maker.isCreator);
  const formErrors = form.formState.errors;
  
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
  console.log('Form errors:', formErrors);

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
              
              {formErrors.makers && (
                <Alert variant="destructive" className="mt-2 mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {formErrors.makers.message || 'Please add at least one maker with a valid email'}
                  </AlertDescription>
                </Alert>
              )}

              {!hasCreator && (
                <Alert variant="default" className="mt-2 mb-4 border-yellow-500 bg-yellow-50 text-yellow-700">
                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                  <AlertDescription>
                    A product must have at least one creator. Please ensure there is a maker marked as creator.
                  </AlertDescription>
                </Alert>
              )}
              
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
