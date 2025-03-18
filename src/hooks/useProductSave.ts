
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseProductSaveProps {
  productId: string;
}

export const useProductSave = ({ productId }: UseProductSaveProps) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the product is saved by the user
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) {
        setIsSaved(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('saved_products')
          .select('id')
          .eq('product_id', productId)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking saved product:', error);
        }

        setIsSaved(!!data);
      } catch (error) {
        console.error('Error in saved products fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkIfSaved();
  }, [productId, user]);

  // Toggle save/unsave
  const toggleSave = async () => {
    if (!user) {
      toast.error('Please sign in to save products');
      return;
    }

    try {
      setIsLoading(true);

      if (isSaved) {
        // Unsave the product
        const { error } = await supabase
          .from('saved_products')
          .delete()
          .eq('product_id', productId)
          .eq('user_id', user.id);

        if (error) throw error;
        
        setIsSaved(false);
        toast.success('Product removed from saved items');
      } else {
        // Save the product
        const { error } = await supabase
          .from('saved_products')
          .insert({ product_id: productId, user_id: user.id });

        if (error) throw error;
        
        setIsSaved(true);
        toast.success('Product saved');
      }
    } catch (error: any) {
      console.error('Error toggling saved product:', error);
      toast.error(error.message || 'Failed to update saved status');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSaved,
    isLoading,
    toggleSave
  };
};
