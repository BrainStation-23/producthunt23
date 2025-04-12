
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface CategoryListProps {
  categories: string[] | null | undefined;
  categoryNames: Record<string, string>;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, categoryNames }) => {
  if (!categories || categories.length === 0) return null;
  
  return (
    <div>
      <h3 className="font-medium mb-2">Categories</h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((categoryId, index) => (
          <Badge key={index} variant="secondary">
            {categoryNames[categoryId] || categoryId}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
