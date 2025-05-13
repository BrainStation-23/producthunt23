
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { AssignmentTable } from './AssignmentTable';
import type { Assignment } from './hooks/useJudgeAssignments';

interface AssignmentContentProps {
  isLoading: boolean;
  selectedProduct: string | null;
  products: any[] | null;
  assignments: Assignment[] | undefined;
  deletingAssignmentId: string | null;
  onDeleteAssignment: (assignmentId: string) => void;
  onAssignClick: () => void;
}

export const AssignmentContent: React.FC<AssignmentContentProps> = ({
  isLoading,
  selectedProduct,
  products,
  assignments,
  deletingAssignmentId,
  onDeleteAssignment,
  onAssignClick
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Select a product to manage judge assignments.</p>
      </Card>
    );
  }

  if (!assignments || assignments.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No judges assigned to this product yet.</p>
        <Button 
          className="mt-4" 
          onClick={onAssignClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Assign First Judge
        </Button>
      </Card>
    );
  }

  const selectedProductName = products?.find(p => p.id === selectedProduct)?.name;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>
          Assigned Judges
        </CardTitle>
        <CardDescription>
          Judges assigned to evaluate {selectedProductName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AssignmentTable
          assignments={assignments}
          deletingAssignmentId={deletingAssignmentId}
          onDeleteAssignment={onDeleteAssignment}
        />
      </CardContent>
    </Card>
  );
};
