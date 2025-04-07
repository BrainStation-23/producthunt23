
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchUserRole } from './roleService';
import { UserRole } from './types';

export const signIn = async (email: string, password: string): Promise<UserRole> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    const signInUser = data.user;
    
    if (signInUser) {
      const role = await fetchUserRole(signInUser.id);
      return role;
    }
    
    return 'user';
  } catch (error: any) {
    console.error('Error signing in:', error);
    toast.error(error.message || 'Error signing in');
    throw error;
  }
};

export const signUp = async (email: string, password: string, userData?: any): Promise<void> => {
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

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    console.error('Error signing out:', error);
    toast.error(error.message || 'Error signing out');
    throw error;
  }
};

export const signInWithGithub = async (): Promise<void> => {
  try {
    console.log('Starting GitHub sign in process');
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log('Redirect URL:', redirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectTo,
      },
    });
    
    if (error) {
      console.error('GitHub OAuth error:', error);
      throw error;
    }
    
    console.log('GitHub OAuth initiated, URL:', data?.url);
  } catch (error: any) {
    console.error('Error signing in with GitHub:', error);
    toast.error(error.message || 'Error signing in with GitHub');
    throw error;
  }
};

export const signInWithLinkedIn = async (): Promise<void> => {
  try {
    console.log('Starting LinkedIn sign in process');
    const redirectTo = `${window.location.origin}/auth/callback`;
    console.log('Redirect URL:', redirectTo);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'linkedin_oidc',
      options: {
        redirectTo: redirectTo,
      },
    });
    
    if (error) {
      console.error('LinkedIn OAuth error:', error);
      throw error;
    }
    
    console.log('LinkedIn OAuth initiated, URL:', data?.url);
  } catch (error: any) {
    console.error('Error signing in with LinkedIn:', error);
    toast.error(error.message || 'Error signing in with LinkedIn');
    throw error;
  }
};
