
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Verify the user is authenticated and is an admin
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (roleError || !roleData || roleData.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request
    const { user_id } = await req.json();
    
    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log(`Starting deletion process for user ${user_id}`);

    // Manual cleanup of user data to ensure all references are removed
    // This approach handles potential foreign key issues
    
    try {
      // 1. Delete user_roles
      console.log(`Deleting user_roles for user ${user_id}`);
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user_id);
      
      if (rolesError) {
        console.warn(`Warning deleting user_roles: ${rolesError.message}`);
      }

      // 2. Get profile ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user_id)
        .single();
      
      if (profileError) {
        console.warn(`Warning getting profile: ${profileError.message}`);
      }
      
      if (profileData) {
        const profileId = profileData.id;
        
        // 3. Delete comments
        console.log(`Deleting comments for user ${profileId}`);
        const { error: commentsError } = await supabase
          .from('comments')
          .delete()
          .eq('user_id', profileId);
        
        if (commentsError) {
          console.warn(`Warning deleting comments: ${commentsError.message}`);
        }
        
        // 4. Delete saved_products
        console.log(`Deleting saved_products for user ${profileId}`);
        const { error: savedError } = await supabase
          .from('saved_products')
          .delete()
          .eq('user_id', profileId);
        
        if (savedError) {
          console.warn(`Warning deleting saved_products: ${savedError.message}`);
        }
        
        // 5. Delete upvotes
        console.log(`Deleting upvotes for user ${profileId}`);
        const { error: upvotesError } = await supabase
          .from('upvotes')
          .delete()
          .eq('user_id', profileId);
        
        if (upvotesError) {
          console.warn(`Warning deleting upvotes: ${upvotesError.message}`);
        }
        
        // 6. Delete product_makers
        console.log(`Deleting product_makers for user ${profileId}`);
        const { error: makersError } = await supabase
          .from('product_makers')
          .delete()
          .eq('profile_id', profileId);
        
        if (makersError) {
          console.warn(`Warning deleting product_makers: ${makersError.message}`);
        }
        
        // 7. Delete products (this should cascade to screenshots, videos, technologies)
        console.log(`Deleting products for user ${profileId}`);
        const { error: productsError } = await supabase
          .from('products')
          .delete()
          .eq('created_by', profileId);
        
        if (productsError) {
          console.warn(`Warning deleting products: ${productsError.message}`);
        }
      }
    } catch (cleanupError) {
      console.error(`Error during cleanup: ${cleanupError.message}`);
      // Continue with auth user deletion even if cleanup has issues
    }
    
    // Now delete the auth user
    console.log(`Deleting auth user ${user_id}`);
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      user_id
    );

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      throw deleteError;
    }
    
    console.log(`User ${user_id} deleted successfully`);
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-delete-user function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
