
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

interface MainLayoutProps {
  isLoggedIn?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ isLoggedIn = false }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
