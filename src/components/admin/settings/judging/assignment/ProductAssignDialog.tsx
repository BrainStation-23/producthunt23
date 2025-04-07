
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProductAssignment } from './hooks/useProductAssignment';
import { ProductAssignListItem } from './ProductAssignListItem';
import { ProductAssignEmptyState } from './ProductAssignEmptyState';

interface ProductAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  judgeId: string;
  onAssignmentAdded: () => void;
}

export const ProductAssignDialog: React.FC<ProductAssignDialogProps> = ({
  open,
  onOpenChange,
  judgeId,
  onAssignmentAdded
}) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedProducts,
    availableProducts,
    isLoading,
    toggleProductSelection,
    handleAssignProducts
  } = useProductAssignment(judgeId, onAssignmentAdded);

  const handleSubmit = async () => {
    const success = await handleAssignProducts();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Assign Products to Judge</DialogTitle>
          <DialogDescription>
            Select products to assign to this judge. Only approved products are shown.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mb-4">
          <Input 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ScrollArea className="h-[300px] w-full">
          <div className="space-y-2">
            {availableProducts.length === 0 ? (
              <ProductAssignEmptyState searchActive={!!searchQuery} />
            ) : (
              availableProducts.map(product => (
                <ProductAssignListItem
                  key={product.id}
                  product={product}
                  isSelected={selectedProducts.includes(product.id)}
                  onToggleSelect={toggleProductSelection}
                />
              ))
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={selectedProducts.length === 0 || isLoading}
          >
            {isLoading ? 'Assigning...' : `Assign ${selectedProducts.length} Product(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
