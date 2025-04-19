
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
        if (mounted) {
          setUserRole(null);
          setIsRoleFetched(true);
        }
        return;
      }

      try {
        console.log('Fetching role for:', user.id);
        const role = await fetchUserRole(user.id);
        if (mounted) {
          setUserRole(role);
          setIsRoleFetched(true);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        if (mounted) {
          setUserRole('user'); // Default to user role on error
          setIsRoleFetched(true);
        }
      }
    };

    // Only fetch if role isn't fetched yet or user has changed
    if (!isRoleFetched || user?.id) {
      setIsRoleFetched(false);
      fetchAndSetUserRole();
    }

    return () => {
      mounted = false;
    };
  }, [user]); // Only depend on user changes

  return {
    userRole,
    isRoleFetched,
    setUserRole,
  };
};
