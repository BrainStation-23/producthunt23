
import React from 'react';
import { ProductVideo } from '@/types/product';
import { getEmbedUrl } from '@/utils/videoUtils';

interface ProductVideosProps {
  videos: ProductVideo[];
}

const ProductVideos: React.FC<ProductVideosProps> = ({ videos }) => {
  return (
    <>
      {videos.map((video) => (
        <div key={video.id} className="space-y-2">
          <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
            <iframe
              src={getEmbedUrl(video.video_url)}
              title={video.title || 'Product video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
          {video.title && (
            <h4 className="font-medium">{video.title}</h4>
          )}
        </div>
      ))}
    </>
  );
};

export default ProductVideos;
