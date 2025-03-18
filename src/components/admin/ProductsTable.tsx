
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import ProductTableRow from './ProductTableRow';
import { Product } from '@/types/product';

interface ProductsTableProps {
  products: Product[] | undefined;
  isLoading: boolean;
  searchQuery: string;
  handleStatusChange: (productId: string, newStatus: string, feedback?: string) => Promise<void>;
  handleEditProduct: (productId: string) => void;
  handleDeleteClick: (productId: string) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ 
  products, 
  isLoading, 
  searchQuery,
  handleStatusChange,
  handleEditProduct,
  handleDeleteClick
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Votes</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="sr-only">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-5 w-full max-w-[200px]" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-10" /></TableCell>
                <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-9 w-9" /></TableCell>
              </TableRow>
            ))
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <ProductTableRow 
                key={product.id} 
                product={product}
                handleStatusChange={handleStatusChange}
                handleEditProduct={handleEditProduct}
                handleDeleteClick={handleDeleteClick}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <Search className="h-10 w-10 mb-2 opacity-20" />
                  <p>No products found</p>
                  {searchQuery && (
                    <p className="text-sm">Try adjusting your search query</p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
