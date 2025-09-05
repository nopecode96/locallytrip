-- Insert Featured Testimonials  
-- This file seeds the featured_testimonials table

INSERT INTO featured_testimonials (id, reviewer_id, experience_id, title, testimonial_text, reviewer_name, reviewer_location, featured_image_url, display_order, is_active, created_at, updated_at) VALUES
(1, 12, 2, 'Life-Changing Spiritual Journey', 'Aria didn''t just show us temples - he opened our hearts to Balinese spirituality. The sunrise at the hidden temple was pure magic. This experience changed how I see travel forever. 10/10 would recommend to anyone seeking deeper meaning in their journey! ✨', 'John Smith', 'Singapore', 'testimonial-1.jpg', 1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 13, 3, 'Instagram Dreams Come True', 'Maya is absolutely incredible! She knew exactly how to capture Jakarta''s urban beauty and made me feel so comfortable during the shoot. The photos turned out better than I could have imagined - my Instagram has never looked better! 📸', 'Sarah Johnson', 'Bangkok, Thailand', 'testimonial-2.jpg', 2, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 14, 1, 'History Buff Paradise', 'As a history enthusiast, Budi''s knowledge blew my mind. He brought Jakarta''s colonial past to life with fascinating stories I never would have learned from guidebooks. The hidden museums and architectural details were incredible! 🏛️', 'Kenji Tanaka', 'Tokyo, Japan', 'testimonial-3.jpg', 3, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 15, 4, 'Perfect Combo Experience', 'Wayan delivered the ultimate Bali experience! Great guiding, amazing photos, AND helped plan the rest of my Indonesia trip. Having everything coordinated by one knowledgeable person was so convenient. Worth every penny! 🌟', 'Lisa Wang', 'Kuala Lumpur, Malaysia', 'testimonial-4.jpg', 4, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 12, 7, 'Foodie Heaven in Jakarta', 'OMG the street food tour was incredible! Joko took us to places I never would have found on my own. Every bite was delicious and he made sure to accommodate my dietary restrictions. My taste buds are still thanking me! 🍜', 'John Smith', 'Singapore', 'testimonial-5.jpg', 5, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(6, 13, 6, 'Adventure of a Lifetime', 'Mount Batur sunrise trek was absolutely breathtaking! The guide was so knowledgeable about the volcano and local geology. Watching the sunrise from the summit while sipping local coffee was pure bliss. Challenging but so worth it! 🌋', 'Sarah Johnson', 'Bangkok, Thailand', 'testimonial-6.jpg', 6, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence
SELECT setval('featured_testimonials_id_seq', (SELECT MAX(id) FROM featured_testimonials));
