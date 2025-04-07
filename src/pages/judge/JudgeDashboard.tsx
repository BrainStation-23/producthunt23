
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useJudgeAssignments } from '@/hooks/useJudgeAssignments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssignmentList from '@/components/judge/dashboard/AssignmentList';
import DashboardStats from '@/components/judge/dashboard/DashboardStats';
import { useJudgingCriteria } from '@/hooks/useJudgingCriteria';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CalendarClock, AlertCircle } from 'lucide-react';

const JudgeDashboard: React.FC = () => {
  const { 
    assignedProducts, 
    isLoading,
    filter, 
    setFilter 
  } = useJudgeAssignments();

  const { criteria } = useJudgingCriteria();

  const pending = assignedProducts.filter(p => p.evaluation_status === 'pending').length;
  const inProgress = assignedProducts.filter(p => p.evaluation_status === 'in_progress').length;
  const completed = assignedProducts.filter(p => p.evaluation_status === 'completed').length;
  const total = assignedProducts.length;

  // Count priority assignments
  const highPriority = assignedProducts.filter(p => p.priority === 'high').length;
  const mediumPriority = assignedProducts.filter(p => p.priority === 'medium').length;
  const lowPriority = assignedProducts.filter(p => p.priority === 'low').length;
  
  // Calculate the counts for the status pie chart
  const statusData = [
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'In Progress', value: inProgress, color: '#3b82f6' },
    { name: 'Completed', value: completed, color: '#10b981' }
  ].filter(item => item.value > 0);

  // Calculate the counts for the priority pie chart
  const priorityData = [
    { name: 'High', value: highPriority, color: '#ef4444' },
    { name: 'Medium', value: mediumPriority, color: '#f59e0b' },
    { name: 'Low', value: lowPriority, color: '#10b981' }
  ].filter(item => item.value > 0);

  // Find upcoming deadlines (within 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingDeadlines = assignedProducts
    .filter(p => {
      if (!p.deadline) return false;
      const deadlineDate = new Date(p.deadline);
      return deadlineDate > today && deadlineDate <= nextWeek && p.evaluation_status !== 'completed';
    })
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Judge Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your judge dashboard. Here you can see your assigned products and evaluation progress.
        </p>
      </div>

      <DashboardStats 
        pending={pending} 
        inProgress={inProgress} 
        completed={completed} 
        total={total} 
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* Status Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>
              Breakdown of your evaluations by status
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                No data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Priority Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>
              Breakdown of your evaluations by priority
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                No data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5" />
            Upcoming Deadlines
          </CardTitle>
          <CardDescription>
            Evaluations due within the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingDeadlines.length > 0 ? (
            <div className="space-y-3">
              {upcomingDeadlines.map((product) => (
                <div key={product.id} className="flex items-start justify-between gap-2 border-b pb-3">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.tagline}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Due: {new Date(product.deadline!).toLocaleDateString()}
                    </p>
                    <span className={`inline-flex text-xs items-center px-2 py-1 rounded-full ${
                      product.priority === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : product.priority === 'medium' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-green-100 text-green-700'
                    }`}>
                      {product.priority.charAt(0).toUpperCase() + product.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
              <p>No upcoming deadlines</p>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold tracking-tight mt-8">Your Assignments</h2>

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

export default JudgeDashboard;
