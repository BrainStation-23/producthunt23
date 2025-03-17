
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Screenshot, Video } from '@/types/product';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import TechnologiesSelector from '@/components/products/TechnologiesSelector';
import TagsSelector from '@/components/products/TagsSelector';
import ScreenshotsManager from '@/components/products/ScreenshotsManager';
import VideosManager from '@/components/products/VideosManager';

// Form validation schema
const productSchema = z.object({
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
  agreed_to_policies: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the policies before submitting.' }),
  }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const SubmitProductForm: React.FC = () => {
  const { user } = useAuth();
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
    if (!user) {
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
          created_by: user.id,
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => handleSubmit(data, false))} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="My Awesome Product" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of your product or project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tagline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tagline*</FormLabel>
                    <FormControl>
                      <Input placeholder="A short, catchy description of your product" {...field} />
                    </FormControl>
                    <FormDescription>
                      A brief description that appears below your product name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your product in detail" 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      A comprehensive description of your product, its features, and benefits.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="website_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The URL where users can find your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Image URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormDescription>
                        A URL to your product's logo or featured image.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="categories">
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="technologies">Technologies</TabsTrigger>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="categories" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categories*</FormLabel>
                      <FormControl>
                        <TagsSelector 
                          selected={field.value} 
                          onSelect={(tags) => field.onChange(tags)} 
                        />
                      </FormControl>
                      <FormDescription>
                        Select categories that best describe your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technologies" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies*</FormLabel>
                      <FormControl>
                        <TechnologiesSelector 
                          selected={field.value} 
                          onSelect={(techs) => field.onChange(techs)} 
                        />
                      </FormControl>
                      <FormDescription>
                        Select the technologies used to build your product.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="screenshots" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="screenshots"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Screenshots</FormLabel>
                      <FormControl>
                        <ScreenshotsManager 
                          screenshots={field.value} 
                          onChange={(screenshots: Screenshot[]) => field.onChange(screenshots)} 
                        />
                      </FormControl>
                      <FormDescription>
                        Add screenshots of your product (optional but recommended).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <FormField
                  control={form.control}
                  name="videos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Videos</FormLabel>
                      <FormControl>
                        <VideosManager 
                          videos={field.value} 
                          onChange={(videos: Video[]) => field.onChange(videos)} 
                        />
                      </FormControl>
                      <FormDescription>
                        Add YouTube or Vimeo videos showcasing your product (optional).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="agreed_to_policies"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I agree to the product submission policies
                    </FormLabel>
                    <FormDescription>
                      By checking this box, you confirm that your submission follows our community guidelines and terms of service.
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => handleSubmit(form.getValues(), true)}
            disabled={isSubmitting}
          >
            Save as Draft
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            Submit for Review
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SubmitProductForm;
