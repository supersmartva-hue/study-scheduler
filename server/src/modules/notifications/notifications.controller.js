const svc = require('./notifications.service');

async function handleList(req, res, next) {
  try { res.json(await svc.listNotifications(req.user.id)); } catch (err) { next(err); }
}
async function handleUnreadCount(req, res, next) {
  try { res.json({ count: await svc.unreadCount(req.user.id) }); } catch (err) { next(err); }
}
async function handleMarkRead(req, res, next) {
  try { await svc.markRead(req.user.id, req.params.id); res.status(204).send(); } catch (err) { next(err); }
}
async function handleMarkAllRead(req, res, next) {
  try { await svc.markAllRead(req.user.id); res.status(204).send(); } catch (err) { next(err); }
}
async function handleDelete(req, res, next) {
  try { await svc.deleteNotification(req.user.id, req.params.id); res.status(204).send(); } catch (err) { next(err); }
}

module.exports = { handleList, handleUnreadCount, handleMarkRead, handleMarkAllRead, handleDelete };
