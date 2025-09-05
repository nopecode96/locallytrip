-- Insert Host Categories
-- This file seeds the host_categories table
-- These categories are specifically related to the 'host' role

INSERT INTO host_categories (id, name, description, icon, color, is_active, sort_order, created_at, updated_at) VALUES
(1, 'Local Tour Guide', 'Experienced local guides offering authentic cultural tours and city exploration', 
 'fa-map-marked-alt', '#3B82F6', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 'Photographer', 'Professional photographers providing photo sessions and visual storytelling services', 
 'fa-camera', '#8B5CF6', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'Combo (Local Tour Guide + Photographer)', 'Multi-skilled hosts combining tour guiding with professional photography services', 
 'fa-camera-retro', '#F59E0B', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 'Trip Planner', 'Expert travel planners creating customized itineraries and travel arrangements', 
 'fa-route', '#10B981', true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to continue from the last ID
SELECT setval('host_categories_id_seq', (SELECT MAX(id) FROM host_categories));
