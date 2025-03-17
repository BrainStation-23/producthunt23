
import React from 'react';
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
import { Edit, Trash, Check, X, ExternalLink, FilePenLine } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductTableRowProps {
  product: Product;
  handleStatusChange: (productId: string, newStatus: string) => Promise<void>;
  handleEditProduct: (productId: string) => void;
  handleDeleteClick: (productId: string) => void;
}

const ProductTableRow: React.FC<ProductTableRowProps> = ({ 
  product, 
  handleStatusChange,
  handleEditProduct,
  handleDeleteClick
}) => {
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

  return (
    <TableRow key={product.id}>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Badge variant={getStatusBadgeVariant(product.status || 'pending')}>
          {product.status ? (product.status.charAt(0).toUpperCase() + product.status.slice(1)) : 'Pending'}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {product.categories && product.categories.length > 0
          ? product.categories[0]
          : '-'}
      </TableCell>
      <TableCell className="hidden md:table-cell">{product.upvotes || 0}</TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(product.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              Actions
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
                <DropdownMenuItem onClick={() => handleStatusChange(product.id, 'rejected')}>
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
  );
};

export default ProductTableRow;
