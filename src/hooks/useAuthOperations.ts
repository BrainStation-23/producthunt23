
import { useNavigate } from 'react-router-dom';
import { UserRole } from '@/contexts/auth/types';
import { 
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  signInWithGithub as authSignInWithGithub,
  signInWithLinkedIn as authSignInWithLinkedIn
} from '@/contexts/auth/authService';

export const useAuthOperations = (setUser: any, setSession: any, setUserRole: any) => {
  const navigate = useNavigate();

  const signIn = async (email: string, password: string): Promise<UserRole> => {
    const role = await authSignIn(email, password);
    setUserRole(role);
    return role;
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    await authSignUp(email, password, userData);
  };

  const signOut = async () => {
    await authSignOut();
    
    setUser(null);
    setSession(null);
    setUserRole(null);
    
    navigate('/login');
  };

  const signInWithGithub = async () => {
    await authSignInWithGithub();
  };

  const signInWithLinkedIn = async () => {
    await authSignInWithLinkedIn();
  };

  return {
    signIn,
    signUp,
    signOut,
    signInWithGithub,
    signInWithLinkedIn,
  };
};
