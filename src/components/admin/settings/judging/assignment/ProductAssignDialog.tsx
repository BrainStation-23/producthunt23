
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProductAssignment } from './hooks/useProductAssignment';
import { ProductAssignListItem } from './ProductAssignListItem';
import { ProductAssignEmptyState } from './ProductAssignEmptyState';
import { Checkbox } from '@/components/ui/checkbox';

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
    selectAllProducts,
    handleAssignProducts
  } = useProductAssignment(judgeId, onAssignmentAdded);

  const handleSubmit = async () => {
    const success = await handleAssignProducts();
    if (success) {
      onOpenChange(false);
    }
  };

  const areAllSelected = 
    availableProducts.length > 0 && 
    selectedProducts.length === availableProducts.length;

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
        
        {availableProducts.length > 0 && (
          <div className="flex items-center mb-2">
            <Checkbox 
              id="select-all" 
              checked={areAllSelected}
              onCheckedChange={selectAllProducts}
            />
            <label 
              htmlFor="select-all" 
              className="ml-2 text-sm cursor-pointer"
            >
              Select all ({availableProducts.length})
            </label>
          </div>
        )}
        
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

export default ProductAssignDialog;
