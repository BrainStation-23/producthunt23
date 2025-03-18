
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ActivitySectionProps {
  isLoading: boolean;
  activityCount: number;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({ isLoading, activityCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your recent interactions on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : activityCount > 0 ? (
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">Activity history coming soon</p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 border rounded-md">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivitySection;
