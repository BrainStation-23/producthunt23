
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssignedProduct } from '@/components/admin/settings/judging/types';
import { ExternalLink } from 'lucide-react';

interface ProductOverviewProps {
  product: AssignedProduct;
}

const ProductOverview: React.FC<ProductOverviewProps> = ({ product }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <div className="aspect-video bg-muted rounded-md overflow-hidden mb-4">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-muted">
                    <p className="text-muted-foreground">No image available</p>
                  </div>
                )}
              </div>
              
              {product.website_url && (
                <a 
                  href={product.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Visit Website
                </a>
              )}
            </div>
            
            <div className="w-full md:w-2/3">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-muted-foreground mb-4">{product.tagline}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm">{product.description || "No description provided."}</p>
                </div>
                
                {product.categories && product.categories.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.categories.map((category: string) => (
                        <Badge key={category} variant="outline">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* You can add more sections like screenshots, technologies used, etc. */}
    </div>
  );
};

export default ProductOverview;
