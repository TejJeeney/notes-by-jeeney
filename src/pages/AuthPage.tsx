
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Lock, Eye, EyeOff, Sparkles, BookOpen, PenTool, Stars, Zap } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-rose-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced animated background with glassmorphism */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/30 to-pink-500/30 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 rounded-full blur-2xl animate-bounce"></div>
        
        {/* Floating glass orbs */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-white/5 backdrop-blur-lg rounded-full border border-white/10 animate-float animation-delay-1000"></div>
      </div>

      {/* Floating magical elements */}
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles className="absolute top-32 left-16 w-6 h-6 text-cyan-300/60 animate-pulse" />
        <Stars className="absolute top-1/4 right-20 w-8 h-8 text-purple-300/60 animate-spin" style={{ animationDuration: '8s' }} />
        <Zap className="absolute bottom-32 left-20 w-5 h-5 text-pink-300/60 animate-bounce" />
        <BookOpen className="absolute bottom-20 right-16 w-7 h-7 text-blue-300/60 animate-float" />
      </div>

      {/* Main glass card */}
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-105 hover:bg-white/15">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="flex items-center justify-center space-x-3 mb-6 group">
            <div className="p-3 bg-gradient-to-r from-cyan-500/80 to-purple-500/80 backdrop-blur-lg rounded-2xl group-hover:from-cyan-400 group-hover:to-purple-400 transition-all duration-500 group-hover:scale-110 border border-white/30">
              <PenTool className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-200 bg-clip-text text-transparent hover:from-cyan-100 hover:to-purple-100 transition-all duration-500">
              FunPaw
            </CardTitle>
          </div>
          <CardDescription className="text-white/80 text-lg hover:text-white/90 transition-colors duration-300">
            {isSignUp ? 'Join the magical AI experience' : 'Welcome back to the future'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90 font-medium">Email</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 h-5 w-5 text-white/60 group-hover:text-cyan-300 transition-colors duration-300" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-12 bg-white/10 backdrop-blur-lg border border-white/30 text-white placeholder:text-white/50 focus:border-cyan-400/50 focus:bg-white/15 hover:bg-white/15 transition-all duration-300 rounded-xl"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90 font-medium">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-4 h-5 w-5 text-white/60 group-hover:text-purple-300 transition-colors duration-300" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-12 bg-white/10 backdrop-blur-lg border border-white/30 text-white placeholder:text-white/50 focus:border-purple-400/50 focus:bg-white/15 hover:bg-white/15 transition-all duration-300 rounded-xl"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-white/60 hover:text-white transition-all duration-300 hover:scale-110"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-400/30 bg-red-500/10 backdrop-blur-lg animate-shake">
                <AlertDescription className="text-red-200">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Glass Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-cyan-500/80 to-purple-500/80 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold backdrop-blur-lg border border-white/30 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 active:scale-95 rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isSignUp ? 'Creating Magic...' : 'Entering Portal...'}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-white/80 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
              disabled={loading}
            >
              <span className="relative z-10">
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </span>
              <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-2"></div>
            </button>
          </div>

          <div className="p-4 bg-blue-500/10 backdrop-blur-lg rounded-xl border border-blue-400/30 hover:bg-blue-500/15 transition-colors duration-300">
            <p className="text-sm text-blue-200 text-center flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              Your data is protected with future-grade security
            </p>
          </div>

          {/* Made with love by JEENEY */}
          <div className="text-center">
            <p className="text-sm text-white/60">
              Made with love by{' '}
              <span className="bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent font-bold animate-pulse hover:animate-bounce transition-all duration-300">
                JEENEY
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
