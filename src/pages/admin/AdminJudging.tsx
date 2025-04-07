
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CriteriaList from '@/components/admin/settings/judging/CriteriaList';
import JudgesList from '@/components/admin/settings/judging/JudgesList';
import AssignmentManager from '@/components/admin/settings/judging/AssignmentManager';

const AdminJudging: React.FC = () => {
  const [activeTab, setActiveTab] = useState('criteria');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Judging Management</h1>
        <p className="text-muted-foreground mb-6">
          Configure judging criteria, manage judges, and assign products to judges.
        </p>
      </div>
      
      <Card className="p-6">
        <Tabs defaultValue="criteria" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="criteria">Criteria</TabsTrigger>
            <TabsTrigger value="judges">Judges</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="criteria">
            <CriteriaList />
          </TabsContent>
          
          <TabsContent value="judges">
            <JudgesList />
          </TabsContent>
          
          <TabsContent value="assignments">
            <AssignmentManager />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminJudging;
