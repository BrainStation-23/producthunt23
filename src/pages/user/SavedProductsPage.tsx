
import React from 'react';
import { useSavedProducts } from '@/hooks/useSavedProducts';
import ProfileHeader from '@/components/user/profile/ProfileHeader';
import ProductCard, { ProductCardSkeleton } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';

const SavedProductsPage: React.FC = () => {
  const { products, isLoading, error } = useSavedProducts();

  return (
    <div className="space-y-6">
      <ProfileHeader 
        title="Saved Products" 
        description="Products you've bookmarked for later" 
        icon={<Bookmark className="h-5 w-5" />}
      />
      
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => (
            <ProductCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500 mb-4">Failed to load your saved products</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 space-y-4 border rounded-lg p-8">
          <Bookmark className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-xl font-medium">No saved products yet</h3>
          <p className="text-muted-foreground">
            When you find products you like, click the bookmark icon to save them here for later
          </p>
          <Button asChild className="mt-4">
            <Link to="/products">Discover Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedProductsPage;
