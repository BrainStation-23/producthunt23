
import { UserRole } from '@/contexts/auth/types';

export const getDashboardPathForRole = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'judge':
      return '/judge';
    case 'user':
      return '/user';
    default:
      return '/login';
  }
};
