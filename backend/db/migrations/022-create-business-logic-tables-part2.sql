-- Create Business Logic Tables Part 2
-- File: 022-create-business-logic-tables-part2.sql
-- Content and review tables: reviews, stories, story_comments, story_likes

\echo '📝 Creating Business Logic Tables (Part 2)...'

-- Create reviews table (exact structure from database)
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    experience_id INTEGER NOT NULL REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE CASCADE,
    reviewer_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON UPDATE CASCADE ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create stories table (exact structure from database)
CREATE TABLE IF NOT EXISTS stories (
    id SERIAL PRIMARY KEY,
    uuid VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(220) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt VARCHAR(500),
    author_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    city_id INTEGER REFERENCES cities(id) ON UPDATE CASCADE ON DELETE SET NULL,
    cover_image VARCHAR(255),
    images JSON,
    meta_title VARCHAR(60),
    meta_description VARCHAR(160),
    keywords JSON,
    tags JSON,
    reading_time INTEGER,
    language VARCHAR(5) DEFAULT 'en',
    status enum_stories_status DEFAULT 'draft',
    admin_reason TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create story_comments table (exact structure from database)
CREATE TABLE IF NOT EXISTS story_comments (
    id SERIAL PRIMARY KEY,
    story_id INTEGER NOT NULL REFERENCES stories(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    parent_id INTEGER REFERENCES story_comments(id) ON UPDATE CASCADE ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create story_likes table (exact structure from database)
CREATE TABLE IF NOT EXISTS story_likes (
    id SERIAL PRIMARY KEY,
    story_id INTEGER NOT NULL REFERENCES stories(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE(story_id, user_id)
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_experience_id ON reviews(experience_id);
CREATE INDEX IF NOT EXISTS reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS reviews_booking_id ON reviews(booking_id);
CREATE INDEX IF NOT EXISTS reviews_rating ON reviews(rating);

-- Create indexes for stories
CREATE UNIQUE INDEX IF NOT EXISTS stories_uuid_key ON stories(uuid);
CREATE UNIQUE INDEX IF NOT EXISTS stories_slug_key ON stories(slug);
CREATE INDEX IF NOT EXISTS idx_stories_author_id ON stories(author_id);
CREATE INDEX IF NOT EXISTS stories_slug ON stories(slug);
CREATE INDEX IF NOT EXISTS stories_author_id_status ON stories(author_id, status);
CREATE INDEX IF NOT EXISTS stories_city_id_status ON stories(city_id, status);
CREATE INDEX IF NOT EXISTS stories_is_featured_status ON stories(is_featured, status);
CREATE INDEX IF NOT EXISTS stories_view_count_like_count ON stories(view_count, like_count);

-- Create indexes for story_comments
CREATE INDEX IF NOT EXISTS story_comments_story_id ON story_comments(story_id);
CREATE INDEX IF NOT EXISTS story_comments_user_id ON story_comments(user_id);

-- Create indexes for story_likes
CREATE INDEX IF NOT EXISTS story_likes_story_id ON story_likes(story_id);
CREATE INDEX IF NOT EXISTS story_likes_user_id ON story_likes(user_id);

\echo '✅ Business Logic Tables (Part 2) created successfully!'