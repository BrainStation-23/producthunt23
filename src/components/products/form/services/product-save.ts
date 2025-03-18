
import { supabase } from '@/integrations/supabase/client';
import { ProductFormValues } from '@/types/product';
import { deleteProductRelations, saveProductRelations } from './product-relations';

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

export async function submitProductForReview(productId: string) {
  try {
    const { error } = await supabase
      .from('products')
      .update({ status: 'pending' })
      .eq('id', productId);
      
    if (error) throw error;
    
    return {
      success: true,
      message: 'Product submitted for review'
    };
  } catch (error: any) {
    console.error('Error submitting product for review:', error);
    throw error;
  }
}
