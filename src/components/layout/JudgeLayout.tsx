
import React from 'react';
import { Outlet } from 'react-router-dom';
import JudgeHeader from '../judge/layout/JudgeHeader';
import JudgeSidebar from '../judge/layout/JudgeSidebar';
import { Toaster } from '../ui/sonner';

const JudgeLayout: React.FC = () => {
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
