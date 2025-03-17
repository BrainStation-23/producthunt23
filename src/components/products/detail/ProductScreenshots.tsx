
import React from 'react';
import { ProductScreenshot } from '@/types/product';

interface ProductScreenshotsProps {
  screenshots: ProductScreenshot[];
}

const ProductScreenshots: React.FC<ProductScreenshotsProps> = ({ screenshots }) => {
  return (
    <div className="grid gap-4 grid-cols-1">
      {screenshots.map((screenshot) => (
        <div key={screenshot.id} className="space-y-2">
          <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
            <img 
              src={screenshot.image_url} 
              alt={screenshot.title || 'Product screenshot'} 
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
          {screenshot.title && (
            <h4 className="font-medium">{screenshot.title}</h4>
          )}
          {screenshot.description && (
            <p className="text-sm text-muted-foreground">{screenshot.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductScreenshots;
