
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductSaveButton from './ProductSaveButton';

interface ProductCardActionsProps {
  productId: string;
  websiteUrl: string | null;
  upvotes: number;
  commentCount: number;
  hasUpvoted: boolean;
  onUpvote: (e: React.MouseEvent) => void;
}

const ProductCardActions: React.FC<ProductCardActionsProps> = ({
  productId,
  websiteUrl,
  upvotes,
  commentCount,
  hasUpvoted,
  onUpvote
}) => {
  const formatUrl = (url: string | null): string => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <div className="p-4 pt-0 flex justify-between items-center mt-auto">
      <div className="flex items-center gap-2">
        <Button 
          variant={hasUpvoted ? "default" : "ghost"} 
          size="sm" 
          className="gap-1"
          onClick={onUpvote}
        >
          <ArrowUp className="h-4 w-4" />
          {upvotes}
        </Button>
        
        <Link to={`/products/${productId}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <MessageSquare className="h-4 w-4" />
            {commentCount}
          </Button>
        </Link>

        <ProductSaveButton productId={productId} iconOnly />
      </div>
      
      {websiteUrl && (
        <Button variant="outline" size="sm" onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          window.open(formatUrl(websiteUrl), '_blank');
        }}>
          Visit
        </Button>
      )}
    </div>
  );
};

export default ProductCardActions;
