
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductScreenshot, ProductVideo } from '@/types/product';
import ProductHeader from '@/components/products/detail/ProductHeader';
import ProductMainContent from '@/components/products/detail/ProductMainContent';
import ProductInfoCard from '@/components/products/detail/ProductInfoCard';
import ProductMediaTabs from '@/components/products/detail/ProductMediaTabs';
import ProductLoadingSkeleton from '@/components/products/detail/ProductLoadingSkeleton';
import ProductNotFound from '@/components/products/detail/ProductNotFound';
import ProductComments from '@/components/products/comments/ProductComments';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [screenshots, setScreenshots] = useState<ProductScreenshot[]>([]);
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const fetchCommentCount = async () => {
      if (!productId) return;
      
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('product_id', productId);
        
      if (error) {
        console.error('Error fetching comment count:', error);
      } else {
        setCommentCount(count || 0);
      }
    };
    
    fetchCommentCount();
  }, [productId]);

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

  useEffect(() => {
    // Set up a subscription to listen for changes to the upvotes count
    if (!productId) return;
    
    const upvotesSubscription = supabase
      .channel('product-upvotes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'upvotes',
          filter: `product_id=eq.${productId}`
        },
        () => {
          // Refetch just the product to get the updated upvotes count
          supabase
            .from('products')
            .select('upvotes')
            .eq('id', productId)
            .single()
            .then(({ data, error }) => {
              if (!error && data && product) {
                setProduct({ ...product, upvotes: data.upvotes });
              }
            });
        }
      )
      .subscribe();
      
    // Set up a subscription to listen for changes to comments
    const commentsSubscription = supabase
      .channel('product-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `product_id=eq.${productId}`
        },
        () => {
          // Update comment count
          supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', productId)
            .then(({ count, error }) => {
              if (!error) {
                setCommentCount(count || 0);
              }
            });
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(upvotesSubscription);
      supabase.removeChannel(commentsSubscription);
    };
  }, [productId, product]);

  if (isLoading) {
    return <ProductLoadingSkeleton />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

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

export default ProductDetailPage;
