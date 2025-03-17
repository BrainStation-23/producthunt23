
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductFormValues } from '@/types/product';

// Form validation schema
export const productSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters.' }).max(50),
  tagline: z.string().min(5, { message: 'Tagline must be at least 5 characters.' }).max(150),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  website_url: z.string().url({ message: 'Please enter a valid URL.' }).or(z.literal('')),
  image_url: z.string().url({ message: 'Please enter a valid image URL.' }).or(z.literal('')),
  technologies: z.array(z.string()).min(1, { message: 'Please select at least one technology.' }),
  tags: z.array(z.string()).min(1, { message: 'Please select at least one category.' }),
  screenshots: z.array(z.object({
    title: z.string().optional(),
    image_url: z.string().url({ message: 'Please enter a valid URL.' }),
    description: z.string().optional(),
  })),
  videos: z.array(z.object({
    title: z.string().optional(),
    video_url: z.string().url({ message: 'Please enter a valid URL.' }),
  })),
  agreed_to_policies: z.boolean().refine(val => val === true, {
    message: 'You must agree to the policies before submitting.',
  }),
});

export const useProductForm = (userId: string | undefined) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      tagline: '',
      description: '',
      website_url: '',
      image_url: '',
      technologies: [],
      tags: [],
      screenshots: [],
      videos: [],
      agreed_to_policies: false,
    },
  });

  const handleSubmit = async (values: ProductFormValues, saveAsDraft = false) => {
    if (!userId) {
      toast.error('You must be logged in to submit a product');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save the product first
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          name: values.name,
          tagline: values.tagline,
          description: values.description,
          website_url: values.website_url,
          image_url: values.image_url,
          tags: values.tags,
          status: saveAsDraft ? 'draft' : 'pending',
          created_by: userId,
        })
        .select('id')
        .single();

      if (productError) throw productError;

      // Insert the technologies
      if (values.technologies.length > 0) {
        const techData = values.technologies.map((tech, index) => ({
          product_id: product.id,
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
          product_id: product.id,
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
          product_id: product.id,
          title: video.title || null,
          video_url: video.video_url,
          display_order: index,
        }));

        const { error: videoError } = await supabase
          .from('product_videos')
          .insert(videoData);

        if (videoError) throw videoError;
      }

      toast.success(saveAsDraft 
        ? 'Product saved as draft' 
        : 'Product submitted for review');
      
      navigate('/user/dashboard');
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
    handleSubmit
  };
};
