-- Migration: Add status column to experiences table
-- Date: 2025-09-15
-- Purpose: Replace simple is_active with comprehensive status system

-- Step 1: Add status column with enum type
CREATE TYPE experience_status_enum AS ENUM (
    'draft',
    'pending_review', 
    'published',
    'paused',
    'suspended',
    'deleted'
);

-- Step 2: Add status column to experiences table
ALTER TABLE experiences 
ADD COLUMN status experience_status_enum DEFAULT 'draft';

-- Step 3: Migrate existing data based on is_active
-- Active experiences -> published
-- Inactive experiences -> paused (preserving existing logic)
UPDATE experiences 
SET status = CASE 
    WHEN is_active = true THEN 'published'::experience_status_enum
    WHEN is_active = false THEN 'paused'::experience_status_enum
    ELSE 'draft'::experience_status_enum
END;

-- Step 4: Add constraints and indexes
ALTER TABLE experiences 
ALTER COLUMN status SET NOT NULL;

-- Add index for performance
CREATE INDEX idx_experiences_status ON experiences(status);

-- Add index for filtering published experiences
CREATE INDEX idx_experiences_published_active ON experiences(status, created_at) 
WHERE status = 'published';

-- Step 5: Add comments for documentation
COMMENT ON COLUMN experiences.status IS 'Experience status: draft, pending_review, published, paused, suspended, deleted';
COMMENT ON TYPE experience_status_enum IS 'Status lifecycle for experiences with business logic constraints';

-- Note: We keep is_active for backward compatibility during transition
-- It can be removed in a future migration once all code is updated
