-- =====================================================
-- Migration 003: Business Logic Tables  
-- =====================================================
-- This migration creates all core business logic tables
-- Dependencies: 001-create-master-data-tables.sql, 002-create-user-auth-tables.sql

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS story_likes CASCADE;
DROP TABLE IF EXISTS story_comments CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS payout_history CASCADE;
DROP TABLE IF EXISTS payout_settings CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS trip_planner_bookings CASCADE;
DROP TABLE IF EXISTS photography_bookings CASCADE;
DROP TABLE IF EXISTS guide_bookings CASCADE;
DROP TABLE IF EXISTS combo_bookings CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS experience_itineraries CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS story_likes_id_seq CASCADE;
DROP SEQUENCE IF EXISTS story_comments_id_seq CASCADE;
DROP SEQUENCE IF EXISTS stories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS reviews_id_seq CASCADE;
DROP SEQUENCE IF EXISTS payout_history_id_seq CASCADE;
DROP SEQUENCE IF EXISTS payout_settings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS payments_id_seq CASCADE;
DROP SEQUENCE IF EXISTS trip_planner_bookings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS photography_bookings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS guide_bookings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS combo_bookings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS bookings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS experience_itineraries_id_seq CASCADE;
DROP SEQUENCE IF EXISTS experiences_id_seq CASCADE;

-- Drop ENUM types if they exist
DROP TYPE IF EXISTS enum_stories_status CASCADE;
DROP TYPE IF EXISTS enum_payout_settings_payout_frequency CASCADE;
DROP TYPE IF EXISTS enum_experiences_status CASCADE;

-- Create ENUM types
CREATE TYPE enum_experiences_status AS ENUM (
    'draft', 'pending_review', 'published', 'rejected', 'paused', 'suspended', 'deleted'
);
CREATE TYPE enum_stories_status AS ENUM (
    'draft', 'pending_review', 'published', 'scheduled', 'archived'
);
CREATE TYPE enum_payout_settings_payout_frequency AS ENUM (
    'daily', 'weekly', 'monthly'
);

-- Create experiences table (main business entity)
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    host_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    category_id INTEGER REFERENCES host_categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
    experience_type_id INTEGER REFERENCES experience_types(id) ON UPDATE CASCADE ON DELETE SET NULL,
    city_id INTEGER REFERENCES cities(id) ON UPDATE CASCADE ON DELETE SET NULL,
    package_price NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'IDR',
    duration_hours INTEGER DEFAULT 4,
    max_participants INTEGER DEFAULT 10,
    min_participants INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20),
    images JSONB,
    included_items JSONB,
    excluded_items JSONB,
    meeting_point TEXT,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    status enum_experiences_status NOT NULL DEFAULT 'draft',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating_average NUMERIC(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    host_specific_data JSONB,
    deliverables JSONB,
    equipment_used JSONB,
    ending_point TEXT,
    walking_distance_km NUMERIC(5,2),
    fitness_level VARCHAR(20),
    rejection_reason TEXT,
    rejected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create experience_itineraries table (experience steps/schedule)
CREATE TABLE IF NOT EXISTS experience_itineraries (
    id SERIAL PRIMARY KEY,
    experience_id INTEGER REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE SET NULL,
    step_number INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    location_name VARCHAR(200),
    time_schedule VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create bookings table (main booking entity)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE,
    experience_id INTEGER REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TIME WITHOUT TIME ZONE,
    participant_count INTEGER DEFAULT 1,
    total_price NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status VARCHAR(20) DEFAULT 'pending',
    special_requests TEXT,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    cancellation_reason TEXT,
    booking_reference VARCHAR(50) UNIQUE,
    category_specific_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create combo_bookings table (combined services)
CREATE TABLE IF NOT EXISTS combo_bookings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    selected_services JSONB NOT NULL,
    guide_duration INTEGER,
    photography_duration INTEGER,
    coordination_complexity VARCHAR(50),
    team_coordination_notes TEXT,
    service_timeline JSONB,
    package_discount NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create guide_bookings table (guide-specific bookings)
CREATE TABLE IF NOT EXISTS guide_bookings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    guide_type VARCHAR(50),
    transportation_included BOOLEAN DEFAULT FALSE,
    language_preferences JSONB,
    accessibility_needs TEXT,
    group_type VARCHAR(50),
    activity_level VARCHAR(30),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create photography_bookings table (photography-specific bookings)
CREATE TABLE IF NOT EXISTS photography_bookings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    photo_style VARCHAR(50),
    number_of_photos INTEGER,
    editing_style VARCHAR(50),
    delivery_format VARCHAR(30),
    rush_delivery BOOLEAN DEFAULT FALSE,
    specific_shots TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create trip_planner_bookings table (trip planning services)
CREATE TABLE IF NOT EXISTS trip_planner_bookings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    trip_duration_days INTEGER,
    budget_range VARCHAR(50),
    travel_style VARCHAR(50),
    interests JSONB,
    accommodation_preferences VARCHAR(100),
    transportation_preferences VARCHAR(100),
    dietary_restrictions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create payments table (payment transactions)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_reference VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create payout_settings table (host payout preferences)
CREATE TABLE IF NOT EXISTS payout_settings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    minimum_payout NUMERIC(10,2) NOT NULL DEFAULT 500000,
    payout_frequency enum_payout_settings_payout_frequency NOT NULL DEFAULT 'weekly',
    auto_payout BOOLEAN DEFAULT TRUE,
    currency VARCHAR(3) NOT NULL DEFAULT 'IDR',
    tax_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create payout_history table (payout transaction history)
CREATE TABLE IF NOT EXISTS payout_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_bank_account_id INTEGER REFERENCES user_bank_accounts(id) ON UPDATE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    gross_amount NUMERIC(10,2) NOT NULL,
    commission_rate NUMERIC(5,2) NOT NULL,
    commission_amount NUMERIC(10,2) NOT NULL,
    tax_amount NUMERIC(10,2) DEFAULT 0,
    net_amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'IDR',
    status VARCHAR(20) DEFAULT 'pending',
    payment_reference VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create reviews table (experience reviews)
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    experience_id INTEGER NOT NULL REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE CASCADE,
    reviewer_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON UPDATE CASCADE ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create stories table (content/blog system)
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    author_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id) ON UPDATE CASCADE ON DELETE SET NULL,
    cover_image VARCHAR(255),
    images JSON,
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    keywords JSON,
    tags JSON,
    reading_time INTEGER,
    language VARCHAR(5) DEFAULT 'en',
    status enum_stories_status DEFAULT 'draft',
    admin_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create story_comments table (story comments)
CREATE TABLE IF NOT EXISTS story_comments (
    id SERIAL PRIMARY KEY,
    story_id INTEGER NOT NULL REFERENCES stories(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    parent_comment_id INTEGER REFERENCES story_comments(id) ON UPDATE CASCADE ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create story_likes table (story likes/reactions)
CREATE TABLE IF NOT EXISTS story_likes (
    id SERIAL PRIMARY KEY,
    story_id INTEGER NOT NULL REFERENCES stories(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(story_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experiences_city_id ON experiences(city_id);
CREATE INDEX IF NOT EXISTS idx_experiences_host_id ON experiences(host_id);
CREATE INDEX IF NOT EXISTS experiences_category_id ON experiences(category_id);
CREATE INDEX IF NOT EXISTS experiences_experience_type_id ON experiences(experience_type_id);
CREATE INDEX IF NOT EXISTS experiences_status ON experiences(status);
CREATE INDEX IF NOT EXISTS experiences_is_active ON experiences(is_active);
CREATE INDEX IF NOT EXISTS experiences_is_featured ON experiences(is_featured);

CREATE INDEX IF NOT EXISTS experience_itineraries_experience_id_step_number ON experience_itineraries(experience_id, step_number);

CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS bookings_payment_status ON bookings(payment_status);

CREATE INDEX IF NOT EXISTS combo_bookings_booking_id ON combo_bookings(booking_id);
CREATE INDEX IF NOT EXISTS guide_bookings_booking_id ON guide_bookings(booking_id);
CREATE INDEX IF NOT EXISTS photography_bookings_booking_id ON photography_bookings(booking_id);
CREATE INDEX IF NOT EXISTS trip_planner_bookings_booking_id ON trip_planner_bookings(booking_id);

CREATE INDEX IF NOT EXISTS payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS payments_payment_date ON payments(payment_date);

CREATE INDEX IF NOT EXISTS payout_settings_user_id ON payout_settings(user_id);
CREATE INDEX IF NOT EXISTS payout_history_user_id ON payout_history(user_id);
CREATE INDEX IF NOT EXISTS payout_history_period ON payout_history(period_start, period_end);
CREATE INDEX IF NOT EXISTS payout_history_status ON payout_history(status);

CREATE INDEX IF NOT EXISTS idx_reviews_experience_id ON reviews(experience_id);
CREATE INDEX IF NOT EXISTS reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS reviews_rating ON reviews(rating);

CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS stories_author_id_status ON stories(author_id, status);
CREATE INDEX IF NOT EXISTS stories_city_id_status ON stories(city_id, status);
CREATE INDEX IF NOT EXISTS stories_is_featured_status ON stories(is_featured, status);
CREATE INDEX IF NOT EXISTS stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS stories_view_count_like_count ON stories(view_count, like_count);
CREATE INDEX IF NOT EXISTS stories_status ON stories(status);

CREATE INDEX IF NOT EXISTS story_comments_story_id ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS story_comments_user_id ON story_comments(user_id);
CREATE INDEX IF NOT EXISTS story_comments_parent_comment_id ON story_comments(parent_comment_id);

CREATE INDEX IF NOT EXISTS story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS story_likes_user_id ON story_likes(user_id);