-- =====================================================
-- Migration 002: User & Authentication Tables
-- =====================================================
-- This migration creates all user-related and authentication tables
-- Dependencies: 001-create-master-data-tables.sql (cities, roles, languages, banks, communication_apps, host_categories)

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS security_events CASCADE;
DROP TABLE IF EXISTS user_communication_contacts CASCADE;
DROP TABLE IF EXISTS user_bank_accounts CASCADE;
DROP TABLE IF EXISTS user_host_categories CASCADE;
DROP TABLE IF EXISTS user_languages CASCADE;
DROP TABLE IF EXISTS user_sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS security_events_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_communication_contacts_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_bank_accounts_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_host_categories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_languages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS user_sessions_id_seq CASCADE;
DROP SEQUENCE IF EXISTS users_id_seq CASCADE;

-- Drop ENUM types if they exist
DROP TYPE IF EXISTS enum_security_events_source CASCADE;
DROP TYPE IF EXISTS enum_security_events_severity CASCADE;
DROP TYPE IF EXISTS enum_security_events_event_type CASCADE;
DROP TYPE IF EXISTS enum_user_languages_proficiency CASCADE;
DROP TYPE IF EXISTS enum_user_sessions_logout_reason CASCADE;
DROP TYPE IF EXISTS enum_user_sessions_platform CASCADE;
DROP TYPE IF EXISTS enum_user_sessions_device_type CASCADE;

-- Create ENUM types
CREATE TYPE enum_user_sessions_device_type AS ENUM ('mobile', 'tablet', 'desktop', 'unknown');
CREATE TYPE enum_user_sessions_platform AS ENUM ('ios', 'android', 'web', 'windows', 'macos', 'linux', 'unknown');
CREATE TYPE enum_user_sessions_logout_reason AS ENUM ('user_logout', 'token_expired', 'forced_logout', 'admin_logout', 'security_logout');
CREATE TYPE enum_user_languages_proficiency AS ENUM ('basic', 'intermediate', 'advanced', 'native');
CREATE TYPE enum_security_events_event_type AS ENUM (
    'failed_login', 'suspicious_login', 'password_reset_request', 'password_changed', 
    'email_changed', 'account_locked', 'account_unlocked', 'multiple_failed_attempts',
    'unusual_location', 'token_manipulation', 'api_abuse', 'data_breach_attempt',
    'privilege_escalation', 'unauthorized_access'
);
CREATE TYPE enum_security_events_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE enum_security_events_source AS ENUM ('web', 'mobile', 'admin', 'api', 'system');

-- Create users table (main user table)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL DEFAULT 'traveller',
    role_id INTEGER REFERENCES roles(id) ON UPDATE CASCADE ON DELETE SET NULL,
    phone VARCHAR(50),
    avatar_url VARCHAR(500),
    bio TEXT,
    city_id INTEGER REFERENCES cities(id) ON UPDATE CASCADE ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_trusted BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create user_sessions table (session management)
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    session_token VARCHAR(500) UNIQUE NOT NULL,
    device_id VARCHAR(255),
    device_name VARCHAR(255),
    device_type enum_user_sessions_device_type NOT NULL DEFAULT 'unknown',
    platform enum_user_sessions_platform NOT NULL DEFAULT 'unknown',
    app_version VARCHAR(50),
    os_version VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    fcm_token VARCHAR(500),
    login_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL,
    logout_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    logout_reason enum_user_sessions_logout_reason,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create user_languages table (user language preferences)
CREATE TABLE IF NOT EXISTS user_languages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    language_id INTEGER REFERENCES languages(id) ON UPDATE CASCADE ON DELETE CASCADE,
    proficiency enum_user_languages_proficiency NOT NULL DEFAULT 'intermediate',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, language_id)
);

-- Create user_host_categories table (host specializations)
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

-- Create user_bank_accounts table (payment information)
CREATE TABLE IF NOT EXISTS user_bank_accounts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    bank_id INTEGER NOT NULL REFERENCES banks(id) ON UPDATE CASCADE,
    account_number VARCHAR(50) NOT NULL,
    account_holder_name VARCHAR(100) NOT NULL,
    branch_name VARCHAR(100),
    branch_code VARCHAR(20),
    is_primary BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, bank_id, account_number)
);

-- Create user_communication_contacts table (contact preferences)
CREATE TABLE IF NOT EXISTS user_communication_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    communication_app_id INTEGER REFERENCES communication_apps(id) ON UPDATE CASCADE ON DELETE SET NULL,
    contact_value VARCHAR(255) NOT NULL,
    is_preferred BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(user_id, communication_app_id)
);

-- Create security_events table (security audit logs)
CREATE TABLE IF NOT EXISTS security_events (
    id SERIAL PRIMARY KEY,
    uuid UUID UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    event_type enum_security_events_event_type NOT NULL,
    severity enum_security_events_severity NOT NULL DEFAULT 'medium',
    description TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    device_info JSONB,
    session_id VARCHAR(255),
    source enum_security_events_source NOT NULL DEFAULT 'web',
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    resolved_by INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    blocked_action BOOLEAN NOT NULL DEFAULT FALSE,
    risk_score INTEGER,
    related_events INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_city_id ON users(city_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS users_is_verified ON users(is_verified);

CREATE INDEX IF NOT EXISTS user_sessions_device_id ON user_sessions(device_id);
CREATE INDEX IF NOT EXISTS user_sessions_device_id_user_id ON user_sessions(device_id, user_id);
CREATE INDEX IF NOT EXISTS user_sessions_ip_address ON user_sessions(ip_address);
CREATE INDEX IF NOT EXISTS user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS user_sessions_last_activity_at ON user_sessions(last_activity_at);
CREATE INDEX IF NOT EXISTS user_sessions_login_at ON user_sessions(login_at);
CREATE INDEX IF NOT EXISTS user_sessions_platform ON user_sessions(platform);
CREATE INDEX IF NOT EXISTS user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_user_id_is_active_expires_at ON user_sessions(user_id, is_active, expires_at);

CREATE INDEX IF NOT EXISTS user_languages_user_id ON user_languages(user_id);
CREATE INDEX IF NOT EXISTS user_languages_language_id ON user_languages(language_id);

CREATE INDEX IF NOT EXISTS user_host_categories_host_category_id ON user_host_categories(host_category_id);
CREATE INDEX IF NOT EXISTS user_host_categories_is_active ON user_host_categories(is_active);
CREATE INDEX IF NOT EXISTS user_host_categories_is_primary ON user_host_categories(is_primary);
CREATE INDEX IF NOT EXISTS user_host_categories_user_id ON user_host_categories(user_id);

CREATE INDEX IF NOT EXISTS user_bank_accounts_user_id ON user_bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS user_bank_accounts_bank_id ON user_bank_accounts(bank_id);
CREATE INDEX IF NOT EXISTS user_bank_accounts_is_active ON user_bank_accounts(is_active);

CREATE INDEX IF NOT EXISTS user_communication_contacts_user_id ON user_communication_contacts(user_id);
CREATE INDEX IF NOT EXISTS user_communication_contacts_communication_app_id ON user_communication_contacts(communication_app_id);

CREATE INDEX IF NOT EXISTS security_events_created_at ON security_events(created_at);
CREATE INDEX IF NOT EXISTS security_events_event_type ON security_events(event_type);
CREATE INDEX IF NOT EXISTS security_events_ip_address ON security_events(ip_address);
CREATE INDEX IF NOT EXISTS security_events_resolved ON security_events(resolved);
CREATE INDEX IF NOT EXISTS security_events_risk_score ON security_events(risk_score);
CREATE INDEX IF NOT EXISTS security_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS security_events_severity_resolved_created_at ON security_events(severity, resolved, created_at);
CREATE INDEX IF NOT EXISTS security_events_user_id ON security_events(user_id);
CREATE INDEX IF NOT EXISTS security_events_user_id_event_type_created_at ON security_events(user_id, event_type, created_at);