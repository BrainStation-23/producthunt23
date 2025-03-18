
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

export const useSavedProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSavedProducts = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('saved_products')
          .select(`
            id,
            product_id,
            products (
              id,
              name,
              tagline,
              description,
              image_url,
              website_url,
              categories,
              upvotes,
              created_at,
              created_by,
              status
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        // Transform the data to match the Product type
        const transformedProducts = data.map(item => ({
          ...item.products,
        }));
        
        setProducts(transformedProducts);
      } catch (err: any) {
        console.error('Error fetching saved products:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedProducts();
  }, [user]);

  return {
    products,
    isLoading,
    error
  };
};
