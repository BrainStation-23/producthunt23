
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
        JSON.stringify({ error: 'No users provided for update' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };
    
    // Process each user
    for (const userData of users) {
      try {
        // Skip if no id (required field)
        if (!userData.id) {
          results.failed++;
          results.errors.push({ email: userData.email || 'unknown', error: 'User ID is required' });
          continue;
        }
        
        // Prepare user metadata update
        const userUpdateData: Record<string, any> = {};
        
        // Update email if provided
        if (userData.email) {
          userUpdateData.email = userData.email;
        }
        
        // Update user metadata if username provided
        if (userData.username) {
          userUpdateData.user_metadata = { username: userData.username };
        }
        
        // Only update if we have data to update
        if (Object.keys(userUpdateData).length > 0) {
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            userData.id,
            userUpdateData
          );
          
          if (updateError) {
            results.failed++;
            results.errors.push({ id: userData.id, error: updateError.message });
            continue;
          }
        }
        
        // Update role if provided
        if (userData.role && ['admin', 'user', 'judge'].includes(userData.role)) {
          // Check if user already has a role entry
          const { data: existingRole } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', userData.id)
            .maybeSingle();
          
          if (existingRole) {
            // Update existing role
            const { error: roleUpdateError } = await supabase
              .from('user_roles')
              .update({ role: userData.role })
              .eq('user_id', userData.id);
            
            if (roleUpdateError) {
              console.error(`Error updating role for user ${userData.id}:`, roleUpdateError);
            }
          } else {
            // Insert new role
            const { error: roleInsertError } = await supabase
              .from('user_roles')
              .insert({ user_id: userData.id, role: userData.role });
            
            if (roleInsertError) {
              console.error(`Error inserting role for user ${userData.id}:`, roleInsertError);
            }
          }
        }
        
        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push({ id: userData.id || 'unknown', error: error.message });
      }
    }
    
    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-bulk-update-users function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
