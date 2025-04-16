
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

    // Function to fetch and set user role
    const fetchAndSetUserRole = async (userId: string) => {
      if (!userId || !mounted) return;
      
      try {
        console.log('Fetching role for user ID:', userId);
        const role = await fetchUserRole(userId);
        
        if (mounted) {
          console.log('Role fetched:', role);
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
    };

    const setupAuth = async () => {
      try {
        // Set initial loading state
        if (mounted) setIsLoading(true);
        
        // First set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
          console.log('Auth state changed:', event);
          
          if (!mounted) return;

          if (newSession?.user?.app_metadata?.disabled) {
            // Handle disabled user synchronously
            setSession(null);
            setUser(null);
            setUserRole(null);
            setIsRoleFetched(true);
            toast.error('Your account has been suspended');
            
            // Sign out asynchronously
            supabase.auth.signOut().then(() => {
              if (mounted) navigate('/login');
            });
            return;
          }

          // Update session and user state synchronously
          setSession(newSession);
          setUser(newSession?.user ?? null);

          // For certain auth events, fetch the role
          if (newSession?.user && ['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
            // Schedule role fetch to avoid Supabase API deadlocks
            setTimeout(() => {
              fetchAndSetUserRole(newSession.user.id);
            }, 0);
          } else if (!newSession?.user) {
            setUserRole(null);
            setIsRoleFetched(true);
          }
        });

        authSubscription = subscription;

        // Then check initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (initialSession?.user) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch role directly from database
          await fetchAndSetUserRole(initialSession.user.id);
        } else {
          setUserRole(null);
          setIsRoleFetched(true);
        }
      } catch (error) {
        console.error('Error in auth setup:', error);
        if (mounted) {
          setIsRoleFetched(true);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    setupAuth();

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
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
