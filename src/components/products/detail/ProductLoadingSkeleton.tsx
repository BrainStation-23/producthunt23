
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductLoadingSkeleton: React.FC = () => {
  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <Skeleton className="h-80 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  );
};

export default ProductLoadingSkeleton;
