
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RoleRedirect: React.FC = () => {
  const { userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  // Use effect to redirect based on role, but only when not loading and we have a role
  useEffect(() => {
    if (!isLoading && userRole) {
      console.log(`RoleRedirect: routing to /${userRole}`);
      
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else if (userRole === 'judge') {
        navigate('/judge', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    }
  }, [userRole, isLoading, navigate]);

  // When loading, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Redirecting...</p>
        </div>
      </div>
    );
  }

  // When not loading but no role yet, also show loading
  if (!userRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Determining user access...</p>
        </div>
      </div>
    );
  }

  // Should never reach here if redirects work properly
  return null;
};

export default RoleRedirect;
