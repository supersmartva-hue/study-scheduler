const { query } = require('../../config/database');

async function listSubjects(userId) {
  const result = await query(
    `SELECT * FROM subjects WHERE user_id = $1 AND is_active = TRUE ORDER BY priority DESC, deadline ASC NULLS LAST`,
    [userId]
  );
  return result.rows;
}

async function createSubject(userId, data) {
  const { name, description, color, difficulty, estimatedHours, deadline, priority } = data;
  const result = await query(
    `INSERT INTO subjects (user_id, name, description, color, difficulty, estimated_hours, deadline, priority)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [userId, name, description || null, color || '#6366f1', difficulty || 3, estimatedHours, deadline || null, priority || 3]
  );
  return result.rows[0];
}

async function getSubject(userId, subjectId) {
  const result = await query(
    'SELECT * FROM subjects WHERE id = $1 AND user_id = $2',
    [subjectId, userId]
  );
  if (!result.rows[0]) {
    const err = new Error('Subject not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
}

async function updateSubject(userId, subjectId, updates) {
  const allowed = ['name', 'description', 'color', 'difficulty', 'estimated_hours', 'deadline', 'priority'];
  const map = {
    name: updates.name, description: updates.description, color: updates.color,
    difficulty: updates.difficulty, estimated_hours: updates.estimatedHours,
    deadline: updates.deadline, priority: updates.priority,
  };
  const fields = Object.keys(map).filter((k) => map[k] !== undefined && allowed.includes(k));
  if (fields.length === 0) return getSubject(userId, subjectId);

  const setClauses = fields.map((f, i) => `${f} = $${i + 3}`).join(', ');
  const values = fields.map((f) => map[f]);

  const result = await query(
    `UPDATE subjects SET ${setClauses}, updated_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *`,
    [subjectId, userId, ...values]
  );
  if (!result.rows[0]) {
    const err = new Error('Subject not found');
    err.status = 404;
    throw err;
  }
  return result.rows[0];
}

async function deleteSubject(userId, subjectId) {
  await query(
    'UPDATE subjects SET is_active = FALSE, updated_at = NOW() WHERE id = $1 AND user_id = $2',
    [subjectId, userId]
  );
}

module.exports = { listSubjects, createSubject, getSubject, updateSubject, deleteSubject };
