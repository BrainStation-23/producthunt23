
import { supabase } from '@/integrations/supabase/client';
import { ProductFormValues } from '@/types/product';

export async function deleteProductRelations(productId: string) {
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

export async function saveProductRelations(productId: string, values: ProductFormValues, userId: string) {
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
