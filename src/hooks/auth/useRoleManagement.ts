
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { UserRole } from '@/contexts/auth/types';
import { fetchUserRole } from '@/contexts/auth/roleService';

export const useRoleManagement = (user: User | null) => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isRoleFetched, setIsRoleFetched] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchAndSetUserRole = async () => {
      if (!user) {
        setUserRole(null);
        setIsRoleFetched(true);
        return;
      }

      try {
        console.log('Fetching role for:', user.id);
        const role = await fetchUserRole(user.id);
        if (mounted) {
          console.log('Setting user role:', role);
          setUserRole(role);
          setIsRoleFetched(true);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        if (mounted) {
          setUserRole('user');
          setIsRoleFetched(true);
        }
      }
    };

    setIsRoleFetched(false);
    fetchAndSetUserRole();

    return () => {
      mounted = false;
    };
  }, [user]);

  return {
    userRole,
    isRoleFetched,
    setUserRole,
  };
};
