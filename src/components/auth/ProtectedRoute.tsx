
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

  // Remove loading state check
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
