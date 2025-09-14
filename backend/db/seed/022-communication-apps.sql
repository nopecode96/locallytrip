-- Seed communication apps master data
INSERT INTO communication_apps (name, display_name, icon_url, url_pattern, sort_order, is_active) VALUES
('telegram', 'Telegram', '/images/communication-apps/telegram.png', 'https://t.me/{username}', 1, true),
('whatsapp', 'WhatsApp', '/images/communication-apps/whatsapp.png', 'https://wa.me/{phone}', 2, true),
('line', 'LINE', '/images/communication-apps/line.png', 'https://line.me/ti/p/{lineid}', 3, true),
('zalo', 'Zalo', '/images/communication-apps/zalo.png', 'https://zalo.me/{zaloid}', 4, true),
('wechat', 'WeChat', '/images/communication-apps/wechat.png', null, 5, true),
('discord', 'Discord', '/images/communication-apps/discord.png', 'https://discord.com/users/{userid}', 6, true),
('instagram', 'Instagram', '/images/communication-apps/instagram.png', 'https://instagram.com/{username}', 7, true),
('viber', 'Viber', '/images/communication-apps/viber.png', 'viber://chat?number={phone}', 8, true),
('kakaotalk', 'KakaoTalk', '/images/communication-apps/kakaotalk.png', null, 9, true),
('skype', 'Skype', '/images/communication-apps/skype.png', 'skype:{username}?chat', 10, true);

-- Seed some sample user communication contacts for existing hosts
-- Host ID 1 (John Smith)
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(1, 1, 'johnsmith_bali', true, true),    -- Telegram
(1, 2, '+6281234567890', false, true),   -- WhatsApp
(1, 7, 'johnsmith.bali', false, true);   -- Instagram

-- Host ID 2 (Sarah Johnson)  
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(2, 2, '+6281987654321', true, true),    -- WhatsApp
(2, 1, 'sarahjohnson_tokyo', false, true), -- Telegram
(2, 3, 'sarah.johnson.tokyo', false, true); -- LINE

-- Host ID 3 (Mike Chen)
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(3, 5, 'mikechen_sg', true, true),       -- WeChat
(3, 2, '+6591234567', false, true),      -- WhatsApp
(3, 7, 'mikechen.singapore', false, true); -- Instagram

-- Host ID 4 (Lisa Park)
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(4, 9, 'lisapark_seoul', true, true),    -- KakaoTalk
(4, 1, 'lisapark_korea', false, true),   -- Telegram
(4, 3, 'lisa.park.seoul', false, true);  -- LINE

-- Host ID 5 (David Wilson)
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(5, 6, 'davidwilson#1234', true, true),  -- Discord
(5, 1, 'davidwilson_thailand', false, true), -- Telegram
(5, 2, '+6612345678', false, true);      -- WhatsApp

-- Traveller ID 6 (Emma Brown)
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(6, 1, 'emmabrown_traveller', true, true), -- Telegram
(6, 2, '+1234567890', false, false);     -- WhatsApp (private)

-- Traveller ID 7 (Alex Kim)
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(7, 9, 'alexkim_traveller', true, true), -- KakaoTalk
(7, 1, 'alexkim_travel', false, true);   -- Telegram

-- Traveller ID 8 (Maria Garcia)
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(8, 2, '+34123456789', true, true),      -- WhatsApp
(8, 7, 'maria.garcia.travel', false, true); -- Instagram

-- Traveller ID 9 (James Liu)
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(9, 5, 'jamesliu_canada', true, true),   -- WeChat
(9, 1, 'jamesliu_travel', false, true);  -- Telegram

-- Traveller ID 10 (Sophie Martin)
INSERT INTO user_communication_contacts (user_id, communication_app_id, contact_value, is_preferred, is_public) VALUES
(10, 1, 'sophiemartin_traveller', true, true), -- Telegram
(10, 2, '+33123456789', false, false),   -- WhatsApp (private)
(10, 7, 'sophie.martin.travel', false, true); -- Instagram
