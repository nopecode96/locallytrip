-- Insert Experience Types
-- This file seeds the experience_types table

INSERT INTO experience_types (id, name, description, icon, color, image_url, is_active, sort_order, created_at, updated_at) VALUES

-- Local Tour Guide Experience Types  
(1, 'Couple Tour', 'Romantic tours designed for couples seeking intimate cultural experiences', 
 'fa-heart', '#E91E63', 'couple-tour.jpg', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 'Food Tour', 'Culinary adventures exploring local cuisine and street food',
 'fa-utensils', '#FF9800', 'food-tour.jpg', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'Cultural Tour', 'Deep dive into local traditions, temples, and cultural sites',
 'fa-landmark', '#9C27B0', 'cultural-tour.jpg', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 'Adventure Tour', 'Exciting outdoor activities and nature exploration',
 'fa-mountain', '#4CAF50', 'adventure-tour.jpg', true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 'Spiritual Tour', 'Meditation, healing, and spiritual journey experiences',
 'fa-om', '#FF6B35', 'spiritual-tour.jpg', true, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Photographer Experience Types
(6, 'Portrait Session', 'Professional portrait photography services',
 'fa-camera-retro', '#2196F3', 'portrait-session.jpg', true, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, 'Photography Tour', 'Guided photo tours to capture best moments and locations',
 'fa-camera', '#00BCD4', 'photography-tour.jpg', true, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(8, 'Wedding Photography', 'Professional wedding and couple photography services',
 'fa-rings-wedding', '#E91E63', 'wedding-photography.jpg', true, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Combo Experience Types
(9, 'Photo Tour Combo', 'Combined guided tour with professional photography service',
 'fa-camera-alt', '#FF5722', 'photo-tour-combo.jpg', true, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(10, 'All-in-One Experience', 'Complete package with tour guide, photographer, and planning',
 'fa-star', '#FFC107', 'all-in-one.jpg', true, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(11, 'Culture + Photo Package', 'Cultural immersion with professional photography documentation',
 'fa-palette', '#795548', 'culture-photo.jpg', true, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(12, 'Adventure + Photo', 'Adventure activities with action photography service',
 'fa-hiking', '#607D8B', 'adventure-photo.jpg', true, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Trip Planner Experience Types
(13, 'Custom Itinerary', 'Personalized trip planning and itinerary creation service',
 'fa-map-marked-alt', '#673AB7', 'custom-itinerary.jpg', true, 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(14, 'Multi-City Planning', 'Comprehensive planning for multi-destination trips',
 'fa-route', '#3F51B5', 'multi-city-planning.jpg', true, 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(15, 'Budget Planning', 'Cost-effective trip planning and budget optimization',
 'fa-calculator', '#8BC34A', 'budget-planning.jpg', true, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to match the highest ID
SELECT setval('experience_types_id_seq', (SELECT MAX(id) FROM experience_types));
