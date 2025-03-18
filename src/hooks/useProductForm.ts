import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductFormValues, ProductScreenshot, ProductVideo, ProductTechnology } from '@/types/product';

// Form validation schema
export const productSchema = z.object({
  id: z.string().optional(), // Optional ID for editing
  name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }).max(50),
  tagline: z.string().min(5, { message: 'Tagline must be at least 5 characters.' }).max(150),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  website_url: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
  image_url: z.string().url({ message: 'Please enter a valid image URL.' }).or(z.literal('')),
  technologies: z.array(z.string()).min(1, { message: 'Please select at least one technology.' }),
  categories: z.array(z.string()).min(1, { message: 'Please select at least one category.' }),
  screenshots: z.array(z.object({
    title: z.string().optional(),
    image_url: z.string().url({ message: 'Please enter a valid URL.' }),
    description: z.string().optional(),
  })),
  videos: z.array(z.object({
    title: z.string().optional(),
    video_url: z.string().url({ message: 'Please enter a valid URL.' }),
  })),
  makers: z.array(z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    id: z.string().nullable(),
    isCreator: z.boolean(),
    username: z.string().nullable(),
    avatar_url: z.string().nullable()
  })),
  agreed_to_policies: z.boolean().refine(val => val === true, {
    message: 'You must agree to the policies before submitting.',
  }),
});

interface UseProductFormProps {
  userId: string | undefined;
  productId?: string; // Optional product ID for editing
}

export const useProductForm = ({ userId, productId }: UseProductFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!productId);
  
  // Initialize form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      website_url: '',
      image_url: '',
      technologies: [],
      categories: [],
      screenshots: [],
      videos: [],
      makers: userId ? [{ email: '', id: userId, isCreator: true }] : [],
      agreed_to_policies: false,
    },
  });

  // Fetch existing product data for editing
  useEffect(() => {
    if (productId) {
      const fetchProductData = async () => {
        try {
          setIsLoading(true);
          
          // Fetch product details
          const { data: product, error: productError } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
          
          if (productError) throw productError;
          if (!product) throw new Error('Product not found');
          
          // Fetch product screenshots
          const { data: screenshots, error: screenshotsError } = await supabase
            .from('product_screenshots')
            .select('*')
            .eq('product_id', productId)
            .order('display_order', { ascending: true });
          
          if (screenshotsError) throw screenshotsError;
          
          // Fetch product videos
          const { data: videos, error: videosError } = await supabase
            .from('product_videos')
            .select('*')
            .eq('product_id', productId)
            .order('display_order', { ascending: true });
          
          if (videosError) throw videosError;
          
          // Fetch product technologies
          const { data: technologies, error: technologiesError } = await supabase
            .from('product_technologies')
            .select('*')
            .eq('product_id', productId)
            .order('display_order', { ascending: true });
          
          if (technologiesError) throw technologiesError;
          
          // Fetch product makers with their profile data
          const { data: makers, error: makersError } = await supabase
            .from('product_makers')
            .select(`
              id, 
              product_id, 
              profile_id, 
              profiles:profile_id (
                id, 
                username, 
                email, 
                avatar_url
              )
            `)
            .eq('product_id', productId);
          
          if (makersError) throw makersError;
          
          // Transform the data for the form
          const formattedScreenshots = screenshots.map((screenshot: ProductScreenshot) => ({
            title: screenshot.title || undefined,
            image_url: screenshot.image_url,
            description: screenshot.description || undefined,
          }));
          
          const formattedVideos = videos.map((video: ProductVideo) => ({
            title: video.title || undefined,
            video_url: video.video_url,
          }));
          
          const formattedTechnologies = technologies.map((tech: ProductTechnology) => tech.technology_name);
          
          // Format makers with profile data
          const formattedMakers = makers.map((maker: any) => ({
            email: maker.profiles?.email || maker.profiles?.username || 'Unknown',
            id: maker.profile_id,
            isCreator: maker.profile_id === product.created_by,
            username: maker.profiles?.username,
            avatar_url: maker.profiles?.avatar_url
          }));
          
          // Set form values
          form.reset({
            id: productId,
            name: product.name,
            tagline: product.tagline,
            description: product.description,
            website_url: product.website_url || '',
            image_url: product.image_url || '',
            technologies: formattedTechnologies,
            categories: product.categories || [],
            screenshots: formattedScreenshots,
            videos: formattedVideos,
            makers: formattedMakers,
            agreed_to_policies: true, // Already agreed when first submitted
          });
          
        } catch (error: any) {
          console.error('Error fetching product data:', error);
          toast.error(error.message || 'Failed to load product data');
          navigate('/admin/products');
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchProductData();
    }
  }, [productId, form, navigate]);
  
  // Once user data is available, update the creator's profile info
  const updateCreatorEmail = async (userId: string) => {
    const { data: userData, error } = await supabase
      .from('profiles')
      .select('id, username, email, avatar_url')
      .eq('id', userId)
      .single();
    
    if (!error && userData) {
      const currentMakers = form.getValues('makers');
      const updatedMakers = currentMakers.map(maker => 
        maker.isCreator 
          ? { 
              ...maker, 
              email: userData.email || userData.username || 'Creator',
              username: userData.username,
              avatar_url: userData.avatar_url
            }
          : maker
      );
      form.setValue('makers', updatedMakers);
    }
  };

  if (userId && !productId) {
    updateCreatorEmail(userId);
  }

  const handleSubmit = async (values: ProductFormValues, saveAsDraft = false) => {
    if (!userId) {
      toast.error('You must be logged in to submit a product');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEditing = !!values.id;
      
      // Update or insert the product
      const productData = {
        name: values.name,
        tagline: values.tagline,
        description: values.description,
        website_url: values.website_url,
        image_url: values.image_url,
        categories: values.categories,
        status: saveAsDraft ? 'draft' : isEditing ? undefined : 'pending',
      };
      
      let productId: string;
      
      if (isEditing) {
        // Update existing product
        const { error: updateError } = await supabase
          .from('products')
          .update(productData)
          .eq('id', values.id);
          
        if (updateError) throw updateError;
        productId = values.id;
        
        // Delete existing related records to replace them
        const { error: deleteScreenshotsError } = await supabase
          .from('product_screenshots')
          .delete()
          .eq('product_id', productId);
          
        if (deleteScreenshotsError) throw deleteScreenshotsError;
        
        const { error: deleteVideosError } = await supabase
          .from('product_videos')
          .delete()
          .eq('product_id', productId);
          
        if (deleteVideosError) throw deleteVideosError;
        
        const { error: deleteTechError } = await supabase
          .from('product_technologies')
          .delete()
          .eq('product_id', productId);
          
        if (deleteTechError) throw deleteTechError;
        
        const { error: deleteMakersError } = await supabase
          .from('product_makers')
          .delete()
          .eq('product_id', productId);
          
        if (deleteMakersError) throw deleteMakersError;
      } else {
        // Insert new product
        const { data: product, error: productError } = await supabase
          .from('products')
          .insert({
            ...productData,
            created_by: userId,
          })
          .select('id')
          .single();

        if (productError) throw productError;
        productId = product.id;
      }

      // Insert the makers
      if (values.makers.length > 0) {
        const makerData = values.makers.map(maker => ({
          product_id: productId,
          profile_id: maker.id || userId, // Use the creator's ID as a fallback
        }));

        const { error: makersError } = await supabase
          .from('product_makers')
          .insert(makerData);

        if (makersError) throw makersError;
      }

      // Insert the technologies
      if (values.technologies.length > 0) {
        const techData = values.technologies.map((tech, index) => ({
          product_id: productId,
          technology_name: tech,
          display_order: index,
        }));

        const { error: techError } = await supabase
          .from('product_technologies')
          .insert(techData);

        if (techError) throw techError;
      }

      // Insert screenshots
      if (values.screenshots.length > 0) {
        const screenshotData = values.screenshots.map((screenshot, index) => ({
          product_id: productId,
          title: screenshot.title || null,
          image_url: screenshot.image_url,
          description: screenshot.description || null,
          display_order: index,
        }));

        const { error: screenshotError } = await supabase
          .from('product_screenshots')
          .insert(screenshotData);

        if (screenshotError) throw screenshotError;
      }

      // Insert videos
      if (values.videos.length > 0) {
        const videoData = values.videos.map((video, index) => ({
          product_id: productId,
          title: video.title || null,
          video_url: video.video_url,
          display_order: index,
        }));

        const { error: videoError } = await supabase
          .from('product_videos')
          .insert(videoData);

        if (videoError) throw videoError;
      }

      toast.success(isEditing 
        ? 'Product updated successfully' 
        : (saveAsDraft ? 'Product saved as draft' : 'Product submitted for review'));
      
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error submitting product:', error);
      toast.error(error.message || 'Failed to submit product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isLoading,
    handleSubmit
  };
};
