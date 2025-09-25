-- Create All ENUM Types
-- File: 010-create-enum-types.sql
-- This file should run before any table creation that uses these ENUMs

\echo '📋 Creating ENUM Types...'

-- Audit Logs ENUMs
CREATE TYPE IF NOT EXISTS enum_audit_logs_action_category AS ENUM (
    'auth', 'profile', 'booking', 'experience', 'payment', 'admin', 'system'
);

CREATE TYPE IF NOT EXISTS enum_audit_logs_severity AS ENUM (
    'low', 'medium', 'high', 'critical'
);

CREATE TYPE IF NOT EXISTS enum_audit_logs_source AS ENUM (
    'web', 'mobile', 'admin', 'api', 'system'
);

CREATE TYPE IF NOT EXISTS enum_audit_logs_status AS ENUM (
    'success', 'failed', 'pending'
);

-- Experiences ENUMs
CREATE TYPE IF NOT EXISTS enum_experiences_status AS ENUM (
    'draft', 'pending_review', 'published', 'rejected', 'paused', 'suspended', 'deleted'
);

-- FAQs ENUMs
CREATE TYPE IF NOT EXISTS enum_faqs_category AS ENUM (
    'general', 'booking', 'payment', 'host', 'traveller', 'technical'
);

-- Payout ENUMs
CREATE TYPE IF NOT EXISTS enum_payout_history_status AS ENUM (
    'pending', 'processing', 'completed', 'failed', 'cancelled'
);

CREATE TYPE IF NOT EXISTS enum_payout_settings_payout_frequency AS ENUM (
    'weekly', 'biweekly', 'monthly'
);

-- Security Events ENUMs (already created in previous migration)
CREATE TYPE IF NOT EXISTS enum_security_events_event_type AS ENUM (
    'failed_login', 'suspicious_login', 'password_reset_request', 'password_changed', 
    'email_changed', 'account_locked', 'account_unlocked', 'multiple_failed_attempts',
    'unusual_location', 'token_manipulation', 'api_abuse', 'data_breach_attempt',
    'privilege_escalation', 'unauthorized_access'
);

CREATE TYPE IF NOT EXISTS enum_security_events_severity AS ENUM (
    'low', 'medium', 'high', 'critical'
);

CREATE TYPE IF NOT EXISTS enum_security_events_source AS ENUM (
    'web', 'mobile', 'api', 'admin', 'system'
);

-- Stories ENUMs
CREATE TYPE IF NOT EXISTS enum_stories_status AS ENUM (
    'draft', 'pending_review', 'published', 'scheduled', 'archived'
);

-- User Languages ENUMs
CREATE TYPE IF NOT EXISTS enum_user_languages_proficiency AS ENUM (
    'basic', 'intermediate', 'advanced', 'native'
);

-- User Sessions ENUMs
CREATE TYPE IF NOT EXISTS enum_user_sessions_device_type AS ENUM (
    'desktop', 'mobile', 'tablet', 'unknown'
);

CREATE TYPE IF NOT EXISTS enum_user_sessions_logout_reason AS ENUM (
    'user_logout', 'token_expired', 'forced_logout', 'admin_logout', 'security_logout'
);

CREATE TYPE IF NOT EXISTS enum_user_sessions_platform AS ENUM (
    'ios', 'android', 'web', 'windows', 'macos', 'linux', 'unknown'
);

\echo '✅ All ENUM Types created successfully!'