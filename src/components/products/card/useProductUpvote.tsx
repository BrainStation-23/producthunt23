
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface UseProductUpvoteProps {
  productId: string;
  initialUpvotes: number;
}

const useProductUpvote = ({ productId, initialUpvotes }: UseProductUpvoteProps) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(initialUpvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    const checkUserUpvote = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('upvotes')
        .select('*')
        .eq('product_id', productId)
        .eq('user_id', user.id)
        .single();
        
      if (data && !error) {
        setHasUpvoted(true);
      }
    };
    
    checkUserUpvote();
  }, [user, productId]);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to upvote products');
      return;
    }
    
    if (hasUpvoted) {
      const { error } = await supabase
        .from('upvotes')
        .delete()
        .eq('product_id', productId)
        .eq('user_id', user.id);
        
      if (error) {
        console.error('Error removing upvote:', error);
        toast.error('Failed to remove upvote');
        return;
      }
      
      setUpvotes(prev => Math.max(0, prev - 1));
      setHasUpvoted(false);
      toast.success('Upvote removed');
    } else {
      const { error } = await supabase
        .from('upvotes')
        .insert({ product_id: productId, user_id: user.id });
        
      if (error) {
        console.error('Error adding upvote:', error);
        toast.error('Failed to upvote');
        return;
      }
      
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      toast.success('Product upvoted');
    }
  };

  return {
    upvotes,
    hasUpvoted,
    handleUpvote
  };
};

export default useProductUpvote;
