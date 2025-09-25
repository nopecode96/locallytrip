-- Migration: Create system audit and featured content tables
-- Date: 2025-01-03  
-- Purpose: Create audit_logs, featured_cities, featured_testimonials, and remaining system tables

-- Create audit_logs table (exact structure from database)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    action CHARACTER VARYING(100) NOT NULL,
    action_category enum_audit_logs_action_category NOT NULL,
    resource_type CHARACTER VARYING(50),
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    session_id CHARACTER VARYING(255),
    status enum_audit_logs_status DEFAULT 'success' NOT NULL,
    error_message TEXT,
    severity enum_audit_logs_severity DEFAULT 'low' NOT NULL,
    source enum_audit_logs_source DEFAULT 'web' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS audit_logs_action_category ON audit_logs(action_category);
CREATE INDEX IF NOT EXISTS audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS audit_logs_ip_address ON audit_logs(ip_address);
CREATE INDEX IF NOT EXISTS audit_logs_session_id ON audit_logs(session_id);
CREATE INDEX IF NOT EXISTS audit_logs_severity ON audit_logs(severity);
CREATE INDEX IF NOT EXISTS audit_logs_source ON audit_logs(source);
CREATE INDEX IF NOT EXISTS audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS audit_logs_user_id_action_category_created_at ON audit_logs(user_id, action_category, created_at);

-- Create featured_cities table (exact structure from database)
CREATE TABLE IF NOT EXISTS featured_cities (
    id SERIAL PRIMARY KEY,
    city_id INTEGER REFERENCES cities(id) ON UPDATE CASCADE ON DELETE SET NULL,
    title CHARACTER VARYING(255),
    description TEXT,
    badge CHARACTER VARYING(100) DEFAULT 'Popular Destination',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    featured_until TIMESTAMP WITH TIME ZONE,
    featured_image_url CHARACTER VARYING(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for featured_cities
CREATE INDEX IF NOT EXISTS featured_cities_city_id ON featured_cities(city_id);
CREATE INDEX IF NOT EXISTS featured_cities_is_active_display_order ON featured_cities(is_active, display_order);

-- Create featured_testimonials table
CREATE TABLE IF NOT EXISTS featured_testimonials (
    id SERIAL PRIMARY KEY,
    title CHARACTER VARYING(150),
    testimonial_text TEXT NOT NULL,
    reviewer_name CHARACTER VARYING(100) NOT NULL,
    reviewer_location CHARACTER VARYING(100),
    featured_image_url CHARACTER VARYING(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewer_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    experience_id INTEGER REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE SET NULL
);

-- Create indexes for featured_testimonials
CREATE INDEX IF NOT EXISTS featured_testimonials_is_active_display_order ON featured_testimonials(is_active, display_order);

-- Create security_events table
CREATE TABLE IF NOT EXISTS security_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    event_type enum_security_event_type NOT NULL,
    event_category enum_security_event_category DEFAULT 'authentication' NOT NULL,
    severity enum_security_event_severity DEFAULT 'low' NOT NULL,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    session_id CHARACTER VARYING(255),
    details JSONB,
    is_resolved BOOLEAN DEFAULT FALSE,
    resolved_by INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for security_events
CREATE INDEX IF NOT EXISTS security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS security_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS security_events_ip_address ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS security_events_created_at ON security_events(created_at);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    session_id CHARACTER VARYING(255) NOT NULL UNIQUE,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    login_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    logout_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for user_sessions
CREATE INDEX IF NOT EXISTS user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS user_sessions_expires_at ON user_sessions(expires_at);