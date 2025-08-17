
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useEmailVerification() {
  const [loading, setLoading] = useState(false);

  const sendVerificationEmail = useCallback(async (email: string, userId: string) => {
    setLoading(true);
    try {
      // Generate secure token
      const token = crypto.randomUUID() + '-' + Date.now();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      // Store token in database
      const { error: tokenError } = await supabase
        .from('email_verification_tokens')
        .insert({
          user_id: userId,
          token,
          email,
          expires_at: expiresAt.toISOString()
        });

      if (tokenError) throw tokenError;

      // Send email via edge function
      const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
        body: { 
          email, 
          token,
          redirectUrl: `${window.location.origin}/auth?verify=${token}`
        }
      });

      if (emailError) throw emailError;

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
      // Get token from database
      const { data: tokenData, error: fetchError } = await supabase
        .from('email_verification_tokens')
        .select('*')
        .eq('token', token)
        .is('used_at', null)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (fetchError || !tokenData) {
        throw new Error('Invalid or expired verification token');
      }

      // Mark token as used
      const { error: updateError } = await supabase
        .from('email_verification_tokens')
        .update({ used_at: new Date().toISOString() })
        .eq('id', tokenData.id);

      if (updateError) throw updateError;

      // Update user email_confirmed_at in auth.users if needed
      const { error: confirmError } = await supabase.auth.updateUser({
        email_confirm: true
      });

      if (confirmError) {
        console.warn('Could not update email confirmation status:', confirmError);
      }

      toast.success('Email verified successfully!');
      return { success: true, userId: tokenData.user_id };
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
