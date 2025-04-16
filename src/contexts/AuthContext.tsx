import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { AuthContextType, UserRole } from './auth/types';
import { fetchUserRole } from './auth/roleService';
import { updateSocialProfileLinks } from './auth/socialService';
import { 
  signIn as authSignIn, 
  signUp as authSignUp, 
  signOut as authSignOut,
  signInWithGithub as authSignInWithGithub,
  signInWithLinkedIn as authSignInWithLinkedIn
} from './auth/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRoleFetched, setIsRoleFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const setupAuth = async () => {
      try {
        setIsLoading(true);

        // First, set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return;

          console.log('Auth state changed:', event);
          
          if (newSession?.user?.app_metadata?.disabled) {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setUserRole(null);
            toast.error('Your account has been suspended');
            navigate('/login');
            return;
          }

          setSession(newSession);
          setUser(newSession?.user ?? null);

          // Only fetch role for new sessions or user updates
          if (newSession?.user && ['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
            try {
              const role = await fetchUserRole(newSession.user.id);
              if (mounted) {
                setUserRole(role);
                setIsRoleFetched(true);
              }
            } catch (error) {
              console.error('Error fetching role:', error);
              if (mounted) {
                setUserRole('user');
                setIsRoleFetched(true);
              }
            }
          } else if (!newSession?.user) {
            setUserRole(null);
            setIsRoleFetched(true);
          }
          
          setIsLoading(false);
        });

        authSubscription = subscription;

        // Then check initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          try {
            const role = await fetchUserRole(initialSession.user.id);
            if (mounted) {
              setUserRole(role);
              setIsRoleFetched(true);
            }
          } catch (error) {
            console.error('Error fetching initial role:', error);
            if (mounted) {
              setUserRole('user');
              setIsRoleFetched(true);
            }
          }
        } else {
          setUserRole(null);
          setIsRoleFetched(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in auth setup:', error);
        if (mounted) {
          setIsLoading(false);
          setIsRoleFetched(true);
        }
      }
    };

    setupAuth();

    return () => {
      mounted = false;
      authSubscription?.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string): Promise<UserRole> => {
    try {
      setIsLoading(true);
      setIsRoleFetched(false);
      const role = await authSignIn(email, password);
      setUserRole(role);
      setIsRoleFetched(true);
      return role;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    await authSignUp(email, password, userData);
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authSignOut();
      
      setUser(null);
      setSession(null);
      setUserRole(null);
      setIsRoleFetched(true);
      
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGithub = async () => {
    await authSignInWithGithub();
  };

  const signInWithLinkedIn = async () => {
    await authSignInWithLinkedIn();
  };

  const value = {
    session,
    user,
    userRole,
    isLoading,
    isRoleFetched,
    signIn,
    signUp,
    signOut,
    signInWithGithub,
    signInWithLinkedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
