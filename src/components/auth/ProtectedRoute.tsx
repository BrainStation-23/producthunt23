
import React, { ReactNode, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children?: ReactNode;
  allowedRoles?: ('admin' | 'user' | 'judge')[];
  adminOnly?: boolean;
  userOnly?: boolean;
  judgeOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  allowedRoles = ['admin', 'user', 'judge'],
  adminOnly = false,
  userOnly = false,
  judgeOnly = false
}) => {
  const { user, userRole, isLoading, isRoleFetched } = useAuth();
  const location = useLocation();

  // For debugging
  useEffect(() => {
    console.log('ProtectedRoute:', { 
      path: location.pathname,
      isLoading, 
      isRoleFetched,
      userRole, 
      allowedRoles,
      adminOnly,
      userOnly,
      judgeOnly,
      isAllowed: userRole ? allowedRoles.includes(userRole) : false
    });
  }, [isLoading, isRoleFetched, userRole, allowedRoles, adminOnly, userOnly, judgeOnly, location]);

  // Show loading state when auth is loading or role is not yet fetched
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

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Wait for role to be fetched before doing role-based redirects
  if (!isRoleFetched) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Check role-specific restrictions
  if (adminOnly && userRole !== 'admin') {
    // If user is judge and trying to access admin route, redirect to judge route
    if (userRole === 'judge') {
      return <Navigate to="/judge" replace />;
    }
    return <Navigate to="/user" replace />;
  }

  if (userOnly && userRole !== 'user') {
    // If user is judge and trying to access user route, redirect to judge route
    if (userRole === 'judge') {
      return <Navigate to="/judge" replace />;
    }
    return <Navigate to="/admin" replace />;
  }

  if (judgeOnly && userRole !== 'judge') {
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  // Redirect if not in allowed roles
  if (!allowedRoles.includes(userRole as 'admin' | 'user' | 'judge')) {
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else if (userRole === 'judge') {
      return <Navigate to="/judge" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  // If children are provided, render them, otherwise use Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
