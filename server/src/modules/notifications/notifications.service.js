const { query } = require('../../config/database');

async function listNotifications(userId, limit = 20) {
  const result = await query(
    `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}

async function unreadCount(userId) {
  const result = await query(
    'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = FALSE',
    [userId]
  );
  return parseInt(result.rows[0].count, 10);
}

async function markRead(userId, notificationId) {
  await query(
    'UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2',
    [notificationId, userId]
  );
}

async function markAllRead(userId) {
  await query('UPDATE notifications SET is_read = TRUE WHERE user_id = $1', [userId]);
}

async function deleteNotification(userId, notificationId) {
  await query('DELETE FROM notifications WHERE id = $1 AND user_id = $2', [notificationId, userId]);
}

async function createNotification(userId, { sessionId, type, title, message, scheduledFor }) {
  const result = await query(
    `INSERT INTO notifications (user_id, session_id, type, title, message, scheduled_for)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [userId, sessionId || null, type, title, message || null, scheduledFor || null]
  );
  return result.rows[0];
}

module.exports = { listNotifications, unreadCount, markRead, markAllRead, deleteNotification, createNotification };
