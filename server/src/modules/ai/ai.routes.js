const express = require('express');
const auth = require('../../middleware/auth');
const { handleGenerate, handleGetActive } = require('./ai.controller');

const router = express.Router();
router.use(auth);

router.post('/generate-schedule', handleGenerate);
router.get('/active-schedule', handleGetActive);

module.exports = router;
