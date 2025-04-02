
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { UserRole } from '@/types/auth';
import { useUserRole } from './useUserRole';

export const useAuthSession = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchUserRole } = useUserRole();

  useEffect(() => {
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, 'User:', session?.user?.email || 'No user');
        
        // Check if user is disabled through app_metadata
        if (session?.user?.app_metadata?.disabled) {
          console.log('User is disabled, signing out');
          // Don't update state yet, handle in the signOut call
          supabase.auth.signOut().then(() => {
            setSession(null);
            setUser(null);
            setUserRole(null);
            toast.error('Your account has been suspended. Please contact an administrator.');
            navigate('/login');
          });
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to prevent recursive calls
          setTimeout(() => {
            fetchUserRole(session.user.id).then(role => {
              setUserRole(role);
              setIsLoading(false);
            });
          }, 0);
        } else {
          setUserRole(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Getting initial session:', session?.user?.email || 'No session');
      
      // Check if user is disabled through app_metadata
      if (session?.user?.app_metadata?.disabled) {
        console.log('User is disabled, signing out');
        supabase.auth.signOut().then(() => {
          setSession(null);
          setUser(null);
          setUserRole(null);
          toast.error('Your account has been suspended. Please contact an administrator.');
          navigate('/login');
        });
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id).then(role => {
          setUserRole(role);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, fetchUserRole]);

  return {
    session,
    user,
    userRole,
    isLoading,
    setSession,
    setUser,
    setUserRole
  };
};
