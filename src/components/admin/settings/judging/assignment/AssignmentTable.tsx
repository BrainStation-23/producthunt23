
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Assignment } from './hooks/useJudgeAssignments';

interface AssignmentTableProps {
  assignments: Assignment[];
  deletingAssignmentId: string | null;
  onDeleteAssignment: (assignmentId: string) => void;
}

export const AssignmentTable: React.FC<AssignmentTableProps> = ({
  assignments,
  deletingAssignmentId,
  onDeleteAssignment
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Evaluation</TableHead>
          <TableHead>Assigned Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {assignments.map((assignment) => (
          <TableRow key={assignment.id}>
            <TableCell>
              <div>
                <div className="font-medium">{assignment.product.name}</div>
                <div className="text-sm text-muted-foreground">{assignment.product.tagline}</div>
              </div>
            </TableCell>
            <TableCell>
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                assignment.product.status === 'approved' 
                  ? 'bg-green-50 text-green-700' 
                  : assignment.product.status === 'rejected'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-yellow-50 text-yellow-700'
              }`}>
                {assignment.product.status}
              </span>
            </TableCell>
            <TableCell>
              {assignment.product.hasSubmissions ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Evaluated
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Pending
                </Badge>
              )}
            </TableCell>
            <TableCell>{new Date(assignment.assigned_at).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={() => onDeleteAssignment(assignment.id)}
                disabled={deletingAssignmentId === assignment.id}
              >
                {deletingAssignmentId === assignment.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
