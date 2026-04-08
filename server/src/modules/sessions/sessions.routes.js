const express = require('express');
const auth = require('../../middleware/auth');
const c = require('./sessions.controller');

const router = express.Router();
router.use(auth);

router.get('/', c.handleList);
router.post('/', c.handleCreate);
router.get('/:id', c.handleGet);
router.patch('/:id', c.handleUpdate);
router.patch('/:id/complete', c.handleComplete);
router.patch('/:id/skip', c.handleSkip);
router.delete('/:id', c.handleDelete);

module.exports = router;
