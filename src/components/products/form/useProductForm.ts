
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ProductFormValues } from '@/types/product';
import { productSchema } from './schema/productSchema';
import {
  fetchProductById,
  fetchProductScreenshots,
  fetchProductVideos,
  fetchProductTechnologies,
  fetchProductMakers,
  fetchUserProfile,
  saveProduct,
  submitProductForReview,
  formatMakersData
} from './services/productService';
import {
  formatScreenshots,
  formatVideos,
  formatTechnologies
} from './utils/formDataTransformers';

interface UseProductFormProps {
  userId: string | undefined;
  productId?: string; // Optional product ID for editing
}

export const useProductForm = ({ userId, productId }: UseProductFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!productId);
  const [productStatus, setProductStatus] = useState<string | undefined>();
  
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
          
          // Fetch all product data
          const product = await fetchProductById(productId);
          const screenshots = await fetchProductScreenshots(productId);
          const videos = await fetchProductVideos(productId);
          const technologies = await fetchProductTechnologies(productId);
          const makers = await fetchProductMakers(productId);
          
          // Store product status
          setProductStatus(product.status);
          
          // Format data for the form
          const formattedScreenshots = formatScreenshots(screenshots);
          const formattedVideos = formatVideos(videos);
          const formattedTechnologies = formatTechnologies(technologies);
          const formattedMakers = formatMakersData(makers, product.created_by);
          
          console.log('Formatted makers for form:', formattedMakers);
          
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
  useEffect(() => {
    const updateCreatorProfile = async () => {
      if (!userId || productId) return; // Skip if no user ID or if we're editing (profile will be loaded)
      
      try {
        const userData = await fetchUserProfile(userId);
        if (userData) {
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
      } catch (error) {
        console.error('Error updating creator profile:', error);
      }
    };
    
    updateCreatorProfile();
  }, [userId, productId, form]);

  const handleSubmit = async (values: ProductFormValues, saveAsDraft = false) => {
    if (!userId) {
      toast.error('You must be logged in to submit a product');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await saveProduct(values, userId, saveAsDraft);
      toast.success(result.message);
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error submitting product:', error);
      toast.error(error.message || 'Failed to submit product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!productId) {
      toast.error('Product ID is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitProductForReview(productId);
      toast.success(result.message);
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error submitting product for review:', error);
      toast.error(error.message || 'Failed to submit product for review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    isLoading,
    productStatus,
    handleSubmit,
    handleSubmitForReview
  };
};
