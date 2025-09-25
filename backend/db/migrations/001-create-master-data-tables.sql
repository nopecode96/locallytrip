-- =====================================================
-- Migration 001: Master Data Tables
-- =====================================================
-- This migration creates all foundational master data tables
-- Order: countries -> cities -> languages -> roles -> banks -> communication_apps -> host_categories -> experience_types

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS experience_types CASCADE;
DROP TABLE IF EXISTS host_categories CASCADE;
DROP TABLE IF EXISTS communication_apps CASCADE;
DROP TABLE IF EXISTS banks CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS countries CASCADE;

-- Drop sequences if they exist
DROP SEQUENCE IF EXISTS experience_types_id_seq CASCADE;
DROP SEQUENCE IF EXISTS host_categories_id_seq CASCADE;
DROP SEQUENCE IF EXISTS communication_apps_id_seq CASCADE;
DROP SEQUENCE IF EXISTS banks_id_seq CASCADE;
DROP SEQUENCE IF EXISTS roles_id_seq CASCADE;
DROP SEQUENCE IF EXISTS languages_id_seq CASCADE;
DROP SEQUENCE IF EXISTS cities_id_seq CASCADE;
DROP SEQUENCE IF EXISTS countries_id_seq CASCADE;

-- Create countries table
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(3) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create cities table (depends on countries)
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    country_id INTEGER REFERENCES countries(id) ON UPDATE CASCADE ON DELETE SET NULL,
    latitude NUMERIC(10, 8),
    longitude NUMERIC(11, 8),
    description TEXT,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(5) NOT NULL UNIQUE,
    native_name VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    permissions JSON,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create banks table
CREATE TABLE IF NOT EXISTS banks (
    id SERIAL PRIMARY KEY,
    bank_code VARCHAR(10) NOT NULL UNIQUE,
    bank_name VARCHAR(100) NOT NULL,
    bank_name_short VARCHAR(50),
    swift_code VARCHAR(11),
    country_code VARCHAR(2) DEFAULT 'ID',
    logo_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create communication_apps table
CREATE TABLE IF NOT EXISTS communication_apps (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    icon_url VARCHAR(255),
    url_pattern VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create host_categories table
CREATE TABLE IF NOT EXISTS host_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create experience_types table
CREATE TABLE IF NOT EXISTS experience_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS cities_country_id ON cities(country_id);
CREATE INDEX IF NOT EXISTS cities_is_active ON cities(is_active);
CREATE INDEX IF NOT EXISTS languages_is_active ON languages(is_active);
CREATE INDEX IF NOT EXISTS roles_is_active ON roles(is_active);
CREATE INDEX IF NOT EXISTS roles_name ON roles(name);
CREATE INDEX IF NOT EXISTS banks_is_active ON banks(is_active);
CREATE INDEX IF NOT EXISTS communication_apps_is_active ON communication_apps(is_active);
CREATE INDEX IF NOT EXISTS host_categories_is_active ON host_categories(is_active);
CREATE INDEX IF NOT EXISTS experience_types_is_active ON experience_types(is_active);