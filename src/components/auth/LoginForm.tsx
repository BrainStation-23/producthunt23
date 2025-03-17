
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { signIn, signInWithGithub, user, userRole, isLoading } = useAuth();

  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    if (user && userRole && !isLoading) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from);
      } else if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    }
  }, [user, userRole, isLoading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setLoading(true);
    
    try {
      const role = await signIn(email, password);
      toast.success('Successfully logged in');
      
      // Redirection will happen in the useEffect above
      console.log('Login successful, user role:', role);
    } catch (error: any) {
      console.error('Login error:', error);
      setLoading(false); // Reset loading state on error
    }
  };

  const handleGithubLogin = async () => {
    if (loading) return; // Prevent multiple clicks
    
    setLoading(true);
    try {
      await signInWithGithub();
    } catch (error: any) {
      console.error('GitHub login error:', error);
      setLoading(false);
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
            disabled={loading || isLoading}
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
              disabled={loading || isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading || isLoading}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
        
        <Button type="submit" className="w-full rounded-md" disabled={loading || isLoading}>
          {loading || isLoading ? "Logging in..." : "Log in"}
        </Button>
      </form>
      
      <div className="flex items-center space-x-2">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>
      
      <Button 
        variant="outline" 
        className="w-full rounded-md" 
        type="button" 
        onClick={handleGithubLogin}
        disabled={loading || isLoading}
      >
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
