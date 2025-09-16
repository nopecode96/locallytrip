-- Migration: Add rejected status to experience_status_enum
-- Date: 2025-09-15
-- Purpose: Add rejected status for admin workflow

-- Step 1: Add rejected to the enum type
ALTER TYPE experience_status_enum ADD VALUE 'rejected';

-- Step 2: Add rejection_reason column for admin feedback
ALTER TABLE experiences 
ADD COLUMN rejection_reason TEXT;

-- Step 3: Add rejected_at timestamp
ALTER TABLE experiences 
ADD COLUMN rejected_at TIMESTAMP WITH TIME ZONE;

-- Step 4: Add index for rejected experiences
CREATE INDEX idx_experiences_rejected ON experiences(status, rejected_at) 
WHERE status = 'rejected';

-- Step 5: Add comments
COMMENT ON COLUMN experiences.rejection_reason IS 'Admin feedback when experience is rejected';
COMMENT ON COLUMN experiences.rejected_at IS 'Timestamp when experience was rejected by admin';

-- Update the enum comment
COMMENT ON TYPE experience_status_enum IS 'Status lifecycle: draft, pending_review, published, rejected, paused, suspended, deleted';
