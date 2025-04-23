
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface ProductScoringHeaderProps {
  selectedProduct: string | null;
}

export const ProductScoringHeader: React.FC<ProductScoringHeaderProps> = ({
  selectedProduct
}) => {
  const { toast } = useToast();
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product-detail', selectedProduct],
    queryFn: async () => {
      if (!selectedProduct) return null;
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, tagline, image_url')
          .eq('id', selectedProduct)
          .single();
          
        if (error) {
          toast({
            title: "Error loading product details",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        return data;
      } catch (err) {
        console.error("Error fetching product details:", err);
        throw err;
      }
    },
    enabled: !!selectedProduct
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return null;
  }

  return (
    <div className="flex items-start gap-4">
      {product.image_url ? (
        <div className="h-16 w-16 rounded overflow-hidden shrink-0">
          <img 
            src={product.image_url} 
            alt={product.name}
            className="h-full w-full object-cover" 
          />
        </div>
      ) : (
        <div className="h-16 w-16 rounded bg-muted flex items-center justify-center shrink-0">
          <span className="text-lg font-medium text-muted-foreground">
            {product.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      <div>
        <h2 className="text-2xl font-bold">{product.name}</h2>
        <p className="text-muted-foreground">{product.tagline}</p>
      </div>
    </div>
  );
};
