-- Create communication_apps table for master data
CREATE TABLE communication_apps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    icon_url VARCHAR(255),
    url_pattern VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_communication_contacts table for user contact information
CREATE TABLE user_communication_contacts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    communication_app_id INTEGER NOT NULL REFERENCES communication_apps(id),
    contact_value VARCHAR(255) NOT NULL,
    is_preferred BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_communication_app UNIQUE (user_id, communication_app_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_communication_contacts_user_id ON user_communication_contacts(user_id);
CREATE INDEX idx_user_communication_contacts_app_id ON user_communication_contacts(communication_app_id);
CREATE INDEX idx_user_communication_contacts_is_preferred ON user_communication_contacts(user_id, is_preferred) WHERE is_preferred = true;
CREATE INDEX idx_user_communication_contacts_is_public ON user_communication_contacts(user_id, is_public) WHERE is_public = true;

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to both tables
CREATE TRIGGER update_communication_apps_updated_at 
    BEFORE UPDATE ON communication_apps 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_communication_contacts_updated_at 
    BEFORE UPDATE ON user_communication_contacts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE communication_apps IS 'Master data for available communication applications';
COMMENT ON COLUMN communication_apps.url_pattern IS 'Pattern to generate contact links, use {username}, {phone}, etc as placeholders';
COMMENT ON TABLE user_communication_contacts IS 'User contact information for various communication apps';
COMMENT ON COLUMN user_communication_contacts.contact_value IS 'Username, phone number, or contact ID for the communication app';
COMMENT ON COLUMN user_communication_contacts.is_public IS 'Whether this contact is visible to other users';
