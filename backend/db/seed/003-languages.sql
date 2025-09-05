-- Insert Languages
-- This file seeds the languages table

INSERT INTO languages (id, name, code, native_name, is_active, created_at, updated_at) VALUES
(1, 'Indonesian', 'id', 'Bahasa Indonesia', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'English', 'en', 'English', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Javanese', 'jv', 'Basa Jawa', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Sundanese', 'su', 'Basa Sunda', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Balinese', 'ban', 'Basa Bali', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Mandarin', 'zh', '中文', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Japanese', 'ja', '日本語', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Korean', 'ko', '한국어', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Arabic', 'ar', 'العربية', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Dutch', 'nl', 'Nederlands', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, 'German', 'de', 'Deutsch', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'French', 'fr', 'Français', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 'Spanish', 'es', 'Español', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 'Portuguese', 'pt', 'Português', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'Italian', 'it', 'Italiano', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to continue from the last ID
SELECT setval('languages_id_seq', (SELECT MAX(id) FROM languages));
