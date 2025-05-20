
import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ThumbsUp, MessageSquare, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';
import CategoryList from '@/components/products/detail/info/CategoryList';
import TechnologiesList from '@/components/products/detail/info/TechnologiesList';
import LaunchDate from '@/components/products/detail/info/LaunchDate';
import WebsiteButton from '@/components/products/detail/info/WebsiteButton';
import UpvoteActions from '@/components/products/detail/info/UpvoteActions';

interface ProductInfoCardProps {
  product: Product;
  commentCount: number;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ product, commentCount }) => {
  return (
    <Card className="border shadow-sm">
      <CardContent className="p-5 space-y-5">
        {/* Website Link */}
        <WebsiteButton website_url={product.website_url} />
        
        {/* Stats */}
        <div className="flex items-center justify-between">
          {/* Upvotes */}
          <div className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{product.upvotes || 0} upvotes</span>
          </div>
          
          {/* Comments count */}
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{commentCount} comments</span>
          </div>
        </div>
        
        {/* Upvote Button */}
        <UpvoteActions product={product} />
        
        {/* Certificate Link */}
        <Button variant="outline" className="w-full" asChild>
          <Link to={`/products/${product.id}/certificate`} className="flex items-center justify-center gap-2">
            <Award className="h-4 w-4" />
            View Certificate
          </Link>
        </Button>
        
        {/* Categories */}
        {product.categoryNames && product.categoryNames.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Categories</h4>
            <CategoryList categories={product.categoryNames} />
          </div>
        )}
        
        {/* Technologies */}
        {product.technologies && product.technologies.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Built with</h4>
            <TechnologiesList technologies={product.technologies} />
          </div>
        )}
        
        {/* Launch Date */}
        <LaunchDate created_at={product.created_at} />
      </CardContent>
    </Card>
  );
};

export default ProductInfoCard;
