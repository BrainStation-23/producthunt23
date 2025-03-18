
import React from 'react';
import { Activity, Bookmark, Package, MessageSquare } from 'lucide-react';
import DashboardStatsCard from './DashboardStatsCard';

interface StatsOverviewProps {
  isLoading: boolean;
  stats: {
    products: number;
    savedProducts: number;
    activity: number;
    messages: number;
  };
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ isLoading, stats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardStatsCard
        title="Your Products"
        count={stats.products}
        description="Products you've submitted"
        icon={Package}
        isLoading={isLoading}
      />
      
      <DashboardStatsCard
        title="Saved Products"
        count={stats.savedProducts}
        description="Products you've saved"
        icon={Bookmark}
        isLoading={isLoading}
      />
      
      <DashboardStatsCard
        title="Your Activity"
        count={stats.activity}
        description="Comments, votes, etc."
        icon={Activity}
        isLoading={isLoading}
      />
      
      <DashboardStatsCard
        title="New Messages"
        count={stats.messages}
        description="Unread messages"
        icon={MessageSquare}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StatsOverview;
