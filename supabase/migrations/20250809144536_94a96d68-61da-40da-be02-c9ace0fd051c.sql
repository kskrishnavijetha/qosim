
-- Fix Function Search Path Mutable issue
-- Set search_path for the update_updated_at_column function to be secure
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';

-- Enable leaked password protection for Auth
UPDATE auth.config 
SET 
  password_min_length = 8,
  password_require_letters = true,
  password_require_numbers = true,
  password_require_symbols = false,
  password_require_uppercase = false,
  enable_leaked_password_protection = true;

-- Set OTP expiry to recommended threshold (10 minutes instead of default)
UPDATE auth.config 
SET 
  otp_exp = 600, -- 10 minutes in seconds
  sms_otp_exp = 600, -- 10 minutes for SMS OTP as well
  email_confirm_exp = 86400; -- 24 hours for email confirmation
