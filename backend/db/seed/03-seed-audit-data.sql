-- Seed data untuk testing audit trail system
-- File: 03-seed-audit-data.sql

-- Insert sample audit logs (hanya untuk testing)
INSERT INTO audit_logs (
    uuid, user_id, action, action_category, resource_type, resource_id,
    new_values, metadata, ip_address, user_agent, status, severity, source, created_at
) VALUES 
-- Admin login logs
(gen_random_uuid(), 1, 'login', 'auth', 'user', 1, 
 '{"email": "admin@locallytrip.com", "role": "super_admin"}',
 '{"endpoint": "/api/v1/admin/auth/login", "method": "POST", "loginMethod": "email_password"}',
 '192.168.1.100', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'success', 'medium', 'admin', CURRENT_TIMESTAMP),

-- User registrations
(gen_random_uuid(), 2, 'register', 'auth', 'user', 2,
 '{"email": "rahma.host@example.com", "role": "host"}',
 '{"endpoint": "/api/v1/auth/register", "method": "POST", "hostCategories": ["Food Tour", "Cultural Experience"]}',
 '203.78.121.45', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)', 'success', 'medium', 'mobile', CURRENT_TIMESTAMP);

(3, 'register', 'auth', 'user', 3,
 '{"email": "budi.traveller@example.com", "role": "traveller"}',
 '{"endpoint": "/api/v1/auth/register", "method": "POST"}',
 '114.79.23.156', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36', 'success', 'medium', 'web'),

-- Profile updates
(2, 'update_profile', 'profile', 'user', 2,
 '{"name": "Rahma Sari Updated", "bio": "Updated bio text"}',
 '{"endpoint": "/api/v1/auth/profile", "method": "PUT"}',
 '203.78.121.45', 'LocallyTripApp/1.0.0 (iPhone)', 'success', 'low', 'mobile'),

-- Failed login attempts
(NULL, 'login_failed', 'auth', 'user', 2,
 NULL,
 '{"email": "rahma.host@example.com", "reason": "invalid_password"}',
 '180.242.215.123', 'Mozilla/5.0 (Android 12; Mobile)', 'failed', 'medium', 'mobile'),

-- Experience creation
(2, 'create_experience', 'experience', 'experience', 1,
 '{"title": "Jakarta Food Adventure", "price": 250000, "duration": 4}',
 '{"endpoint": "/api/v1/experiences", "method": "POST"}',
 '203.78.121.45', 'LocallyTripApp/1.0.0 (iPhone)', 'success', 'medium', 'mobile'),

-- Booking creation
(3, 'create_booking', 'booking', 'booking', 1,
 '{"experienceId": 1, "totalAmount": 250000, "participants": 2}',
 '{"endpoint": "/api/v1/bookings", "method": "POST"}',
 '114.79.23.156', 'Mozilla/5.0 (Windows NT 10.0)', 'success', 'high', 'web');

-- Insert sample user sessions
INSERT INTO user_sessions (
    uuid, user_id, session_token, device_id, device_name, device_type, platform,
    app_version, os_version, ip_address, user_agent, location, is_active, login_at, last_activity_at, created_at, updated_at
) VALUES 
-- Admin web session
(gen_random_uuid(), 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin.session.token',
 'device-admin-web-001', 'MacBook Pro', 'desktop', 'macos',
 '1.0.0', 'macOS 13.4', '192.168.1.100',
 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
 '{"country": "ID", "city": "Jakarta", "timezone": "Asia/Jakarta"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Host mobile session
(gen_random_uuid(), 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.host.mobile.token',
 'device-iphone-rahma-001', 'iPhone 14', 'mobile', 'ios',
 '1.2.0', 'iOS 16.0', '203.78.121.45',
 'LocallyTripApp/1.2.0 (iPhone14,2; iOS 16.0)',
 '{"country": "ID", "city": "Yogyakarta", "timezone": "Asia/Jakarta"}', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
 '{"country": "ID", "city": "Yogyakarta", "timezone": "Asia/Jakarta"}', false);

-- Update the inactive session with logout info
UPDATE user_sessions 
SET logout_at = CURRENT_TIMESTAMP - INTERVAL '2 days',
    logout_reason = 'user_logout'
WHERE session_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.host.old.token';

-- Insert sample security events
INSERT INTO security_events (
    uuid, user_id, event_type, severity, description, details,
    ip_address, user_agent, resolved, risk_score, created_at, updated_at
) VALUES 
-- Failed login from unusual location
(gen_random_uuid(), 2, 'failed_login', 'medium', 'Failed login attempt from unusual location',
 '{"email": "rahma.host@example.com", "attempts": 3, "location": "Singapore", "usual_location": "Yogyakarta"}',
 '180.242.215.123', 'Mozilla/5.0 (Android 12; Mobile)', false, 65, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Password reset request
(gen_random_uuid(), 2, 'password_reset_request', 'low', 'Password reset requested via email',
 '{"email": "rahma.host@example.com", "reset_method": "email"}',
 '203.78.121.45', 'LocallyTripApp/1.2.0 (iPhone)', true, 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Update resolved security events
UPDATE security_events 
SET resolved = true, 
    resolved_at = CURRENT_TIMESTAMP - INTERVAL '1 day',
    resolved_by = 1,
    resolution_notes = 'Verified as legitimate access after user confirmation'
WHERE event_type IN ('password_reset_request', 'unusual_location');

-- Add some comments for documentation
COMMENT ON COLUMN audit_logs.created_at IS 'Timestamp saat audit log dibuat (immutable)';
COMMENT ON COLUMN user_sessions.last_activity_at IS 'Timestamp aktivitas terakhir user dalam session ini';
COMMENT ON COLUMN security_events.risk_score IS 'Skor risiko dari 0-100 berdasarkan pola dan konteks event';
