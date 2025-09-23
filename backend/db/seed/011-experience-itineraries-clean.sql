-- Experience Itinerary Seed Data
-- Step-by-step itinerary for each experience

-- Jakarta Heritage Walking Tour itinerary (Experience ID: 1)  
INSERT INTO experience_itineraries (experience_id, step_number, title, description, location_name, duration_minutes, created_at) VALUES
(1, 1, 'Meet at Fatahillah Square', 'Meet your local guide at the iconic Fatahillah Square, the heart of Jakarta Old Town. Brief introduction and overview of the tour.', 'Fatahillah Square, Jakarta Old Town', 15, NOW()),
(1, 2, 'Jakarta History Museum', 'Explore the Jakarta History Museum housed in the former city hall of Batavia. Learn about Jakarta''s transformation from Sunda Kelapa to modern metropolis.', 'Jakarta History Museum', 45, NOW(), NOW()),
(1, 3, 'Wayang Museum', 'Discover the art of Indonesian shadow puppetry at Wayang Museum. Watch traditional puppet shows and learn about this UNESCO-recognized art form.', 'Wayang Museum', 30, NOW(), NOW()),
(1, 4, 'Cafe Batavia', 'Coffee break at the famous Cafe Batavia, a colonial-era restaurant with antique decorations and historical ambiance.', 'Cafe Batavia', 30, NOW(), NOW()),
(1, 5, 'Bank Indonesia Museum', 'Visit the Bank Indonesia Museum to understand the economic history of Indonesia and see the old bank vault.', 'Bank Indonesia Museum', 40, NOW(), NOW()),
(1, 6, 'Sunda Kelapa Harbor', 'Walk to the traditional harbor where wooden schooners (pinisi) still dock, representing Jakarta''s maritime heritage.', 'Sunda Kelapa Harbor', 45, NOW(), NOW()),

-- Sacred Temples & Rice Terraces Tour itinerary (Experience ID: 2)  
(2, 1, 'Hotel Pickup', 'Comfortable pickup from your hotel in Ubud area. Meet your knowledgeable local guide.', 'Ubud Hotel Area', 15, NOW(), NOW()),
(2, 2, 'Tirta Empul Temple', 'Visit the sacred holy water temple where locals come for purification rituals. Optional participation in the cleansing ceremony.', 'Tirta Empul Temple', 60, NOW(), NOW()),
(2, 3, 'Tegallalang Rice Terraces', 'Explore the stunning UNESCO-listed rice terraces. Perfect photo opportunities and learn about traditional Subak irrigation system.', 'Tegallalang Rice Terraces', 75, NOW(), NOW()),
(2, 4, 'Traditional Lunch', 'Enjoy authentic Balinese lunch at a local warung with views of rice fields.', 'Local Warung, Tegallalang', 60, NOW(), NOW()),
(2, 5, 'Gunung Kawi Temple', 'Discover the ancient royal tombs carved into rock faces. Walk through beautiful gardens and learn about 11th-century Balinese history.', 'Gunung Kawi Temple', 90, NOW(), NOW()),
(2, 6, 'Coffee Plantation Visit', 'Visit traditional coffee plantation, taste various Indonesian coffees and teas, including the famous Luwak coffee.', 'Bali Coffee Plantation', 45, NOW(), NOW()),

-- Jakarta Portrait Photography Session itinerary (Experience ID: 3)
(3, 1, 'Consultation & Planning', 'Meet with photographer to discuss your vision, preferred styles, and outfit coordination.', 'Meeting Point Jakarta', 30, NOW(), NOW()),
(3, 2, 'National Monument Area', 'Professional portrait session at Indonesia''s iconic National Monument with beautiful backdrops.', 'National Monument (Monas)', 45, NOW(), NOW()),
(3, 3, 'Hotel Indonesia Roundabout', 'Urban portraits at the famous HI Roundabout with modern Jakarta cityscape in background.', 'Hotel Indonesia Roundabout', 30, NOW(), NOW()),
(3, 4, 'Grand Indonesia Mall Area', 'Indoor and outdoor shots around Jakarta''s premium shopping district with architectural elements.', 'Grand Indonesia Area', 45, NOW(), NOW()),
(3, 5, 'Photo Review & Selection', 'Quick review of shots taken, select favorites for immediate editing preview.', 'Nearby Cafe', 30, NOW(), NOW()),

-- Bali Complete Experience Package itinerary (Experience ID: 4)
(4, 1, 'Welcome & Trip Planning', 'Detailed consultation to customize your Bali experience based on preferences and interests.', 'Meeting Point Ubud', 60, NOW(), NOW()),
(4, 2, 'Temple Hopping Tour', 'Guided visit to 3 significant temples: Tirta Empul, Gunung Kawi, and Goa Gajah with cultural insights.', 'Multiple Temple Locations', 180, NOW(), NOW()),
(4, 3, 'Professional Photography', 'Dedicated photo session at rice terraces and temples with professional photographer.', 'Tegallalang Rice Terraces', 90, NOW(), NOW()),
(4, 4, 'Traditional Lunch Experience', 'Authentic Balinese cooking class followed by lunch with local family.', 'Local Family Home', 120, NOW(), NOW()),
(4, 5, 'Beach & Sunset Session', 'Transfer to beach area for sunset photography and relaxation.', 'Canggu Beach', 90, NOW(), NOW()),
(4, 6, 'Trip Planning Finalization', 'Complete personalized itinerary delivery with bookings and recommendations for rest of stay.', 'Hotel Drop-off', 30, NOW(), NOW()),

-- Custom Indonesia Trip Planning Service itinerary (Experience ID: 5)
(5, 1, 'Initial Consultation', 'Comprehensive discussion about travel preferences, budget, interests, and travel dates.', 'Online/Phone Consultation', 60, NOW(), NOW()),
(5, 2, 'Destination Research', 'Detailed research and proposal of destinations, activities, and experiences tailored to your interests.', 'Research Phase', 120, NOW(), NOW()),
(5, 3, 'Itinerary Draft Creation', 'Create detailed day-by-day itinerary with multiple options for activities and accommodations.', 'Planning Phase', 180, NOW(), NOW()),
(5, 4, 'Review & Refinement', 'Present itinerary options, gather feedback, and refine the plan based on your preferences.', 'Online Review Session', 90, NOW(), NOW()),
(5, 5, 'Booking Coordination', 'Handle all bookings for accommodations, activities, transportation, and special experiences.', 'Booking Phase', 120, NOW(), NOW()),
(5, 6, 'Final Documentation', 'Deliver comprehensive travel package with confirmations, emergency contacts, and local tips.', 'Documentation Delivery', 30, NOW(), NOW()),

-- Mount Batur Sunrise Trekking itinerary (Experience ID: 6)
(6, 1, 'Early Morning Pickup', 'Pickup from hotel at 3:00 AM for Mount Batur trek. Brief safety introduction and equipment check.', 'Hotel pickup Ubud area', 30, NOW(), NOW()),
(6, 2, 'Trek Start', 'Begin trek in darkness with headlamps. Gradual ascent through volcanic landscape.', 'Mount Batur Base', 120, NOW(), NOW()),
(6, 3, 'Summit Sunrise', 'Reach summit for spectacular sunrise viewing. Time for photos and rest.', 'Mount Batur Summit', 60, NOW(), NOW()),
(6, 4, 'Volcanic Breakfast', 'Traditional breakfast cooked using volcanic steam. Unique cooking method demonstration.', 'Summit Area', 45, NOW(), NOW()),
(6, 5, 'Descent & Hot Springs', 'Descend mountain and visit natural hot springs for relaxation.', 'Natural Hot Springs', 90, NOW(), NOW()),
(6, 6, 'Hotel Return', 'Return journey to hotel with stops for photos and souvenirs.', 'Hotel drop-off', 45, NOW(), NOW()),

-- Jakarta Street Food Adventure itinerary (Experience ID: 7)
(7, 1, 'Traditional Market Tour', 'Explore traditional Jakarta markets. Learn about local ingredients and spices.', 'Pasar Baru Traditional Market', 60, -6.1645, 106.8370, true, NOW(), NOW()),
(7, 2, 'Street Food Tasting', 'Taste iconic Jakarta street foods: kerak telor, soto betawi, gado-gado.', 'Street Food Vendors', 90, -6.1352, 106.8133, true, NOW(), NOW()),
(7, 3, 'Traditional Beverage', 'Try traditional Indonesian drinks: es doger, bajigur, cendol.', 'Traditional Drink Stalls', 30, -6.1380, 106.8150, true, NOW(), NOW()),
(7, 4, 'Modern Food Court', 'Experience modern Indonesian cuisine in contemporary food court setting.', 'Grand Indonesia Food Court', 60, -6.1956, 106.8239, true, NOW(), NOW()),

-- Bandung Tea Plantation Tour itinerary (Experience ID: 8)
(8, 1, 'Highland Drive', 'Scenic drive to Bandung highlands with stops at viewpoints.', 'Highland Road Bandung', 60, -6.8650, 107.5950, true, NOW(), NOW()),
(8, 2, 'Tea Plantation Walk', 'Guided walk through tea plantation. Learn about tea cultivation and varieties.', 'Tea Plantation Fields', 90, -6.8400, 107.6000, true, NOW(), NOW()),
(8, 3, 'Tea Processing Tour', 'Visit tea factory and observe traditional tea processing methods.', 'Colonial Tea Factory', 60, -6.8350, 107.6050, true, NOW(), NOW()),
(8, 4, 'Tea Tasting Session', 'Professional tea tasting with different varieties and brewing methods.', 'Tea House', 45, -6.8380, 107.6020, true, NOW(), NOW()),
(8, 5, 'Highland Views', 'Enjoy panoramic views of Bandung valley with afternoon tea.', 'Highland Viewpoint', 45, -6.8300, 107.6100, true, NOW(), NOW()),

-- Yogyakarta Traditional Arts Photo Session itinerary (Experience ID: 9)
(9, 1, 'Costume Selection', 'Choose and fit traditional Javanese costumes with cultural explanation.', 'Costume Studio Yogyakarta', 45, -7.8053, 110.3587, true, NOW(), NOW()),
(9, 2, 'Water Castle Shoot', 'Photography session at historic Taman Sari Water Castle.', 'Taman Sari Water Castle', 90, -7.8053, 110.3587, true, NOW(), NOW()),
(9, 3, 'Cultural Props Session', 'Photos with traditional Javanese cultural artifacts and instruments.', 'Cultural Heritage Center', 60, -7.8000, 110.3600, true, NOW(), NOW()),

-- Lombok Waterfalls Village Trek itinerary (Experience ID: 10)
(10, 1, 'Village Introduction', 'Meet with Sasak village elders and learn about traditional customs.', 'Senaru Village Center', 45, NOW(), NOW()),
(10, 2, 'Village Trek', 'Trek through traditional Sasak villages observing daily life and agriculture.', 'Traditional Village Path', 120, NOW(), NOW()),
(10, 3, 'Waterfall Discovery', 'Reach hidden waterfall with crystal clear natural pools.', 'Sekumpul Waterfall', 90, NOW(), NOW()),
(10, 4, 'Swimming & Lunch', 'Swimming in natural pools and traditional Sasak lunch by the waterfall.', 'Waterfall Base', 90, NOW(), NOW()),
(10, 5, 'Cultural Demonstration', 'Traditional Sasak weaving and craft demonstration by villagers.', 'Village Craft Center', 60, NOW(), NOW()),

-- Surabaya Heroes Monument itinerary (Experience ID: 11)
(11, 1, 'Heroes Monument Tour', 'Guided tour of Heroes Monument and independence history museum.', 'Heroes Monument Surabaya', 90, NOW(), NOW()),
(11, 2, 'Historic District Walk', 'Walking tour through Surabaya historic district and colonial buildings.', 'Surabaya Historic District', 90, NOW(), NOW()),
(11, 3, 'Independence Sites', 'Visit key locations related to Battle of Surabaya and independence struggle.', 'Independence Memorial Sites', 60, NOW(), NOW()),

-- Jakarta Architecture Photo Tour itinerary (Experience ID: 12)
(12, 1, 'Modern Skyline', 'Photography of Jakarta modern skyline from multiple vantage points.', 'Bundaran HI Area', 90, NOW(), NOW()),
(12, 2, 'Architectural Details', 'Close-up photography of architectural details and design elements.', 'Modern Buildings District', 90, NOW(), NOW()),
(12, 3, 'Urban Composition', 'Learn composition techniques for urban architecture photography.', 'Various City Locations', 60, NOW(), NOW()),
(12, 4, 'Editing Workshop', 'Quick photo editing session and technique sharing.', 'Photography Studio', 60, NOW(), NOW()),

-- Bali Cultural Immersion + Photography itinerary (Experience ID: 13)
(13, 1, 'Temple Morning Ceremony', 'Participate in traditional Balinese temple ceremony with photography.', 'Traditional Balinese Temple', 120, NOW(), NOW()),
(13, 2, 'Rice Terrace Photography', 'Professional photography session at Tegallalang rice terraces.', 'Tegallalang Rice Terraces', 90, NOW(), NOW()),
(13, 3, 'Traditional Market', 'Explore traditional market with cultural guide and photography.', 'Ubud Traditional Market', 90, NOW(), NOW()),
(13, 4, 'Cultural Workshop', 'Hands-on traditional Balinese arts workshop with photo documentation.', 'Arts Village Ubud', 90, NOW(), NOW()),
(13, 5, 'Sunset Temple Visit', 'Visit cliff temple for sunset photography and cultural reflection.', 'Tanah Lot Temple', 90, NOW(), NOW()),

-- Java Heritage Circuit Planning itinerary (Experience ID: 14)
(14, 1, 'Heritage Assessment', 'Comprehensive assessment of Java cultural heritage interests and preferences.', 'Online Consultation', 90, NOW(), NOW()),
(14, 2, 'Multi-City Research', 'Research and route planning for Jakarta-Bandung-Yogyakarta-Solo circuit.', 'Planning Phase', 180, NOW(), NOW()),
(14, 3, 'Cultural Sites Selection', 'Curate specific cultural and heritage sites for each city with historical context.', 'Site Curation Phase', 120, NOW(), NOW()),
(14, 4, 'Accommodation & Transport', 'Arrange heritage hotels and cultural transport experiences.', 'Booking Coordination', 90, NOW(), NOW()),
(14, 5, 'Final Documentation', 'Complete heritage circuit itinerary with cultural guides and historical context.', 'Documentation Delivery', 60, NOW(), NOW()),

-- Bali Wedding Pre-shoot itinerary (Experience ID: 15)
(15, 1, 'Pre-shoot Consultation', 'Styling consultation, outfit coordination, and location planning.', 'Photography Studio Bali', 60, NOW(), NOW()),
(15, 2, 'Rice Terrace Romance', 'Romantic couple photography session at Tegallalang rice terraces.', 'Tegallalang Rice Terraces', 180, NOW(), NOW()),
(15, 3, 'Temple Heritage Shoot', 'Traditional Balinese temple photography with cultural elements.', 'Ancient Balinese Temple', 150, NOW(), NOW()),
(15, 4, 'Beach Sunset Session', 'Romantic sunset photography session at pristine Bali beach.', 'Sekumpul Beach Bali', 180, NOW(), NOW()),
(15, 5, 'Photo Review & Selection', 'Professional photo review session and final selection process.', 'Photography Studio', 90, NOW());

-- Reset sequence for experience_itineraries table
SELECT setval('experience_itineraries_id_seq', (SELECT MAX(id) FROM experience_itineraries));
