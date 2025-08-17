
-- Completely disable all email confirmations and notifications
UPDATE auth.config 
SET 
  enable_confirmations = false,
  enable_signup = true,
  enable_email_change_confirmations = false,
  enable_password_reset = true
WHERE true;

-- Also update the email templates to be empty/disabled
UPDATE auth.email_templates 
SET 
  subject = '',
  body_html = '',
  body_text = ''
WHERE template_name IN ('confirmation', 'email_change_confirmation_new', 'email_change_confirmation_current');
