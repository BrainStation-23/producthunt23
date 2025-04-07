
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductAssignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  judgeId: string;
  onAssignmentAdded: () => void;
}

interface Product {
  id: string;
  name: string;
  tagline: string;
  image_url: string | null;
}

export const ProductAssignDialog: React.FC<ProductAssignDialogProps> = ({
  open,
  onOpenChange,
  judgeId,
  onAssignmentAdded
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  // Fetch available products not already assigned to this judge
  const fetchAvailableProducts = async () => {
    try {
      // First, get already assigned product IDs for this judge
      const { data: assignedData, error: assignedError } = await supabase
        .from('judge_assignments')
        .select('product_id')
        .eq('judge_id', judgeId);

      if (assignedError) throw assignedError;

      const assignedProductIds = assignedData.map(a => a.product_id);

      // Then fetch products not already assigned
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, tagline, image_url')
        .eq('status', 'approved')
        .not('id', 'in', `(${assignedProductIds.join(',')})`)
        .ilike('name', `%${searchQuery}%`);

      if (productsError) throw productsError;

      setAvailableProducts(productsData || []);
    } catch (error) {
      toast.error('Failed to load available products');
      console.error(error);
    }
  };

  // Handle product selection toggle
  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Assign selected products to judge
  const handleAssignProducts = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    try {
      setIsLoading(true);
      
      // Bulk insert assignments
      const assignmentData = selectedProducts.map(productId => ({
        judge_id: judgeId,
        product_id: productId,
        assigned_by: 'YOUR_CURRENT_USER_ID' // Replace with actual user ID from context
      }));

      const { error } = await supabase
        .from('judge_assignments')
        .insert(assignmentData);

      if (error) throw error;

      toast.success(`Assigned ${selectedProducts.length} product(s) to judge`);
      
      // Reset state and trigger parent component update
      setSelectedProducts([]);
      onAssignmentAdded();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to assign products');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchAvailableProducts();
    }
  }, [open, searchQuery]);

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
              <p className="text-center text-muted-foreground">
                No available products to assign
              </p>
            ) : (
              availableProducts.map(product => (
                <div 
                  key={product.id} 
                  className="flex items-center space-x-3 p-2 hover:bg-accent rounded"
                >
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => toggleProductSelection(product.id)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.tagline}</div>
                  </div>
                </div>
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
            onClick={handleAssignProducts} 
            disabled={selectedProducts.length === 0 || isLoading}
          >
            {isLoading ? 'Assigning...' : `Assign ${selectedProducts.length} Product(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
