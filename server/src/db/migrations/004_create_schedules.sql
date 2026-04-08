CREATE TABLE IF NOT EXISTS schedules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    generated_at    TIMESTAMPTZ DEFAULT NOW(),
    week_start_date DATE NOT NULL,
    ai_reasoning    TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    raw_ai_response JSONB
);

CREATE INDEX IF NOT EXISTS idx_schedules_user ON schedules(user_id, is_active);
