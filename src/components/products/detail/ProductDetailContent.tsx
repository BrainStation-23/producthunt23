
import React from 'react';
import { Product, ProductScreenshot, ProductVideo, ProductMaker } from '@/types/product';
import ProductHeader from '@/components/products/detail/ProductHeader';
import ProductMainContent from '@/components/products/detail/ProductMainContent';
import ProductInfoCard from '@/components/products/detail/ProductInfoCard';
import ProductMediaTabs from '@/components/products/detail/ProductMediaTabs';
import ProductComments from '@/components/products/comments/ProductComments';
import ProductMakers from '@/components/products/detail/ProductMakers';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductDetailContentProps {
  product: Product;
  screenshots: ProductScreenshot[];
  videos: ProductVideo[];
  makers: ProductMaker[];
  commentCount: number;
}

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({ 
  product, 
  screenshots, 
  videos, 
  makers,
  commentCount 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="container max-w-5xl mx-auto py-4 sm:py-8 px-4 sm:px-6 space-y-6 sm:space-y-8">
      <ProductHeader product={product} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {isMobile && (
          <div className="lg:col-span-1">
            <ProductInfoCard product={product} commentCount={commentCount} />
          </div>
        )}
        
        <div className="lg:col-span-2 space-y-6">
          <ProductMainContent product={product} />
          <ProductMediaTabs screenshots={screenshots} videos={videos} />
          
          {isMobile && makers && makers.length > 0 && (
            <div className="mt-6">
              <ProductMakers makers={makers} creatorId={product.created_by} />
            </div>
          )}
          
          <div className="mt-6 sm:mt-8">
            <ProductComments productId={product.id} />
          </div>
        </div>

        {!isMobile && (
          <div className="space-y-6">
            <ProductInfoCard product={product} commentCount={commentCount} />
            {makers && makers.length > 0 && (
              <ProductMakers makers={makers} creatorId={product.created_by} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailContent;
