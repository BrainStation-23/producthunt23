
import React from 'react';
import { Product, ProductScreenshot, ProductVideo } from '@/types/product';
import ProductHeader from '@/components/products/detail/ProductHeader';
import ProductMainContent from '@/components/products/detail/ProductMainContent';
import ProductInfoCard from '@/components/products/detail/ProductInfoCard';
import ProductMediaTabs from '@/components/products/detail/ProductMediaTabs';
import ProductComments from '@/components/products/comments/ProductComments';

interface ProductDetailContentProps {
  product: Product;
  screenshots: ProductScreenshot[];
  videos: ProductVideo[];
  commentCount: number;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ 
  product, 
  screenshots, 
  videos, 
  commentCount 
}) => {
  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-8">
      <ProductHeader product={product} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ProductMainContent product={product} />
          <ProductMediaTabs screenshots={screenshots} videos={videos} />
          
          <div className="mt-8">
            <ProductComments productId={product.id} />
          </div>
        </div>

        <div className="space-y-6">
          <ProductInfoCard product={product} commentCount={commentCount} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailContent;
