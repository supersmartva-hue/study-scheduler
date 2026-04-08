const { query } = require('../../config/database');

async function getProfile(userId) {
  const result = await query(
    `SELECT u.id, u.email, u.full_name, u.timezone, u.study_start_hour, u.study_end_hour,
            u.daily_goal_hours, u.created_at,
            g.xp_total, g.level, g.current_streak, g.longest_streak, g.last_study_date
     FROM users u
     LEFT JOIN user_gamification g ON g.user_id = u.id
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0];
}

async function updateProfile(userId, updates) {
  const allowed = ['full_name', 'timezone', 'study_start_hour', 'study_end_hour', 'daily_goal_hours'];
  const fields = Object.keys(updates).filter((k) => allowed.includes(k));
  if (fields.length === 0) return getProfile(userId);

  const setClauses = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = fields.map((f) => updates[f]);

  await query(
    `UPDATE users SET ${setClauses}, updated_at = NOW() WHERE id = $1`,
    [userId, ...values]
  );
  return getProfile(userId);
}

async function getStats(userId) {
  const result = await query(
    `SELECT
       COUNT(*) FILTER (WHERE status = 'completed') AS sessions_completed,
       COUNT(*) FILTER (WHERE status = 'missed') AS sessions_missed,
       COUNT(*) FILTER (WHERE status = 'pending' AND planned_date >= CURRENT_DATE) AS sessions_upcoming,
       COALESCE(SUM(duration_mins) FILTER (WHERE status = 'completed'), 0) AS total_minutes_studied,
       ROUND(
         COUNT(*) FILTER (WHERE status = 'completed')::numeric /
         NULLIF(COUNT(*) FILTER (WHERE status IN ('completed','missed')), 0) * 100, 1
       ) AS completion_rate
     FROM study_sessions WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
}

async function getAchievements(userId) {
  const result = await query(
    `SELECT a.slug, a.name, a.description, a.xp_reward, a.icon, ua.earned_at
     FROM user_achievements ua
     JOIN achievements a ON a.id = ua.achievement_id
     WHERE ua.user_id = $1
     ORDER BY ua.earned_at DESC`,
    [userId]
  );
  return result.rows;
}

module.exports = { getProfile, updateProfile, getStats, getAchievements };
