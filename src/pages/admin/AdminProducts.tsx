
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import ProductsHeader from '@/components/admin/ProductsHeader';
import ProductsFilters from '@/components/admin/ProductsFilters';
import ProductsTable from '@/components/admin/ProductsTable';
import DeleteProductDialog from '@/components/admin/DeleteProductDialog';

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const pageSize = 10;

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          profiles:created_by (username, avatar_url)
        `, { count: 'exact' });

      // Apply search filter
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%`);
      }

      // Apply status filter
      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      // Pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      // Execute query with pagination
      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      // Calculate total pages
      if (count !== null) {
        setTotalPages(Math.ceil(count / pageSize));
      }

      // Add empty technologies array if it doesn't exist
      const productsWithTechnologies = data?.map(product => ({
        ...product,
        technologies: null,
        profile_username: product.profiles?.username,
        profile_avatar_url: product.profiles?.avatar_url
      })) || [];

      return productsWithTechnologies;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['adminProducts', searchQuery, statusFilter, currentPage],
    queryFn: fetchProducts
  });

  // Handle status change
  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', productId);

      if (error) throw error;
      
      toast.success(`Product ${newStatus} successfully`);
      refetch();
    } catch (error) {
      console.error('Error updating product status:', error);
      toast.error('Failed to update product status');
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete);

      if (error) throw error;
      
      toast.success('Product deleted successfully');
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle product edit
  const handleEditProduct = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  // Handle delete click
  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <ProductsHeader />
      
      <ProductsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        handleSearch={handleSearch}
      />
      
      <ProductsTable 
        products={products as Product[]}
        isLoading={isLoading}
        searchQuery={searchQuery}
        handleStatusChange={handleStatusChange}
        handleEditProduct={handleEditProduct}
        handleDeleteClick={handleDeleteClick}
      />
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      <DeleteProductDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default AdminProducts;
