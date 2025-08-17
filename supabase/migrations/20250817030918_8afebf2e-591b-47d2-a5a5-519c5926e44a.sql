-- Change ownership of the view from postgres to the authenticated role
-- This removes the security definer behavior
ALTER VIEW public.classroom_enrollments_safe OWNER TO authenticator;

-- Alternatively, we can recreate it properly with explicit security invoker behavior
-- First drop it
DROP VIEW IF EXISTS public.classroom_enrollments_safe;

-- Recreate with explicit security invoker (this is the default, but being explicit)
CREATE VIEW public.classroom_enrollments_safe 
WITH (security_invoker = true) AS 
SELECT 
  se.id,
  se.classroom_id,
  se.student_user_id,
  se.enrollment_date,
  se.is_active,
  p.display_name AS student_name
FROM student_enrollments se
LEFT JOIN profiles p ON p.user_id = se.student_user_id;

-- Set proper ownership to avoid security definer issues
ALTER VIEW public.classroom_enrollments_safe OWNER TO authenticator;

-- Grant necessary permissions
GRANT SELECT ON public.classroom_enrollments_safe TO authenticated;
GRANT SELECT ON public.classroom_enrollments_safe TO service_role;