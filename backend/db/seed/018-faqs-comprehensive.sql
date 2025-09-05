-- Insert FAQs
-- This file seeds the faqs table with comprehensive GenZ-friendly frequently asked questions

INSERT INTO faqs (id, question, answer, category, is_active, is_featured, display_order, created_at, updated_at) VALUES
-- General FAQs - GenZ Style
(1, 'What is LocallyTrip? 🌟', 'LocallyTrip is your gateway to authentic Indonesian adventures! We connect you with amazing local hosts who offer everything from epic guided tours to Instagram-worthy photo sessions and custom trip planning. Think of it as your local bestie showing you around their hometown! ✨', 'general', true, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 'How does LocallyTrip work? 🚀', 'It''s super easy! Browse through incredible experiences, pick one that vibes with you, book with a verified local host, and get ready for an unforgettable adventure. Our hosts are real locals who know all the hidden gems and secret spots that you won''t find on typical tourist sites! 📍', 'general', true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(3, 'Is LocallyTrip available worldwide? 🌏', 'Right now we''re focusing on making Indonesia absolutely amazing for travelers! But don''t worry - we''re planning to expand to other Southeast Asian countries soon. Indonesia has SO much to offer though, you''ll be busy exploring for years! 🇮🇩', 'general', true, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(4, 'What makes LocallyTrip different from other travel apps? 💫', 'We''re not just another booking platform! We connect you with real locals who are passionate about sharing their culture. No touristy fake experiences here - just authentic connections, hidden gems, and memories that''ll make your friends jealous on social media! 📸', 'general', true, true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(5, 'Can I trust the local hosts? Is it safe? 🔒', 'Absolutely! All our hosts go through a thorough verification process. We check their backgrounds, read reviews, and make sure they''re genuinely awesome people who care about giving you the best experience. Safety first, always! 🛡️', 'general', true, true, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(6, 'What types of experiences can I book? 🎯', 'The possibilities are endless! Cultural tours to ancient temples, street food adventures, photography sessions at stunning locations, adventure activities like volcano hiking, traditional art workshops, spiritual journeys, and custom trip planning. Whatever you''re into, we''ve got you covered! 🌈', 'general', true, false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Booking FAQs - GenZ Style
(7, 'How do I book an experience? Is it complicated? 📱', 'Not at all! It''s literally as easy as ordering food delivery. Browse experiences, pick your dates, add your details, pay securely, and boom - you''re all set! You''ll get instant confirmation and your host''s contact info via email. Easy peasy! ⚡', 'booking', true, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(8, 'Can I cancel or change my booking? Life happens! 😅', 'Totally get it! Life can be unpredictable. You can modify or cancel bookings up to 24 hours before your scheduled experience. Each host has their own cancellation policy, but most are pretty understanding if something urgent comes up! 🤝', 'booking', true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(9, 'What if it rains or weather is bad? ☔', 'Don''t worry! Your host will hit you up to discuss alternatives - maybe reschedule, switch to indoor activities, or modify the itinerary. Indonesian weather can be unpredictable, but that''s part of the adventure! Plus, some of the best photos happen in the rain! 🌧️', 'booking', true, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(10, 'Can I book last minute? I''m spontaneous like that! ⚡', 'We love spontaneous travelers! Many of our hosts can accommodate last-minute bookings (even same-day sometimes!). Just check the availability on their profile or message them directly. Some of the best adventures are unplanned! 🎲', 'booking', true, false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(11, 'What if I want to bring friends? Group bookings? 👥', 'The more the merrier! Most experiences can accommodate groups. When booking, just specify how many people are coming. Group adventures are always more fun, and you might even get a better rate! Perfect for those squad goals photos! 📸', 'booking', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(12, 'Do I need to speak Indonesian? Language barriers? 🗣️', 'Nope! All our featured hosts speak English (some even know other languages like Japanese, Mandarin, or Korean). They''re used to international travelers and are great at communicating. Plus, they love teaching you some Indonesian phrases! 🇮🇩', 'booking', true, false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Payment FAQs - GenZ Style
(13, 'What payment methods do you accept? 💳', 'We accept all the usual suspects - credit cards (Visa, Mastercard), debit cards, PayPal, and bank transfers. All payments are super secure and encrypted. No sketchy payment methods here! Your money is safe! 🔐', 'payment', true, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(14, 'When do I get charged? Immediately or later? ⏰', 'Payment is processed right when you confirm your booking - no surprises! For some premium experiences, you might pay a deposit first with the rest due before the experience starts. We''ll always be transparent about the payment timeline! 💯', 'payment', true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(15, 'Are there hidden fees? Please say no! 😰', 'We hate hidden fees as much as you do! The price you see includes all the basic services. Any extra costs (like transportation, meals, entrance fees) are clearly mentioned upfront. No nasty surprises at checkout! 🚫💸', 'payment', true, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(16, 'Is it expensive? I''m on a budget! 💰', 'We have experiences for every budget! From affordable street food tours (under $15) to luxury private experiences. Many hosts offer student discounts or group rates too. Amazing experiences don''t have to break the bank! 🎯', 'payment', true, false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(17, 'Do you accept cryptocurrency? Bitcoin? 🪙', 'Not yet, but we''re exploring crypto payments for the future! For now, stick with traditional payment methods. But hey, maybe by next year you can pay with your favorite digital currency! 🚀', 'payment', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(18, 'What if I need a refund? Refund policy? 💸', 'Refund policies vary by host and experience type, but most are pretty fair. If something goes wrong on our end, we''ll make it right. Emergency situations are handled case-by-case with understanding and flexibility! 🤝', 'payment', true, false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Host FAQs - GenZ Style
(19, 'How can I become a host? I want to share my city! 🌟', 'That''s awesome! Apply through our host registration form, complete our chill verification process, create your killer profile, and start earning by sharing your passion! We''re always looking for enthusiastic locals who want to show off their hometown! 💫', 'host', true, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(20, 'What do I need to become a host? Requirements? 📋', 'You need to be a local resident, have good vibes and communication skills, pass our background check, and show your expertise in your area (guiding, photography, etc.). Most importantly - you need to genuinely love sharing your culture! ❤️', 'host', true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(21, 'How much can I earn as a host? 💵', 'Earnings vary based on your experience type, frequency, and demand. Some hosts make pocket money, others turn it into a serious side hustle! Top hosts earn $500-2000+ per month. The more unique and engaging your experience, the more you can charge! 📈', 'host', true, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(22, 'What commission does LocallyTrip charge? 🤔', 'We take a small service fee to keep the platform running and support both hosts and travelers. Our rates are transparent and competitive - no sneaky charges! You''ll know exactly what you earn before you start hosting! 💯', 'host', true, false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(23, 'Do I need professional equipment? Camera, etc? 📸', 'Depends on your service! For photography sessions, good equipment helps, but personality and creativity matter more than having the latest gear. For tours, just bring your enthusiasm and knowledge. We''ll help you figure out what you need! 🎯', 'host', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(24, 'Can I host part-time? I have other commitments! ⏰', 'Absolutely! Most of our hosts do this part-time. Set your own schedule, work weekends only, or whenever you''re free. It''s your side hustle, your rules! Perfect for students, freelancers, or anyone wanting extra income! 🔥', 'host', true, false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Traveller FAQs - GenZ Style
(25, 'How should I prepare for my experience? What to bring? 🎒', 'Your host will send you all the deets - what to wear, what to bring, where to meet, and any special prep needed. Generally bring sunscreen, comfortable shoes, your phone for epic photos, and an open mind for adventure! 📱☀️', 'traveller', true, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(26, 'How do I contact my host? WhatsApp? 📞', 'You''ll get your host''s contact details in your booking confirmation. Most hosts prefer WhatsApp (it''s like the universal language in Indonesia!). You can also message through our platform. Don''t be shy - they love chatting with travelers! 💬', 'traveller', true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(27, 'Can I customize my experience? Make it more ''me''? ✨', 'YES! This is what makes us special. Want vegetarian food options? Need wheelchair accessibility? Celebrating an anniversary? Planning a proposal? Most hosts are super flexible and love creating personalized experiences. Just ask! 💝', 'traveller', true, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(28, 'What if I have dietary restrictions? Food allergies? 🥗', 'Definitely mention this when booking! Indonesian cuisine is diverse, and hosts can usually accommodate dietary needs. Vegetarian, vegan, halal, gluten-free - just let them know and they''ll make sure you''re well-fed and safe! 🍽️', 'traveller', true, false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(29, 'Can I bring my kids? Family-friendly options? 👨‍👩‍👧‍👦', 'Many experiences welcome families! Look for the family-friendly badge or ask your host. Indonesian culture loves kids, and many hosts are great with children. Some experiences might be better for older kids - just check the age recommendations! 🧒', 'traveller', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(30, 'What should I tip? Tipping culture in Indonesia? 💰', 'Tipping isn''t mandatory in Indonesia, but it''s always appreciated! If you had an amazing time (which you will!), 10-15% or rounding up is awesome. Your host will remember you fondly and might even become a lifelong friend! 🤝', 'traveller', true, false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Technical FAQs - GenZ Style
(31, 'Is my data safe? Privacy concerns? 🔒', 'Your privacy is our priority! We use bank-level encryption and security measures to protect your personal and payment info. We never share your data with random companies. Your secrets are safe with us! 🛡️', 'technical', true, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(32, 'Do you have a mobile app? I live on my phone! 📱', 'Yes! LocallyTrip is available on both iOS and Android. The app is actually better than the website - easier booking, direct chat with hosts, and managing experiences on the go. Download it and join the mobile revolution! 🚀', 'technical', true, true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(33, 'How do I leave a review? Rate my experience? ⭐', 'After your experience, you''ll get an email asking for a review (don''t ignore it!). You can also leave reviews from your account dashboard. Your honest feedback helps other travelers and makes hosts even better! 📝', 'technical', true, true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(34, 'Can I share photos from my experience? Social media? 📸', 'Please do! We love when travelers share their amazing experiences. Tag us @LocallyTrip on Instagram, TikTok, or wherever you post. Some of the best travel content comes from our users! You might even get featured! 🌟', 'technical', true, false, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(35, 'Is there a loyalty program? Frequent traveler perks? 🎁', 'We''re working on something epic for our regular travelers! For now, frequent bookers often get special offers and early access to new experiences. The more you explore with us, the more perks you''ll unlock! 🔓', 'technical', true, false, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(36, 'Website is slow/buggy. Technical issues? 🐛', 'Ugh, tech issues are the worst! If you''re experiencing problems, try refreshing, clearing cache, or using the mobile app. If it''s still acting up, hit up our support team - we''ll fix it ASAP! 🔧', 'technical', true, false, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Lifestyle & Culture FAQs - GenZ Specific
(37, 'Best experiences for content creation? Instagram-worthy spots? 📷', 'OMG yes! Try our photography sessions in Bali rice terraces, sunrise volcano hikes, traditional batik workshops, or street art tours in Jakarta. Our hosts know all the best angles and lighting for that perfect gram! ✨', 'general', true, true, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(38, 'Solo female traveler - is it safe? Any recommendations? 👩‍🦱', 'Indonesia is generally very safe for solo female travelers, and our hosts are extra protective of solo guests! We have specific experiences designed for solo travelers, and female hosts if you prefer. You''ll never feel alone! 💪', 'general', true, true, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(39, 'Sustainable travel options? Eco-friendly experiences? 🌱', 'We''re big on sustainable tourism! Look for experiences with local communities, traditional craft workshops, organic farm visits, and conservation activities. Travel responsibly and help preserve Indonesia''s beauty for future generations! 🌍', 'general', true, false, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(40, 'Digital nomad friendly? WiFi, workspaces? 💻', 'Absolutely! Many of our hosts understand the nomad lifestyle. Some experiences include coworking space recommendations, cafés with great WiFi, or even work-friendly accommodations. Bali is basically nomad heaven! 🏝️', 'general', true, false, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(41, 'Best time to visit Indonesia? Weather and seasons? 🌤️', 'Indonesia is amazing year-round, but dry season (May-September) is generally best for outdoor activities. Rainy season (October-April) can be beautiful too with fewer crowds and lush landscapes. Each season has its vibe! 🌈', 'general', true, false, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(42, 'Local customs I should know? Cultural etiquette? 🙏', 'Indonesians are super welcoming! Basic etiquette: use your right hand for eating/giving, dress modestly at temples, remove shoes before entering homes, and always smile. Your host will guide you through local customs! 😊', 'traveller', true, false, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(43, 'Emergency contacts? What if something goes wrong? 🚨', 'Safety first! Your host will provide local emergency contacts, and our support team is available 24/7. Save important numbers in your phone, and don''t hesitate to contact us if anything feels off. We''ve got your back! 📞', 'traveller', true, false, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(44, 'Can I extend my experience? Having too much fun! ⏰', 'We love when that happens! If you''re having an amazing time, ask your host about extending the experience. Subject to their availability and your budget, but most hosts are happy to keep the good times rolling! 🎉', 'booking', true, false, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(45, 'Group discounts? Bringing my squad! 👥', 'Squad goals! Many hosts offer group discounts for 4+ people. The bigger the group, the better the rate usually. Plus, group experiences are always more fun and make for epic group photos! 📸', 'payment', true, false, 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Reset sequence
SELECT setval('faqs_id_seq', (SELECT MAX(id) FROM faqs));
