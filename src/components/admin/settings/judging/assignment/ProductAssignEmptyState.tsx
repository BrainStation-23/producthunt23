
import React from 'react';

interface ProductAssignEmptyStateProps {
  searchActive: boolean;
}

export const ProductAssignEmptyState: React.FC<ProductAssignEmptyStateProps> = ({
  searchActive
}) => {
  return (
    <p className="text-center text-muted-foreground">
      {searchActive
        ? 'No available products match your search'
        : 'No available products to assign'}
    </p>
  );
};
