
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash, 
  Check, 
  X, 
  ExternalLink, 
  FilePenLine, 
  MoreVertical
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductActionsDropdownProps {
  productId: string;
  productStatus: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onEditClick: (productId: string) => void;
  onDeleteClick: (productId: string) => void;
  onStatusChange: (productId: string, newStatus: string) => Promise<void>;
  openRejectDialog: () => void;
}

const ProductActionsDropdown: React.FC<ProductActionsDropdownProps> = ({
  productId,
  productStatus,
  isOpen,
  setIsOpen,
  onEditClick,
  onDeleteClick,
  onStatusChange,
  openRejectDialog
}) => {
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Manage Product</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEditClick(productId)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={`/products/${productId}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        
        {/* Status change actions based on current status */}
        {productStatus === 'pending' && (
          <>
            <DropdownMenuItem onClick={() => onStatusChange(productId, 'approved')}>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openRejectDialog}>
              <X className="mr-2 h-4 w-4 text-red-500" />
              Reject
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(productId, 'draft')}>
              <FilePenLine className="mr-2 h-4 w-4 text-blue-500" />
              Move to Draft
            </DropdownMenuItem>
          </>
        )}
        
        {productStatus === 'approved' && (
          <DropdownMenuItem onClick={() => onStatusChange(productId, 'draft')}>
            <FilePenLine className="mr-2 h-4 w-4 text-blue-500" />
            Move to Draft
          </DropdownMenuItem>
        )}
        
        {productStatus === 'rejected' && (
          <DropdownMenuItem onClick={() => onStatusChange(productId, 'draft')}>
            <FilePenLine className="mr-2 h-4 w-4 text-blue-500" />
            Move to Draft
          </DropdownMenuItem>
        )}
        
        {productStatus === 'draft' && (
          <DropdownMenuItem onClick={() => onStatusChange(productId, 'pending')}>
            <Check className="mr-2 h-4 w-4 text-yellow-500" />
            Submit for Review
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-500"
          onClick={() => onDeleteClick(productId)}
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProductActionsDropdown;
