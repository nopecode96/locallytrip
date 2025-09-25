-- Create Featured Content Tables
-- File: 011-create-featured-tables.sql

\echo '🏗️  Creating Featured Content Tables...'

-- Note: featured_cities table has been moved to migration 025-create-system-audit-tables.sql
-- This table definition is kept for reference but should use the proper file sequence.
    featured_image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
-- Create featured_experiences table
CREATE TABLE IF NOT EXISTS featured_experiences (
    id SERIAL PRIMARY KEY,
    experience_id INTEGER REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    badge VARCHAR(100) DEFAULT 'Featured Experience',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    featured_until TIMESTAMP WITH TIME ZONE,
    featured_image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for featured_experiences
CREATE INDEX IF NOT EXISTS featured_experiences_experience_id ON featured_experiences(experience_id);
CREATE INDEX IF NOT EXISTS featured_experiences_is_active_display_order ON featured_experiences(is_active, display_order);

-- Create featured_hosts table
CREATE TABLE IF NOT EXISTS featured_hosts (
    id SERIAL PRIMARY KEY,
    host_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    badge VARCHAR(100) DEFAULT 'Featured Host',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    featured_until TIMESTAMP WITH TIME ZONE,
    featured_image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for featured_hosts
CREATE INDEX IF NOT EXISTS featured_hosts_host_id ON featured_hosts(host_id);
CREATE INDEX IF NOT EXISTS featured_hosts_is_active_display_order ON featured_hosts(is_active, display_order);

-- Create featured_stories table
CREATE TABLE IF NOT EXISTS featured_stories (
    id SERIAL PRIMARY KEY,
    story_id INTEGER REFERENCES stories(id) ON UPDATE CASCADE ON DELETE SET NULL,
    title VARCHAR(255),
    description TEXT,
    badge VARCHAR(100) DEFAULT 'Featured Story',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    featured_until TIMESTAMP WITH TIME ZONE,
    featured_image_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for featured_stories
CREATE INDEX IF NOT EXISTS featured_stories_story_id ON featured_stories(story_id);
CREATE INDEX IF NOT EXISTS featured_stories_is_active_display_order ON featured_stories(is_active, display_order);

-- Note: featured_testimonials table has been moved to migration 025-create-system-audit-tables.sql
-- This ensures proper dependency order and avoids duplication

\echo '✅ Featured Content Tables created successfully!'