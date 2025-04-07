
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
    
    const setupAuthListener = async () => {
      setIsLoading(true);
      
      // First get the current session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      console.log('Getting initial session:', initialSession?.user?.email || 'No session');
      
      if (!mounted) return;
      
      // Handle disabled users for initial session
      if (initialSession?.user?.app_metadata?.disabled) {
        console.log('User is disabled, signing out');
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setUserRole(null);
        setIsLoading(false);
        setIsRoleFetched(true);
        toast.error('Your account has been suspended. Please contact an administrator.');
        navigate('/login');
        return;
      }
      
      // Set initial session and user
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      // Fetch role for initial session only if we have a user
      if (initialSession?.user) {
        try {
          console.log('Fetching initial role for:', initialSession.user.id);
          const role = await fetchUserRole(initialSession.user.id);
          if (mounted) {
            console.log('Setting initial user role:', role);
            setUserRole(role);
            setIsRoleFetched(true);
          }
        } catch (error) {
          console.error('Error fetching initial user role:', error);
          if (mounted) {
            setUserRole('user');
            setIsRoleFetched(true);
          }
        }
      } else {
        // No user in session, so no role
        setUserRole(null);
        setIsRoleFetched(true);
      }
      
      if (mounted) {
        setIsLoading(false);
      }
      
      // Then set up auth state listener for future changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth event:', event, 'User:', newSession?.user?.email || 'No user');
          
          if (!mounted) return;
          
          // Reset role fetched flag on auth changes
          if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) {
            setIsRoleFetched(false);
          }
          
          // Handle disabled users
          if (newSession?.user?.app_metadata?.disabled) {
            console.log('User is disabled, signing out');
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setUserRole(null);
            setIsLoading(false);
            setIsRoleFetched(true);
            toast.error('Your account has been suspended. Please contact an administrator.');
            navigate('/login');
            return;
          }
          
          // Update session and user state
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Handle social profile updates on sign-in
          if (event === 'SIGNED_IN' && newSession?.user?.app_metadata?.provider) {
            // Use setTimeout to avoid blocking the auth flow
            setTimeout(() => {
              updateSocialProfileLinks(newSession.user);
            }, 0);
          }
          
          // If we have a new user session, fetch their role
          if (newSession?.user && ['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
            try {
              console.log('Fetching role after auth change for:', newSession.user.id);
              const role = await fetchUserRole(newSession.user.id);
              if (mounted) {
                console.log('Setting updated user role:', role);
                setUserRole(role);
                setIsRoleFetched(true);
              }
            } catch (error) {
              console.error('Error fetching updated user role:', error);
              if (mounted) {
                setUserRole('user');
                setIsRoleFetched(true);
              }
            }
          } else if (!newSession?.user && event === 'SIGNED_OUT') {
            // No user, so no role
            if (mounted) {
              setUserRole(null);
              setIsRoleFetched(true);
            }
          }
          
          if (mounted) {
            setIsLoading(false);
          }
        }
      );
      
      return subscription;
    };
    
    const subscription = setupAuthListener();
    
    return () => {
      mounted = false;
      // Clean up the subscription when component unmounts
      subscription.then(sub => sub?.unsubscribe());
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
