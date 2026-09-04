const EmergencyContact = require('../models/EmergencyContact');

// @desc    Get all emergency contacts
// @route   GET /api/emergency-contacts
// @access  Public
const getContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({ isActive: true }).sort({ order: 1, category: 1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load emergency contacts.' });
  }
};

// @desc    Get all contacts (including inactive) - admin
// @route   GET /api/emergency-contacts/all
// @access  Admin
const getAllContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load contacts.' });
  }
};

// @desc    Create emergency contact
// @route   POST /api/emergency-contacts
// @access  Admin
const createContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message || 'Unable to create contact.' });
  }
};

// @desc    Update emergency contact
// @route   PUT /api/emergency-contacts/:id
// @access  Admin
const updateContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found.' });
    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to update contact.' });
  }
};

// @desc    Delete emergency contact
// @route   DELETE /api/emergency-contacts/:id
// @access  Admin
const deleteContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found.' });
    res.status(200).json({ success: true, message: 'Contact deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to delete contact.' });
  }
};

module.exports = { getContacts, getAllContacts, createContact, updateContact, deleteContact };
