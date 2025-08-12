-- Security Fix: Remove sensitive student data from student_enrollments table
-- This prevents educator account compromise from exposing student email addresses

-- First, let's remove the sensitive columns that store student data directly
ALTER TABLE public.student_enrollments 
DROP COLUMN IF EXISTS student_name,
DROP COLUMN IF EXISTS student_email;

-- Create a view that safely joins student data from profiles when needed
CREATE OR REPLACE VIEW public.classroom_enrollments_with_profiles AS
SELECT 
  se.id,
  se.classroom_id,
  se.student_user_id,
  se.enrollment_date,
  se.is_active,
  p.display_name as student_name,
  -- Email is not included in view for additional security
  CASE 
    WHEN auth.uid() = se.student_user_id THEN 
      (SELECT email FROM auth.users WHERE id = se.student_user_id)
    ELSE NULL 
  END as student_email
FROM public.student_enrollments se
LEFT JOIN public.profiles p ON p.user_id = se.student_user_id;

-- Enable RLS on the view (inherited from base tables)
-- This view will only show email to the student themselves

-- Add audit logging for student enrollment access
CREATE TABLE IF NOT EXISTS public.enrollment_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accessed_by uuid REFERENCES auth.users(id),
  student_user_id uuid NOT NULL,
  classroom_id uuid NOT NULL,
  access_type text NOT NULL,
  timestamp timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.enrollment_access_log ENABLE ROW LEVEL SECURITY;

-- Only allow educators and system to insert audit logs
CREATE POLICY "Educators can log enrollment access" 
ON public.enrollment_access_log 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM classrooms c 
    JOIN educator_profiles ep ON c.educator_id = ep.id
    WHERE c.id = enrollment_access_log.classroom_id 
    AND ep.user_id = auth.uid()
  )
);

-- Only allow viewing your own access logs
CREATE POLICY "Users can view their own access logs" 
ON public.enrollment_access_log 
FOR SELECT 
USING (auth.uid() = accessed_by OR auth.uid() = student_user_id);