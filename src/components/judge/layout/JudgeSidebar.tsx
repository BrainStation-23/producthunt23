
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ListChecks, 
  User, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const JudgeSidebar: React.FC = () => {
  const { signOut } = useAuth();

  const links = [
    { to: '/judge', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { to: '/judge/evaluations', label: 'Evaluations', icon: <ListChecks className="h-5 w-5" /> },
    { to: '/judge/profile', label: 'Profile', icon: <User className="h-5 w-5" /> },
    { to: '/judge/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Judge Panel</h2>
      </div>
      <nav className="p-3 flex-1">
        <ul className="space-y-1.5">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/judge'}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive 
                      ? "bg-accent text-accent-foreground font-medium" 
                      : "hover:bg-muted text-muted-foreground"
                  )
                }
              >
                {link.icon}
                {link.label}
              </NavLink>
            </li>
          ))}
          <li className="mt-6">
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default JudgeSidebar;
