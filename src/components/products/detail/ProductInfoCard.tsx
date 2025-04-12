
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { ExternalLink, ArrowUp, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getDeviconClass } from '@/services/deviconService'; // Updated import path
import ProductSaveButton from '@/components/products/card/ProductSaveButton';

interface ProductInfoCardProps {
  product: Product;
  commentCount: number;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ product, commentCount }) => {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(product?.upvotes || 0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({});
  
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

  useEffect(() => {
    const fetchCategoryNames = async () => {
      if (!product.categories || product.categories.length === 0) return;
      
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .in('id', product.categories);
        
      if (error) {
        console.error('Error fetching category names:', error);
        return;
      }
      
      if (data) {
        const nameMap: Record<string, string> = {};
        data.forEach(category => {
          nameMap[category.id] = category.name;
        });
        setCategoryNames(nameMap);
      }
    };
    
    fetchCategoryNames();
  }, [product.categories]);

  const handleUpvote = async () => {
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
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
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
            <ProductSaveButton productId={product.id} variant="outline" />
          </div>
        </div>

        {product?.website_url && (
          <Button className="w-full" onClick={() => window.open(product.website_url, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Website
          </Button>
        )}

        <div>
          <h3 className="font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {product?.categories && product.categories.map((categoryId, index) => (
              <Badge key={index} variant="secondary">
                {categoryNames[categoryId] || categoryId}
              </Badge>
            ))}
          </div>
        </div>

        {product?.technologies && product.technologies.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Built with</h3>
            <div className="flex flex-wrap gap-2">
              {product.technologies.map((tech, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <i className={`${getDevIconClass(tech)} text-sm`}></i>
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-medium mb-2">Launched</h3>
          <p className="text-sm text-muted-foreground">
            {product?.created_at ? new Date(product.created_at).toLocaleDateString() : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductInfoCard;
