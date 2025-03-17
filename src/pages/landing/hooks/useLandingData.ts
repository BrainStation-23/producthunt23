
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FeaturedCategory, FeaturedProduct } from '../types';

export function useLandingData() {
  // Fetch featured categories
  const { 
    data: categories, 
    isLoading: isCategoriesLoading,
    error: categoriesError 
  } = useQuery({
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

  // Default tab to 'all' or first available category
  const defaultCategory = categories?.length > 0 ? categories[0].slug : 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);

  // Update selected category when categories are loaded
  useEffect(() => {
    if (categories?.length > 0) {
      setSelectedCategory(categories[0].slug);
    }
  }, [categories]);

  // Fetch featured products
  const { 
    data: featuredProducts, 
    isLoading: isProductsLoading,
    error: productsError 
  } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_featured_products');
      
      if (error) throw error;
      return data as FeaturedProduct[];
    }
  });

  // Fetch products by category when tab changes
  const { 
    data: categoryProducts, 
    isLoading: isCategoryProductsLoading,
    error: categoryProductsError 
  } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: async () => {
      if (selectedCategory === 'all') {
        const { data, error } = await supabase
          .from('products')
          .select('*, profiles:created_by(username, avatar_url)')
          .eq('status', 'approved')
          .limit(8);
        
        if (error) throw error;
        
        // Format data to match the expected shape
        return data.map(product => ({
          ...product,
          profile_username: product.profiles?.username,
          profile_avatar_url: product.profiles?.avatar_url
        })) as unknown as FeaturedProduct[];
      } else {
        const { data, error } = await supabase
          .from('products')
          .select('*, profiles:created_by(username, avatar_url)')
          .eq('status', 'approved')
          .contains('tags', [selectedCategory])
          .limit(8);
        
        if (error) throw error;
        
        // Format data to match the expected shape
        return data.map(product => ({
          ...product,
          profile_username: product.profiles?.username,
          profile_avatar_url: product.profiles?.avatar_url
        })) as unknown as FeaturedProduct[];
      }
    }
  });

  // Check for any errors
  const hasError = Boolean(categoriesError || productsError || categoryProductsError);
  
  // Log errors if any
  useEffect(() => {
    if (hasError) {
      console.error('Error loading data:', categoriesError || productsError || categoryProductsError);
    }
  }, [hasError, categoriesError, productsError, categoryProductsError]);

  return {
    categories,
    isCategoriesLoading,
    featuredProducts,
    isProductsLoading,
    categoryProducts,
    isCategoryProductsLoading,
    selectedCategory,
    setSelectedCategory,
    hasError
  };
}
