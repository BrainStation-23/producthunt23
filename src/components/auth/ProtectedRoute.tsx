
import React, { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/auth/types';

interface ProtectedRouteProps {
  children?: ReactNode;
  requiredRole?: UserRole;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  requiredRole
}) => {
  const { user, userRole, isLoading, isRoleFetched } = useAuth();

  // Only show loading state when auth is initially loading or when we need to fetch role
  if (isLoading || (user && !isRoleFetched)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If a required role is specified and user doesn't have it, redirect to their default route
  if (requiredRole && userRole !== requiredRole) {
    const redirectPath = userRole === 'admin' ? '/admin' : 
                        userRole === 'judge' ? '/judge' : '/user';
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
