
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { UserRole } from '@/types/auth';

export const useAuthMethods = (
  setUser: React.Dispatch<React.SetStateAction<any>>,
  setSession: React.Dispatch<React.SetStateAction<any>>,
  setUserRole: React.Dispatch<React.SetStateAction<UserRole>>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string): Promise<UserRole> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      const signInUser = data.user;
      setUser(signInUser);
      
      if (signInUser) {
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', signInUser.id)
          .single();
          
        if (roleError) {
          console.error('Error fetching user role:', roleError);
          setUserRole('user');
          return 'user';
        } else {
          const role = roleData?.role as UserRole || 'user';
          setUserRole(role);
          return role;
        }
      }
      
      return 'user'; // Default
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Error signing in');
      throw error;
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      setUserRole(null);
      
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error(error.message || 'Error signing out');
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGithub = async () => {
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

  return {
    signIn,
    signUp,
    signOut,
    signInWithGithub,
    isLoading
  };
};
