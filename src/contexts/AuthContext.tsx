
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth event:', event, 'User:', newSession?.user?.email || 'No user');
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Clear role cache on sign out
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem('cached_user_role');
          localStorage.removeItem('cached_user_id');
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log('Getting initial session:', initialSession?.user?.email || 'No session');
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });
      
      if (error) throw error;
      toast.success('Registration successful! Check your email to confirm your account.');
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      console.log('Starting GitHub sign in process');
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error signing in with GitHub:', error);
      toast.error(error.message || 'Error signing in with GitHub');
      throw error;
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      console.log('Starting LinkedIn sign in process');
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo,
        },
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error signing in with LinkedIn:', error);
      toast.error(error.message || 'Error signing in with LinkedIn');
      throw error;
    }
  };

  // New function for magic link authentication
  const signInWithMagicLink = async (email: string) => {
    try {
      console.log('Starting Magic Link sign in process');
      const redirectTo = `${window.location.origin}/auth/callback`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Magic link sent! Check your email to continue.');
    } catch (error: any) {
      console.error('Error sending magic link:', error);
      toast.error(error.message || 'Error sending magic link');
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGithub,
    signInWithLinkedIn,
    signInWithMagicLink,
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
