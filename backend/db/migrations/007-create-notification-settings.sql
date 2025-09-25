-- 007-create-notification-settings.sql
-- Create notification settings table for users

\echo '🔔 Creating Notification Settings Schema...'

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
    id SERIAL PRIMARY KEY,
    uuid UUID,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    
    -- Notification preferences for different categories
    -- Essential notifications (usually can't be disabled)
    booking_confirmations_email BOOLEAN DEFAULT true,
    booking_confirmations_push BOOLEAN DEFAULT true,
    booking_confirmations_sms BOOLEAN DEFAULT true,
    
    payment_updates_email BOOLEAN DEFAULT true,
    payment_updates_push BOOLEAN DEFAULT true,
    payment_updates_sms BOOLEAN DEFAULT false,
    
    messages_email BOOLEAN DEFAULT true,
    messages_push BOOLEAN DEFAULT true,
    messages_sms BOOLEAN DEFAULT false,
    
    -- Update notifications
    reviews_email BOOLEAN DEFAULT true,
    reviews_push BOOLEAN DEFAULT true,
    reviews_sms BOOLEAN DEFAULT false,
    
    favorites_email BOOLEAN DEFAULT false,
    favorites_push BOOLEAN DEFAULT true,
    favorites_sms BOOLEAN DEFAULT false,
    
    -- Marketing notifications (usually disabled by default)
    promotions_email BOOLEAN DEFAULT false,
    promotions_push BOOLEAN DEFAULT false,
    promotions_sms BOOLEAN DEFAULT false,
    
    newsletter_email BOOLEAN DEFAULT false,
    newsletter_push BOOLEAN DEFAULT false,
    newsletter_sms BOOLEAN DEFAULT false,
    
    -- Global settings
    email_enabled BOOLEAN DEFAULT true,
    push_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    
    -- Marketing preferences
    marketing_consent BOOLEAN DEFAULT false,
    marketing_consent_date TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notification_settings_user_id ON notification_settings(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS notification_settings_uuid_key ON notification_settings(uuid);

-- Insert default notification settings for existing users
INSERT INTO notification_settings (user_id, created_at, updated_at)
SELECT 
    id,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM users 
WHERE id NOT IN (SELECT user_id FROM notification_settings WHERE user_id IS NOT NULL);

\echo '✅ Notification Settings schema created successfully!'

-- Add comments for documentation
COMMENT ON TABLE notification_settings IS 'User notification preferences for email, push, and SMS notifications';
COMMENT ON COLUMN notification_settings.marketing_consent IS 'Explicit consent for marketing communications (GDPR compliance)';
COMMENT ON COLUMN notification_settings.marketing_consent_date IS 'Date when marketing consent was given';
