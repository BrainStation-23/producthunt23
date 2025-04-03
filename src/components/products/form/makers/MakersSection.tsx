
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
import { AlertCircle, Info } from 'lucide-react';
import { ProductFormValues, Maker } from '@/types/product';
import MakerItem from './MakerItem';
import MakerSearch from './MakerSearch';
import { useMakerSearch, ProfileSearchResult } from './useMakerSearch';
import { useToast } from '@/hooks/use-toast';

interface MakersSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const MakersSection: React.FC<MakersSectionProps> = ({ form }) => {
  const makers = form.watch('makers') || [];
  const hasCreator = makers.some(maker => maker.isCreator);
  const formErrors = form.formState.errors;
  const { toast } = useToast();
  
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching
  } = useMakerSearch(makers);

  const handleAddMaker = (profile: ProfileSearchResult) => {
    if (makers.some(maker => maker.id === profile.id)) {
      toast({
        variant: "destructive",
        title: "Duplicate maker",
        description: "This person is already added as a maker."
      });
      return;
    }
    
    console.log('Adding maker profile:', profile);
    
    form.setValue('makers', [
      ...makers, 
      { 
        id: profile.id, 
        isCreator: !hasCreator, // If no creator exists, make this person the creator
        username: profile.username,
        avatar_url: profile.avatar_url
      }
    ], { shouldValidate: true });
    
    setSearchQuery('');
    
    toast({
      title: "Maker added",
      description: `${profile.username || 'New maker'} has been added to the product.`
    });
  };

  const handleRemoveMaker = (index: number) => {
    const makerToRemove = makers[index];
    if (makerToRemove.isCreator) {
      toast({
        variant: "destructive",
        title: "Cannot remove creator",
        description: "You cannot remove the product creator. If you want to change the creator, please mark another maker as creator first."
      });
      return;
    }
    
    const updatedMakers = [...makers];
    updatedMakers.splice(index, 1);
    form.setValue('makers', updatedMakers, { shouldValidate: true });
    
    toast({
      title: "Maker removed",
      description: `${makerToRemove.username || 'Maker'} has been removed from the product.`
    });
  };

  const getErrorDetails = () => {
    if (!formErrors.makers) return null;
    
    // Handle array-level errors
    if (formErrors.makers.message) {
      return formErrors.makers.message as string;
    }
    
    // Handle field-level errors in the array
    if (formErrors.makers.root?.message) {
      return formErrors.makers.root.message as string;
    }
    
    // Check for specific errors in maker items
    if (typeof formErrors.makers === 'object' && Object.keys(formErrors.makers).length > 0) {
      const errorKeys = Object.keys(formErrors.makers);
      const firstErrorKey = errorKeys[0];
      
      if (formErrors.makers[firstErrorKey]?.id) {
        return `Maker ${parseInt(firstErrorKey) + 1}: ${formErrors.makers[firstErrorKey]?.id?.message}`;
      }
      
      return `Error in maker ${parseInt(firstErrorKey) + 1}`;
    }
    
    return 'Please check your makers information';
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
                Add all the people involved in making this product. Every product needs at least one maker marked as creator.
              </FormDescription>
              
              {formErrors.makers && (
                <Alert variant="destructive" className="mt-2 mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {getErrorDetails() || 'Please add at least one maker with valid information'}
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
              
              {makers.length === 0 && (
                <Alert variant="default" className="mt-2 mb-4 border-blue-500 bg-blue-50 text-blue-700">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertDescription>
                    Search for users by name to add them as makers of this product.
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
