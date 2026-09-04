const express = require('express');
const router = express.Router();
const {
  getAssignments,
  autoMatch,
  manualAssign,
  getAssignmentStats,
} = require('../controllers/assignmentController');

router.get('/', getAssignments);
router.get('/stats', getAssignmentStats);
router.post('/auto-match/:incidentId', autoMatch);
router.post('/manual', manualAssign);

module.exports = router;
