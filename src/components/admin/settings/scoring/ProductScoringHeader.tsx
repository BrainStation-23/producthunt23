
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

interface ProductScoringHeaderProps {
  selectedProduct: string | null;
  onProductSelect: (productId: string) => void;
}

export const ProductScoringHeader: React.FC<ProductScoringHeaderProps> = ({
  selectedProduct,
  onProductSelect,
}) => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products-with-evaluations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name')
        .eq('status', 'approved')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="mb-6">
      <Select 
        value={selectedProduct || ''} 
        onValueChange={onProductSelect}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select a product to view scores" />
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
  );
};
