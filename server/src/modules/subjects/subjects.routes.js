const express = require('express');
const auth = require('../../middleware/auth');
const { handleList, handleCreate, handleGet, handleUpdate, handleDelete } = require('./subjects.controller');

const router = express.Router();
router.use(auth);

router.get('/', handleList);
router.post('/', handleCreate);
router.get('/:id', handleGet);
router.patch('/:id', handleUpdate);
router.delete('/:id', handleDelete);

module.exports = router;
