-- =====================================================
-- Migration 004: System & Featured Tables
-- =====================================================
-- This migration creates all system tables and featured content management
-- Dependencies: 001-create-master-data-tables.sql, 002-create-user-auth-tables.sql, 003-create-business-logic-tables.sql

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS featured_testimonials CASCADE;
DROP TABLE IF EXISTS featured_stories CASCADE;
DROP TABLE IF EXISTS featured_hosts CASCADE;
DROP TABLE IF EXISTS featured_experiences CASCADE;
DROP TABLE IF EXISTS featured_cities CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notification_settings CASCADE;
DROP TABLE IF EXISTS newsletter_subscriptions CASCADE;
DROP TABLE IF EXISTS newsletters CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS featured_testimonials_id_seq CASCADE;
DROP SEQUENCE IF EXISTS featured_stories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS featured_hosts_id_seq CASCADE;
DROP SEQUENCE IF EXISTS featured_experiences_id_seq CASCADE;
DROP SEQUENCE IF EXISTS featured_cities_id_seq CASCADE;
DROP SEQUENCE IF EXISTS audit_logs_id_seq CASCADE;
DROP SEQUENCE IF EXISTS notification_settings_id_seq CASCADE;
DROP SEQUENCE IF EXISTS newsletter_subscriptions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS faqs_id_seq CASCADE;

-- Drop ENUM types if they exist
DROP TYPE IF EXISTS enum_audit_logs_status CASCADE;
DROP TYPE IF EXISTS enum_audit_logs_source CASCADE;
DROP TYPE IF EXISTS enum_audit_logs_severity CASCADE;
DROP TYPE IF EXISTS enum_audit_logs_action_category CASCADE;
DROP TYPE IF EXISTS enum_faqs_category CASCADE;

-- Create ENUM types
CREATE TYPE enum_faqs_category AS ENUM (
    'general', 'booking', 'payment', 'host', 'traveller', 'technical'
);
CREATE TYPE enum_audit_logs_action_category AS ENUM (
    'auth', 'profile', 'booking', 'experience', 'payment', 'admin', 'system'
);
CREATE TYPE enum_audit_logs_severity AS ENUM (
    'low', 'medium', 'high', 'critical'
);
CREATE TYPE enum_audit_logs_source AS ENUM (
    'web', 'mobile', 'admin', 'api', 'system'
);
CREATE TYPE enum_audit_logs_status AS ENUM (
    'success', 'failed', 'pending'
);

-- Create faqs table (frequently asked questions)
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    question VARCHAR(500) NOT NULL,
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

-- Create newsletters table (comprehensive newsletter management)
CREATE TABLE IF NOT EXISTS newsletters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_token_expires_at TIMESTAMP WITH TIME ZONE,
    unsubscribe_token VARCHAR(255) NOT NULL,
    is_subscribed BOOLEAN DEFAULT TRUE,
    frequency VARCHAR(50) DEFAULT 'weekly',
    categories TEXT[] DEFAULT ARRAY[]::text[],
    subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    last_email_sent_at TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{"specialOffers": false, "newExperiences": true, "featuredStories": true, "weeklyNewsletter": true}',
    subscription_source VARCHAR(50) DEFAULT 'homepage',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create newsletter_subscriptions table (simplified subscription tracking)
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER,
    subscribed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    unsubscribed_at TIMESTAMP WITHOUT TIME ZONE
);

-- Create notification_settings table (comprehensive user notification preferences)
CREATE TABLE IF NOT EXISTS notification_settings (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    booking_confirmations_email BOOLEAN DEFAULT TRUE,
    booking_confirmations_push BOOLEAN DEFAULT TRUE,
    booking_confirmations_sms BOOLEAN DEFAULT TRUE,
    payment_updates_email BOOLEAN DEFAULT TRUE,
    payment_updates_push BOOLEAN DEFAULT TRUE,
    payment_updates_sms BOOLEAN DEFAULT FALSE,
    messages_email BOOLEAN DEFAULT TRUE,
    messages_push BOOLEAN DEFAULT TRUE,
    messages_sms BOOLEAN DEFAULT FALSE,
    reviews_email BOOLEAN DEFAULT TRUE,
    reviews_push BOOLEAN DEFAULT TRUE,
    reviews_sms BOOLEAN DEFAULT FALSE,
    favorites_email BOOLEAN DEFAULT FALSE,
    favorites_push BOOLEAN DEFAULT TRUE,
    favorites_sms BOOLEAN DEFAULT FALSE,
    promotions_email BOOLEAN DEFAULT FALSE,
    promotions_push BOOLEAN DEFAULT FALSE,
    promotions_sms BOOLEAN DEFAULT FALSE,
    newsletter_email BOOLEAN DEFAULT FALSE,
    newsletter_push BOOLEAN DEFAULT FALSE,
    newsletter_sms BOOLEAN DEFAULT FALSE,
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    marketing_consent BOOLEAN DEFAULT FALSE,
    marketing_consent_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create audit_logs table (comprehensive system audit trail)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    action_category enum_audit_logs_action_category NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    session_id VARCHAR(255),
    status enum_audit_logs_status NOT NULL DEFAULT 'success',
    error_message TEXT,
    severity enum_audit_logs_severity NOT NULL DEFAULT 'low',
    source enum_audit_logs_source NOT NULL DEFAULT 'web',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create featured_cities table (featured city management)
CREATE TABLE IF NOT EXISTS featured_cities (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON UPDATE CASCADE ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    badge VARCHAR(100) DEFAULT 'Popular Destination',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    featured_until TIMESTAMP WITH TIME ZONE,
    featured_image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create featured_experiences table (featured experience management)
CREATE TABLE IF NOT EXISTS featured_experiences (
    id SERIAL PRIMARY KEY,
    experience_id INTEGER REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    badge VARCHAR(100) DEFAULT 'Featured',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    featured_until TIMESTAMP WITH TIME ZONE,
    featured_image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create featured_hosts table (featured host management)
CREATE TABLE IF NOT EXISTS featured_hosts (
    id SERIAL PRIMARY KEY,
    host_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    badge VARCHAR(100) DEFAULT 'Verified Host',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    featured_until TIMESTAMP WITH TIME ZONE,
    featured_image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create featured_stories table (featured story management)
CREATE TABLE IF NOT EXISTS featured_stories (
    id SERIAL PRIMARY KEY,
    story_id INTEGER REFERENCES stories(id) ON UPDATE CASCADE ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    badge VARCHAR(100) DEFAULT 'Featured Story',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    featured_until TIMESTAMP WITH TIME ZONE,
    featured_image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create featured_testimonials table (featured testimonial management)
CREATE TABLE IF NOT EXISTS featured_testimonials (
    id SERIAL PRIMARY KEY,
    reviewer_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    experience_id INTEGER REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE SET NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    rating INTEGER,
    reviewer_name VARCHAR(255),
    reviewer_location VARCHAR(255),
    reviewer_avatar_url VARCHAR(500),
    badge VARCHAR(100) DEFAULT 'Verified Review',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    featured_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS faqs_category ON faqs(category);
CREATE INDEX IF NOT EXISTS faqs_is_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS faqs_is_featured ON faqs(is_featured);
CREATE INDEX IF NOT EXISTS faqs_display_order ON faqs(display_order);

CREATE INDEX IF NOT EXISTS newsletters_email ON newsletters(email);
CREATE INDEX IF NOT EXISTS newsletters_user_id ON newsletters(user_id);
CREATE INDEX IF NOT EXISTS newsletters_is_verified ON newsletters(is_verified);
CREATE INDEX IF NOT EXISTS newsletters_subscription_source ON newsletters(subscription_source);
CREATE INDEX IF NOT EXISTS newsletters_verification_token ON newsletters(verification_token);
CREATE INDEX IF NOT EXISTS newsletters_unsubscribe_token ON newsletters(unsubscribe_token);

CREATE INDEX IF NOT EXISTS newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS newsletter_subscriptions_is_active ON newsletter_subscriptions(is_active);

CREATE INDEX IF NOT EXISTS notification_settings_user_id ON notification_settings(user_id);

CREATE INDEX IF NOT EXISTS audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_action_category ON audit_logs(action_category);
CREATE INDEX IF NOT EXISTS audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS audit_logs_ip_address ON audit_logs(ip_address);
CREATE INDEX IF NOT EXISTS audit_logs_session_id ON audit_logs(session_id);
CREATE INDEX IF NOT EXISTS audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS audit_logs_source ON audit_logs(source);
CREATE INDEX IF NOT EXISTS audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_user_id_action_category_created_at ON audit_logs(user_id, action_category, created_at);

CREATE INDEX IF NOT EXISTS featured_cities_city_id ON featured_cities(city_id);
CREATE INDEX IF NOT EXISTS featured_cities_is_active_display_order ON featured_cities(is_active, display_order);

CREATE INDEX IF NOT EXISTS featured_experiences_experience_id ON featured_experiences(experience_id);
CREATE INDEX IF NOT EXISTS featured_experiences_is_active_display_order ON featured_experiences(is_active, display_order);

CREATE INDEX IF NOT EXISTS featured_hosts_host_id ON featured_hosts(host_id);
CREATE INDEX IF NOT EXISTS featured_hosts_is_active_display_order ON featured_hosts(is_active, display_order);

CREATE INDEX IF NOT EXISTS featured_stories_story_id ON featured_stories(story_id);
CREATE INDEX IF NOT EXISTS featured_stories_is_active_display_order ON featured_stories(is_active, display_order);

CREATE INDEX IF NOT EXISTS featured_testimonials_reviewer_id ON featured_testimonials(reviewer_id);
CREATE INDEX IF NOT EXISTS featured_testimonials_experience_id ON featured_testimonials(experience_id);
CREATE INDEX IF NOT EXISTS featured_testimonials_is_active_display_order ON featured_testimonials(is_active, display_order);