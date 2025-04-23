
import React from 'react';

interface ProductAssignEmptyStateProps {
  searchActive: boolean;
}

export const ProductAssignEmptyState: React.FC<ProductAssignEmptyStateProps> = ({ searchActive }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted p-3 mb-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-muted-foreground" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h3 className="text-sm font-medium mb-1">
        {searchActive ? 'No matching products found' : 'No available products'}
      </h3>
      <p className="text-xs text-muted-foreground max-w-xs">
        {searchActive
          ? 'Try adjusting your search or clear the filter to see all available products.'
          : 'All products have already been assigned to this judge or no approved products exist.'}
      </p>
    </div>
  );
};
