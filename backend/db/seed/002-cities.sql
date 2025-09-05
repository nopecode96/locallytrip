-- Insert Cities
-- This file seeds the cities table

INSERT INTO cities (id, name, country_id, latitude, longitude, description, image_url, is_active, created_at, updated_at) VALUES
-- Indonesia Cities
(1, 'Jakarta', 1, -6.2088, 106.8456, 'The bustling capital city of Indonesia, known for its vibrant culture and modern skyline.', 'jakarta.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Bali', 1, -8.3405, 115.0920, 'The Island of Gods, famous for its beautiful beaches, temples, and rich Hindu culture.', 'bali.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Yogyakarta', 1, -7.7956, 110.3695, 'The cultural heart of Java, home to ancient temples and royal palaces.', 'yogyakarta.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Bandung', 1, -6.9175, 107.6191, 'The Paris of Java, known for its cool climate and Dutch colonial architecture.', 'bandung.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'Surabaya', 1, -7.2575, 112.7521, 'The capital of East Java, a major industrial and business center.', 'surabaya.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'Medan', 1, 3.5952, 98.6722, 'The largest city in Sumatra, gateway to Lake Toba and Orangutan sanctuaries.', 'default-city.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'Semarang', 1, -6.9667, 110.4167, 'A historic port city with beautiful colonial architecture and rich Chinese heritage.', 'default-city.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'Makassar', 1, -5.1477, 119.4327, 'The gateway to Eastern Indonesia, known for its seafood and maritime culture.', 'default-city.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 'Palembang', 1, -2.9761, 104.7754, 'Ancient city on the Musi River, former capital of the Srivijaya empire.', 'default-city.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'Lombok', 1, -8.6500, 116.3242, 'Beautiful island near Bali, known for pristine beaches and Mount Rinjani.', 'default-city.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Malaysia Cities  
(11, 'Kuala Lumpur', 2, 3.1319, 101.6841, 'The capital of Malaysia, famous for its Twin Towers and diverse culture.', 'default-city.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'George Town', 2, 5.4164, 100.3327, 'UNESCO World Heritage city in Penang, known for its street art and food.', 'default-city.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Singapore
(13, 'Singapore', 3, 1.3521, 103.8198, 'The Lion City, a modern city-state known for its gardens and multicultural harmony.', 'default-city.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Thailand
(14, 'Bangkok', 4, 13.7563, 100.5018, 'The capital of Thailand, famous for its temples, street food, and vibrant nightlife.', 'bangkok.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(15, 'Phuket', 4, 7.8804, 98.3923, 'Tropical paradise island known for its beaches and water sports.', 'default-city.jpg', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to continue from the last ID
SELECT setval('cities_id_seq', (SELECT MAX(id) FROM cities));
