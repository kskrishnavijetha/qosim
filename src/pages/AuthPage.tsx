import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Mail, Shield, CheckCircle } from 'lucide-react';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword, user, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const mode = searchParams.get('mode');
  const isConfirmed = searchParams.get('confirmed') === 'true';

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Email verified successfully! You can now sign in.');
    }
  }, [isConfirmed]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
      if (error.message.includes('Email not verified')) {
        setVerificationSent(false);
      }
    } else if (data) {
      navigate('/');
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await signUp(email, password, { display_name: displayName });
    
    if (error) {
      setError(error.message);
    } else if (data?.user) {
      setVerificationSent(true);
      toast.success('Account created! Please check your email to verify your account.');
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setResetEmailSent(true);
      toast.success('Password reset email sent!');
    }
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Welcome to QoSim</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          {verificationSent ? (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <Mail className="h-12 w-12 mx-auto text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Check your email</h3>
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification link to {email}
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setVerificationSent(false)} 
                variant="outline" 
                className="w-full"
              >
                Back to sign in
              </Button>
            </div>
          ) : resetEmailSent ? (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <Shield className="h-12 w-12 mx-auto text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Reset link sent</h3>
                  <p className="text-sm text-muted-foreground">
                    Check your email for password reset instructions
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => setResetEmailSent(false)} 
                variant="outline" 
                className="w-full"
              >
                Back to sign in
              </Button>
            </div>
          ) : isConfirmed ? (
            <div className="space-y-4">
              <div className="text-center space-y-4">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
                <div>
                  <h3 className="text-lg font-semibold">Email verified!</h3>
                  <p className="text-sm text-muted-foreground">
                    Your email has been successfully verified. You can now sign in.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/auth')} 
                className="w-full"
              >
                Continue to sign in
              </Button>
            </div>
          ) : (
            <Tabs defaultValue={mode === 'reset-password' ? 'reset' : 'signin'} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="reset">Reset</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input
                      id="display-name"
                      type="text"
                      placeholder="Enter your display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign Up
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset" className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
