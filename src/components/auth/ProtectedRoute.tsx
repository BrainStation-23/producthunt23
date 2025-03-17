
import React, { ReactNode, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: ('admin' | 'user')[];
  adminOnly?: boolean; // New prop to explicitly mark admin-only routes
  userOnly?: boolean; // New prop to explicitly mark user-only routes
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  allowedRoles = ['admin', 'user'],
  adminOnly = false,
  userOnly = false
}) => {
  const { user, userRole, isLoading } = useAuth();
  const location = useLocation();

  // For debugging
  useEffect(() => {
    console.log('ProtectedRoute:', { 
      path: location.pathname,
      isLoading, 
      userRole, 
      allowedRoles,
      adminOnly,
      userOnly,
      isAllowed: userRole ? allowedRoles.includes(userRole) : false
    });
  }, [isLoading, userRole, allowedRoles, adminOnly, userOnly, location]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check role-specific restrictions
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  if (userOnly && userRole !== 'user') {
    return <Navigate to="/admin" replace />;
  }

  // Redirect if not in allowed roles
  if (!allowedRoles.includes(userRole as 'admin' | 'user')) {
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  // If children are provided, render them, otherwise use Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
