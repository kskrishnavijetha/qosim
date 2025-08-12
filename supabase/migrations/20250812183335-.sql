-- Fix the security issues detected after removing sensitive student data

-- 1. Fix the view to not expose auth.users data directly
DROP VIEW IF EXISTS public.classroom_enrollments_with_profiles;

-- Create a secure view that doesn't expose auth.users
CREATE OR REPLACE VIEW public.classroom_enrollments_safe AS
SELECT 
  se.id,
  se.classroom_id,
  se.student_user_id,
  se.enrollment_date,
  se.is_active,
  p.display_name as student_name
FROM public.student_enrollments se
LEFT JOIN public.profiles p ON p.user_id = se.student_user_id;

-- 2. Add RLS policies for the audit log table (currently has RLS enabled but no policies)
-- Allow educators to view audit logs for their classrooms
CREATE POLICY "Educators can view their classroom audit logs" 
ON public.enrollment_access_log 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM classrooms c 
    JOIN educator_profiles ep ON c.educator_id = ep.id
    WHERE c.id = enrollment_access_log.classroom_id 
    AND ep.user_id = auth.uid()
  )
);

-- 3. Create a security definer function to safely get student email when needed
CREATE OR REPLACE FUNCTION public.get_student_email_if_authorized(student_id uuid, classroom_id uuid)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = '';

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_student_email_if_authorized(uuid, uuid) TO authenticated;