
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from '@/components/ThemeToggle';
import { FileText, Mail, Lock, User, ArrowRight, Sparkles, Phone, Star, Zap, Heart } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (authMethod === 'phone') {
      // For now, we'll simulate phone auth with email format
      const emailFromPhone = `${phoneNumber.replace(/\D/g, '')}@phone.auth`;
      const { error } = await signIn(emailFromPhone, password);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back!');
      }
    } else {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back!');
      }
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (authMethod === 'phone') {
      // For now, we'll simulate phone auth with email format
      const emailFromPhone = `${phoneNumber.replace(/\D/g, '')}@phone.auth`;
      const { error } = await signUp(emailFromPhone, password);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! Please check your phone for verification.');
      }
    } else {
      const { error } = await signUp(email, password);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Account created! Please check your email to verify your account.');
      }
    }
    
    setLoading(false);
  };

  // Floating animation elements
  const floatingElements = Array.from({ length: 12 }, (_, i) => (
    <div
      key={i}
      className={`absolute animate-bounce opacity-20 dark:opacity-10 text-indigo-500 dark:text-purple-400 ${
        i % 4 === 0 ? 'animate-pulse' : 
        i % 4 === 1 ? 'animate-ping' : 
        i % 4 === 2 ? 'animate-spin' : 'animate-bounce'
      }`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 3}s`
      }}
    >
      {i % 4 === 0 ? <Star className="w-4 h-4" /> :
       i % 4 === 1 ? <Sparkles className="w-3 h-3" /> :
       i % 4 === 2 ? <Zap className="w-3 h-3" /> : <Heart className="w-3 h-3" />}
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 transition-all duration-300 overflow-hidden relative">
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements}
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full blur-3xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full blur-2xl opacity-15 animate-ping" style={{ animationDuration: '4s' }}></div>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl animate-bounce">
            <FileText className="w-10 h-10 text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-scale-in">
            Welcome to Notes
          </h1>
          <p className="text-slate-600 dark:text-slate-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Your beautiful note-taking experience awaits
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-slate-200/60 dark:border-slate-700/60 shadow-2xl animate-scale-in hover:shadow-3xl transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
              <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                Get Started
              </CardTitle>
              <Sparkles className="w-5 h-5 text-purple-500 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} />
            </div>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Sign in to your account or create a new one
            </CardDescription>
            
            {/* Auth method toggle */}
            <div className="mt-4">
              <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <Button
                  type="button"
                  variant={authMethod === 'email' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setAuthMethod('email')}
                  className="flex-1 transition-all duration-200"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button
                  type="button"
                  variant={authMethod === 'phone' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setAuthMethod('phone')}
                  className="flex-1 transition-all duration-200"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin" className="transition-all duration-200 hover:scale-105">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="transition-all duration-200 hover:scale-105">
                  Sign Up
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-auth" className="text-slate-700 dark:text-slate-300">
                      {authMethod === 'email' ? 'Email' : 'Phone Number'}
                    </Label>
                    <div className="relative">
                      {authMethod === 'email' ? (
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      ) : (
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      )}
                      <Input
                        id="signin-auth"
                        type={authMethod === 'email' ? 'email' : 'tel'}
                        placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                        value={authMethod === 'email' ? email : phoneNumber}
                        onChange={(e) => authMethod === 'email' ? setEmail(e.target.value) : setPhoneNumber(e.target.value)}
                        required
                        className="pl-10 bg-slate-50/80 dark:bg-slate-700/80 border-slate-200/60 dark:border-slate-600/60 focus:ring-2 focus:ring-indigo-500/20 transition-all hover:scale-105 focus:scale-105"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 bg-slate-50/80 dark:bg-slate-700/80 border-slate-200/60 dark:border-slate-600/60 focus:ring-2 focus:ring-indigo-500/20 transition-all hover:scale-105 focus:scale-105"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        Sign In
                        <ArrowRight className="w-4 h-4 animate-bounce" style={{ animationDirection: 'alternate' }} />
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-auth" className="text-slate-700 dark:text-slate-300">
                      {authMethod === 'email' ? 'Email' : 'Phone Number'}
                    </Label>
                    <div className="relative">
                      {authMethod === 'email' ? (
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      ) : (
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      )}
                      <Input
                        id="signup-auth"
                        type={authMethod === 'email' ? 'email' : 'tel'}
                        placeholder={authMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                        value={authMethod === 'email' ? email : phoneNumber}
                        onChange={(e) => authMethod === 'email' ? setEmail(e.target.value) : setPhoneNumber(e.target.value)}
                        required
                        className="pl-10 bg-slate-50/80 dark:bg-slate-700/80 border-slate-200/60 dark:border-slate-600/60 focus:ring-2 focus:ring-indigo-500/20 transition-all hover:scale-105 focus:scale-105"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="pl-10 bg-slate-50/80 dark:bg-slate-700/80 border-slate-200/60 dark:border-slate-600/60 focus:ring-2 focus:ring-indigo-500/20 transition-all hover:scale-105 focus:scale-105"
                      />
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating account...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 animate-pulse" />
                        Create Account
                      </div>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          By signing up, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  );
}
