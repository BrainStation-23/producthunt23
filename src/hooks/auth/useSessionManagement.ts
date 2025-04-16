
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useSessionManagement = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    
    const setupAuthListener = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      console.log('Getting initial session:', initialSession?.user?.email || 'No session');
      
      if (!mounted) return;
      
      if (initialSession?.user?.app_metadata?.disabled) {
        console.log('User is disabled, signing out');
        await handleDisabledUser();
        return;
      }
      
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('Auth event:', event, 'User:', newSession?.user?.email || 'No user');
          
          if (!mounted) return;
          
          if (newSession?.user?.app_metadata?.disabled) {
            console.log('User is disabled, signing out');
            await handleDisabledUser();
            return;
          }
          
          setSession(newSession);
          setUser(newSession?.user ?? null);
        }
      );
      
      return subscription;
    };

    const handleDisabledUser = async () => {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      toast.error('Your account has been suspended. Please contact an administrator.');
      navigate('/login');
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
    setSession,
    setUser,
  };
};
