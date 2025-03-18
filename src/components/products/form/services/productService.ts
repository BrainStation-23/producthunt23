
import { supabase } from '@/integrations/supabase/client';
import { ProductFormValues, ProductScreenshot, ProductVideo, ProductTechnology } from '@/types/product';
import { toast } from 'sonner';

export async function fetchProductById(productId: string) {
  try {
    // Fetch product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();
    
    if (productError) throw productError;
    if (!product) throw new Error('Product not found');
    
    return product;
  } catch (error: any) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function fetchProductScreenshots(productId: string) {
  try {
    const { data, error } = await supabase
      .from('product_screenshots')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching screenshots:', error);
    throw error;
  }
}

export async function fetchProductVideos(productId: string) {
  try {
    const { data, error } = await supabase
      .from('product_videos')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching videos:', error);
    throw error;
  }
}

export async function fetchProductTechnologies(productId: string) {
  try {
    const { data, error } = await supabase
      .from('product_technologies')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching technologies:', error);
    throw error;
  }
}

export async function fetchProductMakers(productId: string) {
  try {
    console.log('Fetching product makers for product ID:', productId);
    const { data, error } = await supabase
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
    
    if (error) throw error;
    console.log('Raw makers data from Supabase:', data);
    return data;
  } catch (error: any) {
    console.error('Error fetching makers:', error);
    throw error;
  }
}

export async function fetchUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, email, avatar_url')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function saveProduct(values: ProductFormValues, userId: string, saveAsDraft = false) {
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
      await deleteProductRelations(productId);
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

    // Save product relations
    await saveProductRelations(productId, values, userId);

    return {
      success: true,
      productId,
      message: isEditing 
        ? 'Product updated successfully' 
        : (saveAsDraft ? 'Product saved as draft' : 'Product submitted for review')
    };
  } catch (error: any) {
    console.error('Error saving product:', error);
    throw error;
  }
}

async function deleteProductRelations(productId: string) {
  try {
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
  } catch (error) {
    console.error('Error deleting product relations:', error);
    throw error;
  }
}

async function saveProductRelations(productId: string, values: ProductFormValues, userId: string) {
  try {
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
  } catch (error) {
    console.error('Error saving product relations:', error);
    throw error;
  }
}

export function formatMakersData(makers: any[], productCreatedBy: string) {
  return makers.map(maker => {
    console.log('Processing maker:', maker);
    return {
      email: maker.profiles?.email || maker.profiles?.username || 'Unknown',
      id: maker.profile_id,
      isCreator: maker.profile_id === productCreatedBy,
      username: maker.profiles?.username || null,
      avatar_url: maker.profiles?.avatar_url || null
    };
  });
}
