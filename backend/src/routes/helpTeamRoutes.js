const express = require('express');
const router = express.Router();
const { getMyTasks, getTaskById, updateTaskStatus } = require('../controllers/helpTeamController');
const { protectHelpTeam } = require('../middleware/helpTeamAuth');

// All endpoints require Help Team Member authentication
router.use(protectHelpTeam);

router.get('/tasks', getMyTasks);
router.get('/tasks/:id', getTaskById);
router.patch('/tasks/:id/status', updateTaskStatus);

module.exports = router;
