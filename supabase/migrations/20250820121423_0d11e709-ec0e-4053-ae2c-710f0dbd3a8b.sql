
-- Add privacy-related columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS privacy_level TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS allow_profile_search BOOLEAN DEFAULT true;

-- Create security_audit_log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB NOT NULL DEFAULT '{}',
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to security_audit_log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own security logs
CREATE POLICY "Users can view their own security logs" 
  ON public.security_audit_log 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own security logs
CREATE POLICY "Users can create their own security logs" 
  ON public.security_audit_log 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at);
