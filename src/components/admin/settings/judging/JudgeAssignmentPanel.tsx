
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JudgesPanel } from './assignment/JudgesPanel';
import UnassignedProducts from './assignment/UnassignedProducts';
import { useJudges } from './hooks/useJudges';

const JudgeAssignmentPanel: React.FC = () => {
  const [viewMode, setViewMode] = useState<'judges' | 'unassigned'>('judges');
  const {
    judges,
    isLoading,
    selectedJudge,
    handleJudgeSelected,
    handleAssignmentsUpdated
  } = useJudges();
  
  return (
    <div className="h-[calc(100vh-320px)] min-h-[500px]">
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'judges' | 'unassigned')} className="mb-4">
        <TabsList>
          <TabsTrigger value="judges">Judges</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned Products</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {viewMode === 'judges' ? (
        <JudgesPanel
          judges={judges}
          isLoading={isLoading}
          selectedJudge={selectedJudge}
          onSelectJudge={handleJudgeSelected}
          onAssignmentsUpdated={handleAssignmentsUpdated}
        />
      ) : (
        <UnassignedProducts />
      )}
    </div>
  );
};

export default JudgeAssignmentPanel;
