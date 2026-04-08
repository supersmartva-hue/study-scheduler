CREATE TABLE IF NOT EXISTS subjects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    color           VARCHAR(7) DEFAULT '#6366f1',
    difficulty      SMALLINT NOT NULL DEFAULT 3 CHECK (difficulty BETWEEN 1 AND 5),
    estimated_hours DECIMAL(6,2) NOT NULL DEFAULT 10,
    hours_completed DECIMAL(6,2) DEFAULT 0,
    deadline        DATE,
    is_active       BOOLEAN DEFAULT TRUE,
    priority        SMALLINT DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subjects_user ON subjects(user_id, is_active);
