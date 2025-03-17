
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Comment } from '@/types/comment';
import { toast } from 'sonner';

// Helper function to build a hierarchical comment structure
const buildCommentHierarchy = (flatComments: Comment[]): Comment[] => {
  const commentMap: Record<string, Comment> = {};
  const rootComments: Comment[] = [];
  
  // First pass: Create a map of comments by ID and initialize replies array
  flatComments.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });
  
  // Second pass: Organize comments into a tree structure
  flatComments.forEach(comment => {
    const processedComment = commentMap[comment.id];
    
    if (comment.parent_id === null) {
      // This is a root comment
      rootComments.push(processedComment);
    } else if (commentMap[comment.parent_id]) {
      // This is a reply, add it to its parent's replies
      if (!commentMap[comment.parent_id].replies) {
        commentMap[comment.parent_id].replies = [];
      }
      commentMap[comment.parent_id].replies!.push(processedComment);
    } else {
      // Parent comment might have been deleted, add as root
      rootComments.push(processedComment);
    }
  });
  
  // Sort root comments by created_at (newest first)
  return rootComments.sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
};

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
      setComments(commentsWithHierarchy);
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
