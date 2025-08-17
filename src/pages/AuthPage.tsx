import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from '@/contexts/AuthContext';
import { useEmailVerification } from '@/hooks/useEmailVerification';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'verify'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const { user, signUp, signIn, resetPassword, verifyEmail } = useAuth();
  const { sendVerificationEmail } = useEmailVerification();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for verification token in URL
    const params = new URLSearchParams(location.search);
    const verifyToken = params.get('verify');
    const urlMode = params.get('mode');
    
    if (verifyToken) {
      setMode('verify');
      handleEmailVerification(verifyToken);
    } else if (urlMode === 'reset-password') {
      setMode('signin');
      setMessage('Please enter your new password');
    }

    // Redirect authenticated users
    if (user && !verifyToken) {
      navigate('/');
    }
  }, [user, navigate, location]);

  const handleEmailVerification = async (token: string) => {
    setLoading(true);
    setMessage('Verifying your email address...');
    
    try {
      const result = await verifyEmail(token);
      if (result.success) {
        setMessage('Email verified successfully! You can now sign in.');
        setTimeout(() => {
          setMode('signin');
          navigate('/auth', { replace: true });
        }, 2000);
      } else {
        setMessage('Email verification failed. The link may be expired or invalid.');
      }
    } catch (error) {
      setMessage('Email verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Input validation
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setMessage('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      if (mode === 'signup') {
        // Sanitize display name
        const sanitizedDisplayName = displayName.trim().substring(0, 50);
        
        const { data, error } = await signUp(email, password, {
          display_name: sanitizedDisplayName || email.split('@')[0]
        });

        if (error) throw error;

        if (data?.user) {
          setMessage('Account created! Please check your email to verify your account before signing in.');
          setTimeout(() => setMode('signin'), 3000);
        }
      } else {
        const { data, error } = await signIn(email, password);
        if (error) throw error;
        
        if (data?.user) {
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Handle specific error cases
      if (error.message?.includes('Invalid login credentials')) {
        setMessage('Invalid email or password. Please try again.');
      } else if (error.message?.includes('Email not verified')) {
        setMessage('Please verify your email address before signing in.');
      } else if (error.message?.includes('User already registered')) {
        setMessage('An account with this email already exists. Please sign in instead.');
        setMode('signin');
      } else {
        setMessage(error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email address first');
      return;
    }

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please enter your email address first');
      return;
    }

    setLoading(true);
    try {
      await sendVerificationEmail(email, ''); // Will need user ID - this is simplified
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setMessage('Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {loading ? (
              <div className="space-y-4">
                <div className="animate-spin mx-auto h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p>{message}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className={message.includes('successfully') ? 'text-green-600' : 'text-red-600'}>
                  {message}
                </p>
                {!message.includes('successfully') && (
                  <Button 
                    onClick={() => window.location.href = '/auth'}
                    variant="outline"
                  >
                    Back to Sign In
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {mode === 'signup' 
              ? 'Sign up to start your quantum computing journey' 
              : 'Sign in to your QOSim account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
            
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name (Optional)</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  maxLength={50}
                  autoComplete="name"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              />
            </div>
            
            {message && (
              <Alert className={message.includes('success') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <AlertDescription className={message.includes('success') ? 'text-green-800' : 'text-red-800'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Please wait...' : (mode === 'signup' ? 'Create Account' : 'Sign In')}
            </Button>
          </form>
          
          <div className="mt-4 space-y-2">
            {mode === 'signin' && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={handleForgotPassword}
                disabled={loading}
                className="w-full"
              >
                Forgot Password?
              </Button>
            )}
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup');
                setMessage('');
              }}
              className="w-full"
            >
              {mode === 'signup' 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"
              }
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
