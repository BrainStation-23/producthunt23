
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

// Create a local storage key for role caching
const ROLE_CACHE_KEY = 'cached_user_role';

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>(() => {
    // Initialize from localStorage if available
    const cachedRole = localStorage.getItem(ROLE_CACHE_KEY);
    return cachedRole ? (cachedRole as UserRole) : null;
  });
  const [isRoleFetched, setIsRoleFetched] = useState<boolean>(() => {
    // If we have a cached role, consider it already fetched
    return !!localStorage.getItem(ROLE_CACHE_KEY);
  });

  useEffect(() => {
    let isMounted = true;

    const fetchRole = async () => {
      // If no user, clear role
      if (!user) {
        if (isMounted) {
          setUserRole(null);
          setIsRoleFetched(true);
          localStorage.removeItem(ROLE_CACHE_KEY);
        }
        return;
      }

      // If we already have a role for this user, don't fetch again
      const cachedRole = localStorage.getItem(ROLE_CACHE_KEY);
      const cachedUserId = localStorage.getItem('cached_user_id');
      
      if (cachedRole && cachedUserId === user.id && isRoleFetched) {
        console.log('Using cached role:', cachedRole);
        return;
      }

      try {
        console.log('Fetching role for user:', user.id);
        const role = await fetchUserRole(user.id);
        
        if (isMounted) {
          console.log('Role fetched successfully:', role);
          setUserRole(role);
          setIsRoleFetched(true);
          
          // Cache the role and user ID
          localStorage.setItem(ROLE_CACHE_KEY, role);
          localStorage.setItem('cached_user_id', user.id);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        if (isMounted) {
          setUserRole('user'); // Default to user role on error
          setIsRoleFetched(true);
          localStorage.setItem(ROLE_CACHE_KEY, 'user');
          localStorage.setItem('cached_user_id', user.id);
        }
      }
    };

    // Only reset fetch state if user changes (login/logout)
    if (!isRoleFetched || !localStorage.getItem(ROLE_CACHE_KEY)) {
      fetchRole();
    }

    return () => {
      isMounted = false;
    };
  }, [user?.id, isRoleFetched]); // Only depend on user ID, not the entire user object

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
