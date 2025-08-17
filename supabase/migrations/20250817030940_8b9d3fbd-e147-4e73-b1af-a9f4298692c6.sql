-- Check current permissions and ownership
SELECT 
  current_user as current_user,
  session_user as session_user;

-- Check the current view definition and ownership
SELECT 
  schemaname,
  viewname,
  viewowner,
  definition
FROM pg_views 
WHERE schemaname = 'public' 
  AND viewname = 'classroom_enrollments_safe';