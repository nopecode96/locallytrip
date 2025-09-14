-- Insert Users
-- This file seeds the users table
-- Password for all users: "$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS."

INSERT INTO users (id, uuid, name, email, password_hash, role, role_id, phone, avatar_url, bio, city_id, is_verified, is_active, email_verified_at, created_at, updated_at) VALUES
-- Super Admin
(1, gen_random_uuid(), 'Super Admin', 'superadmin@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'super_admin', 4, '+6281234567890', 'admin-1.jpg', 'Super Administrator of LocallyTrip platform', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Admin Users
(2, gen_random_uuid(), 'Admin User', 'admin@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'admin', 5, '+6281234567891', 'admin-2.jpg', 'Platform Administrator', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, gen_random_uuid(), 'Finance Admin', 'finance@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'finance', 6, '+6281234567892', 'admin-3.jpg', 'Financial operations and reporting', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, gen_random_uuid(), 'Marketing Admin', 'marketing@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'marketing', 7, '+6281234567893', 'admin-4.jpg', 'Marketing campaigns and promotions', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, gen_random_uuid(), 'Content Moderator', 'moderator@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'moderator', 8, '+6281234567894', 'admin-5.jpg', 'Content moderation and quality control', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Host Users (Local Tour Guides)
(6, gen_random_uuid(), 'Budi Santoso', 'budi@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456001', 'host-1.jpg', 'Professional tour guide in Jakarta with 5+ years experience. Specialized in cultural and historical tours.', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, gen_random_uuid(), 'Sari Dewi', 'sari@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456002', 'host-2.jpg', 'Bali local guide passionate about Balinese culture, temples, and authentic experiences.', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, gen_random_uuid(), 'Agus Wijaya', 'agus@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456003', 'host-3.jpg', 'Yogyakarta expert guide with deep knowledge of Javanese culture and royal heritage.', 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, gen_random_uuid(), 'Made Ngurah', 'made@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456004', 'host-4.jpg', 'Adventure guide specializing in volcano trekking and nature tours in Bali.', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Photographer Hosts
(10, gen_random_uuid(), 'Rina Photography', 'rina@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456005', 'host-5.jpg', 'Professional photographer offering photo tours and portrait sessions in beautiful Jakarta locations.', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(11, gen_random_uuid(), 'Dika Lens Studio', 'dika@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456006', 'host-6.jpg', 'Wedding and travel photographer with artistic eye for capturing Balinese beauty.', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Combo Hosts
(12, gen_random_uuid(), 'Wayan Combo Tours', 'wayan@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456007', 'host-7.jpg', 'Complete travel service provider: guiding, photography, and trip planning in one package.', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(13, gen_random_uuid(), 'Jakarta All-in-One', 'jakarta.combo@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456008', 'host-8.jpg', 'Your one-stop solution for Jakarta experiences: tours, photos, and custom itineraries.', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Trip Planners
(14, gen_random_uuid(), 'Indonesia Travel Pro', 'planner1@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456009', 'host-9.jpg', 'Expert trip planner creating personalized Indonesian adventures for every traveler type.', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, gen_random_uuid(), 'Wanderlust Planner', 'wanderlust@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456010', 'host-10.jpg', 'Specialized in crafting unique multi-city Indonesian itineraries with local insights.', 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Regular Traveller Users
(16, gen_random_uuid(), 'John Smith', 'john@example.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'traveller', 1, '+1234567890', 'traveller-1.jpg', 'Adventure traveler from USA, love exploring Southeast Asian cultures.', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(17, gen_random_uuid(), 'Sarah Johnson', 'sarah@example.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'traveller', 1, '+1234567891', 'traveller-2.jpg', 'Digital nomad and travel blogger documenting authentic local experiences.', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(18, gen_random_uuid(), 'Michael Brown', 'michael@example.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'traveller', 1, '+1234567892', 'traveller-3.jpg', 'Solo traveler passionate about photography and local cuisine discovery.', 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(19, gen_random_uuid(), 'Emma Wilson', 'emma@example.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'traveller', 1, '+1234567893', 'traveller-4.jpg', 'Backpacker exploring Indonesia on a budget, seeking authentic cultural exchanges.', 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(20, gen_random_uuid(), 'David Lee', 'david@example.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'traveller', 1, '+1234567894', 'traveller-5.jpg', 'Business traveler who extends trips for cultural exploration and local experiences.', 5, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Affiliate Users
(21, gen_random_uuid(), 'TravelBlog Indonesia', 'affiliate1@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'affiliate', 3, '+628123456011', 'affiliate-1.jpg', 'Popular Indonesia travel blog promoting authentic local experiences.', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(22, gen_random_uuid(), 'Southeast Asia Guide', 'affiliate2@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'affiliate', 3, '+628123456012', 'affiliate-2.jpg', 'Travel agency specializing in Southeast Asian adventures and cultural tours.', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Partner Users
(23, gen_random_uuid(), 'Bali Hotels Group', 'partner1@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'partner', 9, '+628123456013', 'partner-1.jpg', 'Hotel partner offering accommodation packages with local experiences.', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(24, gen_random_uuid(), 'Jakarta Transport Co', 'partner2@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'partner', 9, '+628123456014', 'partner-2.jpg', 'Transportation partner providing transfer services for local experiences.', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Additional Hosts for diverse experiences
(25, gen_random_uuid(), 'Ketut Bali Guide', 'ketut@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456015', 'host-11.jpg', 'Traditional Balinese guide specializing in spiritual and temple tours.', 2, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(26, gen_random_uuid(), 'Joko Jakarta Food', 'joko@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456016', 'host-12.jpg', 'Jakarta food expert offering authentic culinary tours and cooking classes.', 1, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(27, gen_random_uuid(), 'Eko Bandung Explorer', 'eko@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456017', 'host-13.jpg', 'Bandung local guide focusing on art, culture, and highland adventures.', 4, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(28, gen_random_uuid(), 'Lestari Yogya Arts', 'lestari@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456018', 'host-14.jpg', 'Yogyakarta artist and guide offering batik workshops and cultural immersion.', 3, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(29, gen_random_uuid(), 'Putu Lombok Adventure', 'putu@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456019', 'host-15.jpg', 'Lombok adventure guide specializing in Mount Rinjani trekking and island hopping.', 10, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(30, gen_random_uuid(), 'Indra Surabaya Heritage', 'indra@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'host', 2, '+628123456020', 'host-16.jpg', 'Surabaya heritage guide with expertise in East Javanese history and culture.', 5, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to continue from the last ID
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Reset sequence to continue from the last ID
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Additional users with full profile data
INSERT INTO users (id, uuid, name, email, password_hash, role, role_id, city_id, phone, bio, is_active, is_verified, created_at, updated_at) VALUES

-- Admin
(101, gen_random_uuid(), 'Platform Admin', 'admin@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'admin', 5, 1, '+62-21-2345678', 'Platform administrator handling daily operations', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Finance
(102, gen_random_uuid(), 'Finance Manager', 'finance@locallytrip.com', '$2a$10$2E5mcUd3TQ21egKhnjLTrua8pGf.0Ujrfq6PkNBycRvhCRRvoFYS.', 'finance', 6, 1, '+62-21-3456789', 'Finance manager handling payments and transactions', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
-- Reset sequence to continue from the last ID
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
