-- Migration: Add Follows Table with Constraints
-- Description: Creates the follows table and ensures a user cannot follow themselves or the same person twice.

CREATE TABLE IF NOT EXISTS follows (
    follower_id BIGINT NOT NULL,
    following_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT fk_follows_follower FOREIGN KEY (follower_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    CONSTRAINT fk_follows_following FOREIGN KEY (following_id) REFERENCES user_accounts(id) ON DELETE CASCADE,
    CONSTRAINT chk_not_self_follow CHECK (follower_id <> following_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);
