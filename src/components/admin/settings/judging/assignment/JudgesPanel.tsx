
import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { JudgeList } from './JudgeList';
import { JudgeAssignmentDetail } from './JudgeAssignmentDetail';
import type { Judge } from '../types';

interface JudgesPanelProps {
  judges: Judge[];
  isLoading: boolean;
  selectedJudge: Judge | null;
  onSelectJudge: (judge: Judge) => void;
  onAssignmentsUpdated: () => void;
}

export const JudgesPanel: React.FC<JudgesPanelProps> = ({
  judges,
  isLoading,
  selectedJudge,
  onSelectJudge,
  onAssignmentsUpdated
}) => {
  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={30} minSize={20}>
        <JudgeList 
          judges={judges} 
          isLoading={isLoading}
          selectedJudgeId={selectedJudge?.id} 
          onSelectJudge={onSelectJudge}
        />
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={70}>
        {selectedJudge ? (
          <JudgeAssignmentDetail 
            judge={selectedJudge}
            onAssignmentsUpdated={onAssignmentsUpdated}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground p-4">
            Select a judge to manage their product assignments
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
