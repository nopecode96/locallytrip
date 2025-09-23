-- Featured Content Seed Data
-- This file seeds featured_experiences, featured_cities, and featured_stories

DELETE FROM featured_experiences;
DELETE FROM featured_cities;
DELETE FROM featured_stories;

-- Featured Experiences
INSERT INTO featured_experiences (id, experience_id, title, description, badge, display_order, is_active, featured_until, featured_image_url, created_at, updated_at) VALUES
(1, 1, 'Jakarta Heritage Discovery', 'Explore Jakarta''s rich colonial history with a local expert guide', 'Most Popular', 1, true, NULL, '/images/experiences/jakarta-heritage-featured.jpg', NOW(), NOW()),
(2, 2, 'Sacred Bali Temple Tour', 'Spiritual journey through Bali''s most sacred temples and rice terraces', 'Cultural Pick', 2, true, NULL, '/images/experiences/bali-temple-featured.jpg', NOW(), NOW()),
(3, 4, 'Temple Photography Tour', 'Capture Bali''s spiritual beauty with professional photography guidance', 'Photo Special', 3, true, NULL, '/images/experiences/temple-photo-featured.jpg', NOW(), NOW()),
(4, 5, 'Yogyakarta Royal Culture', 'Immerse in Javanese royal heritage and traditional crafts', 'Heritage Choice', 4, true, NULL, '/images/experiences/yogya-culture-featured.jpg', NOW(), NOW()),
(5, 3, 'Jakarta Portrait Session', 'Professional portrait photography in Jakarta''s iconic locations', 'Creator Favorite', 5, true, NULL, '/images/experiences/jakarta-portrait-featured.jpg', NOW(), NOW());

-- Featured Cities  
INSERT INTO featured_cities (id, city_id, title, description, badge, display_order, is_active, featured_until, featured_image_url, created_at, updated_at) VALUES
(1, 1, 'Jakarta - Capital Discovery', 'Indonesia''s bustling capital city with rich history and modern attractions', 'Capital City', 1, true, NULL, '/images/cities/jakarta-featured.jpg', NOW(), NOW()),
(2, 2, 'Bali - Island Paradise', 'Tropical paradise with stunning temples, rice terraces, and cultural experiences', 'Island Paradise', 2, true, NULL, '/images/cities/bali-featured.jpg', NOW(), NOW()),
(3, 3, 'Yogyakarta - Cultural Heart', 'Cultural center of Java with royal palaces, temples, and traditional arts', 'Cultural Hub', 3, true, NULL, '/images/cities/yogyakarta-featured.jpg', NOW(), NOW()),
(4, 4, 'Bandung - Cool Highlands', 'Mountain city known for its cool climate, outlet shopping, and culinary scene', 'Mountain Retreat', 4, true, NULL, '/images/cities/bandung-featured.jpg', NOW(), NOW()),
(5, 5, 'Surabaya - East Java Gateway', 'Historic port city and gateway to East Java''s natural and cultural attractions', 'Historic Port', 5, true, NULL, '/images/cities/surabaya-featured.jpg', NOW(), NOW());

-- Featured Stories
INSERT INTO featured_stories (id, story_id, title, description, badge, display_order, is_active, featured_until, featured_image_url, created_at, updated_at) VALUES
(1, 1, 'Hidden Temples of Bali', 'Discovering secret temples off the beaten path with local wisdom', 'Editor''s Choice', 1, true, NULL, '/images/stories/bali-temples-featured.jpg', NOW(), NOW()),
(2, 3, 'Jakarta Street Food Adventure', 'A culinary journey through Jakarta''s diverse street food scene', 'Food Lover', 2, true, NULL, '/images/stories/jakarta-food-featured.jpg', NOW(), NOW()),
(3, 5, 'Sunrise at Borobudur', 'Experiencing the magical sunrise at Indonesia''s most famous Buddhist temple', 'Spiritual Journey', 3, true, NULL, '/images/stories/borobudur-featured.jpg', NOW(), NOW()),
(4, 7, 'Batik Making in Yogyakarta', 'Learning the ancient art of batik from master craftsmen', 'Cultural Experience', 4, true, NULL, '/images/stories/batik-featured.jpg', NOW(), NOW()),
(5, 9, 'Mount Bromo Adventure', 'Epic journey to witness the otherworldly beauty of Mount Bromo', 'Adventure Pick', 5, true, NULL, '/images/stories/bromo-featured.jpg', NOW(), NOW());

-- Reset sequences
SELECT setval('featured_experiences_id_seq', (SELECT MAX(id) FROM featured_experiences));
SELECT setval('featured_cities_id_seq', (SELECT MAX(id) FROM featured_cities));
SELECT setval('featured_stories_id_seq', (SELECT MAX(id) FROM featured_stories));