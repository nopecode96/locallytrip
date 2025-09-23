-- Additional Master Data Seeds
-- Communication apps, notification settings, and related data

-- Communication Apps
INSERT INTO communication_apps (id, name, display_name, icon_url, url_pattern, is_active, sort_order, created_at, updated_at) VALUES
(1, 'whatsapp', 'WhatsApp', '/images/apps/whatsapp.png', 'https://wa.me/{phone}', true, 1, NOW(), NOW()),
(2, 'telegram', 'Telegram', '/images/apps/telegram.png', 'https://t.me/{username}', true, 2, NOW(), NOW()),
(3, 'line', 'LINE', '/images/apps/line.png', 'https://line.me/ti/p/{username}', true, 3, NOW(), NOW()),
(4, 'wechat', 'WeChat', '/images/apps/wechat.png', 'weixin://dl/chat?{username}', true, 4, NOW(), NOW()),
(5, 'instagram', 'Instagram', '/images/apps/instagram.png', 'https://instagram.com/{username}', true, 5, NOW(), NOW()),
(6, 'email', 'Email', '/images/apps/email.png', 'mailto:{email}', true, 6, NOW(), NOW());

-- User Communication Contacts (for hosts)
INSERT INTO user_communication_contacts (id, user_id, communication_app_id, contact_value, is_preferred, is_public, created_at, updated_at) VALUES
-- Budi Santoso (Jakarta Guide)
(1, 6, 1, '+628123456001', true, true, NOW(), NOW()),  -- WhatsApp
(2, 6, 6, 'budi@locallytrip.com', false, true, NOW(), NOW()),  -- Email

-- Sari Dewi (Bali Guide)  
(3, 7, 1, '+628123456002', true, true, NOW(), NOW()),  -- WhatsApp
(4, 7, 5, 'saridewi_bali', false, true, NOW(), NOW()),  -- Instagram

-- Agus Wijaya (Yogya Guide)
(5, 8, 1, '+628123456003', true, true, NOW(), NOW()),  -- WhatsApp
(6, 8, 2, 'aguswijaya_yogya', false, true, NOW(), NOW()),  -- Telegram

-- Made Ngurah (Adventure Guide)
(7, 9, 1, '+628123456004', true, true, NOW(), NOW()),  -- WhatsApp
(8, 9, 5, 'madebali_adventure', false, true, NOW(), NOW()),  -- Instagram

-- Rina Photography
(9, 10, 1, '+628123456005', true, true, NOW(), NOW()),  -- WhatsApp
(10, 10, 5, 'rina_photography', true, true, NOW(), NOW()),  -- Instagram

-- Dika Lens Studio
(11, 11, 1, '+628123456006', true, true, NOW(), NOW()),  -- WhatsApp
(12, 11, 5, 'dikalens_studio', true, true, NOW(), NOW()),  -- Instagram

-- Wayan Combo Tours
(13, 12, 1, '+628123456007', true, true, NOW(), NOW()),  -- WhatsApp
(14, 12, 3, 'wayancombotours', false, true, NOW(), NOW()),  -- LINE

-- Jakarta All-in-One
(15, 13, 1, '+628123456008', true, true, NOW(), NOW()),  -- WhatsApp
(16, 13, 6, 'jakarta.combo@locallytrip.com', false, true, NOW(), NOW());  -- Email

-- Notification Settings (for all users)
INSERT INTO notification_settings (id, uuid, user_id, 
  booking_confirmations_email, booking_confirmations_push, booking_confirmations_sms,
  payment_updates_email, payment_updates_push, payment_updates_sms,
  messages_email, messages_push, messages_sms,
  reviews_email, reviews_push, reviews_sms,
  favorites_email, favorites_push, favorites_sms,
  promotions_email, promotions_push, promotions_sms,
  newsletter_email, newsletter_push, newsletter_sms,
  email_enabled, push_enabled, sms_enabled,
  marketing_consent, marketing_consent_date,
  created_at, updated_at) 
SELECT 
  u.id, 
  gen_random_uuid(),
  u.id,
  -- Booking notifications (always enabled for important stuff)
  true, true, CASE WHEN u.role IN ('admin', 'super_admin') THEN false ELSE true END,
  -- Payment notifications  
  true, true, false,
  -- Messages
  true, true, false,
  -- Reviews
  CASE WHEN u.role = 'host' THEN true ELSE false END, 
  CASE WHEN u.role = 'host' THEN true ELSE false END, 
  false,
  -- Favorites
  false, true, false,
  -- Promotions
  CASE WHEN u.role = 'traveller' THEN true ELSE false END, 
  false, false,
  -- Newsletter
  CASE WHEN u.role = 'traveller' THEN true ELSE false END, 
  false, false,
  -- Main toggles
  true, true, false,
  -- Marketing consent
  CASE WHEN u.role = 'traveller' THEN true ELSE false END,
  CASE WHEN u.role = 'traveller' THEN NOW() ELSE NULL END,
  NOW(), NOW()
FROM users u;

-- Newsletter Subscriptions (migrate some from newsletters table)
INSERT INTO newsletter_subscriptions (id, email, user_id, subscribed_at, is_active)
SELECT 
  ROW_NUMBER() OVER (ORDER BY email),
  email,
  user_id,
  subscribed_at,
  is_subscribed
FROM newsletters
WHERE email IS NOT NULL;

-- Reset sequences
SELECT setval('communication_apps_id_seq', (SELECT MAX(id) FROM communication_apps));
SELECT setval('user_communication_contacts_id_seq', (SELECT MAX(id) FROM user_communication_contacts));
SELECT setval('notification_settings_id_seq', (SELECT MAX(id) FROM notification_settings));
SELECT setval('newsletter_subscriptions_id_seq', (SELECT MAX(id) FROM newsletter_subscriptions));