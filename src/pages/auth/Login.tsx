
import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-8 flex items-center space-x-2">
        <div className="rounded-full bg-hunt-600 w-8 h-8 flex items-center justify-center">
          <span className="text-white font-bold">P</span>
        </div>
        <span className="font-bold text-xl">ProductHunt</span>
      </Link>
      
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
