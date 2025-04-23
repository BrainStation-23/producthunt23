
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  tagline: string;
  image_url: string | null;
}

export function useProductAssignment(judgeId: string, onAssignmentAdded: () => void) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setCurrentUserId(data.session.user.id);
      }
    };
    getCurrentUser();
  }, []);

  // Fetch available products not already assigned to this judge
  const fetchAvailableProducts = async () => {
    try {
      // First, get already assigned product IDs for this judge
      const { data: assignedData, error: assignedError } = await supabase
        .from('judge_assignments')
        .select('product_id')
        .eq('judge_id', judgeId);

      if (assignedError) throw assignedError;

      const assignedProductIds = assignedData.length > 0 
        ? assignedData.map(a => a.product_id) 
        : ['00000000-0000-0000-0000-000000000000']; // Use a dummy UUID if no assignments

      // Then fetch products not already assigned
      let query = supabase
        .from('products')
        .select('id, name, tagline, image_url')
        .eq('status', 'approved');
      
      if (assignedProductIds.length > 0) {
        query = query.not('id', 'in', `(${assignedProductIds.join(',')})`);
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const { data: productsData, error: productsError } = await query;

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

  // Select all visible products
  const selectAllProducts = () => {
    if (selectedProducts.length === availableProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(availableProducts.map(product => product.id));
    }
  };

  // Assign selected products to judge
  const handleAssignProducts = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product');
      return false;
    }

    if (!currentUserId) {
      toast.error('Could not determine current user. Please try again.');
      return false;
    }

    try {
      setIsLoading(true);
      
      // Bulk insert assignments
      const assignmentData = selectedProducts.map(productId => ({
        judge_id: judgeId,
        product_id: productId,
        assigned_by: currentUserId
      }));

      const { error } = await supabase
        .from('judge_assignments')
        .insert(assignmentData);

      if (error) throw error;

      toast.success(`Assigned ${selectedProducts.length} product(s) to judge`);
      
      // Reset state and trigger parent component update
      setSelectedProducts([]);
      onAssignmentAdded();
      return true;
    } catch (error) {
      toast.error('Failed to assign products');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to fetch products when search query changes
  useEffect(() => {
    fetchAvailableProducts();
  }, [searchQuery, judgeId]);

  return {
    searchQuery,
    setSearchQuery,
    selectedProducts,
    availableProducts,
    isLoading,
    toggleProductSelection,
    selectAllProducts,
    handleAssignProducts
  };
}
