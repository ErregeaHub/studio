-- MediaFlow Database Schema Migration (PostgreSQL)
-- Version: 1.1.0
-- Description: Updated schema for PostgreSQL with categories removed.

-- 1. Users Table
CREATE TABLE IF NOT EXISTS user_accounts (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone_number VARCHAR(20),
    avatar_url VARCHAR(255),
    bio TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_username ON user_accounts (username);
CREATE INDEX IF NOT EXISTS idx_email ON user_accounts (email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for user_accounts
CREATE TRIGGER update_user_accounts_updated_at
    BEFORE UPDATE ON user_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. Media Contents Table
CREATE TYPE media_type AS ENUM ('photo', 'video');

CREATE TABLE IF NOT EXISTS media_contents (
    id SERIAL PRIMARY KEY,
    uploader_id INTEGER NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    type media_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    media_url VARCHAR(255) NOT NULL,
    thumbnail_url VARCHAR(255) NOT NULL,
    views_count BIGINT DEFAULT 0,
    likes_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_uploader ON media_contents (uploader_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON media_contents (type);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media_contents (created_at);

-- Trigger for media_contents
CREATE TRIGGER update_media_contents_updated_at
    BEFORE UPDATE ON media_contents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 3. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    media_id INTEGER NOT NULL REFERENCES media_contents(id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comment_media ON comments (media_id);
CREATE INDEX IF NOT EXISTS idx_comment_author ON comments (author_id);
CREATE INDEX IF NOT EXISTS idx_comment_created_at ON comments (created_at);

-- 4. Migration Log Table
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Follows Table
CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    following_id INTEGER NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

-- 6. Media Likes Table
CREATE TABLE IF NOT EXISTS media_likes (
    user_id INTEGER NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    media_id INTEGER NOT NULL REFERENCES media_contents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, media_id)
);

-- 7. Notifications Table
CREATE TYPE notification_type AS ENUM ('follow', 'comment', 'like');

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    actor_id INTEGER NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    reference_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
