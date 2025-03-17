
import React, { useEffect, useState } from 'react';
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
  tags: string[] | null;
  upvotes: number;
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
  const [categoriesMap, setCategoriesMap] = useState<Record<string, string>>({});
  
  // Fetch categories to map IDs to names
  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('id, name')
        .eq('status', 'active');
      
      if (data) {
        const categoryMap: Record<string, string> = {};
        data.forEach(category => {
          categoryMap[category.id] = category.name;
        });
        setCategoriesMap(categoryMap);
      }
    };
    
    fetchCategories();
  }, []);

  // Transform product tags to use category names instead of IDs
  const productsWithCategoryNames = products?.map(product => ({
    ...product,
    tags: product.tags?.map(tagId => categoriesMap[tagId] || tagId) || null
  }));
  
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
  
  if (!productsWithCategoryNames || productsWithCategoryNames.length === 0) {
    return (
      <div className="col-span-full py-12 text-center">
        <p className="text-lg text-muted-foreground">No products found matching your search criteria.</p>
        <Button onClick={clearFilters} variant="outline" className="mt-4">
          Clear filters
        </Button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productsWithCategoryNames.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
