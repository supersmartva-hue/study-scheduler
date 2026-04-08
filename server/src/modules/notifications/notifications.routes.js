const express = require('express');
const auth = require('../../middleware/auth');
const c = require('./notifications.controller');

const router = express.Router();
router.use(auth);

router.get('/', c.handleList);
router.get('/unread-count', c.handleUnreadCount);
router.patch('/read-all', c.handleMarkAllRead);
router.patch('/:id/read', c.handleMarkRead);
router.delete('/:id', c.handleDelete);

module.exports = router;
