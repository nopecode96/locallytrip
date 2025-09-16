-- Migration: Fix experience itinerary table name consistency
-- From: experience_itineraries → experience_itinerary (to match Sequelize model)

-- Drop the old table if it exists (with data backup if needed)
DROP TABLE IF EXISTS experience_itineraries CASCADE;

-- Create the correct table name with complete schema
CREATE TABLE IF NOT EXISTS experience_itinerary (
    id SERIAL PRIMARY KEY,
    experience_id INTEGER NOT NULL REFERENCES experiences(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    duration_minutes INTEGER,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_experience_itinerary_experience_id ON experience_itinerary(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_itinerary_step_number ON experience_itinerary(experience_id, step_number);
CREATE INDEX IF NOT EXISTS idx_experience_itinerary_active ON experience_itinerary(is_active);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_experience_itinerary_updated_at ON experience_itinerary;
CREATE TRIGGER update_experience_itinerary_updated_at
    BEFORE UPDATE ON experience_itinerary
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
