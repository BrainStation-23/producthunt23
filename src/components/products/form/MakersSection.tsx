
import React, { useState } from 'react';
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
import { X, UserPlus } from 'lucide-react';
import { ProductFormValues } from '@/types/product';
import { useAuth } from '@/contexts/AuthContext';

interface MakersSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

const MakersSection: React.FC<MakersSectionProps> = ({ form }) => {
  const { user } = useAuth();
  const [newMakerEmail, setNewMakerEmail] = useState('');
  
  const makers = form.watch('makers') || [];
  const creatorId = user?.id;

  const handleAddMaker = () => {
    if (!newMakerEmail || !newMakerEmail.includes('@')) return;
    
    // Check if email already exists in makers
    if (makers.some(maker => maker.email === newMakerEmail)) return;
    
    form.setValue('makers', [
      ...makers, 
      { email: newMakerEmail, id: null, isCreator: false }
    ]);
    setNewMakerEmail('');
  };

  const handleRemoveMaker = (index: number) => {
    // Don't allow removing the creator
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
              
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {makers.map((maker, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 bg-secondary p-2 rounded-md"
                  >
                    <span>{maker.email}</span>
                    {!maker.isCreator && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => handleRemoveMaker(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                    {maker.isCreator && (
                      <span className="text-xs bg-primary text-primary-foreground px-1 rounded">Creator</span>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="Enter co-maker's email"
                    value={newMakerEmail}
                    onChange={(e) => setNewMakerEmail(e.target.value)}
                  />
                </FormControl>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleAddMaker}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Maker
                </Button>
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
