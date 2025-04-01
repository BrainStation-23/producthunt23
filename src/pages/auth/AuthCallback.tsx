
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // The hash contains the token
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // Check for the session to determine user role and navigate accordingly
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user role
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          if (roleError && roleError.code !== 'PGRST116') {
            console.error('Error fetching user role:', roleError);
            navigate('/user'); // Default to user dashboard if there's an error
          } else if (roleData?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        } else {
          navigate('/login');
        }
      } catch (error: any) {
        console.error('Error in auth callback:', error.message);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p>Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
