
-- Phase 1: Create secure infrastructure for API keys and credentials
CREATE TABLE public.user_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  encrypted_credentials BYTEA NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service_name)
);

-- Enable RLS for user credentials
ALTER TABLE public.user_credentials ENABLE ROW LEVEL SECURITY;

-- Users can only access their own credentials
CREATE POLICY "Users can manage their own credentials" 
  ON public.user_credentials 
  FOR ALL 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Phase 2: Fix profile data exposure - restrict profile visibility
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public profiles only" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() IS NOT NULL AND 
    (user_id = auth.uid() OR 
     EXISTS (SELECT 1 FROM public.community_profiles cp WHERE cp.user_id = profiles.user_id))
  );

-- Phase 3: Add privacy settings to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS privacy_level TEXT DEFAULT 'private';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS allow_profile_search BOOLEAN DEFAULT false;

-- Create enum for privacy levels
DO $$ BEGIN
  CREATE TYPE profile_privacy_level AS ENUM ('private', 'friends', 'public');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public.profiles ALTER COLUMN privacy_level TYPE profile_privacy_level USING privacy_level::profile_privacy_level;
ALTER TABLE public.profiles ALTER COLUMN privacy_level SET DEFAULT 'private'::profile_privacy_level;

-- Update profile policies with privacy controls
DROP POLICY IF EXISTS "Users can view public profiles only" ON public.profiles;

CREATE POLICY "Users can view profiles based on privacy" 
  ON public.profiles 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    (auth.uid() IS NOT NULL AND privacy_level = 'public'::profile_privacy_level) OR
    (auth.uid() IS NOT NULL AND privacy_level = 'friends'::profile_privacy_level AND 
     EXISTS (SELECT 1 FROM public.user_follows WHERE following_id = profiles.user_id AND follower_id = auth.uid()))
  );

-- Phase 4: Fix database function security - update search paths
CREATE OR REPLACE FUNCTION public.get_student_email_if_authorized(student_id uuid, classroom_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_email TEXT;
BEGIN
  -- Only return email if requester is the student themselves or an authorized educator
  IF auth.uid() = student_id THEN
    SELECT email INTO user_email FROM auth.users WHERE id = student_id;
    RETURN user_email;
  ELSIF EXISTS (
    SELECT 1 FROM public.classrooms c 
    JOIN public.educator_profiles ep ON c.educator_id = ep.id
    WHERE c.id = classroom_id AND ep.user_id = auth.uid()
  ) THEN
    SELECT email INTO user_email FROM auth.users WHERE id = student_id;
    RETURN user_email;
  ELSE
    RETURN NULL;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_classroom_enrollments_safe(target_classroom_id uuid DEFAULT NULL::uuid)
RETURNS TABLE(id uuid, classroom_id uuid, student_user_id uuid, enrollment_date timestamp with time zone, is_active boolean, student_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    se.id,
    se.classroom_id,
    se.student_user_id,
    se.enrollment_date,
    se.is_active,
    p.display_name AS student_name
  FROM public.student_enrollments se
  LEFT JOIN public.profiles p ON p.user_id = se.student_user_id
  WHERE (target_classroom_id IS NULL OR se.classroom_id = target_classroom_id)
    AND (
      -- Allow if user is the student themselves
      auth.uid() = se.student_user_id
      OR
      -- Allow if user is an educator for this classroom
      EXISTS (
        SELECT 1 FROM public.classrooms c
        JOIN public.educator_profiles ep ON c.educator_id = ep.id
        WHERE c.id = se.classroom_id 
        AND ep.user_id = auth.uid()
      )
    );
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'display_name');
  RETURN NEW;
END;
$function$;

-- Add audit logging for security events
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs" 
  ON public.security_audit_log 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs" 
  ON public.security_audit_log 
  FOR INSERT 
  WITH CHECK (true);
