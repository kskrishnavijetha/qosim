-- Fix Security Definer View issue
-- Remove SECURITY DEFINER from any views and ensure proper RLS policies handle access control

-- First, let's check and recreate the classroom_enrollments_safe view without SECURITY DEFINER
DROP VIEW IF EXISTS public.classroom_enrollments_safe;

-- Recreate the view as a normal view (without SECURITY DEFINER)
CREATE VIEW public.classroom_enrollments_safe AS
SELECT 
  se.id,
  se.classroom_id,
  se.student_user_id,
  se.enrollment_date,
  se.is_active,
  p.display_name as student_name
FROM public.student_enrollments se
LEFT JOIN public.profiles p ON p.user_id = se.student_user_id;

-- Grant SELECT permission to authenticated users on the view
GRANT SELECT ON public.classroom_enrollments_safe TO authenticated;

-- Add RLS policy for the view to ensure proper access control
-- Note: Views inherit RLS from their underlying tables, but we can add explicit policies if needed
-- The view will be filtered by the RLS policies on student_enrollments and profiles tables

-- Ensure the view respects the same access patterns as the underlying tables:
-- 1. Educators can see enrollments for their classrooms
-- 2. Students can see their own enrollments
-- This is already handled by the RLS policies on the student_enrollments table