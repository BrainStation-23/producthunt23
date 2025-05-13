
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface ProductSelectorProps {
  products: any[] | null;
  selectedProduct: string | null;
  onProductChange: (productId: string) => void;
  isLoading: boolean;
}

export const ProductSelector: React.FC<ProductSelectorProps> = ({
  products,
  selectedProduct,
  onProductChange,
  isLoading
}) => {
  return (
    <div className="w-full sm:w-64">
      <Select 
        value={selectedProduct || ''}
        onValueChange={onProductChange}
        disabled={isLoading || !products || products.length === 0}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a product" />
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
