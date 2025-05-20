
import React from 'react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const CertificateSkeleton = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between mb-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <Card className="p-8 md:p-12 border-4 border-primary/20">
        <div className="flex flex-col items-center space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
          
          <div className="w-full space-y-3">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-8 w-1/2 mx-auto" />
            <Skeleton className="h-6 w-3/5 mx-auto" />
          </div>
          
          <Skeleton className="h-40 w-40" />
          
          <div className="w-full space-y-3">
            <Skeleton className="h-8 w-1/3 mx-auto" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
          
          <Skeleton className="h-32 w-32 mx-auto" />
        </div>
      </Card>
    </div>
  );
};

export default CertificateSkeleton;
