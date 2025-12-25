-- RedRAW Database Schema Rollback
-- Version: 1.0.0
-- Description: Reverts the initial schema setup.

-- Order of dropping is important due to foreign key constraints
DROP TABLE IF EXISTS schema_migrations;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS media_contents;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS user_accounts;
