
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash, MoveUp, MoveDown, Save } from 'lucide-react';
import { toast } from 'sonner';
import { FeaturedCategory } from '@/pages/landing/types';
import { IconPicker } from '../icons/IconPicker';
import { DynamicIcon } from '../icons/DynamicIcon';
import { generateSlug } from '../utils/categoryUtils';

interface CategoriesTableProps {
  categories: FeaturedCategory[] | null;
  isLoading: boolean;
}

export const CategoriesTable: React.FC<CategoriesTableProps> = ({ categories, isLoading }) => {
  const queryClient = useQueryClient();
  const [editMode, setEditMode] = useState<string | null>(null);

  // Update category
  const updateCategory = useMutation({
    mutationFn: async (category: FeaturedCategory) => {
      // Generate a new slug if name was updated
      const originalCategory = categories?.find(c => c.id === category.id);
      const updatedData: Partial<FeaturedCategory> = {
        name: category.name,
        icon: category.icon
      };
      
      // Update slug if name changed
      if (originalCategory && originalCategory.name !== category.name) {
        updatedData.slug = generateSlug(category.name);
      }
      
      const { data, error } = await supabase
        .from('featured_categories')
        .update(updatedData)
        .eq('id', category.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCategories'] });
      setEditMode(null);
      toast.success('Category updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update category: ' + error.message);
    }
  });

  // Delete category
  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('featured_categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCategories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete category: ' + error.message);
    }
  });

  // Reorder category
  const reorderCategory = useMutation({
    mutationFn: async ({ id, direction }: { id: string, direction: 'up' | 'down' }) => {
      if (!categories) return;
      
      const currentIndex = categories.findIndex(c => c.id === id);
      if (currentIndex === -1) return;
      
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= categories.length) return;
      
      const currentCategory = categories[currentIndex];
      const targetCategory = categories[targetIndex];
      
      // Swap display_order values
      const updates = [
        {
          id: currentCategory.id,
          display_order: targetCategory.display_order
        },
        {
          id: targetCategory.id,
          display_order: currentCategory.display_order
        }
      ];
      
      // Update both categories in transaction
      for (const update of updates) {
        const { error } = await supabase
          .from('featured_categories')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCategories'] });
    },
    onError: (error) => {
      toast.error('Failed to reorder categories: ' + error.message);
    }
  });

  // Handle category update
  const handleUpdateCategory = (id: string, field: string, value: string) => {
    if (!categories) return;
    const category = categories.find(c => c.id === id);
    if (!category) return;
    
    const updatedCategory = { ...category, [field]: value };
    updateCategory.mutate(updatedCategory);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading categories...</div>;
  }

  if (!categories || categories.length === 0) {
    return <div className="text-center py-4 text-muted-foreground">No featured categories found</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead>
          <TableHead>Display Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Icon</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">
              {category.display_order}
              <div className="flex space-x-1 mt-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => reorderCategory.mutate({ id: category.id, direction: 'up' })}
                  disabled={category === categories[0]}
                >
                  <MoveUp className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => reorderCategory.mutate({ id: category.id, direction: 'down' })}
                  disabled={category === categories[categories.length - 1]}
                >
                  <MoveDown className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
            <TableCell>
              {editMode === `${category.id}-name` ? (
                <div className="flex space-x-2">
                  <Input 
                    value={category.name}
                    onChange={(e) => {
                      const updatedCategories = categories.map(c => 
                        c.id === category.id ? { ...c, name: e.target.value } : c
                      );
                      queryClient.setQueryData(['featuredCategories'], updatedCategories);
                    }}
                    className="h-8"
                  />
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleUpdateCategory(category.id, 'name', category.name)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="cursor-pointer hover:underline" 
                  onClick={() => setEditMode(`${category.id}-name`)}
                >
                  {category.name}
                </div>
              )}
            </TableCell>
            <TableCell>
              {category.slug}
            </TableCell>
            <TableCell>
              {editMode === `${category.id}-icon` ? (
                <div className="flex space-x-2">
                  <div className="w-full">
                    <IconPicker
                      value={category.icon}
                      onChange={(value) => {
                        const updatedCategories = categories.map(c => 
                          c.id === category.id ? { ...c, icon: value } : c
                        );
                        queryClient.setQueryData(['featuredCategories'], updatedCategories);
                      }}
                    />
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleUpdateCategory(category.id, 'icon', category.icon || '')}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="cursor-pointer hover:underline flex items-center"
                  onClick={() => setEditMode(`${category.id}-icon`)}
                >
                  {category.icon ? (
                    <>
                      <DynamicIcon name={category.icon} className="h-4 w-4 mr-2" />
                      <span>{category.icon}</span>
                    </>
                  ) : (
                    'No icon'
                  )}
                </div>
              )}
            </TableCell>
            <TableCell>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => deleteCategory.mutate(category.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
