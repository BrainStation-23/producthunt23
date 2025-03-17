
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProductsResponse } from '@/types/product';
import ProductFilters from '@/components/products/ProductFilters';
import ProductsGrid from '@/components/products/ProductsGrid';
import ProductPagination from '@/components/products/ProductPagination';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  
  // Extract search parameters
  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const sortBy = searchParams.get('sort') || 'newest';
  
  // Map sort options to actual sort parameters
  const getSortParams = () => {
    switch(sortBy) {
      case 'newest':
        return { sort_by: 'created_at', sort_direction: 'desc' };
      case 'oldest':
        return { sort_by: 'created_at', sort_direction: 'asc' };
      case 'most-upvotes':
        return { sort_by: 'upvotes', sort_direction: 'desc' };
      case 'least-upvotes':
        return { sort_by: 'upvotes', sort_direction: 'asc' };
      default:
        return { sort_by: 'created_at', sort_direction: 'desc' };
    }
  };
  
  // Fetch products using the filter_products function
  const fetchProducts = async (): Promise<ProductsResponse> => {
    try {
      const { sort_by, sort_direction } = getSortParams();
      
      // Call the filter_products function
      const { data, error } = await supabase.rpc('filter_products', {
        search_query: searchQuery,
        selected_category: selectedCategory || null,
        sort_by,
        sort_direction,
        page_number: currentPage,
        page_size: 12
      });
      
      if (error) throw error;
      
      // Extract total count from the first result
      const totalCount = data.length > 0 ? data[0].total_count : 0;
      setTotalPages(Math.ceil(totalCount / 12));
      
      // Add empty technologies array if it doesn't exist
      const productsWithTechnologies = data.map(product => ({
        ...product,
        technologies: null
      }));
      
      return { data: productsWithTechnologies, totalCount };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: [], totalCount: 0 };
    }
  };
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory, currentPage, sortBy],
    queryFn: fetchProducts
  });
  
  // Navigate to a specific page
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchParams({});
  };
  
  return (
    <div className="container py-8 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Discover Products</h1>
        <p className="text-muted-foreground max-w-3xl">
          Explore the latest products and tools built by the community. Find inspiration for your next project.
        </p>
      </div>
      
      <ProductFilters 
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        sortBy={sortBy}
        setSearchParams={setSearchParams}
        searchParams={searchParams}
      />
      
      <ProductsGrid 
        products={data?.data}
        isLoading={isLoading}
        isError={isError} 
        clearFilters={clearFilters}
      />
      
      <ProductPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />
    </div>
  );
};

export default ProductsPage;
