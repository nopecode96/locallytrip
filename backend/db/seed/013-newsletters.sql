-- Newsletter subscription seed data
-- Clear existing data first
DELETE FROM newsletters WHERE email IN ('alice@example.com', 'bob@example.com', 'charlie@example.com');

-- Sample newsletter subscriptions
INSERT INTO newsletters (
  id,
  email, 
  user_id, 
  is_verified, 
  verification_token,
  unsubscribe_token, 
  is_subscribed, 
  frequency, 
  categories,
  preferences,
  subscribed_at,
  verified_at,
  created_at,
  updated_at
) VALUES 
-- Verified user subscription
(
  uuid_generate_v4(),
  'alice@example.com',
  (SELECT id FROM users WHERE email = 'alice@example.com' LIMIT 1),
  true,
  NULL,
  md5(random()::text || clock_timestamp()::text),
  true,
  'weekly',
  ARRAY['experiences', 'stories'],
  '{"weeklyNewsletter": true, "newExperiences": true, "featuredStories": true, "specialOffers": false}',
  CURRENT_TIMESTAMP - INTERVAL '7 days',
  CURRENT_TIMESTAMP - INTERVAL '7 days',
  CURRENT_TIMESTAMP - INTERVAL '7 days',
  CURRENT_TIMESTAMP
),
-- Unverified guest subscription
(
  uuid_generate_v4(),
  'bob@example.com',
  NULL,
  false,
  md5(random()::text || clock_timestamp()::text),
  md5(random()::text || clock_timestamp()::text),
  true,
  'monthly',
  ARRAY['experiences'],
  '{"weeklyNewsletter": false, "newExperiences": true, "featuredStories": false, "specialOffers": true}',
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  NULL,
  CURRENT_TIMESTAMP - INTERVAL '3 days',
  CURRENT_TIMESTAMP
),
-- Unsubscribed user
(
  uuid_generate_v4(),
  'charlie@example.com',
  NULL,
  true,
  NULL,
  md5(random()::text || clock_timestamp()::text),
  false,
  'weekly',
  ARRAY['stories'],
  '{"weeklyNewsletter": true, "newExperiences": false, "featuredStories": true, "specialOffers": false}',
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CURRENT_TIMESTAMP - INTERVAL '14 days',
  CURRENT_TIMESTAMP - INTERVAL '1 day'
);

-- Update newsletter statistics
UPDATE newsletters 
SET last_email_sent_at = CURRENT_TIMESTAMP - INTERVAL '1 day'
WHERE email = 'alice@example.com';

-- Display results
SELECT 
  email,
  CASE WHEN user_id IS NOT NULL THEN 'User' ELSE 'Guest' END as subscriber_type,
  is_verified,
  is_subscribed,
  frequency,
  array_length(categories, 1) as category_count,
  subscribed_at::date as subscribed_date,
  CASE 
    WHEN verified_at IS NOT NULL THEN verified_at::date::text
    ELSE 'Not verified' 
  END as verified_date
FROM newsletters 
ORDER BY subscribed_at DESC;

-- Show subscription statistics
SELECT 
  COUNT(*) as total_subscriptions,
  COUNT(CASE WHEN is_subscribed = true THEN 1 END) as active_subscriptions,
  COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_subscriptions,
  COUNT(CASE WHEN user_id IS NOT NULL THEN 1 END) as user_subscriptions,
  COUNT(CASE WHEN user_id IS NULL THEN 1 END) as guest_subscriptions
FROM newsletters;
