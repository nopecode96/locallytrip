-- Create Business Logic Tables Part 1
-- File: 021-create-business-logic-tables-part1.sql
-- Core business tables: experiences, bookings, payments

\echo '💼 Creating Business Logic Tables (Part 1)...'

-- Create experiences table (exact structure from database)
CREATE TABLE IF NOT EXISTS experiences (
    id SERIAL PRIMARY KEY,
    uuid UUID,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(255),
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    host_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    category_id INTEGER REFERENCES host_categories(id) ON UPDATE CASCADE ON DELETE SET NULL,
    experience_type_id INTEGER REFERENCES experience_types(id) ON UPDATE CASCADE ON DELETE SET NULL,
    city_id INTEGER REFERENCES cities(id) ON UPDATE CASCADE ON DELETE SET NULL,
    package_price NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'IDR',
    duration_hours INTEGER DEFAULT 4,
    max_participants INTEGER DEFAULT 10,
    min_participants INTEGER DEFAULT 1,
    difficulty_level VARCHAR(20),
    images JSONB,
    included_items JSONB,
    excluded_items JSONB,
    meeting_point TEXT,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    status enum_experiences_status NOT NULL DEFAULT 'draft',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating_average NUMERIC(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    booking_count INTEGER DEFAULT 0,
    host_specific_data JSONB,
    deliverables JSONB,
    equipment_used JSONB,
    ending_point TEXT,
    walking_distance_km NUMERIC(5,2),
    fitness_level VARCHAR(20),
    rejection_reason TEXT,
    rejected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for experiences
CREATE UNIQUE INDEX IF NOT EXISTS experiences_slug_key ON experiences(slug);
CREATE UNIQUE INDEX IF NOT EXISTS experiences_uuid_key ON experiences(uuid);
CREATE INDEX IF NOT EXISTS idx_experiences_host_id ON experiences(host_id);
CREATE INDEX IF NOT EXISTS idx_experiences_city_id ON experiences(city_id);
CREATE INDEX IF NOT EXISTS experiences_category_id ON experiences(category_id);
CREATE INDEX IF NOT EXISTS experiences_experience_type_id ON experiences(experience_type_id);
CREATE INDEX IF NOT EXISTS experiences_status ON experiences(status);
CREATE INDEX IF NOT EXISTS experiences_is_active ON experiences(is_active);
CREATE INDEX IF NOT EXISTS experiences_is_featured ON experiences(is_featured);

-- Create bookings table (exact structure from database)
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    uuid UUID,
    experience_id INTEGER REFERENCES experiences(id) ON UPDATE CASCADE ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TIME WITHOUT TIME ZONE,
    participant_count INTEGER DEFAULT 1,
    total_price NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status VARCHAR(20) DEFAULT 'pending',
    special_requests TEXT,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(255),
    cancellation_reason TEXT,
    booking_reference VARCHAR(50),
    category_specific_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create payments table (exact structure from database)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_reference VARCHAR(255),
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for bookings
CREATE UNIQUE INDEX IF NOT EXISTS bookings_uuid_key ON bookings(uuid);
CREATE UNIQUE INDEX IF NOT EXISTS bookings_booking_reference_key ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id ON bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_booking_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS bookings_status ON bookings(status);

-- Create indexes for payments
CREATE INDEX IF NOT EXISTS payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS payments_payment_date ON payments(payment_date);

\echo '✅ Business Logic Tables (Part 1) created successfully!'