
import { supabase } from '@/integrations/supabase/client';
import { Maker, ProductMaker } from '@/types/product';

// Function to fetch product makers
export const fetchProductMakers = async (productId: string) => {
  try {
    const { data, error } = await supabase
      .from('product_makers')
      .select(`
        id,
        product_id,
        profile_id,
        created_at,
        profile:profiles(
          id,
          username,
          avatar_url,
          email
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching product makers:', error);
      throw error;
    }
    
    return data as ProductMaker[];
  } catch (error: any) {
    console.error('Failed to fetch product makers:', error.message);
    throw new Error(`Failed to fetch product makers: ${error.message}`);
  }
};

// Function to fetch user profile by ID
export const fetchUserProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, email')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
    
    return data;
  } catch (error: any) {
    console.error('Failed to fetch user profile:', error.message);
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
};

// Utility function to format makers data for the form
export const formatMakersData = (makers: ProductMaker[], creatorId: string | null): Maker[] => {
  if (!makers || makers.length === 0) {
    return [];
  }
  
  return makers.map(maker => {
    const isCreator = maker.profile_id === creatorId;
    return {
      id: maker.profile_id,
      username: maker.profile?.username || null,
      avatar_url: maker.profile?.avatar_url || null,
      isCreator
    };
  });
};

// Function to sync product makers with the database
export const syncProductMakers = async (productId: string, makers: Maker[]) => {
  try {
    // Step 1: Delete all existing makers for this product
    const { error: deleteError } = await supabase
      .from('product_makers')
      .delete()
      .eq('product_id', productId);
    
    if (deleteError) {
      console.error('Error deleting product makers:', deleteError);
      throw deleteError;
    }
    
    // Step 2: Insert new makers
    const makersToInsert = makers.map(maker => ({
      product_id: productId,
      profile_id: maker.id
    }));
    
    const { error: insertError } = await supabase
      .from('product_makers')
      .insert(makersToInsert);
    
    if (insertError) {
      console.error('Error inserting product makers:', insertError);
      throw insertError;
    }
    
    return true;
  } catch (error: any) {
    console.error('Failed to sync product makers:', error.message);
    throw new Error(`Failed to sync product makers: ${error.message}`);
  }
};
