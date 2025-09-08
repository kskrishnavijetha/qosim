
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SecureAuthForm } from '@/components/security/SecureAuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateCSRFToken } from '@/lib/security';

const AuthPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    // Generate CSRF token on component mount
    setCsrfToken(generateCSRFToken());
    
    // Redirect if already authenticated
    if (user) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectPath = urlParams.get('redirect') || '/app';
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const handleAuth = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    
    try {
      if (mode === 'signup') {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('redirect') || '/app';
        const redirectUrl = `${window.location.origin}${redirectPath}`;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              display_name: displayName,
            }
          }
        });

        if (error) throw error;

        // Log security event
        if (data.user) {
          await supabase
            .from('security_audit_log')
            .insert({
              user_id: data.user.id,
              event_type: 'signup',
              event_data: { email },
              ip_address: null, // Will be populated by edge function if needed
              user_agent: navigator.userAgent,
            });
        }

        return { error: null };
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Log failed login attempt
          await supabase
            .from('security_audit_log')
            .insert({
              user_id: null,
              event_type: 'failed_login',
              event_data: { email, reason: error.message },
              ip_address: null,
              user_agent: navigator.userAgent,
            });
          throw error;
        }

        // Log successful login
        if (data.user) {
          await supabase
            .from('security_audit_log')
            .insert({
              user_id: data.user.id,
              event_type: 'login',
              event_data: { email },
              ip_address: null,
              user_agent: navigator.userAgent,
            });
        }

        return { error: null };
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">QoSim</h1>
          <p className="text-muted-foreground">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </CardTitle>
            <CardDescription>
              {mode === 'signin' 
                ? 'Enter your credentials to access your quantum workspace'
                : 'Create an account to start building quantum circuits'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SecureAuthForm
              mode={mode}
              onSubmit={handleAuth}
              loading={loading}
            />
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                disabled={loading}
              >
                {mode === 'signin' 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'
                }
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="text-xs text-center text-muted-foreground space-y-1">
          <p>🔒 Your data is encrypted and secure</p>
          <p>🛡️ Protected by advanced security measures</p>
        </div>

        {/* Hidden CSRF token for additional security */}
        <input type="hidden" name="csrf_token" value={csrfToken} />
      </div>
    </div>
  );
};

export default AuthPage;
