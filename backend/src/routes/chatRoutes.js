const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chatController');

// Public route to ask disaster safety questions
router.post('/', handleChat);

module.exports = router;
