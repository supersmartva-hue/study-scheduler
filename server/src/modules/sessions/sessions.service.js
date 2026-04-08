const { query } = require('../../config/database');
const { calculateXP } = require('../../utils/xp');

async function listSessions(userId, filters = {}) {
  let sql = `
    SELECT ss.*, s.name AS subject_name, s.color AS subject_color
    FROM study_sessions ss
    JOIN subjects s ON s.id = ss.subject_id
    WHERE ss.user_id = $1
  `;
  const params = [userId];
  let idx = 2;

  if (filters.date) {
    sql += ` AND ss.planned_date = $${idx++}`;
    params.push(filters.date);
  }
  if (filters.week) {
    // week = 'YYYY-MM-DD' (Monday)
    sql += ` AND ss.planned_date >= $${idx++} AND ss.planned_date < $${idx++}::date + interval '7 days'`;
    params.push(filters.week, filters.week);
  }
  if (filters.status) {
    sql += ` AND ss.status = $${idx++}`;
    params.push(filters.status);
  }

  sql += ' ORDER BY ss.planned_date, ss.start_time';
  const result = await query(sql, params);
  return result.rows;
}

async function createSession(userId, data) {
  const { subjectId, scheduleId, title, plannedDate, startTime, endTime, notes } = data;
  const durationMins = calcDuration(startTime, endTime);
  const result = await query(
    `INSERT INTO study_sessions
       (user_id, subject_id, schedule_id, title, planned_date, start_time, end_time, duration_mins, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [userId, subjectId, scheduleId || null, title || null, plannedDate, startTime, endTime, durationMins, notes || null]
  );
  return result.rows[0];
}

async function getSession(userId, sessionId) {
  const result = await query(
    `SELECT ss.*, s.name AS subject_name, s.color AS subject_color, s.difficulty
     FROM study_sessions ss JOIN subjects s ON s.id = ss.subject_id
     WHERE ss.id = $1 AND ss.user_id = $2`,
    [sessionId, userId]
  );
  if (!result.rows[0]) {
    const err = new Error('Session not found'); err.status = 404; throw err;
  }
  return result.rows[0];
}

async function updateSession(userId, sessionId, updates) {
  const allowed = { title: updates.title, notes: updates.notes, planned_date: updates.plannedDate,
    start_time: updates.startTime, end_time: updates.endTime };
  const fields = Object.keys(allowed).filter((k) => allowed[k] !== undefined);
  if (fields.length === 0) return getSession(userId, sessionId);

  const setClauses = fields.map((f, i) => `${f} = $${i + 3}`).join(', ');
  const values = fields.map((f) => allowed[f]);

  const result = await query(
    `UPDATE study_sessions SET ${setClauses}, updated_at = NOW()
     WHERE id = $1 AND user_id = $2 RETURNING *`,
    [sessionId, userId, ...values]
  );
  if (!result.rows[0]) { const err = new Error('Session not found'); err.status = 404; throw err; }
  return result.rows[0];
}

async function completeSession(userId, sessionId) {
  const session = await getSession(userId, sessionId);
  if (session.status === 'completed') return session;

  const xp = calculateXP(session.duration_mins || 50, session.difficulty || 3);

  const result = await query(
    `UPDATE study_sessions
     SET status = 'completed', completed_at = NOW(), xp_awarded = $3, updated_at = NOW()
     WHERE id = $1 AND user_id = $2 RETURNING *`,
    [sessionId, userId, xp]
  );

  // Update hours_completed on subject
  await query(
    `UPDATE subjects SET hours_completed = hours_completed + $1::decimal / 60, updated_at = NOW()
     WHERE id = $2`,
    [session.duration_mins || 50, session.subject_id]
  );

  // Award XP + update streak
  await updateGamification(userId, xp);

  return result.rows[0];
}

async function skipSession(userId, sessionId) {
  const result = await query(
    `UPDATE study_sessions SET status = 'skipped', updated_at = NOW()
     WHERE id = $1 AND user_id = $2 RETURNING *`,
    [sessionId, userId]
  );
  if (!result.rows[0]) { const err = new Error('Session not found'); err.status = 404; throw err; }
  return result.rows[0];
}

async function deleteSession(userId, sessionId) {
  await query('DELETE FROM study_sessions WHERE id = $1 AND user_id = $2', [sessionId, userId]);
}

async function updateGamification(userId, xp) {
  const today = new Date().toISOString().split('T')[0];
  const g = await query('SELECT * FROM user_gamification WHERE user_id = $1', [userId]);
  const current = g.rows[0];
  if (!current) return;

  const lastDate = current.last_study_date ? current.last_study_date.toISOString().split('T')[0] : null;
  let newStreak = current.current_streak;

  if (lastDate === today) {
    // same day, no streak change
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    newStreak = lastDate === yesterdayStr ? current.current_streak + 1 : 1;
  }

  const newXP = current.xp_total + xp;
  const { calculateLevel } = require('../../utils/xp');
  const newLevel = calculateLevel(newXP);
  const newLongest = Math.max(current.longest_streak, newStreak);

  await query(
    `UPDATE user_gamification
     SET xp_total = $2, level = $3, current_streak = $4, longest_streak = $5, last_study_date = $6, updated_at = NOW()
     WHERE user_id = $1`,
    [userId, newXP, newLevel, newStreak, newLongest, today]
  );
}

function calcDuration(startTime, endTime) {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

module.exports = { listSessions, createSession, getSession, updateSession, completeSession, skipSession, deleteSession };
