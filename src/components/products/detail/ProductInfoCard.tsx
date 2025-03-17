
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { ExternalLink, ArrowUp, MessageSquare } from 'lucide-react';

interface ProductInfoCardProps {
  product: Product;
}

const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ product }) => {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="gap-1">
              <ArrowUp className="h-4 w-4" />
              {product?.upvotes || 0}
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <MessageSquare className="h-4 w-4" />
              0
            </Button>
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
            {product?.tags && product.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>

        {product?.technologies && product.technologies.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Built with</h3>
            <div className="flex flex-wrap gap-2">
              {product.technologies.map((tech, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  <i className={`devicon-${tech.toLowerCase()}-plain colored text-sm`}></i>
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
