
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  image_url: string | null;
  tagline: string;
}

interface ProductsListProps {
  selectedProduct: string | null;
  onProductSelect: (productId: string) => void;
  searchQuery: string;
}

export const ProductsList: React.FC<ProductsListProps> = ({
  selectedProduct,
  onProductSelect,
  searchQuery
}) => {
  const { toast } = useToast();

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products-for-scoring', searchQuery],
    queryFn: async () => {
      try {
        let query = supabase
          .from('products')
          .select('id, name, image_url, tagline')
          .eq('status', 'approved')
          .order('name');

        // Apply search filter if provided
        if (searchQuery) {
          query = query.ilike('name', `%${searchQuery}%`);
        }
          
        const { data, error } = await query;
          
        if (error) {
          toast({
            title: "Error loading products",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        return data as Product[];
      } catch (err) {
        console.error("Error fetching products:", err);
        throw err;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-destructive">
        Failed to load products
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {searchQuery ? "No products match your search" : "No products available"}
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1 -mx-4 px-4">
      <ul className="space-y-2">
        {products.map((product) => (
          <li 
            key={product.id}
            onClick={() => onProductSelect(product.id)}
            className={cn(
              "p-3 rounded-md cursor-pointer hover:bg-secondary/50 transition-colors",
              selectedProduct === product.id && "bg-secondary"
            )}
          >
            <div className="flex items-center gap-3">
              {product.image_url ? (
                <div className="h-10 w-10 rounded overflow-hidden shrink-0">
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="h-full w-full object-cover" 
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
                  <span className="text-xs font-medium text-muted-foreground">
                    {product.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-muted-foreground truncate">{product.tagline}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
