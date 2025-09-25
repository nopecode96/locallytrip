-- Migration: Create user relations and remaining booking tables
-- Date: 2025-01-03
-- Purpose: Create user_languages, user_host_categories, and remaining booking tables

-- Create user_languages table (exact structure from database)
CREATE TABLE IF NOT EXISTS user_languages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id) ON UPDATE CASCADE ON DELETE CASCADE,
    proficiency enum_user_languages_proficiency DEFAULT 'intermediate' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, language_id)
);

-- Create user_host_categories table (exact structure from database)
CREATE TABLE IF NOT EXISTS user_host_categories (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    host_category_id INTEGER REFERENCES host_categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, host_category_id)
);

-- Create indexes for user_host_categories
CREATE INDEX IF NOT EXISTS user_host_categories_host_category_id ON user_host_categories(host_category_id);
CREATE INDEX IF NOT EXISTS user_host_categories_is_active ON user_host_categories(is_active);
CREATE INDEX IF NOT EXISTS user_host_categories_is_primary ON user_host_categories(is_primary);
CREATE INDEX IF NOT EXISTS user_host_categories_user_id ON user_host_categories(user_id);

-- Create combo_bookings table (exact structure from database)
CREATE TABLE IF NOT EXISTS combo_bookings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON UPDATE CASCADE ON DELETE CASCADE,
    selected_services JSONB NOT NULL,
    guide_duration INTEGER,
    photography_duration INTEGER,
    coordination_complexity CHARACTER VARYING(50),
    team_coordination_notes TEXT,
    service_timeline JSONB,
    package_discount NUMERIC(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create guide_bookings table (exact structure from database)
CREATE TABLE IF NOT EXISTS guide_bookings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    tour_duration INTEGER NOT NULL,
    meeting_point TEXT,
    languages JSONB,
    transportation_included BOOLEAN DEFAULT FALSE,
    group_size_preference CHARACTER VARYING(50),
    special_interests JSONB,
    accessibility_needs TEXT,
    dietary_restrictions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create photography_bookings table (exact structure from database)
CREATE TABLE IF NOT EXISTS photography_bookings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    package_type CHARACTER VARYING(100) NOT NULL,
    photography_style CHARACTER VARYING(100) NOT NULL,
    session_duration INTEGER NOT NULL,
    number_of_photos INTEGER NOT NULL,
    edited_photos_count INTEGER NOT NULL,
    raw_photos_included BOOLEAN DEFAULT FALSE,
    outfit_changes INTEGER DEFAULT 1,
    preferred_locations JSONB,
    backup_date DATE,
    editing_timeline_days INTEGER DEFAULT 7,
    delivery_format CHARACTER VARYING(50) DEFAULT 'digital_gallery',
    print_rights BOOLEAN DEFAULT TRUE,
    commercial_use BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create trip_planner_bookings table (exact structure from database)
CREATE TABLE IF NOT EXISTS trip_planner_bookings (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id),
    destination CHARACTER VARYING(255) NOT NULL,
    trip_duration INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    budget_range CHARACTER VARYING(50),
    travel_style CHARACTER VARYING(100),
    interests JSONB,
    revision_count INTEGER DEFAULT 0,
    max_revisions INTEGER DEFAULT 2,
    pdf_delivery_method CHARACTER VARYING(50) DEFAULT 'email',
    planning_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);