const express = require('express');
const auth = require('../../middleware/auth');
const { handleGetMe, handleUpdateMe, handleGetStats, handleGetAchievements } = require('./users.controller');

const router = express.Router();
router.use(auth);

router.get('/me', handleGetMe);
router.patch('/me', handleUpdateMe);
router.get('/me/stats', handleGetStats);
router.get('/me/achievements', handleGetAchievements);

module.exports = router;
