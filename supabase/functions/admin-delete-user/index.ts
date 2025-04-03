
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

    // IMPROVED DELETION ORDER:
    // First delete profile (should trigger cascades for product-related data)
    // Then delete user_roles
    // Finally delete the auth user
    
    try {
      // 1. Delete profile first (this will cascade delete related data)
      console.log(`Deleting profile for user ${user_id}`);
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user_id);
      
      if (profileError) {
        console.warn(`Warning deleting profile: ${profileError.message}`);
      }

      // 2. Delete user_roles
      console.log(`Deleting user_roles for user ${user_id}`);
      const { error: rolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user_id);
      
      if (rolesError) {
        console.warn(`Warning deleting user_roles: ${rolesError.message}`);
      }

      // 3. Finally delete auth user
      console.log(`Deleting auth user ${user_id}`);
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        user_id
      );

      if (deleteError) {
        console.error('Error deleting auth user:', deleteError);
        throw deleteError;
      }
      
      console.log(`User ${user_id} deleted successfully`);
      
      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (cleanupError) {
      console.error(`Error during deletion process: ${cleanupError.message}`);
      throw cleanupError;
    }
  } catch (error) {
    console.error('Error in admin-delete-user function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
