
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { UserRole } from '@/contexts/auth/types';
import { fetchUserRole } from '@/contexts/auth/roleService';
import { updateSocialProfileLinks } from '@/contexts/auth/socialService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAuthState = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isRoleFetched, setIsRoleFetched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    const setupAuthListener = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      console.log('Getting initial session:', initialSession?.user?.email || 'No session');
      
      if (!mounted) return;
      
      if (initialSession?.user?.app_metadata?.disabled) {
        console.log('User is disabled, signing out');
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
        setUserRole(null);
        setIsRoleFetched(true);
        toast.error('Your account has been suspended. Please contact an administrator.');
        navigate('/login');
        return;
      }
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
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
        setUserRole(null);
        setIsRoleFetched(true);
      }
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth event:', event, 'User:', newSession?.user?.email || 'No user');
          
          if (!mounted) return;
          
          if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) {
            setIsRoleFetched(false);
          }
          
          if (newSession?.user?.app_metadata?.disabled) {
            console.log('User is disabled, signing out');
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setUserRole(null);
            setIsRoleFetched(true);
            toast.error('Your account has been suspended. Please contact an administrator.');
            navigate('/login');
            return;
          }
          
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          if (event === 'SIGNED_IN' && newSession?.user?.app_metadata?.provider) {
            setTimeout(() => {
              updateSocialProfileLinks(newSession.user);
            }, 0);
          }
          
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
            if (mounted) {
              setUserRole(null);
              setIsRoleFetched(true);
            }
          }
        }
      );
      
      return subscription;
    };
    
    const subscription = setupAuthListener();
    
    return () => {
      mounted = false;
      subscription.then(sub => sub?.unsubscribe());
    };
  }, [navigate]);

  return {
    session,
    user,
    userRole,
    isRoleFetched,
    setSession,
    setUser,
    setUserRole,
  };
};
