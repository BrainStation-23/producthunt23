
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

  // Show loading state only during initial auth check or when explicitly waiting for role
  if (isLoading || (user && !isRoleFetched)) {
    console.log('Protected route loading state:', { isLoading, isRoleFetched, user, userRole });
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // If a required role is specified and user doesn't have it, redirect to their default route
  if (requiredRole && userRole !== requiredRole) {
    console.log('User lacks required role:', { requiredRole, userRole });
    const redirectPath = userRole === 'admin' ? '/admin' : 
                        userRole === 'judge' ? '/judge' : '/user';
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
