
import React from 'react';
import { Button } from '@/components/ui/button';
import ProductCard, { ProductCardSkeleton } from './ProductCard';

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
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
