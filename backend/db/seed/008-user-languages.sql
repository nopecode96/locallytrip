-- Insert User Languages
-- This file seeds the user_languages table linking users with their spoken languages

INSERT INTO user_languages (id, user_id, language_id, proficiency, is_active, created_at, updated_at) VALUES
-- Super Admin (ID: 1) - Indonesian, English
(1, 1, 1, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Platform Admin (ID: 2) - Indonesian, English  
(3, 2, 1, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 2, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Finance Manager (ID: 3) - Indonesian, English
(5, 3, 1, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 3, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Marketing Specialist (ID: 4) - Indonesian, English
(7, 4, 1, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 4, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Content Moderator (ID: 5) - Indonesian, English
(9, 5, 1, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 5, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Business Partner (ID: 6) - English, Mandarin
(11, 6, 2, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 6, 6, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Travel Influencer/Affiliate (ID: 7) - Malay, English, Mandarin
(13, 7, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 7, 6, 'intermediate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Aria Wijaya - Host Tour Guide (ID: 8) - Indonesian, English, Japanese
(15, 8, 1, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(16, 8, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, 8, 7, 'intermediate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, 8, 5, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Balinese

-- Maya Chen - Host Photographer (ID: 9) - Indonesian, English, Mandarin
(19, 9, 1, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(20, 9, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(21, 9, 6, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Rizal Adventure - Host Combo (ID: 10) - Indonesian, English, Dutch
(22, 10, 1, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(23, 10, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(24, 10, 10, 'intermediate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(25, 10, 3, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Javanese

-- Indah Planner - Host Trip Planner (ID: 11) - Indonesian, English, Sundanese
(26, 11, 1, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(27, 11, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(28, 11, 4, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Sundanese

-- John Smith - Traveller (ID: 12) - English, Mandarin
(29, 12, 2, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(30, 12, 6, 'intermediate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sarah Johnson - Traveller (ID: 13) - English, Thai
(31, 13, 2, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Kenji Tanaka - Traveller (ID: 14) - Japanese, English, Indonesian
(32, 14, 7, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(33, 14, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(34, 14, 1, 'intermediate', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Lisa Wang - Traveller (ID: 15) - Mandarin, English, Malay
(35, 15, 6, 'native', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(36, 15, 2, 'advanced', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to continue from the last ID
SELECT setval('user_languages_id_seq', (SELECT MAX(id) FROM user_languages));
