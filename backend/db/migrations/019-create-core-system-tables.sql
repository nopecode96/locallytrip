-- Create Core System Tables (Missing from migrations)
-- File: 019-create-core-system-tables.sql
-- Critical tables that exist in database but missing from migration files

\echo '🏗️  Creating Missing Core System Tables...'

-- Create countries table (exact structure from database)
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(3) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create cities table (exact structure from database) 
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INTEGER REFERENCES countries(id) ON UPDATE CASCADE ON DELETE SET NULL,
    timezone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create languages table (exact structure from database)
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(5) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create roles table (exact structure from database)
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create host_categories table (exact structure from database)
CREATE TABLE IF NOT EXISTS host_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create experience_types table (exact structure from database)
CREATE TABLE IF NOT EXISTS experience_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for countries
CREATE UNIQUE INDEX IF NOT EXISTS countries_name_key ON countries(name);
CREATE UNIQUE INDEX IF NOT EXISTS countries_code_key ON countries(code);

-- Create indexes for cities
CREATE INDEX IF NOT EXISTS cities_country_id ON cities(country_id);

-- Create indexes for languages
CREATE UNIQUE INDEX IF NOT EXISTS languages_name_key ON languages(name);
CREATE UNIQUE INDEX IF NOT EXISTS languages_code_key ON languages(code);

-- Create indexes for roles
CREATE UNIQUE INDEX IF NOT EXISTS roles_name_key ON roles(name);

-- Create users table (moved here to fix dependency order)
-- This table depends on roles and cities created above
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    uuid UUID,
    name CHARACTER VARYING(255) NOT NULL,
    email CHARACTER VARYING(255) NOT NULL UNIQUE,
    password_hash CHARACTER VARYING(255),
    role CHARACTER VARYING(50) DEFAULT 'traveller' NOT NULL,
    role_id INTEGER REFERENCES roles(id) ON UPDATE CASCADE ON DELETE SET NULL,
    phone CHARACTER VARYING(50),
    avatar_url CHARACTER VARYING(500),
    bio TEXT,
    city_id INTEGER REFERENCES cities(id) ON UPDATE CASCADE ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_trusted BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    verification_token CHARACTER VARYING(255),
    password_reset_token CHARACTER VARYING(255),
    password_reset_expires_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for users
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS users_uuid_key ON users(uuid);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_city_id ON users(city_id);
CREATE INDEX IF NOT EXISTS users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS users_is_verified ON users(is_verified);

\echo '✅ Core System Tables (including users) created successfully!'