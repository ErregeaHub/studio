-- RedRAW Database Schema Migration
-- Version: 1.1.0
-- Description: Updated schema with categories removed. Users can post text, videos or photos.



-- 1. Users Table
CREATE TABLE IF NOT EXISTS user_accounts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
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

CREATE INDEX IF NOT EXISTS idx_username ON user_accounts(username);
CREATE INDEX IF NOT EXISTS idx_email ON user_accounts(email);

-- 2. Media Contents Table
CREATE TABLE IF NOT EXISTS media_contents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uploader_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('photo', 'video', 'text')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    media_url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    views_count BIGINT DEFAULT 0,
    likes_count BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_media_uploader FOREIGN KEY (uploader_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_uploader ON media_contents(uploader_id);
CREATE INDEX IF NOT EXISTS idx_type ON media_contents(type);
CREATE INDEX IF NOT EXISTS idx_created_at ON media_contents(created_at);

-- 3. Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    media_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comment_media FOREIGN KEY (media_id) REFERENCES media_contents(id) ON DELETE CASCADE,
    CONSTRAINT fk_comment_author FOREIGN KEY (author_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_media ON comments(media_id);
CREATE INDEX IF NOT EXISTS idx_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comment_created_at ON comments(created_at);

-- 4. Migration Log Table
CREATE TABLE IF NOT EXISTS schema_migrations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    version VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Follows Table
CREATE TABLE IF NOT EXISTS follows (
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT fk_follows_follower FOREIGN KEY (follower_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk_follows_following FOREIGN KEY (following_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);

-- 6. Media Likes Table
CREATE TABLE IF NOT EXISTS media_likes (
    user_id BIGINT NOT NULL,
    media_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, media_id),
    CONSTRAINT fk_likes_user FOREIGN KEY (user_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk_likes_media FOREIGN KEY (media_id) REFERENCES media_contents(id) ON DELETE CASCADE
);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    actor_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('follow', 'comment', 'like')),
    reference_id BIGINT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_recipient FOREIGN KEY (recipient_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_actor FOREIGN KEY (actor_id) REFERENCES user_accounts(id) ON DELETE CASCADE
);
