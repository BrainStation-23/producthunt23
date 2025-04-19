
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { getDashboardPathForRole } from '@/utils/navigation';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { userRole, isRoleFetched } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

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
        
        // Check if user is disabled
        if (sessionData.session.user.app_metadata?.disabled) {
          console.error("User account is suspended");
          await supabase.auth.signOut();
          throw new Error("Your account has been suspended. Please contact an administrator.");
        }

        // Wait for role to be fetched
        if (!isRoleFetched) {
          console.log("Waiting for role to be fetched...");
          return;
        }
        
        // Get the appropriate dashboard path based on user role
        const dashboardPath = getDashboardPathForRole(userRole);
        console.log("Redirecting to dashboard:", dashboardPath);
        
        // We've successfully authenticated, redirect to the role-specific dashboard
        toast.success('Login successful');
        setIsProcessing(false);
        
        navigate(dashboardPath, { replace: true });
      } catch (error: any) {
        console.error('Error during authentication callback:', error);
        setError(error.message);
        toast.error(`Authentication failed: ${error.message}`);
        setIsProcessing(false);
        navigate('/login');
      }
    };

    if (isProcessing) {
      handleAuthCallback();
    }
  }, [navigate, userRole, isRoleFetched, isProcessing]);

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

  // Show loading state while waiting for role
  if (isProcessing || !isRoleFetched) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Completing authentication...</p>
          <p className="text-sm text-muted-foreground mt-2">You will be redirected shortly</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;
