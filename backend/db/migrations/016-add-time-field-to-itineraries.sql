-- Migration: Add time field to experience_itineraries table
-- This allows storing time information for each itinerary step (e.g., "09:00 - 10:30")

-- Add time field to experience_itineraries table
ALTER TABLE experience_itineraries 
ADD COLUMN time_schedule VARCHAR(50);

-- Add comment for the new field
COMMENT ON COLUMN experience_itineraries.time_schedule IS 'Time schedule for the step (e.g., "09:00 - 10:30", "Morning", "Afternoon")';

-- Create index for performance (optional, useful for filtering by time)
CREATE INDEX IF NOT EXISTS idx_experience_itineraries_time ON experience_itineraries(time_schedule);
