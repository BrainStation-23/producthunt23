
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

interface ProductScoringHeaderProps {
  selectedProduct: string | null;
  onProductSelect: (productId: string) => void;
}

export const ProductScoringHeader: React.FC<ProductScoringHeaderProps> = ({
  selectedProduct,
  onProductSelect,
}) => {
  const { toast } = useToast();
  
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products-with-evaluations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name')
          .eq('status', 'approved')
          .order('name');
          
        if (error) {
          toast({
            title: "Error loading products",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        return data;
      } catch (err) {
        console.error("Error fetching products:", err);
        throw err;
      }
    },
    meta: {
      onError: (err: Error) => {
        console.error("Products query error:", err);
      }
    }
  });

  if (error) {
    return (
      <div className="mb-6 text-destructive">
        Error loading products. Please try again.
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        <Select 
          value={selectedProduct || ''} 
          onValueChange={onProductSelect}
          disabled={isLoading}
        >
          <SelectTrigger className="w-[300px]">
            {isLoading ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Loading products...</span>
              </div>
            ) : (
              <SelectValue placeholder="Select a product to view scores" />
            )}
          </SelectTrigger>
          <SelectContent>
            {products?.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
