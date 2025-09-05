-- Insert Featured Hosts
-- This file seeds the featured_hosts table

INSERT INTO featured_hosts (id, host_id, title, description, featured_until, display_order, is_active, created_at, updated_at) VALUES
(1, 8, 'Bali''s Most Authentic Guide', 'Aria has been showing travelers the real Bali for over 10 years. Experience hidden temples and rice terraces through the eyes of a true local.', '2025-12-31 23:59:59', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 9, 'Jakarta''s Premier Photographer', 'Maya captures the soul of Jakarta in every shot. Perfect for couples and solo travelers looking for stunning portraits against the city''s backdrop.', '2025-12-31 23:59:59', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 6, 'Heritage Walking Expert', 'Budi brings Jakarta''s colonial history to life with captivating stories and insider knowledge of the Old Town''s hidden corners.', '2025-12-31 23:59:59', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 7, 'Cultural Immersion Specialist', 'Sari offers deep dives into Balinese spirituality and traditions, perfect for travelers seeking meaningful cultural connections.', '2025-12-31 23:59:59', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 12, 'Ultimate Experience Curator', 'Wayan combines guiding, photography, and trip planning for the ultimate Bali experience package. One host, endless possibilities.', '2025-12-31 23:59:59', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence
SELECT setval('featured_hosts_id_seq', (SELECT MAX(id) FROM featured_hosts));
