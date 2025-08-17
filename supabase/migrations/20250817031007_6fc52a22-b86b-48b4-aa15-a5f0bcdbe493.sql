-- Drop the problematic view
DROP VIEW IF EXISTS public.classroom_enrollments_safe CASCADE;

-- Instead of a view, let's create a security definer function that properly handles permissions
-- This is safer than a postgres-owned view
CREATE OR REPLACE FUNCTION public.get_classroom_enrollments_safe(target_classroom_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  classroom_id uuid,
  student_user_id uuid,
  enrollment_date timestamptz,
  is_active boolean,
  student_name text
) 
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
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
$$;

-- Grant permissions to the function
GRANT EXECUTE ON FUNCTION public.get_classroom_enrollments_safe(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_classroom_enrollments_safe(uuid) TO service_role;