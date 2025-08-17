
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create/update profile when user signs in
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(() => {
            createUserProfile(session.user);
          }, 0);
        }

        // Handle email confirmation
        if (event === 'TOKEN_REFRESHED' && session?.user?.email_confirmed_at) {
          // User has confirmed their email, redirect to main app
          window.location.href = 'https://qosim.app/app';
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createUserProfile = async (user: User) => {
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!existingProfile) {
        await supabase.from('profiles').insert({
          user_id: user.id,
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0],
          avatar_url: user.user_metadata?.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  };

  const sendCustomVerificationEmail = async (email: string, token: string) => {
    try {
      const response = await supabase.functions.invoke('send-verification-email', {
        body: {
          email,
          token,
          redirectUrl: 'https://qosim.app/auth',
        },
      });

      if (response.error) {
        throw new Error('Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending custom verification email:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    // First, sign up without email confirmation to get the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://qosim.app/auth',
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      return { error };
    }

    // If signup was successful, send our custom verification email
    if (data.user && !data.user.email_confirmed_at) {
      try {
        // Generate a custom verification token
        const verificationToken = crypto.randomUUID();
        
        // Send custom verification email
        await sendCustomVerificationEmail(email, verificationToken);
        
        return { 
          error: null,
          message: 'Account created! Please check your email to verify your account, then return to sign in.' 
        };
      } catch (emailError) {
        console.error('Custom email error:', emailError);
        return { error: null };
      }
    }

    return { error };
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Attempt global sign out
      await supabase.auth.signOut({ scope: 'global' });
    } catch (error) {
      // Continue even if sign out fails
      console.error('Sign out error:', error);
    } finally {
      // Always redirect to qosim.app for clean state
      window.location.href = 'https://qosim.app';
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
