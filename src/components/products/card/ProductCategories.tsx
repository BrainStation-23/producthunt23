
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProductCategoriesProps {
  categories: string[] | null | undefined;
}

const ProductCategories: React.FC<ProductCategoriesProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-1">
      {categories.slice(0, 3).map((category, index) => (
        <Badge key={index} variant="secondary" className="text-xs">
          {category}
        </Badge>
      ))}
      {categories.length > 3 && (
        <Badge variant="outline" className="text-xs">
          +{categories.length - 3}
        </Badge>
      )}
    </div>
  );
};

export default ProductCategories;
