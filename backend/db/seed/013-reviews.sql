-- Insert Reviews
-- This file seeds the reviews table with guest reviews for completed experiences

INSERT INTO reviews (id, experience_id, reviewer_id, booking_id, rating, title, comment, is_verified, created_at, updated_at) VALUES

-- Reviews for completed bookings
(1, 1, 16, 1, 5, 'Amazing Heritage Tour!', 
 'Budi was an incredible guide! The Jakarta heritage tour exceeded all expectations. We learned so much about Dutch colonial history and visited places we never would have found on our own. The stories and cultural context made it so meaningful. Highly recommend!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 1, 17, 2, 4, 'Great Historical Insights', 
 'Solo traveler here - the tour was well-organized and informative. Budi knows his history very well and shared fascinating stories about Old Batavia. Perfect for photography enthusiasts too. Good value for money.',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 2, 18, 3, 5, 'Spiritual and Beautiful Experience', 
 'Sari was an amazing guide for our anniversary trip! The temple ceremonies were so meaningful and the rice terraces absolutely stunning. She explained Hindu-Balinese culture with such passion. Unforgettable experience!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 3, 19, 4, 5, 'Professional Photography Session', 
 'Rina is incredibly talented! The portrait session was professional yet fun. She knew all the best spots in Jakarta and the lighting was perfect. Got amazing photos for my portfolio. Definitely booking again!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 4, 16, 6, 5, 'Complete Bali Experience', 
 'Wayan and team delivered exactly what they promised - an all-in-one Bali experience! The combination of guiding, professional photography, and trip planning was seamless. Family loved every moment. Worth every penny!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(6, 5, 17, 7, 4, 'Excellent Trip Planning Service', 
 'Indonesia Travel Pro created a perfect 2-week itinerary for my solo trip. Every recommendation was spot-on, from accommodations to activities. The local insights made all the difference. Professional and reliable service.',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(7, 1, 18, 9, 4, 'Informative Colonial History Tour', 
 'As a history buff, I thoroughly enjoyed this tour. Budi''s knowledge of Dutch colonial period is impressive. The museums and colonial buildings were fascinating. Great for couples interested in history and culture.',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- NEW REVIEWS FOR NEW EXPERIENCES

(8, 2, 19, 8, 5, 'Peaceful Spiritual Journey', 
 'Mount Batur sunrise trek was absolutely incredible! Ketut was an excellent guide - very knowledgeable about the volcano and kept us safe. The sunrise view was breathtaking and the volcanic steam breakfast was so unique. Challenging but totally worth it!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(9, 7, 18, 13, 5, 'Best Food Tour Ever!', 
 'Joko knows Jakarta food scene like no one else! Tried authentic dishes I never heard of and each one was delicious. His stories about food history made it educational too. Perfect for food bloggers - got amazing content!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(10, 8, 19, 14, 4, 'Relaxing Highland Experience', 
 'Beautiful tea plantation tour in Bandung highlands. Eko was very informative about tea processing and colonial history. The fresh mountain air and tea tasting were lovely. Could use more time at the viewpoints.',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(11, 9, 20, 15, 5, 'Stunning Traditional Photography', 
 'Lestari captured the essence of Javanese culture perfectly! The traditional costumes were beautiful and she knew exactly how to pose for authentic cultural photos. Got 20 amazing edited photos. Highly recommend!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(12, 10, 16, 11, 5, 'Amazing Cultural Immersion', 
 'Putu showed us authentic Sasak village life. The waterfall was crystal clear and perfect for swimming. Traditional lunch with villagers was highlights. Learned so much about local culture and customs.',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(13, 11, 17, 12, 4, 'Educational History Tour', 
 'Great introduction to Surabaya independence history. Indra explained the Battle of Surabaya very well. Heroes Monument was impressive. Good for students and history enthusiasts.',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(14, 12, 18, 13, 5, 'Professional Architecture Photography', 
 'Dika has excellent eye for architectural photography. Learned great composition techniques for urban photography. Jakarta skyline shots turned out amazing. Perfect for photography students.',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(15, 13, 19, 14, 5, 'Complete Bali Cultural Experience', 
 'Wayan combination of guiding and photography was perfect! Temple ceremony was deeply spiritual and the photos captured every moment beautifully. Rice terrace photos are magazine quality. Unforgettable!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- REVIEWS FOR NEW EXPERIENCES

(16, 6, 16, 11, 5, 'Epic Sunrise Trek!', 
 'Ketut is an amazing mountain guide! The Mount Batur sunrise trek was absolutely incredible. Waking up at 3 AM was tough but totally worth it. The breakfast cooked by volcanic steam was a unique experience. The sunrise view from the summit was breathtaking!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(17, 7, 17, 12, 4, 'Authentic Jakarta Food Tour', 
 'Joko knows Jakarta street food like no one else! Even though I asked for non-spicy food, he found amazing alternatives. Tried kerak telor for the first time and loved it. Great way to experience local culture through food.',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(18, 8, 18, 13, 5, 'Tea Plantation Paradise', 
 'Eko provided an excellent tea plantation tour in Bandung. The highland views were spectacular and learning about traditional tea processing was fascinating. The tea tasting session was educational and delicious. Perfect family activity!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(19, 9, 19, 14, 5, 'Beautiful Traditional Arts Photos', 
 'Lestari captured stunning traditional Javanese arts photos for our pre-wedding shoot. Her costume collection is impressive and she guided us through poses that looked natural yet cultural. The edited photos exceeded our expectations!',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(20, 10, 20, 15, 4, 'Hidden Waterfall Adventure', 
 'Putu showed us amazing hidden waterfalls in Lombok! The trek through Sasak villages was authentic and the swimming in natural pools was refreshing. Great cultural immersion with beautiful nature. Moderate fitness required.',
 true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence to continue from the last ID
SELECT setval('reviews_id_seq', (SELECT MAX(id) FROM reviews));
