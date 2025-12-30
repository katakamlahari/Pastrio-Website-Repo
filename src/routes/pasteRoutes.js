const express = require('express');
const router = express.Router();
const pasteController = require('../controllers/pasteController');
const { requireAuth } = require('../middleware/auth');

// Create a new paste (allow anonymous users)
router.post('/create', pasteController.createPaste);

// Get paste as JSON
router.get('/:hash/json', pasteController.getPasteJson);

module.exports = router;
