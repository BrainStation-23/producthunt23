
import React from 'react';
import { Product } from '@/types/product';

interface ProductMainContentProps {
  product: Product;
}

const ProductMainContent: React.FC<ProductMainContentProps> = ({ product }) => {
  return (
    <div className="space-y-6">
      {product?.image_url && (
        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border">
          <img 
            src={product.image_url} 
            alt={product.name} 
            className="object-cover w-full h-full"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
      )}

      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">About</h2>
        <div dangerouslySetInnerHTML={{ __html: product?.description }} />
      </div>
    </div>
  );
};

export default ProductMainContent;
