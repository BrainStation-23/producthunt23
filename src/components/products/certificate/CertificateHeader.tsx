
import React from 'react';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/product';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface CertificateHeaderProps {
  product: Product | null;
  formattedDate: string;
}

const CertificateHeader = ({ product, formattedDate }: CertificateHeaderProps) => {
  if (!product) return null;
  
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-2">Certificate of Completion</h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground">Learnathon 3.0 by Geeky Solutions</h2>
      </div>

      {/* Project Title */}
      <div className="mb-8">
        <h3 className="text-lg md:text-xl font-semibold mb-2">This certifies that</h3>
        <p className="text-lg">
          successfully completed the project <span className="font-bold">{product.name}</span>
        </p>
        <p className="text-muted-foreground mt-2">Issued on {formattedDate}</p>
      </div>

      {/* Project Image */}
      {product.image_url && (
        <div className="mb-8 max-w-xs mx-auto">
          <AspectRatio ratio={16/9} className="bg-muted rounded-md overflow-hidden">
            <img 
              src={product.image_url} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </AspectRatio>
        </div>
      )}
    </>
  );
};

export default CertificateHeader;
