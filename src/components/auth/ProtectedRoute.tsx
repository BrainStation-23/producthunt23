
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'user')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles = ['admin', 'user']
}) => {
  const { user, userRole, isLoading } = useAuth();

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
    return <Navigate to="/login" replace />;
  }

  // Redirect if not authorized for this route
  if (!allowedRoles.includes(userRole as 'admin' | 'user')) {
    // Redirect admins to admin dashboard and users to user dashboard if they try to access the wrong area
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
