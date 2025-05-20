
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CategoryListProps {
  categories: string[] | null | undefined;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  if (!categories || categories.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category, index) => (
        <Badge key={index} variant="secondary">
          {category}
        </Badge>
      ))}
    </div>
  );
};

export default CategoryList;
