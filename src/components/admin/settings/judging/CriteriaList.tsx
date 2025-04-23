import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2 } from 'lucide-react';
import CriteriaForm from './CriteriaForm';
import DeleteCriteriaDialog from './DeleteCriteriaDialog';
import type { JudgingCriteria } from './types';

const CriteriaList: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState<JudgingCriteria | undefined>();

  const { data: criteria, isLoading, refetch } = useQuery({
    queryKey: ['judgingCriteria'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('judging_criteria')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(`Failed to load criteria: ${error.message}`);
        throw error;
      }

      return data as JudgingCriteria[];
    }
  });

  const handleEdit = (criteria: JudgingCriteria) => {
    setSelectedCriteria(criteria);
    setFormOpen(true);
  };

  const handleDelete = (criteria: JudgingCriteria) => {
    setSelectedCriteria(criteria);
    setDeleteDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCriteria(undefined);
    setFormOpen(true);
  };

  const renderTypeData = (criteria: JudgingCriteria) => {
    switch (criteria.type) {
      case 'rating':
        return `Rating (${criteria.min_value}-${criteria.max_value})`;
      case 'boolean':
        return 'Yes/No';
      case 'text':
        return 'Text Comment';
      default:
        return criteria.type;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Judging Criteria</h3>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="border rounded-md">
          <div className="p-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 py-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
                <Skeleton className="h-8 w-8 ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Judging Criteria</h3>
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Add Criteria
        </Button>
      </div>

      {criteria && criteria.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {criteria.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {item.description || "-"}
                  </TableCell>
                  <TableCell>{renderTypeData(item)}</TableCell>
                  <TableCell>{item.weight}x</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(item)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <p className="text-muted-foreground">No judging criteria defined yet. Create one to get started.</p>
          <Button className="mt-4" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Criteria
          </Button>
        </div>
      )}

      <CriteriaForm 
        open={formOpen}
        onOpenChange={setFormOpen}
        onSuccess={refetch}
        criteria={selectedCriteria}
      />

      {selectedCriteria && (
        <DeleteCriteriaDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          criteria={selectedCriteria}
          onCriteriaDeleted={() => {
            refetch();
            toast.success("Criteria deleted successfully");
          }}
        />
      )}
    </div>
  );
};

export default CriteriaList;
