
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Product } from '@/types/product';

export function useAdminProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<string[]>(['pending']);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const pageSize = 10;

  // Fetch categories to map IDs to names
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .eq('status', 'active');
        
      if (!error && data) {
        const catMap: Record<string, string> = {};
        data.forEach((cat: { id: string, name: string }) => {
          catMap[cat.id] = cat.name;
        });
        setCategoryMap(catMap);
      }
    };
    
    fetchCategories();
  }, []);

  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
    setCurrentPage(1); // Reset page when changing filters
  };

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

      // Apply status filters if any are selected
      if (statusFilters.length > 0) {
        query = query.in('status', statusFilters);
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
        profile_avatar_url: product.profiles?.avatar_url,
        categoryNames: product.categories?.map((catId: string) => categoryMap[catId] || catId) || []
      })) || [];

      return productsWithTechnologies;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['adminProducts', searchQuery, statusFilters, currentPage, categoryMap],
    queryFn: fetchProducts
  });

  // Handle status change
  const handleStatusChange = async (productId: string, newStatus: string, feedback?: string) => {
    try {
      const updateData = { 
        status: newStatus,
        ...(newStatus === 'rejected' && feedback ? { rejection_feedback: feedback } : {})
      };

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', productId);

      if (error) throw error;
      
      const statusMessage = newStatus === 'rejected' 
        ? `Product rejected with feedback` 
        : `Product ${newStatus} successfully`;
      
      toast.success(statusMessage);
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

  // Handle delete click
  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteDialogOpen(true);
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilters,
    toggleStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    productToDelete,
    products: products as Product[],
    isLoading,
    handleStatusChange,
    handleDeleteProduct,
    handleSearch,
    handleDeleteClick,
  };
}
