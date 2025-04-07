
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import CriteriaList from './CriteriaList';
import AssignmentManager from './AssignmentManager';

const JudgingSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('criteria');
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Judging Configuration</h2>
        <p className="text-muted-foreground mb-6">
          Configure judging criteria and assign products to judges.
        </p>
      </div>
      
      <Tabs defaultValue="criteria" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="criteria">Criteria</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="criteria">
          <CriteriaList />
        </TabsContent>
        
        <TabsContent value="assignments">
          <AssignmentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JudgingSettings;
