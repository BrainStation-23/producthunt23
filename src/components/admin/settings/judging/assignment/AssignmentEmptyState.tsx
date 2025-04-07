
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AssignmentEmptyStateProps {
  hasSearch: boolean;
  hasStatusFilter: boolean;
  onAssignClick: () => void;
}

export const AssignmentEmptyState: React.FC<AssignmentEmptyStateProps> = ({
  hasSearch,
  hasStatusFilter,
  onAssignClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <p className="text-muted-foreground mb-4">
        {hasSearch || hasStatusFilter
          ? 'No products match your filters'
          : 'No products assigned to this judge yet'}
      </p>
      {!hasSearch && !hasStatusFilter && (
        <Button onClick={onAssignClick}>
          <Plus className="h-4 w-4 mr-2" />
          Assign First Product
        </Button>
      )}
    </div>
  );
};
