-- Experience Itinerary Seed Data
-- Step-by-step itinerary for each experience

DELETE FROM experience_itineraries;

-- Jakarta Heritage Walking Tour itinerary (Experience ID: 1)  
INSERT INTO experience_itineraries (experience_id, step_number, title, description, location_name, duration_minutes, created_at) VALUES
(1, 1, 'Meet at Fatahillah Square', 'Meet your local guide at the iconic Fatahillah Square, the heart of Jakarta Old Town. Brief introduction and overview of the tour.', 'Fatahillah Square, Jakarta Old Town', 15, NOW()),
(1, 2, 'Jakarta History Museum', 'Explore the Jakarta History Museum housed in the former city hall of Batavia. Learn about Jakarta''s transformation from Sunda Kelapa to modern metropolis.', 'Jakarta History Museum', 45, NOW()),
(1, 3, 'Wayang Museum', 'Discover the art of Indonesian shadow puppetry at Wayang Museum. Watch traditional puppet shows and learn about this UNESCO-recognized art form.', 'Wayang Museum', 30, NOW()),
(1, 4, 'Cafe Batavia', 'Coffee break at the famous Cafe Batavia, a colonial-era restaurant with antique decorations and historical ambiance.', 'Cafe Batavia', 30, NOW()),
(1, 5, 'Bank Indonesia Museum', 'Visit the Bank Indonesia Museum to understand the economic history of Indonesia and see the old bank vault.', 'Bank Indonesia Museum', 40, NOW()),
(1, 6, 'Sunda Kelapa Harbor', 'Walk to the traditional harbor where wooden schooners (pinisi) still dock, representing Jakarta''s maritime heritage.', 'Sunda Kelapa Harbor', 45, NOW()),

-- Sacred Temples & Rice Terraces Tour itinerary (Experience ID: 2)  
(2, 1, 'Hotel Pickup', 'Comfortable pickup from your hotel in Ubud area. Meet your knowledgeable local guide.', 'Ubud Hotel Area', 15, NOW()),
(2, 2, 'Tirta Empul Temple', 'Visit the sacred holy water temple where locals come for purification rituals. Optional participation in the cleansing ceremony.', 'Tirta Empul Temple', 60, NOW()),
(2, 3, 'Tegallalang Rice Terraces', 'Explore the stunning UNESCO-listed rice terraces. Perfect photo opportunities and learn about traditional Subak irrigation system.', 'Tegallalang Rice Terraces', 75, NOW()),
(2, 4, 'Traditional Lunch', 'Enjoy authentic Balinese lunch at a local warung with views of rice fields.', 'Local Warung, Tegallalang', 60, NOW()),
(2, 5, 'Gunung Kawi Temple', 'Discover the ancient royal tombs carved into rock faces. Walk through beautiful gardens and learn about 11th-century Balinese history.', 'Gunung Kawi Temple', 90, NOW()),
(2, 6, 'Coffee Plantation Visit', 'Visit traditional coffee plantation, taste various Indonesian coffees and teas, including the famous Luwak coffee.', 'Bali Coffee Plantation', 45, NOW()),

-- Jakarta Portrait Photography Session itinerary (Experience ID: 3)
(3, 1, 'Consultation & Planning', 'Meet with photographer to discuss your vision, preferred styles, and outfit coordination.', 'Meeting Point Jakarta', 30, NOW()),
(3, 2, 'National Monument Area', 'Professional portrait session at Indonesia''s iconic National Monument with beautiful backdrops.', 'National Monument (Monas)', 45, NOW()),
(3, 3, 'Hotel Indonesia Roundabout', 'Urban portraits at the famous HI Roundabout with modern Jakarta cityscape in background.', 'Hotel Indonesia Roundabout', 30, NOW()),
(3, 4, 'Grand Indonesia Mall Area', 'Indoor and outdoor shots around Jakarta''s premium shopping district with architectural elements.', 'Grand Indonesia Area', 45, NOW()),
(3, 5, 'Review & Selection', 'Quick review of captured shots and final selections with immediate editing preview.', 'Photography Studio Mobile', 30, NOW()),

-- Balinese Temple Photography Tour itinerary (Experience ID: 4)
(4, 1, 'Early Morning Pickup', 'Early pickup to catch the golden hour lighting at temples with fewer crowds.', 'Hotel Pickup Ubud', 15, NOW()),
(4, 2, 'Besakih Temple Complex', 'Photography session at Bali''s Mother Temple with stunning Mount Agung backdrop.', 'Besakih Temple', 90, NOW()),
(4, 3, 'Traditional Breakfast', 'Local breakfast with temple views and equipment check.', 'Local Warung near Besakih', 45, NOW()),
(4, 4, 'Lempuyang Temple', 'Iconic Gates of Heaven photography with Mount Agung framing.', 'Lempuyang Temple', 75, NOW()),
(4, 5, 'Tirta Gangga Water Palace', 'Architectural and reflection photography at the royal water gardens.', 'Tirta Gangga', 60, NOW()),
(4, 6, 'Photo Processing & Review', 'Professional editing session and final photo selection with the photographer.', 'Photography Studio', 45, NOW()),

-- Yogyakarta Cultural Walking Tour itinerary (Experience ID: 5)
(5, 1, 'Malioboro Street Start', 'Begin the cultural journey at the famous Malioboro Street, heart of Yogyakarta.', 'Malioboro Street', 20, NOW()),
(5, 2, 'Sultan Palace (Kraton)', 'Explore the living palace of Yogyakarta Sultan and learn about Javanese royal culture.', 'Kraton Yogyakarta', 75, NOW()),
(5, 3, 'Traditional Lunch', 'Authentic Gudeg lunch, Yogyakarta''s signature dish, at a historic restaurant.', 'Gudeg Yu Djum', 45, NOW()),
(5, 4, 'Taman Sari Water Castle', 'Discover the ruins of the royal garden and water castle with its underground passages.', 'Taman Sari', 60, NOW()),
(5, 5, 'Silver & Batik Workshop', 'Visit traditional silver smiths and batik artisans to see craftwork in action.', 'Kotagede Silver District', 90, NOW()),
(5, 6, 'Sunset at Prambanan', 'End the day with sunset views at the magnificent Hindu temple complex.', 'Prambanan Temple', 75, NOW());

-- Reset sequence to continue from the last ID
SELECT setval('experience_itineraries_id_seq', (SELECT MAX(id) FROM experience_itineraries));