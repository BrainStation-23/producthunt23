
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ProductSaveButton from '@/components/products/card/ProductSaveButton';

interface UpvoteActionsProps {
  productId: string;
  initialUpvotes: number;
  commentCount: number;
}

const UpvoteActions: React.FC<UpvoteActionsProps> = ({ 
  productId, 
  initialUpvotes, 
  commentCount 
}) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
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

  const handleUpvote = async () => {
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
  
  return (
    <div className="flex space-x-2">
      <Button 
        variant={hasUpvoted ? "default" : "outline"} 
        size="sm" 
        className="gap-1" 
        onClick={handleUpvote}
      >
        <ArrowUp className="h-4 w-4" />
        {upvotes}
      </Button>
      <Button variant="outline" size="sm" className="gap-1">
        <MessageSquare className="h-4 w-4" />
        {commentCount}
      </Button>
      <ProductSaveButton productId={productId} variant="outline" />
    </div>
  );
};

export default UpvoteActions;
