
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Github } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client'; // Added this import

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGithub } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      toast.error('Please accept the terms and conditions to continue.');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: name,
          },
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Registration successful! Please check your email to confirm your account.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setLoading(true);
      await signInWithGithub();
    } catch (error: any) {
      console.error('GitHub login error:', error);
      toast.error(error.message || 'GitHub login failed.');
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-sm space-y-6 animate-fade-in">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an account</h1>
        <p className="text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Username</Label>
          <Input
            id="name"
            type="text"
            placeholder="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="username"
            className="rounded-md"
          />
        </div>
        
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
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
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={acceptTerms} 
            onCheckedChange={(checked) => setAcceptTerms(checked as boolean)} 
          />
          <label
            htmlFor="terms"
            className="text-sm text-muted-foreground"
          >
            I agree to the{" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </label>
        </div>
        
        <Button type="submit" className="w-full rounded-md" disabled={loading || !acceptTerms}>
          {loading ? "Creating account..." : "Create account"}
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
        Already have an account?{" "}
        <Link to="/login" className="underline text-primary hover:text-primary/90">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
