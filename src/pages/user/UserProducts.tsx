
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import UserProductCard from '@/components/user/UserProductCard';
import UserProductsEmptyState from '@/components/user/UserProductsEmptyState';

const UserProducts: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user's products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // First, fetch products created by the user
        const { data: createdProducts, error: createdError } = await supabase
          .from('products')
          .select('*, makers:product_makers(profile_id)')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false });

        if (createdError) throw createdError;
        
        // Then, fetch products where the user is a maker but not the creator
        // Note: Fixed the order syntax here
        const { data: makerProducts, error: makerError } = await supabase
          .from('product_makers')
          .select('products:product_id(*)')
          .eq('profile_id', user.id)
          .order('product_id', { ascending: false });
          
        if (makerError) throw makerError;

        // Process maker products to flatten the structure
        const makerProductsFlattened = makerProducts
          .map(item => item.products)
          .filter(product => product.created_by !== user.id); // Filter out products already in createdProducts

        // Combine both lists
        const combinedProducts = [
          ...(createdProducts || []),
          ...(makerProductsFlattened || [])
        ];
        
        // Adding a flag to identify if the user is the creator or just a maker
        const productsWithRole = combinedProducts.map(product => ({
          ...product,
          isCreator: product.created_by === user.id
        }));
        
        setProducts(productsWithRole);
      } catch (error: any) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load your products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Products</h1>
          <p className="text-muted-foreground">Manage your submitted products and products you're a maker on.</p>
        </div>
        <Button asChild>
          <Link to="/products/submit">
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <UserProductsEmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <UserProductCard 
              key={product.id} 
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProducts;
