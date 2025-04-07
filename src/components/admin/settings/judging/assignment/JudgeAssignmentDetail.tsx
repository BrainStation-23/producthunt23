
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';
import { ProductAssignDialog } from './ProductAssignDialog';
import { useJudgeAssignments } from './hooks/useJudgeAssignments';
import { JudgeHeader } from './JudgeHeader';
import { AssignmentFilters } from './AssignmentFilters';
import { AssignmentTable } from './AssignmentTable';
import { AssignmentEmptyState } from './AssignmentEmptyState';
import type { Judge } from '../JudgeAssignmentPanel';

interface JudgeAssignmentDetailProps {
  judge: Judge;
  onAssignmentsUpdated: () => void;
}

export const JudgeAssignmentDetail: React.FC<JudgeAssignmentDetailProps> = ({
  judge,
  onAssignmentsUpdated
}) => {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    assignDialogOpen,
    setAssignDialogOpen,
    deletingAssignmentId,
    filteredAssignments,
    isLoading,
    handleDeleteAssignment,
    handleAssignmentsChanged
  } = useJudgeAssignments(judge, onAssignmentsUpdated);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/20">
        <JudgeHeader judge={judge} />
        
        <AssignmentFilters 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          onAssignClick={() => setAssignDialogOpen(true)}
        />
      </div>
      
      <ScrollArea className="flex-1 p-1">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredAssignments && filteredAssignments.length > 0 ? (
          <AssignmentTable 
            assignments={filteredAssignments}
            deletingAssignmentId={deletingAssignmentId}
            onDeleteAssignment={handleDeleteAssignment}
          />
        ) : (
          <AssignmentEmptyState 
            hasSearch={!!searchQuery}
            hasStatusFilter={statusFilter !== 'all'}
            onAssignClick={() => setAssignDialogOpen(true)}
          />
        )}
      </ScrollArea>

      <ProductAssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        judgeId={judge.id}
        onAssignmentAdded={handleAssignmentsChanged}
      />
    </div>
  );
};
