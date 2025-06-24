
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles, BookOpen, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateInput = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput()) return;
    
    setLoading(true);
    setError('');

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please try again.');
        } else if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Try signing in instead.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else {
          setError(error.message);
        }
      } else if (isSignUp) {
        setError('');
        setIsSignUp(false);
        alert('Account created! Please check your email for confirmation before signing in.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 hover:scale-110 transition-transform duration-500"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-pulse hover:opacity-80 transition-opacity duration-300"></div>
      </div>

      {/* Enhanced floating icons with hover effects */}
      <div className="absolute inset-0 pointer-events-none">
        <BookOpen className="absolute top-20 left-10 w-8 h-8 text-purple-400 opacity-60 animate-float hover:opacity-100 hover:scale-125 transition-all duration-300" />
        <PenTool className="absolute top-32 right-20 w-6 h-6 text-indigo-400 opacity-60 animate-float animation-delay-1000 hover:opacity-100 hover:scale-125 transition-all duration-300" />
        <Sparkles className="absolute bottom-32 left-16 w-7 h-7 text-pink-400 opacity-60 animate-float animation-delay-2000 hover:opacity-100 hover:scale-125 transition-all duration-300" />
        <Mail className="absolute bottom-20 right-16 w-6 h-6 text-purple-400 opacity-60 animate-float animation-delay-3000 hover:opacity-100 hover:scale-125 transition-all duration-300" />
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-gradient-to-r from-red-400 to-yellow-400 rounded-full opacity-70 animate-bounce"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-400 rounded-full opacity-70 animate-ping"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border-white/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4 group">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg group-hover:from-purple-600 group-hover:to-indigo-600 transition-all duration-300 group-hover:scale-110">
              <BookOpen className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-indigo-700 transition-all duration-300">
              PawNotes
            </CardTitle>
          </div>
          <CardDescription className="text-slate-600 dark:text-slate-300 hover:text-slate-700 dark:hover:text-slate-200 transition-colors duration-300">
            {isSignUp ? 'Create your account to get started' : 'Welcome back! Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-hover:text-purple-500 transition-colors duration-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-400 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 group-hover:text-purple-500 transition-colors duration-300" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9 bg-white/50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 focus:border-purple-400 dark:focus:border-purple-400 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-110"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 animate-shake">
                <AlertDescription className="text-red-600 dark:text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-2.5 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 font-medium transition-all duration-300 hover:scale-105 hover:underline"
              disabled={loading}
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300">
            <p className="text-xs text-blue-600 dark:text-blue-400 text-center">
              🔒 Your data is protected with enterprise-grade security
            </p>
          </div>

          {/* Made with love by JEENEY */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Made with love by{' '}
              <span className="bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent font-bold animate-pulse hover:animate-bounce transition-all duration-300">
                JEENEY
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
