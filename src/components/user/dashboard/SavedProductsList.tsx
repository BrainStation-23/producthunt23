
import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductSaveButton from '@/components/products/card/ProductSaveButton';

interface SavedProductsListProps {
  isLoading: boolean;
  products: any[];
}

const SavedProductsList: React.FC<SavedProductsListProps> = ({ isLoading, products }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Products</CardTitle>
        <CardDescription>
          Products you've saved for later
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-4">
            {products.map(product => (
              <div key={product.id} className="flex items-center gap-3 border p-3 rounded-lg">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="h-12 w-12 object-cover rounded-md"
                  />
                ) : (
                  <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${product.id}`} className="font-medium hover:underline block truncate">
                    {product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">{product.tagline}</p>
                </div>
                <ProductSaveButton productId={product.id} variant="outline" iconOnly />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">You haven't saved any products yet</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" asChild>
          <Link to="/products">Browse products</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SavedProductsList;
