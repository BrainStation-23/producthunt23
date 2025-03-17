
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminProducts } from '@/hooks/useAdminProducts';
import ProductsHeader from '@/components/admin/ProductsHeader';
import ProductsFilters from '@/components/admin/ProductsFilters';
import ProductsTable from '@/components/admin/ProductsTable';
import ProductsPagination from '@/components/admin/ProductsPagination';
import DeleteProductDialog from '@/components/admin/DeleteProductDialog';

const AdminProducts: React.FC = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    statusFilters,
    toggleStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    products,
    isLoading,
    handleStatusChange,
    handleDeleteProduct,
    handleSearch,
    handleDeleteClick,
  } = useAdminProducts();

  // Handle product edit
  const handleEditProduct = (productId: string) => {
    navigate(`/admin/products/edit/${productId}`);
  };

  return (
    <div className="space-y-6">
      <ProductsHeader />
      
      <ProductsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilters={statusFilters}
        toggleStatusFilter={toggleStatusFilter}
        handleSearch={handleSearch}
      />
      
      <ProductsTable 
        products={products}
        isLoading={isLoading}
        searchQuery={searchQuery}
        handleStatusChange={handleStatusChange}
        handleEditProduct={handleEditProduct}
        handleDeleteClick={handleDeleteClick}
      />
      
      <ProductsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      
      <DeleteProductDialog 
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default AdminProducts;
