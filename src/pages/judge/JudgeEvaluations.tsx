
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssignmentList from '@/components/judge/dashboard/AssignmentList';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';

const JudgeEvaluations: React.FC = () => {
  const { 
    assignedProducts, 
    isLoading,
    filter, 
    setFilter 
  } = useJudgeAssignments();

  const pending = assignedProducts.filter(p => p.evaluation_status === 'pending').length;
  const inProgress = assignedProducts.filter(p => p.evaluation_status === 'in_progress').length;
  const completed = assignedProducts.filter(p => p.evaluation_status === 'completed').length;
  const total = assignedProducts.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Product Evaluations</h1>
        <p className="text-muted-foreground">
          View and manage all your assigned products for evaluation.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(value as any)}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Assignments ({total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pending})</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress ({inProgress})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <AssignmentList products={assignedProducts} isLoading={isLoading} />
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          <AssignmentList 
            products={assignedProducts.filter(p => p.evaluation_status === 'pending')} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="in_progress" className="space-y-4">
          <AssignmentList 
            products={assignedProducts.filter(p => p.evaluation_status === 'in_progress')} 
            isLoading={isLoading} 
          />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <AssignmentList 
            products={assignedProducts.filter(p => p.evaluation_status === 'completed')} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JudgeEvaluations;
