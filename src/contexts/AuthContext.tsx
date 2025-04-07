
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
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    const setupAuthListener = async () => {
      setIsLoading(true);
      
      // Set up auth state listener first
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth event:', event, 'User:', newSession?.user?.email || 'No user');
          
          if (!mounted) return;
          
          // Handle disabled users
          if (newSession?.user?.app_metadata?.disabled) {
            console.log('User is disabled, signing out');
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setUserRole(null);
            setIsLoading(false);
            toast.error('Your account has been suspended. Please contact an administrator.');
            navigate('/login');
            return;
          }
          
          // Update session and user state
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // If we have a new user session, fetch their role
          if (newSession?.user) {
            if (event === 'SIGNED_IN' && newSession.user.app_metadata?.provider) {
              setTimeout(() => {
                updateSocialProfileLinks(newSession.user);
              }, 0);
            }
            
            // Fetch user role only when signed in or session changed
            if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED'].includes(event)) {
              const role = await fetchUserRole(newSession.user.id);
              if (mounted) {
                setUserRole(role);
              }
            }
          } else {
            // No user, so no role
            if (mounted) {
              setUserRole(null);
            }
          }
          
          if (mounted) {
            setIsLoading(false);
          }
        }
      );
      
      // Then check for existing session
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      console.log('Getting initial session:', initialSession?.user?.email || 'No session');
      
      if (!mounted) return;
      
      if (initialSession?.user?.app_metadata?.disabled) {
        console.log('User is disabled, signing out');
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setUserRole(null);
        setIsLoading(false);
        toast.error('Your account has been suspended. Please contact an administrator.');
        navigate('/login');
        return;
      }
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      // Get the role for the initial session
      if (initialSession?.user) {
        const role = await fetchUserRole(initialSession.user.id);
        if (mounted) {
          setUserRole(role);
        }
      }
      
      if (mounted) {
        setIsLoading(false);
      }
      
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
      const role = await authSignIn(email, password);
      setUserRole(role);
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
