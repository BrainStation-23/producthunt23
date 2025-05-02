
import React from 'react';
import { ProductVideo } from '@/types/product';
import ProductVideoGallery from './ProductVideoGallery';

interface ProductVideosProps {
  videos: ProductVideo[];
}

const ProductVideos: React.FC<ProductVideosProps> = ({ videos }) => {
  if (videos.length === 0) {
    return null;
  }

  return <ProductVideoGallery videos={videos} />;
};

export default ProductVideos;
