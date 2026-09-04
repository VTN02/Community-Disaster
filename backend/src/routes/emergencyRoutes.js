const express = require('express');
const router = express.Router();
const {
  getContacts,
  getAllContacts,
  createContact,
  updateContact,
  deleteContact,
} = require('../controllers/emergencyController');
const { protect } = require('../middleware/auth');

// Public
router.get('/', getContacts);

// Admin
router.get('/all', protect, getAllContacts);
router.post('/', protect, createContact);
router.put('/:id', protect, updateContact);
router.delete('/:id', protect, deleteContact);

module.exports = router;
