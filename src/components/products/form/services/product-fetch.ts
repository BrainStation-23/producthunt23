
import { supabase } from '@/integrations/supabase/client';

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
      .select('id, username, avatar_url')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export function formatMakersData(makers: any[], productCreatedBy: string) {
  return makers.map(maker => {
    console.log('Processing maker:', maker);
    return {
      id: maker.profile_id,
      isCreator: maker.profile_id === productCreatedBy,
      username: maker.profiles?.username || null,
      avatar_url: maker.profiles?.avatar_url || null
    };
  });
}
