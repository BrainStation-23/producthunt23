
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const FormLoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-10 w-1/2" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-40 w-full" />
      </div>
      
      <div className="flex justify-end space-x-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
};

export default FormLoadingSkeleton;
