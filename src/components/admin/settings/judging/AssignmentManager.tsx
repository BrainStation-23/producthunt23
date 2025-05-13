
import React from 'react';
import { useAssignmentManager } from './hooks/useAssignmentManager';
import { AssignmentHeader } from './assignment/AssignmentHeader';
import { AssignmentContent } from './assignment/AssignmentContent';
import AssignJudgeDialog from './AssignJudgeDialog';
import { toast } from 'sonner';

const AssignmentManager: React.FC = () => {
  const {
    selectedProduct,
    products,
    assignments,
    isLoading,
    assignDialogOpen,
    setAssignDialogOpen,
    deletingAssignmentId,
    handleProductChange,
    handleDeleteAssignment,
    getProductJudgingStatus,
    refetchAssignments
  } = useAssignmentManager();

  const productStatus = selectedProduct 
    ? getProductJudgingStatus(selectedProduct) 
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Product Assignments</h3>
        <p className="text-muted-foreground mb-4">Assign products to judges for evaluation.</p>
      </div>

      <AssignmentHeader
        products={products}
        selectedProduct={selectedProduct}
        onProductChange={handleProductChange}
        onAssignClick={() => setAssignDialogOpen(true)}
        isLoading={isLoading}
        productStatus={productStatus}
      />

      <AssignmentContent
        isLoading={isLoading}
        selectedProduct={selectedProduct}
        products={products}
        assignments={assignments}
        deletingAssignmentId={deletingAssignmentId}
        onDeleteAssignment={handleDeleteAssignment}
        onAssignClick={() => setAssignDialogOpen(true)}
      />

      {selectedProduct && (
        <AssignJudgeDialog
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          productId={selectedProduct}
          onAssignmentAdded={() => {
            refetchAssignments();
            toast.success("Judge assigned successfully");
          }}
        />
      )}
    </div>
  );
};

export default AssignmentManager;
