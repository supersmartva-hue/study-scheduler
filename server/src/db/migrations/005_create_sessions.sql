CREATE TABLE IF NOT EXISTS study_sessions (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id          UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    schedule_id         UUID REFERENCES schedules(id) ON DELETE SET NULL,
    title               VARCHAR(255),
    planned_date        DATE NOT NULL,
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    duration_mins       INT,
    status              VARCHAR(20) DEFAULT 'pending'
                        CHECK (status IN ('pending','completed','missed','skipped','rescheduled')),
    completed_at        TIMESTAMPTZ,
    notes               TEXT,
    xp_awarded          INT DEFAULT 0,
    is_rescheduled      BOOLEAN DEFAULT FALSE,
    original_session_id UUID REFERENCES study_sessions(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_date ON study_sessions(user_id, planned_date);
CREATE INDEX IF NOT EXISTS idx_sessions_schedule  ON study_sessions(schedule_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status    ON study_sessions(user_id, status);
