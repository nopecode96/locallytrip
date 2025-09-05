-- Insert Countries
-- This file seeds the countries table

INSERT INTO countries (id, name, code, created_at, updated_at) VALUES
(1, 'Indonesia', 'ID', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Malaysia', 'MY', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Singapore', 'SG', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Thailand', 'TH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Vietnam', 'VN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Philippines', 'PH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Cambodia', 'KH', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Laos', 'LA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Myanmar', 'MM', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Brunei', 'BN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to continue from the last ID
SELECT setval('countries_id_seq', (SELECT MAX(id) FROM countries));
