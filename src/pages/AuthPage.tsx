
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, CheckCircle, Info, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check for verification success
    const verified = searchParams.get('verified');
    const message = searchParams.get('message');
    
    if (verified === 'true') {
      setSuccess('Your email has been verified! You can now sign in with your credentials.');
      setActiveTab('signin');
    } else if (message) {
      setSuccess(decodeURIComponent(message));
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const { error } = await signIn(email, password);
    
    if (error) {
      if (error.message.includes('Email not confirmed')) {
        setError('Please check your email and click the verification link before signing in. Check your spam folder if you don\'t see the email.');
      } else if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else {
        setError(error.message);
      }
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await signUp(email, password, displayName);
    
    if (result.error) {
      if (result.error.message.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
        setActiveTab('signin');
      } else {
        setError(result.error.message);
      }
    } else {
      setSuccess('Account created successfully! Please check your email for a verification link. You must verify your email before you can sign in.');
      // Clear form
      setEmail('');
      setPassword('');
      setDisplayName('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-quantum-void flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-8 h-8 text-quantum-glow particle-animation" />
            <h1 className="text-2xl font-bold text-quantum-glow">Quantum OS</h1>
          </div>
          <p className="text-quantum-neon font-mono">Enter the quantum realm</p>
        </div>

        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-glow">Access Your Workspace</CardTitle>
            <CardDescription className="text-quantum-neon">
              Sign in to save and sync your quantum circuits across devices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {error && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertDescription className="text-red-400">{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-500/50 bg-green-500/10">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">{success}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="quantum-panel"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="quantum-panel"
                      placeholder="Enter your password"
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-quantum-neon">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      className="text-quantum-glow hover:underline"
                    >
                      Sign up here
                    </button>
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <Alert className="border-blue-500/50 bg-blue-500/10">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-400">
                    After signing up, you'll receive a verification email. You must verify your email before you can sign in.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <Label htmlFor="signup-name">Display Name (Optional)</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="quantum-panel"
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="quantum-panel"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="quantum-panel"
                      placeholder="Create a password"
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Creating account...' : 'Sign Up'}
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-quantum-neon">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('signin')}
                      className="text-quantum-glow hover:underline"
                    >
                      Sign in here
                    </button>
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
