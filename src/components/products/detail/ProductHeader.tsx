
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="p-0 h-8 w-8"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{product?.name}</h1>
          <p className="text-lg text-muted-foreground mt-1">{product?.tagline}</p>
        </div>
      </div>
      
      {product?.status === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">
                This product is currently under review and is not publicly visible.
              </p>
            </div>
          </div>
        </div>
      )}

      {product?.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">
                This product submission was rejected. Please review and resubmit.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductHeader;
