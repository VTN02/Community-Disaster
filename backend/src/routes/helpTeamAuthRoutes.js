const express = require('express');
const router = express.Router();
const { register, login, getMe, updateAvailability } = require('../controllers/helpTeamAuthController');
const { protectHelpTeam } = require('../middleware/helpTeamAuth');

// Public auth routes
router.post('/register', register);
router.post('/login', login);

// Protected routes for Help Team Member
router.get('/me', protectHelpTeam, getMe);
router.patch('/availability', protectHelpTeam, updateAvailability);

module.exports = router;
