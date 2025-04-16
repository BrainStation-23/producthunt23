
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
  const { user, userRole, isRoleFetched } = useAuth();

  // If not authenticated, redirect to login
  if (!user) {
    console.log('No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Wait for role to be fetched
  if (!isRoleFetched) {
    // You might want to show a loading state here
    return null;
  }

  // If a specific role is required and user doesn't have it, redirect to their default route
  if (requiredRole && userRole !== requiredRole) {
    console.log(`Required role: ${requiredRole}, User role: ${userRole}, redirecting to appropriate dashboard`);
    
    // Determine redirect path based on user's actual role
    let redirectPath = '/user'; // Default path
    
    if (userRole === 'admin') {
      redirectPath = '/admin';
    } else if (userRole === 'judge') {
      redirectPath = '/judge';
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
