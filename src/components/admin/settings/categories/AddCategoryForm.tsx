
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from '@/types/product';
import { IconPicker } from '../icons/IconPicker';
import { generateSlug } from '../utils/categoryUtils';

interface AddCategoryFormProps {
  availableCategories: Category[] | undefined;
  loadingCategories: boolean;
  existingCategories: any[] | null;
}

export const AddCategoryForm: React.FC<AddCategoryFormProps> = ({ 
  availableCategories, 
  loadingCategories,
  existingCategories
}) => {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({
    categoryId: '',
    icon: ''
  });

  // Update selectedCategory when categoryId changes
  useEffect(() => {
    if (newCategory.categoryId && availableCategories) {
      const category = availableCategories.find(c => c.id === newCategory.categoryId);
      setSelectedCategory(category || null);
    } else {
      setSelectedCategory(null);
    }
  }, [newCategory.categoryId, availableCategories]);

  // Add new category
  const addCategory = useMutation({
    mutationFn: async (category: {
      categoryId: string;
      icon: string;
    }) => {
      // Find the selected category from available categories
      const selectedCategory = availableCategories?.find(c => c.id === category.categoryId);
      if (!selectedCategory) {
        throw new Error('Selected category not found');
      }
      
      // Calculate max display order
      const maxOrder = existingCategories && existingCategories.length > 0 
        ? Math.max(...existingCategories.map(c => c.display_order)) 
        : 0;
      
      // Generate slug from category name
      const slug = generateSlug(selectedCategory.name);
      
      const { data, error } = await supabase
        .from('featured_categories')
        .insert({
          name: selectedCategory.name,
          slug: slug,
          icon: category.icon || null,
          display_order: maxOrder + 1,
          category_id: category.categoryId
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredCategories'] });
      setNewCategory({ categoryId: '', icon: '' });
      setSelectedCategory(null);
      toast.success('Category added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add category: ' + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.categoryId) {
      toast.error('Category selection is required');
      return;
    }
    addCategory.mutate(newCategory);
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <h3 className="font-medium mb-3">Add New Featured Category</h3>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="category" className="text-sm font-medium">Category</label>
          <Select 
            value={newCategory.categoryId} 
            onValueChange={(value) => setNewCategory(prev => ({ ...prev, categoryId: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {loadingCategories ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : availableCategories?.length === 0 ? (
                <SelectItem value="empty" disabled>No categories available</SelectItem>
              ) : (
                availableCategories?.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {selectedCategory && (
            <p className="text-xs text-muted-foreground mt-1">
              Display name: {selectedCategory.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="icon" className="text-sm font-medium">Icon</label>
          <IconPicker 
            value={newCategory.icon} 
            onChange={(value) => setNewCategory(prev => ({ ...prev, icon: value }))}
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full" disabled={addCategory.isPending || !selectedCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </div>
      </form>
    </div>
  );
};
