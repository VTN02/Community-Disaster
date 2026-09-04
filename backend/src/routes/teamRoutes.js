const express = require('express');
const router = express.Router();
const {
  getAllTeams,
  getTeamById,
  getAllSubGroups,
  getTeamHierarchy,
} = require('../controllers/teamController');

router.get('/', getAllTeams);
router.get('/subgroups', getAllSubGroups);
router.get('/hierarchy', getTeamHierarchy);
router.get('/:id', getTeamById);

module.exports = router;
