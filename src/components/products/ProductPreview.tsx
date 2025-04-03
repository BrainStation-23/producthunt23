
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductFormValues, Screenshot, Video } from '@/types/product';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink } from 'lucide-react';

interface ProductPreviewProps {
  formData: ProductFormValues;
}

const ProductPreview: React.FC<ProductPreviewProps> = ({ formData }) => {
  const hasScreenshots = formData.screenshots && formData.screenshots.length > 0;
  const hasVideos = formData.videos && formData.videos.length > 0;
  
  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold">{formData.name || 'Product Name'}</CardTitle>
        <CardDescription className="text-lg mt-1">
          {formData.tagline || 'Your product tagline will appear here'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {formData.image_url && (
          <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
            <img 
              src={formData.image_url} 
              alt={formData.name || 'Product image'} 
              className="object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>
        )}
        
        <div className="prose max-w-none dark:prose-invert">
          {formData.description ? (
            <div dangerouslySetInnerHTML={{ __html: formData.description }} />
          ) : (
            <p>Your product description will appear here...</p>
          )}
        </div>
        
        {formData.website_url && (
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a 
              href={formData.website_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              {formData.website_url}
            </a>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          {formData.categories && formData.categories.map((category, index) => (
            <Badge key={index} variant="secondary">{category}</Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {formData.technologies && formData.technologies.map((tech, index) => (
            <Badge key={index} variant="outline">{tech}</Badge>
          ))}
        </div>
        
        {(hasScreenshots || hasVideos) && (
          <Tabs defaultValue={hasScreenshots ? "screenshots" : "videos"} className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="screenshots" disabled={!hasScreenshots}>
                Screenshots ({formData.screenshots?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="videos" disabled={!hasVideos}>
                Videos ({formData.videos?.length || 0})
              </TabsTrigger>
            </TabsList>
            
            {hasScreenshots && (
              <TabsContent value="screenshots" className="mt-4">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  {formData.screenshots.map((screenshot: Screenshot, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
                        <img 
                          src={screenshot.image_url} 
                          alt={screenshot.title || `Screenshot ${index + 1}`} 
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      {screenshot.title && (
                        <h4 className="font-medium">{screenshot.title}</h4>
                      )}
                      {screenshot.description && (
                        <p className="text-sm text-muted-foreground">{screenshot.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
            
            {hasVideos && (
              <TabsContent value="videos" className="mt-4 space-y-4">
                {formData.videos.map((video: Video, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
                      <iframe
                        src={getEmbedUrl(video.video_url)}
                        title={video.title || `Video ${index + 1}`}
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
              </TabsContent>
            )}
          </Tabs>
        )}
        
        {formData.makers && formData.makers.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Makers</h3>
            <div className="flex flex-wrap gap-2">
              {formData.makers.map((maker, index) => (
                <Badge key={index} variant="outline">
                  {maker.username || 'Unknown User'}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const getEmbedUrl = (url: string): string => {
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);
  
  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }
  
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?))/;
  const vimeoMatch = url.match(vimeoRegex);
  
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }
  
  return url;
};

export default ProductPreview;
