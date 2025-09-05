-- Specialized Booking Tables Seed Data
-- This file seeds specialized booking tables that reference the main bookings table

-- Photography Bookings - for Portrait Session experiences (booking_id 4, 5)
INSERT INTO photography_bookings (booking_id, package_type, photography_style, session_duration, number_of_photos, edited_photos_count, raw_photos_included, outfit_changes, preferred_locations, backup_date, editing_timeline_days, delivery_format, print_rights, commercial_use, created_at, updated_at) VALUES
(4, 'portrait', 'lifestyle', 180, 100, 25, false, 2, '["National Monument", "Grand Indonesia Area", "Old Town Jakarta"]', '2024-04-15', 7, 'digital_download', true, false, NOW(), NOW()),
(5, 'portrait', 'street', 150, 80, 20, false, 1, '["Urban Jakarta", "Modern Buildings", "Street Photography"]', '2024-04-20', 5, 'digital_download', true, false, NOW(), NOW()),
(14, 'traditional', 'cultural', 120, 50, 15, false, 3, '["Traditional Javanese Setting", "Sultan Palace Area"]', '2024-04-27', 5, 'digital_download', true, false, NOW(), NOW());

-- Guide Bookings - for Cultural Tours and Walking Tours (booking_id 1, 2, 3, 8, 9, 11, 12, 13)  
INSERT INTO guide_bookings (booking_id, tour_duration, group_size_preference, languages, special_interests, dietary_restrictions, accessibility_needs, transportation_included, meeting_point, created_at, updated_at) VALUES
(1, 360, 'small', '["Indonesian", "English"]', '["History", "Architecture", "Museums"]', 'None', 'None', false, 'Fatahillah Square, Jakarta Old Town', NOW(), NOW()),
(2, 360, 'small', '["Indonesian", "English"]', '["History", "Culture", "Photography"]', 'Vegetarian', 'None', false, 'Fatahillah Square, Jakarta Old Town', NOW(), NOW()),
(3, 480, 'small', '["Indonesian", "English"]', '["Temples", "Rice Terraces", "Traditional Culture"]', 'None', 'None', true, 'Ubud Hotel Area', NOW(), NOW()),
(8, 480, 'small', '["Indonesian", "English"]', '["Balinese Culture", "Hindu Temples", "Photography"]', 'Halal', 'None', true, 'Ubud Hotel Area', NOW(), NOW()),
(9, 360, 'small', '["Indonesian", "English"]', '["Colonial History", "Museums", "Traditional Crafts"]', 'None', 'Walking assistance needed', false, 'Fatahillah Square, Jakarta Old Town', NOW(), NOW()),
(11, 300, 'small', '["Indonesian", "English"]', '["Sunrise", "Volcano", "Nature"]', 'None', 'None', true, 'Mount Batur Parking Area', NOW(), NOW()),
(12, 240, 'small', '["Indonesian", "English"]', '["Street Food", "Local Culture", "Markets"]', 'No spicy food', 'None', false, 'Grand Indonesia Mall', NOW(), NOW()),
(13, 360, 'small', '["Indonesian", "English"]', '["Tea Culture", "Agriculture", "History"]', 'None', 'None', true, 'Bandung Hotel Area', NOW(), NOW());

-- Trip Planner Bookings - for Custom Itinerary services (booking_id 7, 10)
INSERT INTO trip_planner_bookings (booking_id, destination, trip_duration, start_date, end_date, budget_range, travel_style, interests, revision_count, max_revisions, pdf_delivery_method, planning_notes, created_at, updated_at) VALUES
(7, 'Multi-destination Indonesia', 14, '2024-05-01', '2024-05-15', '2000-5000', 'cultural_adventure', '["Cultural Sites", "Adventure Activities", "Local Food", "Photography"]', 0, 3, 'email', 'English speaking guide required. Focus on authentic local experiences.', NOW(), NOW()),
(10, 'Comprehensive Indonesia', 14, '2024-05-28', '2024-06-11', '3000-7000', 'luxury_cultural', '["Culture", "Nature", "Luxury Accommodation", "Photography"]', 0, 3, 'email', 'Premium experiences with cultural immersion. Photography documentation important.', NOW(), NOW());

-- Combo Bookings - for All-in-One Experience packages (booking_id 6)
INSERT INTO combo_bookings (booking_id, selected_services, guide_duration, photography_duration, package_discount, coordination_complexity, service_timeline, team_coordination_notes, created_at, updated_at) VALUES
(6, '["Guided Tour", "Photography Session", "Trip Planning"]', 480, 120, 15.00, 'high', '{"day1": "Temple Tour + Photography", "day2": "Trip Planning Session"}', 'Coordinate between guide and photographer for seamless experience', NOW(), NOW());

-- Reset sequences
SELECT setval('photography_bookings_id_seq', COALESCE((SELECT MAX(id) FROM photography_bookings), 0));
SELECT setval('guide_bookings_id_seq', COALESCE((SELECT MAX(id) FROM guide_bookings), 0));
SELECT setval('trip_planner_bookings_id_seq', COALESCE((SELECT MAX(id) FROM trip_planner_bookings), 0));
SELECT setval('combo_bookings_id_seq', COALESCE((SELECT MAX(id) FROM combo_bookings), 0));
