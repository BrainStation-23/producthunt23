
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

    // Parse request body
    const { users } = await req.json();
    
    if (!users || !Array.isArray(users) || users.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No users provided for import' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    // Default password for new users
    const defaultPassword = "Change" + Math.random().toString(36).substring(2, 10) + "!";
    
    // Process each user
    for (const userData of users) {
      try {
        // Skip if no email (required field)
        if (!userData.email) {
          results.failed++;
          results.errors.push({ email: userData.email || 'unknown', error: 'Email is required' });
          continue;
        }
        
        // Create the user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: userData.email,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: { 
            username: userData.username || userData.email.split('@')[0]
          }
        });
        
        if (createError) {
          results.failed++;
          results.errors.push({ email: userData.email, error: createError.message });
          continue;
        }
        
        // Set role directly using the specified role or 'user' as fallback
        const role = userData.role && ['admin', 'user', 'judge'].includes(userData.role) 
          ? userData.role 
          : 'user';
          
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({ 
            user_id: newUser.user.id, 
            role: role 
          });
        
        if (roleError) {
          console.error(`Error setting role for ${userData.email}:`, roleError);
        }
        
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ email: userData.email || 'unknown', error: error.message });
      }
    }
    
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-bulk-create-users function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
