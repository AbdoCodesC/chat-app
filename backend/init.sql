-- Disconnect all users and drop database if it exists
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'chat_db'
AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS chat_db;

CREATE DATABASE chat_db;

\c chat_db;

CREATE TABLE IF NOT EXISTS public_messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add initial system message
INSERT INTO public_messages (content, username) 
VALUES ('Chat initialized', 'System');