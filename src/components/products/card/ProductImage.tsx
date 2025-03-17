
import React from 'react';

interface ProductImageProps {
  imageUrl: string | null;
  productName: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ imageUrl, productName }) => {
  return (
    <div className="aspect-video relative overflow-hidden bg-muted">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={productName} 
          className="h-full w-full object-cover transition-transform hover:scale-105"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-muted">
          <span className="text-muted-foreground">No image</span>
        </div>
      )}
    </div>
  );
};

export default ProductImage;
