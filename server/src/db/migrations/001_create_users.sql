CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   TEXT NOT NULL,
    full_name       VARCHAR(255),
    timezone        VARCHAR(100) DEFAULT 'UTC',
    study_start_hour INT DEFAULT 8,
    study_end_hour   INT DEFAULT 22,
    daily_goal_hours DECIMAL(4,2) DEFAULT 4,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
