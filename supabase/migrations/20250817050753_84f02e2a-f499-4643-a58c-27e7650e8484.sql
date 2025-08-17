
-- Phase 1: Critical Privacy Fixes - Restrict Profile Visibility
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create more secure profile visibility policy - only authenticated users can view profiles
CREATE POLICY "Authenticated users can view profiles" 
  ON public.profiles 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Phase 1: Secure Forum Content - Require authentication for forum access
DROP POLICY IF EXISTS "Anyone can view forum topics" ON public.forum_topics;
DROP POLICY IF EXISTS "Anyone can view forum replies" ON public.forum_replies;

-- Create authenticated-only forum policies
CREATE POLICY "Authenticated users can view forum topics" 
  ON public.forum_topics 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view forum replies" 
  ON public.forum_replies 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Phase 2: Database Security Hardening - Add missing RLS policies for marketplace_item_versions
CREATE POLICY "Users can view item versions for items they can access" 
  ON public.marketplace_item_versions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_items mi 
      WHERE mi.id = marketplace_item_versions.item_id 
      AND (mi.is_published = true OR mi.creator_id = auth.uid())
    )
  );

CREATE POLICY "Item creators can manage their item versions" 
  ON public.marketplace_item_versions 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_items mi 
      WHERE mi.id = marketplace_item_versions.item_id 
      AND mi.creator_id = auth.uid()
    )
  );

-- Add circuit privacy levels enum
CREATE TYPE circuit_privacy_level AS ENUM ('private', 'authenticated_only', 'public');

-- Add privacy level column to circuits with default private
ALTER TABLE public.circuits 
ADD COLUMN IF NOT EXISTS privacy_level circuit_privacy_level DEFAULT 'private';

-- Update existing public circuits to use new privacy system
UPDATE public.circuits 
SET privacy_level = CASE 
  WHEN is_public = true THEN 'public'::circuit_privacy_level
  ELSE 'private'::circuit_privacy_level
END;

-- Drop old public circuit policies and create new privacy-aware ones
DROP POLICY IF EXISTS "Anyone can view public circuits" ON public.circuits;

CREATE POLICY "Users can view circuits based on privacy level" 
  ON public.circuits 
  FOR SELECT 
  USING (
    CASE privacy_level
      WHEN 'private' THEN auth.uid() = user_id
      WHEN 'authenticated_only' THEN auth.uid() IS NOT NULL
      WHEN 'public' THEN true
    END
  );

-- Update database functions with proper search_path
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
    SELECT 1 FROM classrooms c 
    JOIN educator_profiles ep ON c.educator_id = ep.id
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
  FROM student_enrollments se
  LEFT JOIN profiles p ON p.user_id = se.student_user_id
  WHERE (target_classroom_id IS NULL OR se.classroom_id = target_classroom_id)
    AND (
      -- Allow if user is the student themselves
      auth.uid() = se.student_user_id
      OR
      -- Allow if user is an educator for this classroom
      EXISTS (
        SELECT 1 FROM classrooms c
        JOIN educator_profiles ep ON c.educator_id = ep.id
        WHERE c.id = se.classroom_id 
        AND ep.user_id = auth.uid()
      )
    );
$function$;
