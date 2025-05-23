
import { Session, User } from '@supabase/supabase-js';

export type UserRole = 'admin' | 'user' | 'judge' | null;

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRole: UserRole;
  isRoleFetched: boolean;
  signIn: (email: string, password: string) => Promise<UserRole>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithLinkedIn: () => Promise<void>;
}
