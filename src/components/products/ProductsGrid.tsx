
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import ProductCard, { ProductCardSkeleton } from './ProductCard';
import { supabase } from '@/integrations/supabase/client';

interface Product {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image_url: string | null;
  website_url: string | null;
  categories: string[] | null;
  upvotes: number;
}

interface Category {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

interface ProductsGridProps {
  products: Product[] | undefined;
  isLoading: boolean;
  isError: boolean;
  clearFilters: () => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ 
  products, 
  isLoading, 
  isError,
  clearFilters
}) => {
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  
  // Fetch categories to map from IDs to names
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('status', 'active');
        
      if (!error && data) {
        const catMap: Record<string, string> = {};
        data.forEach((cat: Category) => {
          catMap[cat.id] = cat.name;
        });
        setCategoryMap(catMap);
      }
    };
    
    fetchCategories();
  }, []);
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(12).fill(0).map((_, i) => (
          <ProductCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="col-span-full py-12 text-center">
        <p className="text-lg text-red-500">Failed to load products. Please try again later.</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <p className="text-lg text-muted-foreground">No products found matching your search criteria.</p>
        <Button onClick={clearFilters} variant="outline" className="mt-4">
          Clear filters
        </Button>
      </div>
    );
  }
  
  // Transform products to include category names
  const productsWithCategoryNames = products.map(product => {
    const mappedCategories = product.categories?.map(catId => categoryMap[catId] || catId) || [];
    return {
      ...product,
      categoryNames: mappedCategories
    };
  });
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productsWithCategoryNames.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
