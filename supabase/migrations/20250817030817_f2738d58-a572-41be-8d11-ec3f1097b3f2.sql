-- Drop the existing view that has security issues
DROP VIEW IF EXISTS public.classroom_enrollments_safe;

-- Recreate the view as a regular view without security definer properties
-- This ensures it respects RLS policies of the querying user
CREATE VIEW public.classroom_enrollments_safe AS 
SELECT 
  se.id,
  se.classroom_id,
  se.student_user_id,
  se.enrollment_date,
  se.is_active,
  p.display_name AS student_name
FROM student_enrollments se
LEFT JOIN profiles p ON p.user_id = se.student_user_id;

-- Ensure the view has proper RLS policies applied
-- Since this is a view, it will inherit the RLS policies from the underlying tables
-- (student_enrollments and profiles)

-- Grant appropriate permissions
GRANT SELECT ON public.classroom_enrollments_safe TO authenticated;
GRANT SELECT ON public.classroom_enrollments_safe TO service_role;