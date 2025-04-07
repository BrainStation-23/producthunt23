
import React from 'react';
import { Outlet } from 'react-router-dom';
import JudgeHeader from '../judge/layout/JudgeHeader';
import JudgeSidebar from '../judge/layout/JudgeSidebar';
import { Toaster } from '../ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const JudgeLayout: React.FC = () => {
  const { isLoading, isRoleFetched, userRole } = useAuth();

  if (isLoading || !isRoleFetched) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'judge') {
    if (userRole === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/user" replace />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <JudgeHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <JudgeSidebar />
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </div>
  );
};

export default JudgeLayout;
