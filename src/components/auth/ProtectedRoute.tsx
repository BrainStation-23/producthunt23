
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/contexts/RoleContext';
import { UserRole } from '@/contexts/auth/types';
import { getDashboardPathForRole } from '@/utils/navigation';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  redirectPath = '/login',
}) => {
  const { user, loading } = useAuth();
  const { userRole, isRoleFetched } = useRole();
  const location = useLocation();

  // Show loading indicator while auth state is being determined
  if (loading || !isRoleFetched) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If a specific role is required, check if the user has the required role
  if (requiredRole && userRole !== requiredRole) {
    const dashboardPath = getDashboardPathForRole(userRole);
    return <Navigate to={dashboardPath} replace />;
  }

  // User is authenticated and has the required role, render the protected content
  return <Outlet />;
};

export default ProtectedRoute;
