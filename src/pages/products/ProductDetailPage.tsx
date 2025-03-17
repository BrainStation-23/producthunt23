
import React from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '@/hooks/useProductDetail';
import ProductDetailContent from '@/components/products/detail/ProductDetailContent';
import ProductLoadingSkeleton from '@/components/products/detail/ProductLoadingSkeleton';
import ProductNotFound from '@/components/products/detail/ProductNotFound';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { product, screenshots, videos, isLoading, commentCount } = useProductDetail(productId);

  if (isLoading) {
    return <ProductLoadingSkeleton />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <ProductDetailContent 
      product={product} 
      screenshots={screenshots} 
      videos={videos} 
      commentCount={commentCount} 
    />
  );
};

export default ProductDetailPage;
