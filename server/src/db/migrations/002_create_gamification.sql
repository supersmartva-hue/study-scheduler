CREATE TABLE IF NOT EXISTS user_gamification (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    xp_total        INT DEFAULT 0,
    level           INT DEFAULT 1,
    current_streak  INT DEFAULT 0,
    longest_streak  INT DEFAULT 0,
    last_study_date DATE,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS achievements (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(100) UNIQUE NOT NULL,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    xp_reward   INT DEFAULT 0,
    icon        VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS user_achievements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Seed default achievements
INSERT INTO achievements (slug, name, description, xp_reward, icon) VALUES
  ('first_session',  'First Steps',      'Complete your first study session', 50,  'star'),
  ('streak_3',       'On a Roll',        '3-day study streak',               100, 'fire'),
  ('streak_7',       'Week Warrior',     '7-day study streak',               250, 'zap'),
  ('streak_30',      'Monthly Master',   '30-day study streak',              1000,'trophy'),
  ('complete_10',    'Dedicated',        'Complete 10 study sessions',       150, 'check-circle'),
  ('complete_50',    'Scholar',          'Complete 50 study sessions',       500, 'book'),
  ('complete_100',   'Century Club',     'Complete 100 study sessions',      1000,'award'),
  ('night_owl',      'Night Owl',        'Study after 10pm',                 75,  'moon'),
  ('early_bird',     'Early Bird',       'Study before 7am',                 75,  'sun'),
  ('speed_run',      'Speed Runner',     'Complete 3 sessions in one day',   200, 'clock')
ON CONFLICT (slug) DO NOTHING;
