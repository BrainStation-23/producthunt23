
import { AssignedProduct } from '@/components/admin/settings/judging/types';

export const prepareStatusData = (assignedProducts: AssignedProduct[]) => {
  const pending = assignedProducts.filter(p => p.evaluation_status === 'pending').length;
  const inProgress = assignedProducts.filter(p => p.evaluation_status === 'in_progress').length;
  const completed = assignedProducts.filter(p => p.evaluation_status === 'completed').length;
  
  return [
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'In Progress', value: inProgress, color: '#3b82f6' },
    { name: 'Completed', value: completed, color: '#10b981' }
  ].filter(item => item.value > 0);
};

export const preparePriorityData = (assignedProducts: AssignedProduct[]) => {
  const highPriority = assignedProducts.filter(p => p.priority === 'high').length;
  const mediumPriority = assignedProducts.filter(p => p.priority === 'medium').length;
  const lowPriority = assignedProducts.filter(p => p.priority === 'low').length;
  
  return [
    { name: 'High', value: highPriority, color: '#ef4444' },
    { name: 'Medium', value: mediumPriority, color: '#f59e0b' },
    { name: 'Low', value: lowPriority, color: '#10b981' }
  ].filter(item => item.value > 0);
};

export const getUpcomingDeadlines = (assignedProducts: AssignedProduct[]) => {
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  return assignedProducts
    .filter(p => {
      if (!p.deadline) return false;
      const deadlineDate = new Date(p.deadline);
      return deadlineDate > today && deadlineDate <= nextWeek && p.evaluation_status !== 'completed';
    })
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3);
};
