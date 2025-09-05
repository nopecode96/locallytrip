-- Insert User Host Categories
-- This file seeds the user_host_categories table linking hosts with their service categories

INSERT INTO user_host_categories (id, user_id, host_category_id, is_primary, is_active, created_at, updated_at) VALUES
-- Local Tour Guide Hosts
(1, 6, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Budi Santoso
(2, 7, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Sari Dewi
(3, 8, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Agus Wijaya
(4, 9, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Made Ngurah
(5, 25, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Ketut Bali Guide
(6, 26, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Joko Jakarta Food
(7, 27, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Eko Bandung Explorer
(8, 28, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Lestari Yogya Arts
(9, 29, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Putu Lombok Adventure
(10, 30, 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Indra Surabaya Heritage

-- Photographer Hosts
(11, 10, 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Rina Photography
(12, 11, 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Dika Lens Studio

-- Combo Hosts (Multi-category)
(13, 12, 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Wayan Combo Tours
(14, 13, 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Jakarta All-in-One

-- Trip Planner Hosts
(15, 14, 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- Indonesia Travel Pro
(16, 15, 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Wanderlust Planner

-- Reset sequence to match the highest ID
SELECT setval('user_host_categories_id_seq', (SELECT MAX(id) FROM user_host_categories));

-- Maya Chen (ID: 9) - Photographer
(2, 9, 2, true, 'professional', 7, 
 '["couple_photography", "portrait", "travel_documentation", "event_coverage", "street_photography"]',
 '["Canon_EOS_R5", "Sony_A7IV", "DJI_Mavic_Pro", "lighting_kit", "tripods", "reflectors"]',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Rizal Adventure (ID: 10) - Combo (Tour Guide + Photographer)
(3, 10, 1, false, 'certified', 8, 
 '["cultural_tours", "temple_photography", "traditional_arts", "heritage_sites"]',
 '["first_aid_kit", "portable_speaker", "local_guides", "cultural_books"]',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 10, 2, false, 'professional', 6, 
 '["temple_photography", "cultural_documentation", "portrait", "architectural_photography"]',
 '["Canon_EOS_6D", "Nikon_D850", "drone_permit", "lighting_equipment", "backup_cameras"]',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 10, 3, true, 'expert', 8, 
 '["photo_tours", "cultural_immersion", "temple_visits", "traditional_craft_workshops"]',
 '["professional_camera_gear", "tour_guide_equipment", "cultural_props", "traditional_costumes"]',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Indah Planner (ID: 11) - Trip Planner
(6, 11, 4, true, 'certified', 6, 
 '["budget_planning", "hidden_gems", "local_experiences", "accommodation_booking", "transport_coordination"]',
 '["planning_software", "local_contacts", "booking_systems", "mobile_hotspot", "emergency_kit"]',
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to continue from the last ID
SELECT setval('user_host_categories_id_seq', (SELECT MAX(id) FROM user_host_categories));
