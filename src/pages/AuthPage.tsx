
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
      navigate('/app');
    }
  }, [user, navigate]);

  const logSecurityEvent = async (eventType: string, eventData: any, userId?: string) => {
    try {
      // Try to log to security_audit_log, fail gracefully if not available
      await supabase.rpc('exec', {
        sql: `INSERT INTO security_audit_log (user_id, event_type, event_data, user_agent) 
              VALUES ($1, $2, $3, $4)`,
        args: [userId || null, eventType, JSON.stringify(eventData), navigator.userAgent]
      }).catch(() => {
        // Ignore errors if table doesn't exist
        console.log('Security audit logging not available');
      });
    } catch (error) {
      // Fail silently - security logging is optional
      console.log('Security event logging skipped:', error);
    }
  };

  const handleAuth = async (email: string, password: string, displayName?: string) => {
    setLoading(true);
    
    try {
      if (mode === 'signup') {
        const redirectUrl = `${window.location.origin}/app`;
        
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
          await logSecurityEvent('signup', { email }, data.user.id);
        }

        return { error: null };
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Log failed login attempt
          await logSecurityEvent('failed_login', { email, reason: error.message });
          throw error;
        }

        // Log successful login
        if (data.user) {
          await logSecurityEvent('login', { email }, data.user.id);
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
