
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Category } from './types';

export function useCategoriesOperations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Fetch categories
  const { 
    data: categories = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
        throw error;
      }
      
      return data as Category[];
    }
  });

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName.trim() }])
        .select();

      if (error) throw error;
      
      toast.success('Category added successfully');
      setIsAddDialogOpen(false);
      setNewCategoryName('');
      refetch();
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  // Update category
  const handleUpdateCategory = async () => {
    if (!editingCategory || !editName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .update({ 
          name: editName.trim(),
          is_featured: isFeatured
        })
        .eq('id', editingCategory.id);

      if (error) throw error;
      
      toast.success('Category updated successfully');
      setIsEditSheetOpen(false);
      setEditingCategory(null);
      refetch();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  // Toggle category featured status
  const toggleCategoryFeatured = async (category: Category) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_featured: !category.is_featured })
        .eq('id', category.id);

      if (error) throw error;
      
      toast.success(`Category ${!category.is_featured ? 'added to' : 'removed from'} featured`);
      refetch();
    } catch (error) {
      console.error('Error toggling category featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  // Toggle category status
  const toggleCategoryStatus = async (category: Category) => {
    try {
      const newStatus = category.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('categories')
        .update({ status: newStatus })
        .eq('id', category.id);

      if (error) throw error;
      
      toast.success(`Category ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
      refetch();
    } catch (error) {
      console.error('Error toggling category status:', error);
      toast.error('Failed to update category status');
    }
  };

  // Open edit sheet
  const openEditSheet = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setIsFeatured(category.is_featured);
    setIsEditSheetOpen(true);
  };

  return {
    categories,
    isLoading,
    searchTerm,
    setSearchTerm,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditSheetOpen,
    setIsEditSheetOpen,
    newCategoryName,
    setNewCategoryName,
    editingCategory,
    editName,
    setEditName,
    isFeatured,
    setIsFeatured,
    handleAddCategory,
    handleUpdateCategory,
    toggleCategoryFeatured,
    toggleCategoryStatus,
    openEditSheet
  };
}
