
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ProductRejectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  feedback: string;
  setFeedback: (feedback: string) => void;
  onReject: () => void;
  isLoading: boolean;
}

const ProductRejectionDialog: React.FC<ProductRejectionDialogProps> = ({
  isOpen,
  onOpenChange,
  feedback,
  setFeedback,
  onReject,
  isLoading
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="z-50">
        <DialogHeader>
          <DialogTitle>Reject Product</DialogTitle>
          <DialogDescription>
            Please provide feedback on why this product is being rejected. This will be visible to the product creator.
          </DialogDescription>
        </DialogHeader>
        
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Enter rejection feedback..."
          className="min-h-[120px]"
        />
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onReject}
            disabled={!feedback.trim() || isLoading}
          >
            {isLoading ? 'Rejecting...' : 'Reject Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductRejectionDialog;
