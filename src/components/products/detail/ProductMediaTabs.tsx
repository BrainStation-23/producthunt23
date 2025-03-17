
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductScreenshots from './ProductScreenshots';
import ProductVideos from './ProductVideos';
import { ProductScreenshot, ProductVideo } from '@/types/product';

interface ProductMediaTabsProps {
  screenshots: ProductScreenshot[];
  videos: ProductVideo[];
}

const ProductMediaTabs: React.FC<ProductMediaTabsProps> = ({ screenshots, videos }) => {
  if (screenshots.length === 0 && videos.length === 0) {
    return null;
  }

  return (
    <div className="pt-4">
      <Tabs defaultValue={screenshots.length > 0 ? "screenshots" : "videos"}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="screenshots" disabled={screenshots.length === 0}>
            Screenshots ({screenshots.length})
          </TabsTrigger>
          <TabsTrigger value="videos" disabled={videos.length === 0}>
            Videos ({videos.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="screenshots" className="mt-4">
          <ProductScreenshots screenshots={screenshots} />
        </TabsContent>
        
        <TabsContent value="videos" className="mt-4 space-y-4">
          <ProductVideos videos={videos} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductMediaTabs;
