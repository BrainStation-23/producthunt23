
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const LogoutPage: React.FC = () => {
  const { signOut } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await signOut();
        toast.success('Successfully logged out');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('There was a problem logging out');
      }
    };

    performLogout();
  }, [signOut]);

  // Immediately redirect to home page
  return <Navigate to="/" replace />;
};

export default LogoutPage;
