
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/contexts/auth/types';
import { fetchUserRole } from '@/contexts/auth/roleService';
import { useAuth } from '@/contexts/AuthContext';

type RoleContextType = {
  userRole: UserRole;
  isRoleFetched: boolean;
  setUserRole: (role: UserRole) => void;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isRoleFetched, setIsRoleFetched] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchRole = async () => {
      if (!user) {
        if (isMounted) {
          setUserRole(null);
          setIsRoleFetched(true);
        }
        return;
      }

      try {
        console.log('Fetching role for user:', user.id);
        const role = await fetchUserRole(user.id);
        
        if (isMounted) {
          console.log('Role fetched successfully:', role);
          setUserRole(role);
          setIsRoleFetched(true);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        if (isMounted) {
          setUserRole('user'); // Default to user role on error
          setIsRoleFetched(true);
        }
      }
    };

    // Reset role fetched state when user changes
    setIsRoleFetched(false);
    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <RoleContext.Provider value={{ userRole, isRoleFetched, setUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
