import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type UserRole = 'admin' | 'user' | 'judge' | null;

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRole;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<UserRole>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // This is the only place where we fetch the user's role
  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching role for user ID:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return 'user' as UserRole;
      } else {
        console.log('User role from database:', data?.role);
        return (data?.role as UserRole) || 'user';
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error);
      return 'user' as UserRole;
    }
  };

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

  const updateSocialProfileLinks = async (user: User) => {
    try {
      const provider = user.app_metadata?.provider;
      const identities = user.identities || [];
      
      if (!provider || identities.length === 0) return;
      
      let socialData: Record<string, string> = {};
      let verifiedSocials: string[] = [];
      
      // Extract information based on the provider
      if (provider === 'github') {
        const identity = identities.find(id => id.provider === 'github');
        if (identity?.identity_data) {
          const githubUsername = identity.identity_data.user_name || identity.identity_data.preferred_username;
          if (githubUsername) {
            socialData.github = `https://github.com/${githubUsername}`;
            verifiedSocials.push('github');
          }
        }
      } else if (provider === 'linkedin_oidc') {
        const identity = identities.find(id => id.provider === 'linkedin_oidc');
        if (identity?.identity_data?.sub) {
          // LinkedIn doesn't provide the username directly in the identity data
          // We'll use the sub as a unique identifier
          socialData.linkedin = `https://linkedin.com/in/${identity.identity_data.preferred_username || 'profile'}`;
          verifiedSocials.push('linkedin');
        }
      } else if (provider === 'twitter') {
        const identity = identities.find(id => id.provider === 'twitter');
        if (identity?.identity_data) {
          const twitterUsername = identity.identity_data.screen_name;
          if (twitterUsername) {
            socialData.twitter = `https://twitter.com/${twitterUsername}`;
            verifiedSocials.push('twitter');
          }
        }
      }
      
      if (Object.keys(socialData).length === 0) return;
      
      // Update the profile with the social links and mark them as verified
      const { error } = await supabase
        .from('profiles')
        .update({
          ...socialData,
          verified_socials: verifiedSocials
        })
        .eq('id', user.id);
      
      if (error) {
        console.error('Error updating social profile links:', error);
      } else {
        console.log('Updated social profiles:', socialData);
      }
    } catch (error) {
      console.error('Error in updateSocialProfileLinks:', error);
    }
  };

  const signIn = async (email: string, password: string): Promise<UserRole> => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      const signInUser = data.user;
      
      if (signInUser) {
        const role = await fetchUserRole(signInUser.id);
        setUserRole(role);
        return role;
      }
      
      return 'user';
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

  const signInWithLinkedIn = async () => {
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
