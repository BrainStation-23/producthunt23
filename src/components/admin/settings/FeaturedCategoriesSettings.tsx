
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types/product';
import { FeaturedCategory } from '@/pages/landing/types';
import { AddCategoryForm } from './categories/AddCategoryForm';
import { CategoriesTable } from './categories/CategoriesTable';

const FeaturedCategoriesSettings = () => {
  // Fetch all available categories
  const { data: availableCategories, isLoading: loadingCategories } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'active')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    }
  });

  // Fetch featured categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['featuredCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('featured_categories')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as FeaturedCategory[];
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Featured Categories</h2>
        <p className="text-muted-foreground">
          Manage featured categories that appear on the landing page.
        </p>
      </div>

      {/* Add new category form */}
      <AddCategoryForm 
        availableCategories={availableCategories} 
        loadingCategories={loadingCategories}
        existingCategories={categories}
      />

      {/* Categories table */}
      <div>
        <h3 className="font-medium mb-3">Existing Featured Categories</h3>
        <CategoriesTable categories={categories} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default FeaturedCategoriesSettings;
