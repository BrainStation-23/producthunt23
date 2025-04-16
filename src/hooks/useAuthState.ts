
import { useSessionManagement } from './auth/useSessionManagement';
import { useRoleManagement } from './auth/useRoleManagement';

export const useAuthState = () => {
  const { session, user, setSession, setUser } = useSessionManagement();
  const { userRole, isRoleFetched, setUserRole } = useRoleManagement(user);

  return {
    session,
    user,
    userRole,
    isRoleFetched,
    setSession,
    setUser,
    setUserRole,
  };
};
