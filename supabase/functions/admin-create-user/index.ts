
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
    const { email, password, role = 'user', username } = await req.json();
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate role to be one of the allowed types
    const validRoles = ['user', 'admin', 'judge'];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role. Must be one of: user, admin, judge' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create a new user with email/password
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username }
    });

    if (createError) {
      console.error('Error creating user:', createError);
      throw createError;
    }

    // Check if user already has any role assigned (this should not happen for new users,
    // but adding this check for completeness)
    const { data: existingRoles, error: checkRoleError } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', newUser.user.id);
      
    if (checkRoleError) {
      console.error('Error checking existing roles:', checkRoleError);
    } else if (existingRoles && existingRoles.length > 0) {
      // If roles already exist, delete them to avoid duplicates
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', newUser.user.id);
        
      if (deleteError) {
        console.error('Error deleting existing roles:', deleteError);
      }
    }

    // Now insert the single specified role
    const { data: roleInsertData, error: roleInsertError } = await supabase
      .from('user_roles')
      .insert({ user_id: newUser.user.id, role })
      .select();

    if (roleInsertError) {
      console.error('Error assigning role:', roleInsertError);
      // Don't throw here, just log it - the user was created successfully
    }

    return new Response(
      JSON.stringify({ success: true, user: newUser.user }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-create-user function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
