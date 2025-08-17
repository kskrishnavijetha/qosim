
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useEmailVerification() {
  const [loading, setLoading] = useState(false);

  const sendVerificationEmail = useCallback(async (email: string, userId: string) => {
    setLoading(true);
    try {
      // Use Supabase's built-in email confirmation resend
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?confirmed=true`
        }
      });

      if (error) throw error;

      toast.success('Verification email sent! Please check your inbox.');
      return { success: true };
    } catch (error: any) {
      console.error('Error sending verification email:', error);
      toast.error('Failed to send verification email');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyEmail = useCallback(async (token: string) => {
    setLoading(true);
    try {
      // Use Supabase's built-in email verification
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      if (error) throw error;

      toast.success('Email verified successfully!');
      return { success: true, userId: data.user?.id };
    } catch (error: any) {
      console.error('Error verifying email:', error);
      toast.error('Email verification failed');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    sendVerificationEmail,
    verifyEmail
  };
}
