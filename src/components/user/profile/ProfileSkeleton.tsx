
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-72" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-[1fr_250px]">
        <div className="space-y-6">
          <Skeleton className="h-[450px] w-full rounded-lg" />
        </div>
        
        <div className="space-y-6">
          <Skeleton className="h-[350px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
