
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './auth/types';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthOperations } from '@/hooks/useAuthOperations';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    session,
    user,
    userRole,
    isRoleFetched,
    setSession,
    setUser,
    setUserRole,
  } = useAuthState();

  const {
    signIn,
    signUp,
    signOut,
    signInWithGithub,
    signInWithLinkedIn,
  } = useAuthOperations(setUser, setSession, setUserRole);

  const value = {
    session,
    user,
    userRole,
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
