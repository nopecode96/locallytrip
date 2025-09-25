-- Note: Tables from this migration have been moved to proper migration files:
-- - communication_apps: moved to 008-create-communication-apps.sql (this is the correct file)
-- - user_communication_contacts: moved to 018-create-basic-system-tables.sql
-- This maintains the original communication_apps table while moving user_communication_contacts to proper sequence

-- Create communication_apps table for master data
CREATE TABLE IF NOT EXISTS communication_apps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    icon_url VARCHAR(255),
    url_pattern VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);



-- Add comments for documentation
COMMENT ON TABLE communication_apps IS 'Master data for available communication applications';
COMMENT ON COLUMN communication_apps.url_pattern IS 'Pattern to generate contact links, use {username}, {phone}, etc as placeholders';
COMMENT ON TABLE user_communication_contacts IS 'User contact information for various communication apps';
COMMENT ON COLUMN user_communication_contacts.contact_value IS 'Username, phone number, or contact ID for the communication app';
COMMENT ON COLUMN user_communication_contacts.is_public IS 'Whether this contact is visible to other users';
