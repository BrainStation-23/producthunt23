
import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Edit, 
  Trash, 
  Check, 
  X, 
  ExternalLink, 
  FilePenLine, 
  MoreVertical, 
  MessageSquare 
} from 'lucide-react';
import { Product } from '@/types/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface ProductTableRowProps {
  product: Product;
  handleStatusChange: (productId: string, newStatus: string, feedback?: string) => Promise<void>;
  handleEditProduct: (productId: string) => void;
  handleDeleteClick: (productId: string) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({ 
  product, 
  handleStatusChange,
  handleEditProduct,
  handleDeleteClick
}) => {
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionFeedback, setRejectionFeedback] = useState('');
  
  // Get badge variant based on status
  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'approved':
        return 'default'; // Using 'default' instead of 'success'
      case 'pending':
        return 'secondary'; // Using 'secondary' instead of 'warning'
      case 'rejected':
        return 'destructive';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Display category name instead of ID
  const displayCategory = () => {
    if (product.categoryNames && product.categoryNames.length > 0) {
      return product.categoryNames[0];
    }
    
    if (product.categories && product.categories.length > 0) {
      return product.categories[0];
    }
    
    return '-';
  };

  const handleReject = async () => {
    await handleStatusChange(product.id, 'rejected', rejectionFeedback);
    setIsRejectDialogOpen(false);
    setRejectionFeedback('');
  };

  return (
    <>
      <TableRow key={product.id}>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell>
          <Badge variant={getStatusBadgeVariant(product.status || 'pending')}>
            {product.status ? (product.status.charAt(0).toUpperCase() + product.status.slice(1)) : 'Pending'}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {displayCategory()}
        </TableCell>
        <TableCell className="hidden md:table-cell">{product.upvotes || 0}</TableCell>
        <TableCell className="hidden md:table-cell">
          {new Date(product.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Manage Product</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              
              {/* Status change actions based on current status */}
              {product.status === 'pending' && (
                <>
                  <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'approved')}>
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsRejectDialogOpen(true)}>
                    <X className="mr-2 h-4 w-4 text-red-500" />
                    Reject
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'draft')}>
                    <FilePenLine className="mr-2 h-4 w-4 text-blue-500" />
                    Move to Draft
                  </DropdownMenuItem>
                </>
              )}
              
              {product.status === 'approved' && (
                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'draft')}>
                  <FilePenLine className="mr-2 h-4 w-4 text-blue-500" />
                  Move to Draft
                </DropdownMenuItem>
              )}
              
              {product.status === 'rejected' && (
                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'draft')}>
                  <FilePenLine className="mr-2 h-4 w-4 text-blue-500" />
                  Move to Draft
                </DropdownMenuItem>
              )}
              
              {product.status === 'draft' && (
                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'pending')}>
                  <Check className="mr-2 h-4 w-4 text-yellow-500" />
                  Submit for Review
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-500"
                onClick={() => handleDeleteClick(product.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* Rejection Feedback Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Product</DialogTitle>
            <DialogDescription>
              Please provide feedback on why this product is being rejected. This will be visible to the product creator.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={rejectionFeedback}
            onChange={(e) => setRejectionFeedback(e.target.value)}
            placeholder="Enter rejection feedback..."
            className="min-h-[120px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionFeedback.trim()}
            >
              Reject Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductTableRow;
