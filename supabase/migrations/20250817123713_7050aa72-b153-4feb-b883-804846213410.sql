
-- Disable email confirmations at the database level by updating auth configuration
UPDATE auth.config 
SET 
  enable_confirmations = false,
  enable_signup = true
WHERE true;

-- Alternative approach: Update the site URL to prevent default emails
UPDATE auth.config 
SET site_url = 'https://qosim.app'
WHERE true;
