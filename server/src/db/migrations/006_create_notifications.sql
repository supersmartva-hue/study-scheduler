CREATE TABLE IF NOT EXISTS notifications (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id    UUID REFERENCES study_sessions(id) ON DELETE CASCADE,
    type          VARCHAR(50) NOT NULL
                  CHECK (type IN ('reminder','missed','streak','achievement','system')),
    title         VARCHAR(255) NOT NULL,
    message       TEXT,
    is_read       BOOLEAN DEFAULT FALSE,
    scheduled_for TIMESTAMPTZ,
    sent_at       TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user  ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_sched ON notifications(scheduled_for) WHERE sent_at IS NULL;
