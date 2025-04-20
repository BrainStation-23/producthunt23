
import React from 'react';
import { ProductScreenshot } from '@/types/product';
import ProductScreenshotGallery from './ProductScreenshotGallery';

interface ProductScreenshotsProps {
  screenshots: ProductScreenshot[];
}

const ProductScreenshots: React.FC<ProductScreenshotsProps> = ({ screenshots }) => {
  if (screenshots.length === 0) {
    return null;
  }

  return <ProductScreenshotGallery screenshots={screenshots} />;
};

export default ProductScreenshots;
