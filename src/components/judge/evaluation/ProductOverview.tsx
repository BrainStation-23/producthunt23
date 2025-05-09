
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { AssignedProduct } from '@/components/admin/settings/judging/types';

interface ProductOverviewProps {
  product: AssignedProduct;
  screenshots: any[];
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
              <p className="text-muted-foreground">{product.tagline}</p>
            </div>
            
            <Button 
              className="w-full" 
              onClick={() => window.open(`/products/${product.id}`, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Product Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductOverview;
