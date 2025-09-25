-- Migration: Create content management tables
-- Date: 2025-01-03
-- Purpose: Create newsletters, faqs, experience_itineraries tables

-- Create newsletters table (exact structure from database)
CREATE TABLE IF NOT EXISTS newsletters (
    id UUID PRIMARY KEY,
    email CHARACTER VARYING(255) NOT NULL,
    name CHARACTER VARYING(255),
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token CHARACTER VARYING(255),
    verification_token_expires_at TIMESTAMP WITH TIME ZONE,
    unsubscribe_token CHARACTER VARYING(255) NOT NULL,
    is_subscribed BOOLEAN DEFAULT TRUE,
    frequency CHARACTER VARYING(50) DEFAULT 'weekly',
    categories TEXT[] DEFAULT ARRAY[]::text[],
    subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    last_email_sent_at TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{"specialOffers": false, "newExperiences": true, "featuredStories": true, "weeklyNewsletter": true}',
    subscription_source CHARACTER VARYING(50) DEFAULT 'homepage',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for newsletters table
CREATE UNIQUE INDEX IF NOT EXISTS newsletters_email ON newsletters(email);
CREATE INDEX IF NOT EXISTS newsletters_is_verified ON newsletters(is_verified);
CREATE INDEX IF NOT EXISTS newsletters_subscription_source ON newsletters(subscription_source);
CREATE INDEX IF NOT EXISTS newsletters_unsubscribe_token ON newsletters(unsubscribe_token);
CREATE INDEX IF NOT EXISTS newsletters_user_id ON newsletters(user_id);
CREATE INDEX IF NOT EXISTS newsletters_verification_token ON newsletters(verification_token);

-- Create faqs table (exact structure from database)
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question CHARACTER VARYING(500) NOT NULL,
    answer TEXT NOT NULL,
    category enum_faqs_category DEFAULT 'general',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    tags JSON DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create experience_itineraries table (exact structure from database)
CREATE TABLE IF NOT EXISTS experience_itineraries (
    id SERIAL PRIMARY KEY,
    experience_id INTEGER REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE SET NULL,
    step_number INTEGER NOT NULL,
    title CHARACTER VARYING(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    location_name CHARACTER VARYING(200),
    time_schedule CHARACTER VARYING(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for experience_itineraries table
CREATE INDEX IF NOT EXISTS experience_itineraries_experience_id_step_number ON experience_itineraries(experience_id, step_number);

\echo '✅ Content Management Tables created successfully!'