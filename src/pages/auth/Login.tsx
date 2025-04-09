
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import { getBrandName, getBrandLogoLetter, getPrimaryColorClass } from '@/config/appConfig';

const Login: React.FC = () => {
  const logoColorClass = getPrimaryColorClass();
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-8 flex items-center space-x-2">
        <div className={`rounded-full ${logoColorClass} w-8 h-8 flex items-center justify-center`}>
          <span className="text-white font-bold">{getBrandLogoLetter()}</span>
        </div>
        <span className="font-bold text-xl">{getBrandName()}</span>
      </Link>
      
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
