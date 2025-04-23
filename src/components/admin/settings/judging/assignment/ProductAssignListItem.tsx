
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
      className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted/40 ${
        isSelected ? 'bg-muted/40' : ''
      }`}
      onClick={() => onToggleSelect(product.id)}
    >
      <Checkbox 
        checked={isSelected} 
        onCheckedChange={() => onToggleSelect(product.id)}
        className="flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="h-10 w-10 bg-muted rounded-md overflow-hidden flex-shrink-0">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
            No img
          </div>
        )}
      </div>
      <div className="overflow-hidden">
        <h4 className="text-sm font-medium truncate">{product.name}</h4>
        <p className="text-xs text-muted-foreground truncate">
          {product.tagline}
        </p>
      </div>
    </div>
  );
};
