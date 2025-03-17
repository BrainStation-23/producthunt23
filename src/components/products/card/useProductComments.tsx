
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const useProductComments = (productId: string) => {
  const [commentCount, setCommentCount] = useState(0);
  
  useEffect(() => {
    const fetchCommentCount = async () => {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId);
        
      if (error) {
        console.error('Error fetching comment count:', error);
      } else {
        setCommentCount(count || 0);
      }
    };
    
    fetchCommentCount();
  }, [productId]);

  return { commentCount };
};

export default useProductComments;
