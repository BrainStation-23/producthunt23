
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuthMethods } from '@/hooks/useAuthMethods';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    session,
    user,
    userRole,
    isLoading: sessionLoading,
    setSession,
    setUser,
    setUserRole
  } = useAuthSession();

  const {
    signIn,
    signUp,
    signOut,
    signInWithGithub,
    isLoading: authLoading
  } = useAuthMethods(setUser, setSession, setUserRole);

  const isLoading = sessionLoading || authLoading;

  const value = {
    session,
    user,
    userRole,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithGithub,
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
