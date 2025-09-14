-- Migration untuk menambahkan audit trail dan session management
-- File: 006-add-audit-trail-tables.sql

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    action_category VARCHAR(20) NOT NULL CHECK (action_category IN ('auth', 'profile', 'booking', 'experience', 'payment', 'admin', 'system')),
    resource_type VARCHAR(50),
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    session_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending')),
    error_message TEXT,
    severity VARCHAR(20) DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    source VARCHAR(20) DEFAULT 'web' CHECK (source IN ('web', 'mobile', 'admin', 'api', 'system')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for audit_logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_action_category ON audit_logs(action_category);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address);
CREATE INDEX idx_audit_logs_session_id ON audit_logs(session_id);
CREATE INDEX idx_audit_logs_severity ON audit_logs(severity);
CREATE INDEX idx_audit_logs_source ON audit_logs(source);
CREATE INDEX idx_audit_logs_composite ON audit_logs(user_id, action_category, created_at);

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(500) UNIQUE NOT NULL,
    device_id VARCHAR(255),
    device_name VARCHAR(255),
    device_type VARCHAR(20) DEFAULT 'unknown' CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown')),
    platform VARCHAR(20) DEFAULT 'unknown' CHECK (platform IN ('ios', 'android', 'web', 'windows', 'macos', 'linux', 'unknown')),
    app_version VARCHAR(50),
    os_version VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    fcm_token VARCHAR(500),
    login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    logout_reason VARCHAR(50) CHECK (logout_reason IN ('user_logout', 'token_expired', 'forced_logout', 'admin_logout', 'security_logout')),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user_sessions
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE UNIQUE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_device_id ON user_sessions(device_id);
CREATE INDEX idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX idx_user_sessions_login_at ON user_sessions(login_at);
CREATE INDEX idx_user_sessions_last_activity_at ON user_sessions(last_activity_at);
CREATE INDEX idx_user_sessions_ip_address ON user_sessions(ip_address);
CREATE INDEX idx_user_sessions_platform ON user_sessions(platform);
CREATE INDEX idx_user_sessions_composite_active ON user_sessions(user_id, is_active, expires_at);
CREATE INDEX idx_user_sessions_device_user ON user_sessions(device_id, user_id);

-- Create security_events table
CREATE TABLE IF NOT EXISTS security_events (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'failed_login', 'suspicious_login', 'password_reset_request', 
        'password_changed', 'email_changed', 'account_locked', 'account_unlocked',
        'multiple_failed_attempts', 'unusual_location', 'token_manipulation',
        'api_abuse', 'data_breach_attempt', 'privilege_escalation', 'unauthorized_access'
    )),
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    location JSONB,
    device_info JSONB,
    session_id VARCHAR(255),
    source VARCHAR(20) DEFAULT 'web' CHECK (source IN ('web', 'mobile', 'admin', 'api', 'system')),
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    blocked_action BOOLEAN DEFAULT FALSE,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    related_events INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for security_events
CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);
CREATE INDEX idx_security_events_severity ON security_events(severity);
CREATE INDEX idx_security_events_ip_address ON security_events(ip_address);
CREATE INDEX idx_security_events_resolved ON security_events(resolved);
CREATE INDEX idx_security_events_created_at ON security_events(created_at);
CREATE INDEX idx_security_events_risk_score ON security_events(risk_score);
CREATE INDEX idx_security_events_composite_monitoring ON security_events(severity, resolved, created_at);
CREATE INDEX idx_security_events_user_tracking ON security_events(user_id, event_type, created_at);

-- Add updated_at trigger for user_sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_sessions_updated_at 
    BEFORE UPDATE ON user_sessions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add updated_at trigger for security_events
CREATE TRIGGER update_security_events_updated_at 
    BEFORE UPDATE ON security_events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments untuk dokumentasi
COMMENT ON TABLE audit_logs IS 'Table for storing all user actions and system events for auditing purposes';
COMMENT ON TABLE user_sessions IS 'Table for tracking user login sessions across different devices';
COMMENT ON TABLE security_events IS 'Table for storing security-related events and potential threats';

COMMENT ON COLUMN audit_logs.action_category IS 'Category of action: auth, profile, booking, experience, payment, admin, system';
COMMENT ON COLUMN audit_logs.severity IS 'Severity level: low, medium, high, critical';
COMMENT ON COLUMN audit_logs.source IS 'Source of action: web, mobile, admin, api, system';

COMMENT ON COLUMN user_sessions.device_type IS 'Type of device: mobile, tablet, desktop, unknown';
COMMENT ON COLUMN user_sessions.platform IS 'Platform/OS: ios, android, web, windows, macos, linux, unknown';
COMMENT ON COLUMN user_sessions.logout_reason IS 'Reason for logout: user_logout, token_expired, forced_logout, admin_logout, security_logout';

COMMENT ON COLUMN security_events.event_type IS 'Type of security event for monitoring and alerting';
COMMENT ON COLUMN security_events.risk_score IS 'Calculated risk score from 0-100';
COMMENT ON COLUMN security_events.blocked_action IS 'Whether the action was blocked due to security concerns';
