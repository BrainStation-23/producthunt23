
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductScreenshot, ProductVideo, ProductMaker } from '@/types/product';

export const useProductDetail = (productId: string | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [screenshots, setScreenshots] = useState<ProductScreenshot[]>([]);
  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [makers, setMakers] = useState<ProductMaker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  // Fetch comment count
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

  // Fetch product details, screenshots, and videos
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
        
        // Fetch makers
        const { data: makersData, error: makersError } = await supabase
          .from('product_makers')
          .select(`
            id,
            product_id,
            profile_id,
            created_at,
            profile:profiles (
              username,
              avatar_url,
              email
            )
          `)
          .eq('product_id', productId);
          
        if (makersError) throw makersError;
        
        // Fetch category names
        const categoryNames = [];
        if (productData.categories && productData.categories.length > 0) {
          const { data: categoriesData, error: categoriesError } = await supabase
            .from('categories')
            .select('name')
            .in('name', productData.categories);
            
          if (!categoriesError && categoriesData) {
            categoryNames.push(...categoriesData.map(c => c.name));
          }
        }
        
        // Combine product data with technologies
        const completeProductData = {
          ...productData,
          technologies,
          categoryNames,
          profile_username: productData.profiles?.username,
          profile_avatar_url: productData.profiles?.avatar_url
        };
        
        setProduct(completeProductData);
        setScreenshots(screenshotsData || []);
        setVideos(videosData || []);
        setMakers(makersData || []);
      } catch (error: any) {
        console.error('Error fetching product details:', error);
        toast.error('Failed to load product details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!productId) return;
    
    // Subscription for upvotes
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
      
    // Subscription for comments
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

  return {
    product,
    screenshots,
    videos,
    makers,
    isLoading,
    commentCount
  };
};
