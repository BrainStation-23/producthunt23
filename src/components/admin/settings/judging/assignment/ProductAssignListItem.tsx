
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface Product {
  id: string;
  name: string;
  tagline: string;
  image_url: string | null;
}

interface ProductAssignListItemProps {
  product: Product;
  isSelected: boolean;
  onToggleSelect: (productId: string) => void;
}

export const ProductAssignListItem: React.FC<ProductAssignListItemProps> = ({
  product,
  isSelected,
  onToggleSelect
}) => {
  return (
    <div 
      key={product.id} 
      className="flex items-center space-x-3 p-2 hover:bg-accent rounded"
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggleSelect(product.id)}
      />
      <div className="flex-1">
        <div className="font-medium">{product.name}</div>
        <div className="text-sm text-muted-foreground">{product.tagline}</div>
      </div>
    </div>
  );
};
