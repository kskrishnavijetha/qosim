-- The Security Definer View error is likely coming from system-generated views
-- Let's check if there are any materialized views or other views we missed

-- First, check if there are any materialized views with SECURITY DEFINER
SELECT 
    schemaname,
    matviewname,
    definition
FROM pg_matviews 
WHERE schemaname = 'public';

-- The handle_new_user function legitimately needs SECURITY DEFINER to work with auth triggers
-- The get_student_email_if_authorized function also legitimately needs SECURITY DEFINER to access auth.users
-- These are acceptable uses of SECURITY DEFINER for specific security purposes

-- However, let's ensure our view is definitely not using SECURITY DEFINER by recreating it explicitly
DROP VIEW IF EXISTS public.classroom_enrollments_safe CASCADE;

CREATE VIEW public.classroom_enrollments_safe 
WITH (security_barrier = false) AS
SELECT 
  se.id,
  se.classroom_id,
  se.student_user_id,
  se.enrollment_date,
  se.is_active,
  p.display_name as student_name
FROM public.student_enrollments se
LEFT JOIN public.profiles p ON p.user_id = se.student_user_id;

-- Explicitly grant permissions
GRANT SELECT ON public.classroom_enrollments_safe TO authenticated;
GRANT SELECT ON public.classroom_enrollments_safe TO anon;