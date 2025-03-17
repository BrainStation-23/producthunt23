
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CommentFormProps {
  productId: string;
  onCommentAdded: () => void;
  parentId: string | null;
}

const CommentForm: React.FC<CommentFormProps> = ({ productId, onCommentAdded, parentId }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to comment');
      return;
    }
    
    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: content.trim(),
          product_id: productId,
          user_id: user.id,
          parent_id: parentId,
        });
        
      if (error) throw error;
      
      toast.success(parentId ? 'Reply added successfully' : 'Comment added successfully');
      setContent('');
      onCommentAdded();
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // For reply forms, we use a simpler UI
  if (parentId) {
    return (
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Textarea
            placeholder="Write a reply..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={2}
            disabled={!user || isSubmitting}
            className="resize-none"
          />
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!user || isSubmitting || !content.trim()} 
              variant="default"
              size="sm"
            >
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </div>
        </div>
      </form>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Add a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Share your thoughts about this product..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
            disabled={!user || isSubmitting}
            className="resize-none"
          />
          {!user && (
            <p className="mt-2 text-sm text-muted-foreground">
              You need to be logged in to comment.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            type="submit" 
            disabled={!user || isSubmitting || !content.trim()} 
            variant="default"
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CommentForm;
