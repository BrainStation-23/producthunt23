
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ExternalLink, MessageSquare, ArrowUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [screenshots, setScreenshots] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      try {
        // Fetch product data
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            profiles:created_by (
              username,
              avatar_url
            )
          `)
          .eq('id', productId)
          .single();

        if (productError) throw productError;
        
        // Fetch technologies
        const { data: technologiesData, error: technologiesError } = await supabase
          .from('product_technologies')
          .select('technology_name')
          .eq('product_id', productId)
          .order('display_order', { ascending: true });
          
        if (technologiesError) throw technologiesError;
        
        // Extract technology names and add to product data
        const technologies = technologiesData ? technologiesData.map(tech => tech.technology_name) : null;
        
        // Fetch screenshots
        const { data: screenshotsData, error: screenshotsError } = await supabase
          .from('product_screenshots')
          .select('*')
          .eq('product_id', productId)
          .order('display_order', { ascending: true });
          
        if (screenshotsError) throw screenshotsError;
        
        // Fetch videos
        const { data: videosData, error: videosError } = await supabase
          .from('product_videos')
          .select('*')
          .eq('product_id', productId)
          .order('display_order', { ascending: true });
          
        if (videosError) throw videosError;
        
        // Combine product data with technologies
        const completeProductData = {
          ...productData,
          technologies,
          profile_username: productData.profiles?.username,
          profile_avatar_url: productData.profiles?.avatar_url
        };
        
        setProduct(completeProductData);
        setScreenshots(screenshotsData || []);
        setVideos(videosData || []);
      } catch (error: any) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-80 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container max-w-5xl mx-auto py-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm">
                This product could not be found or has been removed.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Function to get embed URL from YouTube or Vimeo URL
  const getEmbedUrl = (url: string): string => {
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo URL patterns
    const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|)(\d+)(?:$|\/|\?))/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    
    // If not YouTube or Vimeo, return the original URL
    return url;
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 space-y-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {product?.image_url && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          )}

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">About</h2>
            <p>{product?.description}</p>
          </div>

          {(screenshots.length > 0 || videos.length > 0) && (
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
                  <div className="grid gap-4 grid-cols-1">
                    {screenshots.map((screenshot) => (
                      <div key={screenshot.id} className="space-y-2">
                        <div className="relative aspect-video rounded-md overflow-hidden bg-gray-100 border">
                          <img 
                            src={screenshot.image_url} 
                            alt={screenshot.title || 'Product screenshot'} 
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
                
                <TabsContent value="videos" className="mt-4 space-y-4">
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
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <ArrowUp className="h-4 w-4" />
                    {product?.upvotes || 0}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <MessageSquare className="h-4 w-4" />
                    0
                  </Button>
                </div>
              </div>

              {product?.website_url && (
                <Button className="w-full" onClick={() => window.open(product.website_url, '_blank')}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Button>
              )}

              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {product?.tags && product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>

              {product?.technologies && product.technologies.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Built with</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        <i className={`devicon-${tech.toLowerCase()}-plain colored text-sm`}></i>
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium mb-2">Launched</h3>
                <p className="text-sm text-muted-foreground">
                  {product?.created_at ? new Date(product.created_at).toLocaleDateString() : ''}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
