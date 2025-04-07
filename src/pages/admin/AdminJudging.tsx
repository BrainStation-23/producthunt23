
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CriteriaList from '@/components/admin/settings/judging/CriteriaList';
import JudgeAssignmentPanel from '@/components/admin/settings/judging/JudgeAssignmentPanel';

const AdminJudging: React.FC = () => {
  const [activeTab, setActiveTab] = useState('criteria');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Judging Management</h1>
        <p className="text-muted-foreground mb-6">
          Configure judging criteria and manage product assignments.
        </p>
      </div>
      
      <Card className="p-6">
        <Tabs defaultValue="criteria" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="criteria">Criteria</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="criteria">
            <CriteriaList />
          </TabsContent>
          
          <TabsContent value="assignments">
            <JudgeAssignmentPanel />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AdminJudging;
