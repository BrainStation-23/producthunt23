import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  tagline: string;
  image_url: string | null;
  website_url: string | null;
  tags: string[] | null;
  categories: string[] | null;
  upvotes: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(product.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  
  useEffect(() => {
    const fetchCommentCount = async () => {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', product.id);
        
      if (error) {
        console.error('Error fetching comment count:', error);
      } else {
        setCommentCount(count || 0);
      }
    };
    
    fetchCommentCount();
  }, [product.id]);
  
  useEffect(() => {
    const checkUserUpvote = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('upvotes')
        .select('*')
        .eq('product_id', product.id)
        .eq('user_id', user.id)
        .single();
        
      if (data && !error) {
        setHasUpvoted(true);
      }
    };
    
    checkUserUpvote();
  }, [user, product.id]);

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
        .eq('product_id', product.id)
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
        .insert({ product_id: product.id, user_id: user.id });
        
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
    <Card key={product.id} className="overflow-hidden h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="flex-grow flex flex-col">
        <div className="aspect-video relative overflow-hidden bg-muted">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>
        
        <CardHeader className="p-4 pb-0">
          <CardTitle className="line-clamp-1 text-xl">{product.name}</CardTitle>
          <p className="line-clamp-2 text-sm text-muted-foreground">{product.tagline}</p>
        </CardHeader>
        
        <CardContent className="p-4 space-y-2 flex-grow">
          <div className="line-clamp-2 text-sm">{product.description}</div>
          
          {product.categories && product.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.categories.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.categories.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.categories.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <Button 
            variant={hasUpvoted ? "default" : "ghost"} 
            size="sm" 
            className="gap-1"
            onClick={handleUpvote}
          >
            <ArrowUp className="h-4 w-4" />
            {upvotes}
          </Button>
          
          <Link to={`/products/${product.id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              {commentCount}
            </Button>
          </Link>
        </div>
        
        {product.website_url && (
          <Button variant="outline" size="sm" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(product.website_url, '_blank');
          }}>
            Visit
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <Card className="overflow-hidden">
    <Skeleton className="h-48 w-full" />
    <CardHeader className="p-4 pb-0">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
    </CardHeader>
    <CardContent className="p-4">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Skeleton className="h-8 w-24" />
    </CardFooter>
  </Card>
);

export default ProductCard;
