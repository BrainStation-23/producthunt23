
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
    const { action, data } = await req.json();

    let result;
    switch (action) {
      case 'create_user':
        // Create a new user with email/password
        const { email, password, role = 'user', username } = data;
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { username }
        });

        if (createError) throw createError;

        // Assign role if different from default 'user'
        if (role !== 'user') {
          await supabase
            .from('user_roles')
            .upsert({ user_id: newUser.user.id, role })
            .select();
        }

        result = { success: true, user: newUser.user };
        break;

      case 'suspend_user':
        // Temporarily disable a user's account
        const { user_id, suspended } = data;
        
        console.log(`Suspending user ${user_id}, suspended: ${suspended}`);
        
        // Use the updateUserById method to set the user to disabled
        const { data: updatedUser, error: suspendError } = await supabase.auth.admin.updateUserById(
          user_id,
          { 
            banned: suspended,
            // Also mark the user as disabled in the internal auth system
            disabled: suspended
          }
        );

        if (suspendError) {
          console.error('Error suspending user:', suspendError);
          throw suspendError;
        }
        
        console.log('User suspension update result:', updatedUser);
        
        result = { success: true, user: updatedUser.user };
        break;

      case 'delete_user':
        // Permanently delete a user's account
        const { user_id: deleteUserId } = data;
        
        console.log(`Deleting user ${deleteUserId}`);
        
        // Delete the user using the admin API
        const { error: deleteError } = await supabase.auth.admin.deleteUser(
          deleteUserId
        );

        if (deleteError) {
          console.error('Error deleting user:', deleteError);
          throw deleteError;
        }
        
        console.log(`User ${deleteUserId} deleted successfully`);
        
        result = { success: true };
        break;

      case 'update_user':
        // Update user details
        const { id, ...userUpdateData } = data;
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          id,
          userUpdateData
        );

        if (updateError) throw updateError;
        result = { success: true };
        break;

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-user-management function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
