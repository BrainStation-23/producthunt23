
import React, { useState } from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Product } from '@/types/product';
import ProductStatusBadge from './ProductStatusBadge';
import ProductActionsDropdown from './ProductActionsDropdown';
import ProductRejectionDialog from './ProductRejectionDialog';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
    setIsLoading(true);
    try {
      await handleStatusChange(product.id, 'rejected', rejectionFeedback);
      setIsRejectDialogOpen(false);
      setRejectionFeedback('');
    } finally {
      setIsLoading(false);
    }
  };

  // This function ensures dropdown is closed before opening dialog
  const openRejectDialog = () => {
    setIsDropdownOpen(false);
    // Small timeout to ensure dropdown is fully closed before opening dialog
    setTimeout(() => {
      setIsRejectDialogOpen(true);
    }, 100);
  };

  // Reset feedback when dialog is closed
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setRejectionFeedback('');
    }
    setIsRejectDialogOpen(open);
  };

  return (
    <>
      <TableRow key={product.id}>
        <TableCell className="font-medium">{product.name}</TableCell>
        <TableCell>
          <ProductStatusBadge status={product.status || 'pending'} />
        </TableCell>
        <TableCell className="hidden md:table-cell">
          {displayCategory()}
        </TableCell>
        <TableCell className="hidden md:table-cell">{product.upvotes || 0}</TableCell>
        <TableCell className="hidden md:table-cell">
          {new Date(product.created_at).toLocaleDateString()}
        </TableCell>
        <TableCell>
          <ProductActionsDropdown 
            productId={product.id}
            productStatus={product.status || 'pending'}
            isOpen={isDropdownOpen}
            setIsOpen={setIsDropdownOpen}
            onEditClick={handleEditProduct}
            onDeleteClick={handleDeleteClick}
            onStatusChange={handleStatusChange}
            openRejectDialog={openRejectDialog}
          />
        </TableCell>
      </TableRow>

      <ProductRejectionDialog 
        isOpen={isRejectDialogOpen}
        onOpenChange={handleDialogClose}
        feedback={rejectionFeedback}
        setFeedback={setRejectionFeedback}
        onReject={handleReject}
        isLoading={isLoading}
      />
    </>
  );
};

export default ProductTableRow;
