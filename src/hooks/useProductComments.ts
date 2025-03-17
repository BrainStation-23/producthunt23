
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/comment';
import { toast } from 'sonner';

export const useProductComments = (productId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchComments = async () => {
    if (!productId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Process comments to create a hierarchical structure
      const commentsWithHierarchy = buildCommentHierarchy(data || []);
      setComments(data || []);
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    
    // Set up a subscription to listen for new, updated, or deleted comments
    const commentsSubscription = supabase
      .channel('comments-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'comments',
          filter: `product_id=eq.${productId}`
        },
        (payload) => {
          fetchComments(); // Refresh comments when any change occurs
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(commentsSubscription);
    };
  }, [productId]);

  return {
    comments,
    isLoading,
    refreshComments: fetchComments
  };
};
