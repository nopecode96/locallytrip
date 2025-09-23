-- Insert User Host Categories
-- This file seeds the user_host_categories table linking hosts with their service categories

DELETE FROM user_host_categories;

INSERT INTO user_host_categories (id, user_id, host_category_id, is_primary, is_active, created_at, updated_at) VALUES
-- Local Tour Guide Hosts
(1, 6, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Budi Santoso
(2, 7, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Sari Dewi
(3, 8, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Agus Wijaya
(4, 9, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Made Ngurah
(5, 25, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ketut Bali Guide
(6, 26, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Joko Jakarta Food

-- Photography Service Hosts
(7, 10, 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Rina Photography
(8, 11, 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Dika Lens Studio

-- Combo Service Hosts
(9, 12, 1, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Wayan Combo Tours - Guide Service
(10, 12, 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Wayan Combo Tours - Photography Service
(11, 13, 1, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Jakarta All-in-One - Guide Service
(12, 13, 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Jakarta All-in-One - Photography Service

-- Trip Planner Hosts
(13, 14, 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Indonesia Travel Pro
(14, 15, 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Wanderlust Planner

-- Additional Photography Hosts (for more comprehensive data)
(15, 6, 2, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Budi Santoso - Secondary Photography
(16, 9, 2, false, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);  -- Made Ngurah - Secondary Photography

-- Reset sequence to continue from the last ID
SELECT setval('user_host_categories_id_seq', (SELECT MAX(id) FROM user_host_categories));