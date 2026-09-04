const express = require('express');
const router = express.Router();
const {
  getReports,
  getReport,
  createReport,
  updateReport,
  deleteReport,
  updateStatus,
  verifyReport,
  getStats,
} = require('../controllers/reportsController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/stats', getStats);
router.get('/', getReports);
router.get('/:id', getReport);
router.post('/', createReport);

// Admin-only routes
router.put('/:id', protect, updateReport);
router.delete('/:id', protect, deleteReport);
router.patch('/:id/status', protect, updateStatus);
router.patch('/:id/verify', protect, verifyReport);

module.exports = router;
