
import React from 'react';
import { useUserDashboard } from '@/hooks/useUserDashboard';
import ProfileHeader from '@/components/user/profile/ProfileHeader';
import StatsOverview from '@/components/user/dashboard/StatsOverview';
import UserProductsList from '@/components/user/dashboard/UserProductsList';
import SavedProductsList from '@/components/user/dashboard/SavedProductsList';
import ActivitySection from '@/components/user/dashboard/ActivitySection';

const UserDashboard: React.FC = () => {
  const { isLoading, data } = useUserDashboard();

  return (
    <div className="space-y-6">
      <ProfileHeader 
        title="Your Dashboard" 
        description="Welcome back! Here's an overview of your activity." 
      />
      
      <StatsOverview 
        isLoading={isLoading} 
        stats={{
          products: data.products.count,
          savedProducts: data.savedProducts.count,
          activity: data.activity.count,
        }} 
      />
      
      <div className="grid gap-4 md:grid-cols-2">
        <UserProductsList 
          isLoading={isLoading} 
          products={data.products.items} 
        />
        
        <SavedProductsList 
          isLoading={isLoading} 
          products={data.savedProducts.items} 
        />
      </div>
      
      <ActivitySection 
        isLoading={isLoading} 
        activityCount={data.activity.count} 
      />
    </div>
  );
};

export default UserDashboard;
