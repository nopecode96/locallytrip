-- Insert Bookings
-- This file seeds th-- Insert Bookings
-- This file seeds the bookings table with sample booking data

INSERT INTO bookings (id, uuid, experience_id, user_id, booking_date, booking_time, participant_count, total_price, currency, status, special_requests, contact_phone, contact_email, payment_status, payment_method, payment_reference, booking_reference, category_specific_data, created_at, updated_at) VALUES

-- Jakarta Heritage Walking Tour Bookings
(1, gen_random_uuid(), 1, 16, '2024-12-15', '09:00:00', 2, 1050000.00, 'IDR', 'confirmed', 'Please arrange pickup from hotel', '+1234567890', 'john@example.com', 'paid', 'credit_card', 'PAY_REF_001', 'BOOK_001', '{"pickup_location": "Grand Indonesia Hotel"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, gen_random_uuid(), 1, 17, '2024-12-20', '09:00:00', 1, 525000.00, 'IDR', 'completed', 'Solo traveler, interested in photography spots', '+1234567891', 'sarah@example.com', 'paid', 'paypal', 'PAY_REF_002', 'BOOK_002', '{"interests": ["photography", "history"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sacred Temples & Rice Terraces Tour Bookings  
(3, gen_random_uuid(), 2, 18, '2024-12-25', '06:00:00', 2, 2250000.00, 'IDR', 'confirmed', 'Anniversary celebration, romantic setup preferred', '+1234567892', 'michael@example.com', 'paid', 'credit_card', 'PAY_REF_003', 'BOOK_003', '{"special_occasion": "anniversary", "dietary_restrictions": "vegetarian"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jakarta Portrait Photography Session Bookings
(4, gen_random_uuid(), 3, 19, '2024-12-18', '16:00:00', 1, 1200000.00, 'IDR', 'confirmed', 'Professional portfolio shoot', '+1234567893', 'emma@example.com', 'paid', 'bank_transfer', 'PAY_REF_004', 'BOOK_004', '{"shoot_type": "portfolio", "preferred_style": "natural"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, gen_random_uuid(), 3, 20, '2024-12-19', '16:00:00', 2, 2400000.00, 'IDR', 'pending', 'Couple portrait session', '+1234567894', 'alex@example.com', 'pending', 'credit_card', 'PAY_REF_005', 'BOOK_005', '{"shoot_type": "couple", "preferred_style": "candid"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Bali Complete Experience Package Bookings
(6, gen_random_uuid(), 4, 16, '2024-12-23', '08:00:00', 2, 4500000.00, 'IDR', 'confirmed', 'Honeymoon package', '+1234567890', 'john@example.com', 'paid', 'credit_card', 'PAY_REF_006', 'BOOK_006', '{"occasion": "honeymoon", "preferences": ["romantic", "photography"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, gen_random_uuid(), 5, 17, '2024-12-21', '10:00:00', 1, 1800000.00, 'IDR', 'confirmed', 'Solo backpacker planning', '+1234567891', 'sarah@example.com', 'paid', 'paypal', 'PAY_REF_007', 'BOOK_007', '{"travel_style": "backpacking", "budget_conscious": true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(8, gen_random_uuid(), 2, 19, '2024-12-24', '06:00:00', 1, 1125000.00, 'IDR', 'completed', 'Solo spiritual journey', '+1234567893', 'emma@example.com', 'paid', 'bank_transfer', 'PAY_REF_008', 'BOOK_008', '{"interests": ["spirituality", "culture"], "dietary": "vegetarian"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(9, gen_random_uuid(), 1, 18, '2024-12-22', '09:00:00', 1, 525000.00, 'IDR', 'confirmed', 'History enthusiast visit', '+1234567892', 'michael@example.com', 'paid', 'debit_card', 'PAY_REF_009', 'BOOK_009', '{"interests": ["history", "architecture"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(10, gen_random_uuid(), 5, 24, '2024-12-28', '10:00:00', 1, 1800000.00, 'IDR', 'confirmed', 'Planning for 2-week Indonesia trip', '+1234567899', 'david@example.com', 'paid', 'bank_transfer', 'PAY_REF_010', 'BOOK_010', '{"trip_duration": "14 days", "interests": ["culture", "nature"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- NEW BOOKINGS FOR ADDITIONAL EXPERIENCES

-- Mount Batur Sunrise Trekking Bookings
(11, gen_random_uuid(), 6, 16, '2024-12-30', '03:00:00', 2, 900000.00, 'IDR', 'confirmed', 'Early morning pickup required', '+1234567890', 'john@example.com', 'paid', 'credit_card', 'PAY_REF_011', 'BOOK_011', '{"fitness_level": "moderate", "dietary_needs": "none"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jakarta Street Food Adventure Bookings
(12, gen_random_uuid(), 7, 17, '2024-12-22', '10:00:00', 2, 550000.00, 'IDR', 'confirmed', 'No spicy food please', '+1234567891', 'sarah@example.com', 'paid', 'cash', 'PAY_REF_012', 'BOOK_012', '{"dietary_restrictions": "no_spicy", "allergies": "none"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Bandung Tea Plantation Tour Bookings
(13, gen_random_uuid(), 8, 18, '2024-12-26', '08:00:00', 3, 960000.00, 'IDR', 'confirmed', 'Interested in tea processing details', '+1234567892', 'michael@example.com', 'paid', 'debit_card', 'PAY_REF_013', 'BOOK_013', '{"interests": ["tea_processing", "history"], "group_type": "family"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Yogyakarta Traditional Arts Photo Session Bookings
(14, gen_random_uuid(), 9, 19, '2024-12-27', '14:00:00', 1, 425000.00, 'IDR', 'confirmed', 'Wedding preparation photos', '+1234567893', 'emma@example.com', 'paid', 'bank_transfer', 'PAY_REF_014', 'BOOK_014', '{"occasion": "pre_wedding", "costume_preference": "traditional"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Lombok Waterfalls Trek Bookings
(15, gen_random_uuid(), 10, 20, '2024-12-29', '07:00:00', 2, 760000.00, 'IDR', 'confirmed', 'Good swimmers, love nature', '+1234567894', 'alex@example.com', 'paid', 'credit_card', 'PAY_REF_015', 'BOOK_015', '{"swimming_ability": "good", "fitness_level": "high"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence
SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings));

-- NEW BOOKINGS FOR ADDITIONAL EXPERIENCES

-- Mount Batur Sunrise Trekking Bookings
(11, gen_random_uuid(), 6, 16, '2024-12-30', '03:00:00', 2, 900000.00, 'IDR', 'confirmed', 'Early morning pickup required', '+1234567890', 'john@example.com', 'paid', 'credit_card', 'PAY_REF_011', 'BOOK_011', '{"fitness_level": "moderate", "dietary_needs": "none"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jakarta Street Food Adventure Bookings
(12, gen_random_uuid(), 7, 17, '2024-12-22', '10:00:00', 2, 550000.00, 'IDR', 'confirmed', 'No spicy food please', '+1234567891', 'sarah@example.com', 'paid', 'cash', 'PAY_REF_012', 'BOOK_012', '{"dietary_restrictions": "no_spicy", "allergies": "none"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Bandung Tea Plantation Tour Bookings
(13, gen_random_uuid(), 8, 18, '2024-12-26', '08:00:00', 3, 960000.00, 'IDR', 'confirmed', 'Interested in tea processing details', '+1234567892', 'michael@example.com', 'paid', 'debit_card', 'PAY_REF_013', 'BOOK_013', '{"interests": ["tea_processing", "history"], "group_type": "family"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Yogyakarta Traditional Arts Photo Session Bookings
(14, gen_random_uuid(), 9, 19, '2024-12-27', '14:00:00', 1, 425000.00, 'IDR', 'confirmed', 'Wedding preparation photos', '+1234567893', 'emma@example.com', 'paid', 'bank_transfer', 'PAY_REF_014', 'BOOK_014', '{"occasion": "pre_wedding", "costume_preference": "traditional"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Lombok Waterfalls Trek Bookings
(15, gen_random_uuid(), 10, 20, '2024-12-29', '07:00:00', 2, 760000.00, 'IDR', 'confirmed', 'Good swimmers, love nature', '+1234567894', 'alex@example.com', 'paid', 'credit_card', 'PAY_REF_015', 'BOOK_015', '{"swimming_ability": "good", "fitness_level": "high"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence
SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings));

-- Jakarta Heritage Walking Tour Bookings
(1, gen_random_uuid(), 1, 16, '2024-12-15', '09:00:00', 2, 1050000.00, 'IDR', 'confirmed', 'Please arrange pickup from hotel', '+1234567890', 'john@example.com', 'paid', 'credit_card', 'PAY_REF_001', 'BOOK_001', '{"pickup_location": "Grand Indonesia Hotel"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, gen_random_uuid(), 1, 17, '2024-12-20', '09:00:00', 1, 525000.00, 'IDR', 'completed', 'Solo traveler, interested in photography spots', '+1234567891', 'sarah@example.com', 'paid', 'paypal', 'PAY_REF_002', 'BOOK_002', '{"interests": ["photography", "history"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sacred Temples & Rice Terraces Tour Bookings  
(3, gen_random_uuid(), 2, 18, '2024-12-25', '06:00:00', 2, 2250000.00, 'IDR', 'confirmed', 'Anniversary celebration, romantic setup preferred', '+1234567892', 'michael@example.com', 'paid', 'credit_card', 'PAY_REF_003', 'BOOK_003', '{"special_occasion": "anniversary", "dietary_restrictions": "vegetarian"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jakarta Portrait Photography Session Bookings
(4, gen_random_uuid(), 3, 19, '2024-12-18', '16:00:00', 1, 1200000.00, 'IDR', 'confirmed', 'Professional portfolio shoot', '+1234567893', 'emma@example.com', 'paid', 'bank_transfer', 'PAY_REF_004', 'BOOK_004', '{"shoot_type": "portfolio", "preferred_style": "natural"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, gen_random_uuid(), 3, 20, '2024-12-22', '10:00:00', 2, 2400000.00, 'IDR', 'completed', 'Couple vacation photos', '+1234567895', 'david@example.com', 'paid', 'gopay', 'PAY_REF_005', 'BOOK_005', '{"couple_shoot": true, "locations": ["old_town", "modern_jakarta"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, gen_random_uuid(), 1, 17, '2024-12-20', '09:00:00', 1, 35.00, 'USD', 'completed', 'Solo traveler, interested in photography spots', '+1234567891', 'sarah@example.com', 'paid', 'paypal', 'PAY_REF_002', 'BOOK_002', '{"interests": ["photography", "history"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Sacred Temples & Rice Terraces Tour Bookings  
(3, gen_random_uuid(), 2, 18, '2024-12-25', '06:00:00', 2, 150.00, 'USD', 'confirmed', 'Anniversary celebration, romantic setup preferred', '+1234567892', 'michael@example.com', 'paid', 'credit_card', 'PAY_REF_003', 'BOOK_003', '{"special_occasion": "anniversary", "dietary_restrictions": "vegetarian"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jakarta Portrait Photography Session Bookings
(4, gen_random_uuid(), 3, 19, '2024-12-18', '16:00:00', 1, 80.00, 'USD', 'confirmed', 'Professional portfolio shoot', '+1234567893', 'emma@example.com', 'paid', 'bank_transfer', 'PAY_REF_004', 'BOOK_004', '{"shoot_type": "portfolio", "preferred_style": "natural"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, gen_random_uuid(), 3, 20, '2024-12-22', '10:00:00', 2, 160.00, 'USD', 'pending', 'Couple photos for social media', '+1234567894', 'david@example.com', 'pending', 'credit_card', null, 'BOOK_005', '{"shoot_type": "couple", "social_media": true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Bali Complete Experience Package Bookings
-- Bali Complete Experience Package Bookings
(6, gen_random_uuid(), 4, 16, '2025-01-10', '08:00:00', 2, 4500000.00, 'IDR', 'confirmed', 'Honeymoon trip to Bali', '+1234567890', 'john@example.com', 'paid', 'credit_card', 'PAY_REF_006', 'BOOK_006', '{"honeymoon": true, "special_requests": ["romantic dinner", "couples massage"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Custom Indonesia Trip Planning Service Bookings
(7, gen_random_uuid(), 5, 17, '2025-01-15', '14:00:00', 4, 7200000.00, 'IDR', 'confirmed', 'Family vacation planning for 2 weeks', '+1234567891', 'sarah@example.com', 'paid', 'bank_transfer', 'PAY_REF_007', 'BOOK_007', '{"family_size": 4, "duration": "14_days", "interests": ["culture", "adventure", "beaches"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(8, gen_random_uuid(), 2, 19, '2025-01-20', '06:00:00', 2, 2250000.00, 'IDR', 'confirmed', 'Cultural immersion experience', '+1234567892', 'emma@example.com', 'paid', 'ovo', 'PAY_REF_008', 'BOOK_008', '{"cultural_focus": true, "temple_ceremonies": "interested"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(9, gen_random_uuid(), 1, 18, '2025-02-05', '09:00:00', 3, 1575000.00, 'IDR', 'pending', 'Group of friends historical tour', '+1234567893', 'michael@example.com', 'pending', 'dana', null, 'BOOK_009', '{"group_type": "friends", "historical_interest": "high"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),,

-- Custom Indonesia Trip Planning Service Bookings
(7, gen_random_uuid(), 5, 17, '2025-01-15', '14:00:00', 1, 120.00, 'USD', 'confirmed', 'Solo female traveler, 2-week Indonesia trip', '+1234567891', 'sarah@example.com', 'paid', 'paypal', 'PAY_REF_007', 'BOOK_007', '{"trip_duration": "14 days", "traveler_type": "solo_female", "budget_range": "mid_range"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Additional bookings for variety
(8, gen_random_uuid(), 2, 19, '2025-01-20', '06:00:00', 3, 225.00, 'USD', 'cancelled', 'Group trip, cancelled due to weather concerns', '+1234567893', 'emma@example.com', 'refunded', 'credit_card', 'PAY_REF_008', 'BOOK_008', '{"cancellation_reason": "weather", "refund_amount": 225.00}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(9, gen_random_uuid(), 1, 18, '2025-02-01', '09:00:00', 2, 70.00, 'USD', 'confirmed', 'Couple interested in Dutch colonial history', '+1234567892', 'michael@example.com', 'paid', 'bank_transfer', 'PAY_REF_009', 'BOOK_009', '{"interests": ["colonial_history", "architecture"]}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(10, gen_random_uuid(), 4, 20, '2025-02-14', '08:00:00', 2, 4500000.00, 'IDR', 'pending', 'Honeymoon package with romantic elements', '+1234567894', 'david@example.com', 'pending', 'credit_card', null, 'BOOK_010', '{"special_occasion": "honeymoon", "romantic_setup": true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- NEW BOOKINGS FOR NEW EXPERIENCES

-- Mount Batur Sunrise Trekking Bookings
(11, gen_random_uuid(), 6, 16, '2025-03-01', '03:00:00', 2, 900000.00, 'IDR', 'confirmed', 'Anniversary celebration at sunrise', '+628123456789', 'andi@example.com', 'paid', 'bank_transfer', 'PAY_REF_011', 'BOOK_011', '{"fitness_level": "good", "dietary": "none"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(12, gen_random_uuid(), 6, 17, '2025-03-15', '03:00:00', 4, 1800000.00, 'IDR', 'confirmed', 'Family adventure with teenage kids', '+628987654321', 'sari@example.com', 'paid', 'credit_card', 'PAY_REF_012', 'BOOK_012', '{"group_composition": "family", "kids_age": "14-17"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jakarta Street Food Adventure Bookings
(13, gen_random_uuid(), 7, 18, '2025-03-08', '09:00:00', 2, 550000.00, 'IDR', 'confirmed', 'Food bloggers documentation tour', '+628555123456', 'foodie@example.com', 'paid', 'gopay', 'PAY_REF_013', 'BOOK_013', '{"purpose": "food blogging", "dietary": "no pork"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Bandung Tea Plantation Tour Booking
(14, gen_random_uuid(), 8, 19, '2025-03-20', '08:00:00', 3, 960000.00, 'IDR', 'pending', 'Corporate team building with tea theme', '+628777888999', 'hr@company.com', 'pending', 'bank_transfer', null, 'BOOK_014', '{"group_type": "corporate", "special_request": "team activities"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Yogyakarta Traditional Arts Photo Session Booking
(15, gen_random_uuid(), 9, 20, '2025-04-05', '14:00:00', 1, 425000.00, 'IDR', 'confirmed', 'Solo traveler cultural documentation', '+628111222333', 'culture@example.com', 'paid', 'ovo', 'PAY_REF_014', 'BOOK_015', '{"costume_preference": "royal", "photo_style": "traditional"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Lombok Waterfalls Village Trek Booking  
(16, gen_random_uuid(), 10, 16, '2025-04-12', '07:00:00', 2, 760000.00, 'IDR', 'confirmed', 'Couple adventure with cultural interest', '+628333444555', 'couple@example.com', 'paid', 'dana', 'PAY_REF_015', 'BOOK_016', '{"interests": ["culture", "nature"], "swimming": true}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Surabaya Heroes Monument Booking
(17, gen_random_uuid(), 11, 17, '2025-04-18', '10:00:00', 5, 1125000.00, 'IDR', 'pending', 'Educational trip for high school students', '+628666777888', 'teacher@school.com', 'pending', 'bank_transfer', null, 'BOOK_017', '{"group_type": "educational", "age_group": "16-18"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Jakarta Architecture Photo Tour Booking
(18, gen_random_uuid(), 12, 18, '2025-04-25', '15:00:00', 2, 1100000.00, 'IDR', 'confirmed', 'Architecture students field study', '+628999111222', 'student@archi.com', 'paid', 'shopeepay', 'PAY_REF_016', 'BOOK_018', '{"student_discount": true, "learning_focus": "modern architecture"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Bali Cultural Immersion + Photography Booking
(19, gen_random_uuid(), 13, 19, '2025-05-02', '06:00:00', 2, 1500000.00, 'IDR', 'confirmed', 'Cultural enthusiasts with photography passion', '+628123987456', 'bali@example.com', 'paid', 'credit_card', 'PAY_REF_017', 'BOOK_019', '{"cultural_level": "advanced", "photo_experience": "intermediate"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Java Heritage Circuit Planning Booking
(20, gen_random_uuid(), 14, 20, '2025-05-10', '10:00:00', 6, 15000000.00, 'IDR', 'pending', 'Extended family heritage tour planning', '+628456789123', 'family@heritage.com', 'pending', 'bank_transfer', null, 'BOOK_020', '{"group_size": 6, "heritage_focus": "colonial + traditional"}'::jsonb, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to match the highest ID
SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings));
(12, 12, 1, '2024-04-15 14:00:00', '2024-04-16 08:00:00', '2024-04-23 20:00:00', 3, 1600000.00, 'pending', 'Family with teenagers', 'Planning exciting itinerary that appeals to teenagers too!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, 13, 2, '2024-04-20 11:00:00', '2024-04-21 10:00:00', '2024-04-21 18:00:00', 2, 1100000.00, 'confirmed', 'Food lovers, want authentic local cuisine', 'Preparing special food tour with hidden local gems!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(14, 14, 3, '2024-04-25 13:00:00', '2024-04-26 07:00:00', '2024-04-26 15:00:00', 1, 700000.00, 'pending', 'Adventure photography session', 'Weather permitting, will be an amazing adventure shoot!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 15, 4, '2024-05-01 09:00:00', '2024-05-02 08:00:00', '2024-05-09 19:00:00', 4, 2800000.00, 'confirmed', 'Extended family reunion trip', 'Large group coordination ready. Special family activities planned!', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
