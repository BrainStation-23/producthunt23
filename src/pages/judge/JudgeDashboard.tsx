
import React from 'react';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';
import { useJudgingCriteria } from '@/hooks/useJudgingCriteria';
import DashboardStats from '@/components/judge/dashboard/DashboardStats';
import StatusDistributionChart from '@/components/judge/dashboard/StatusDistributionChart';
import PriorityDistributionChart from '@/components/judge/dashboard/PriorityDistributionChart';
import UpcomingDeadlines from '@/components/judge/dashboard/UpcomingDeadlines';
import { 
  prepareStatusData, 
  preparePriorityData, 
  getUpcomingDeadlines 
} from '@/components/judge/dashboard/utils/chartDataUtils';

const JudgeDashboard: React.FC = () => {
  const { assignedProducts } = useJudgeAssignments();
  const { criteria } = useJudgingCriteria();

  // Calculate statistics
  const pending = assignedProducts.filter(p => p.evaluation_status === 'pending').length;
  const inProgress = assignedProducts.filter(p => p.evaluation_status === 'in_progress').length;
  const completed = assignedProducts.filter(p => p.evaluation_status === 'completed').length;
  const total = assignedProducts.length;

  // Prepare chart data
  const statusData = prepareStatusData(assignedProducts);
  const priorityData = preparePriorityData(assignedProducts);
  
  // Get upcoming deadlines
  const upcomingDeadlines = getUpcomingDeadlines(assignedProducts);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Judge Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your judge dashboard. Here you can see your evaluation progress and stats.
        </p>
      </div>

      <DashboardStats 
        pending={pending} 
        inProgress={inProgress} 
        completed={completed} 
        total={total} 
      />

      <div className="grid gap-4 md:grid-cols-2">
        <StatusDistributionChart statusData={statusData} />
        <PriorityDistributionChart priorityData={priorityData} />
      </div>

      <UpcomingDeadlines upcomingDeadlines={upcomingDeadlines} />
    </div>
  );
};

export default JudgeDashboard;
