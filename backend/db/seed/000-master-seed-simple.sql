-- Master Seed Script - Simple Version
-- Uses only original files with minimal fixes

\echo '🚀 Starting LocallyTrip Database Seeding...'

-- Create Schema First
\echo '🏗️  Creating database schema...'
\i /docker-entrypoint-initdb.d/000-create-schema.sql

-- Basic Reference Data (no dependencies)
\echo '📍 Seeding basic reference data...'
\i /docker-entrypoint-initdb.d/001-countries.sql
\i /docker-entrypoint-initdb.d/002-cities.sql
\i /docker-entrypoint-initdb.d/003-languages.sql
\i /docker-entrypoint-initdb.d/004-roles.sql
\i /docker-entrypoint-initdb.d/005-host-categories.sql
\i /docker-entrypoint-initdb.d/006-experience-types.sql

-- User Data (depends on cities, roles)
\echo '👥 Seeding user data...'
\i /docker-entrypoint-initdb.d/007-users.sql
\i /docker-entrypoint-initdb.d/008-user-languages.sql
\i /docker-entrypoint-initdb.d/009-user-host-categories.sql

-- Experience Data (depends on users, categories, experience types)
\echo '🎯 Seeding experience data...'
\i /docker-entrypoint-initdb.d/010-experiences.sql
\i /docker-entrypoint-initdb.d/011-experience-itineraries-clean.sql

-- Booking Data (depends on experiences, users)
\echo '📅 Seeding booking data...'
\i /docker-entrypoint-initdb.d/012-bookings.sql

-- Newsletter subscriptions (depends on users)
\echo '📧 Seeding newsletter data...'
\i /docker-entrypoint-initdb.d/013-newsletters.sql

-- Reviews and Community Content (depends on users, experiences)
\echo '🎭 Seeding community content...'
\i /docker-entrypoint-initdb.d/013-reviews.sql
\i /docker-entrypoint-initdb.d/014-stories.sql
\i /docker-entrypoint-initdb.d/015-story-likes.sql
\i /docker-entrypoint-initdb.d/016-story-comments.sql

-- Payment and Transaction Data (depends on bookings, users)
\echo '💳 Seeding payment data...'
\i /docker-entrypoint-initdb.d/017-payments.sql

-- Complete Payment System Data (banks, accounts, payouts)
\echo '🏦 Seeding banking and payout data...'
\i /docker-entrypoint-initdb.d/03-seed-payment-data.sql

-- Platform Content 
\echo '🌟 Seeding platform content...'
\i /docker-entrypoint-initdb.d/018-faqs-comprehensive.sql
\i /docker-entrypoint-initdb.d/019-featured-hosts-fixed.sql
\i /docker-entrypoint-initdb.d/020-featured-testimonials-fixed.sql

-- Specialized Booking Data (depends on bookings)
\echo '📋 Seeding specialized bookings...'
\i /docker-entrypoint-initdb.d/021-specialized-bookings.sql

-- Security and Audit Data (sessions, logs, events)
\echo '🔒 Seeding security and audit data...'
\i /docker-entrypoint-initdb.d/03-seed-audit-data.sql

\echo '📈 Database Seeding Completed!'
\echo 'Final Record Counts:'
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Experiences: ' || COUNT(*) FROM experiences;
SELECT 'Bookings: ' || COUNT(*) FROM bookings;
SELECT 'Newsletters: ' || COUNT(*) FROM newsletters;
SELECT 'Stories: ' || COUNT(*) FROM stories;
SELECT 'Reviews: ' || COUNT(*) FROM reviews;
SELECT 'FAQs: ' || COUNT(*) FROM faqs;
SELECT 'Banks: ' || COUNT(*) FROM banks;
SELECT 'User Bank Accounts: ' || COUNT(*) FROM user_bank_accounts;
SELECT 'Payout Settings: ' || COUNT(*) FROM payout_settings;
SELECT 'Payout History: ' || COUNT(*) FROM payout_history;
SELECT 'Audit Logs: ' || COUNT(*) FROM audit_logs;
SELECT 'User Sessions: ' || COUNT(*) FROM user_sessions;
SELECT 'Security Events: ' || COUNT(*) FROM security_events;
SELECT 'Featured Hosts: ' || COUNT(*) FROM featured_hosts;
SELECT 'Featured Testimonials: ' || COUNT(*) FROM featured_testimonials;
SELECT 'Story Likes: ' || COUNT(*) FROM story_likes;
SELECT 'Story Comments: ' || COUNT(*) FROM story_comments;
SELECT 'Payments: ' || COUNT(*) FROM payments;
SELECT 'Experience Itineraries: ' || COUNT(*) FROM experience_itineraries;
SELECT 'User Languages: ' || COUNT(*) FROM user_languages;
SELECT 'User Host Categories: ' || COUNT(*) FROM user_host_categories;
SELECT 'Guide Bookings: ' || COUNT(*) FROM guide_bookings;
SELECT 'Photography Bookings: ' || COUNT(*) FROM photography_bookings;
SELECT 'Trip Planner Bookings: ' || COUNT(*) FROM trip_planner_bookings;
SELECT 'Combo Bookings: ' || COUNT(*) FROM combo_bookings;
