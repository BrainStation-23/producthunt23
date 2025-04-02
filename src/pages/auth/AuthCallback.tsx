import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback started");
        
        // Get the current session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError.message);
          throw sessionError;
        }
        
        if (!sessionData.session) {
          console.error("No session found");
          throw new Error("Authentication failed. No session found.");
        }
        
        console.log("Session obtained, user:", sessionData.session.user.email);
        
        // Get user role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', sessionData.session.user.id)
          .single();
        
        if (roleError && roleError.code !== 'PGRST116') {
          console.error('Error fetching user role:', roleError);
          // Default to user dashboard if there's an error with role fetch
          toast.success('Login successful');
          navigate('/user');
          return;
        }
        
        console.log("User role:", roleData?.role);
        
        // Navigate based on user role
        if (roleData?.role === 'admin') {
          toast.success('Welcome back, admin!');
          navigate('/admin');
        } else {
          toast.success('Login successful');
          navigate('/user');
        }
      } catch (error: any) {
        console.error('Error during authentication callback:', error);
        setError(error.message);
        toast.error(`Authentication failed: ${error.message}`);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-lg">Completing authentication...</p>
        <p className="text-sm text-muted-foreground mt-2">You will be redirected shortly</p>
      </div>
    </div>
  );
};

export default AuthCallback;
