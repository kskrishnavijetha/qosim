
-- Phase 1: Critical RLS Fixes

-- 1. Fix infinite recursion in circuit_collaborators RLS policy
-- First, create a security definer function to check admin permissions
CREATE OR REPLACE FUNCTION public.check_circuit_admin_permission(circuit_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.circuits 
    WHERE id = circuit_id AND user_id = check_circuit_admin_permission.user_id
  ) OR EXISTS (
    SELECT 1 FROM public.circuit_collaborators 
    WHERE circuit_id = check_circuit_admin_permission.circuit_id 
    AND user_id = check_circuit_admin_permission.user_id 
    AND permission_level = 'admin'
  );
$$;

-- Drop the problematic policy and recreate it without recursion
DROP POLICY IF EXISTS "Circuit owners and admins can manage collaborators" ON public.circuit_collaborators;

CREATE POLICY "Circuit owners and admins can manage collaborators"
ON public.circuit_collaborators
FOR ALL
TO authenticated
USING (public.check_circuit_admin_permission(circuit_id, auth.uid()));

-- 2. Add missing RLS policies for marketplace_item_versions
CREATE POLICY "Item creators can manage versions"
ON public.marketplace_item_versions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.marketplace_items 
    WHERE id = item_id AND creator_id = auth.uid()
  )
);

CREATE POLICY "Anyone can view published item versions"
ON public.marketplace_item_versions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.marketplace_items 
    WHERE id = item_id AND is_published = true
  )
);

-- 3. Create email verification tokens table
CREATE TABLE IF NOT EXISTS public.email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  token text NOT NULL UNIQUE,
  email text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on verification tokens
ALTER TABLE public.email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Only allow users to see their own tokens (for cleanup purposes)
CREATE POLICY "Users can view their own tokens"
ON public.email_verification_tokens
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 4. Secure existing database functions by adding proper search_path
UPDATE pg_proc 
SET prosecdef = true, 
    proconfig = array_append(proconfig, 'search_path=')
WHERE proname IN ('handle_new_user', 'get_student_email_if_authorized', 'get_classroom_enrollments_safe')
AND proconfig IS NULL OR 'search_path=' != ANY(proconfig);

-- 5. Add cleanup function for expired tokens
CREATE OR REPLACE FUNCTION public.cleanup_expired_verification_tokens()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  DELETE FROM public.email_verification_tokens 
  WHERE expires_at < now() - interval '1 day';
$$;
