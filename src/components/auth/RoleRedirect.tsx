
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const RoleRedirect: React.FC = () => {
  const { userRole, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && userRole) {
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else if (userRole === 'judge') {
        navigate('/judge', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    }
  }, [userRole, isLoading, navigate]);

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

  return null;
};

export default RoleRedirect;
