import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Eye, EyeOff, Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGithub, userRole } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast.success('Successfully logged in');
      
      // Wait a moment for userRole to be set
      setTimeout(() => {
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }, 500);
      
    } catch (error: any) {
      console.error('Login error:', error);
      // Error is already handled in the useAuth hook
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await signInWithGithub();
    } catch (error: any) {
      console.error('GitHub login error:', error);
      // Error is already handled in the useAuth hook
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-muted-foreground">
          Enter your email and password to access your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="rounded-md"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="rounded-md pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        
        <Button type="submit" className="w-full rounded-md" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </Button>
      </form>
      
      <div className="flex items-center space-x-2">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>
      
      <Button variant="outline" className="w-full rounded-md" type="button" onClick={handleGithubLogin}>
        <Github className="mr-2 h-4 w-4" />
        Continue with GitHub
      </Button>
      
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/register" className="underline text-primary hover:text-primary/90">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
