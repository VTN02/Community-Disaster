const DisasterReport = require('../models/DisasterReport');

// @desc    Get all disaster reports with filters
// @route   GET /api/reports
// @access  Public
const getReports = async (req, res) => {
  try {
    const { type, severity, status, district, search, verificationStatus, page = 1, limit = 20 } = req.query;

    const query = {};

    // Don't show rejected reports on public view
    if (!req.admin) {
      query.verificationStatus = { $ne: 'rejected' };
      query.status = { $ne: 'rejected' };
    }

    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    if (district) query.district = new RegExp(district, 'i');
    if (verificationStatus) query.verificationStatus = verificationStatus;

    if (search) {
      query.$or = [
        { description: new RegExp(search, 'i') },
        { district: new RegExp(search, 'i') },
        { area: new RegExp(search, 'i') },
        { type: new RegExp(search, 'i') },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await DisasterReport.countDocuments(query);
    const reports = await DisasterReport.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: reports,
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to load disaster reports. Please try again.',
    });
  }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Public
const getReport = async (req, res) => {
  try {
    const report = await DisasterReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Disaster report not found.',
      });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to load this report. Please try again.',
    });
  }
};

// @desc    Create new disaster report
// @route   POST /api/reports
// @access  Public
const createReport = async (req, res) => {
  try {
    const { type, description, severity, location, district, area, reporterName, reporterContact } = req.body;

    // Validate required fields
    if (!type) {
      return res.status(400).json({ success: false, message: 'Please select a disaster type.' });
    }
    if (!description || description.trim().length < 20) {
      return res.status(400).json({ success: false, message: 'Please provide more information about the incident (at least 20 characters).' });
    }
    if (!location || !location.latitude || !location.longitude) {
      return res.status(400).json({ success: false, message: 'Please select or share the incident location.' });
    }
    if (!district || district.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please enter the district.' });
    }

    const report = await DisasterReport.create({
      type,
      description: description.trim(),
      severity: severity || 'medium',
      location,
      district: district.trim(),
      area: area ? area.trim() : '',
      reporterName: reporterName || 'Anonymous',
      reporterContact: reporterContact || '',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully.',
      data: report,
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: 'Unable to submit report. Please try again.',
    });
  }
};

// @desc    Update report (admin)
// @route   PUT /api/reports/:id
// @access  Admin
const updateReport = async (req, res) => {
  try {
    const report = await DisasterReport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to update report.' });
  }
};

// @desc    Delete report (admin)
// @route   DELETE /api/reports/:id
// @access  Admin
const deleteReport = async (req, res) => {
  try {
    const report = await DisasterReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    res.status(200).json({ success: true, message: 'Report deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to delete report.' });
  }
};

// @desc    Update report status (admin)
// @route   PATCH /api/reports/:id/status
// @access  Admin
const updateStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const validStatuses = ['pending', 'investigating', 'resolved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const report = await DisasterReport.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to update status.' });
  }
};

// @desc    Verify or reject report (admin)
// @route   PATCH /api/reports/:id/verify
// @access  Admin
const verifyReport = async (req, res) => {
  try {
    const { verificationStatus, adminNotes } = req.body;
    const valid = ['pending', 'verified', 'rejected'];

    if (!valid.includes(verificationStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid verification status.' });
    }

    // If verified, move to investigating; if rejected, mark rejected
    const statusUpdate = verificationStatus === 'verified' ? 'investigating' : verificationStatus === 'rejected' ? 'rejected' : undefined;
    const updateObj = { verificationStatus, adminNotes };
    if (statusUpdate) updateObj.status = statusUpdate;

    const report = await DisasterReport.findByIdAndUpdate(req.params.id, updateObj, { new: true });

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to update verification status.' });
  }
};

// @desc    Get statistics (admin dashboard)
// @route   GET /api/reports/stats
// @access  Public
const getStats = async (req, res) => {
  try {
    const [total, pending, critical, investigating, resolved, verified] = await Promise.all([
      DisasterReport.countDocuments(),
      DisasterReport.countDocuments({ verificationStatus: 'pending' }),
      DisasterReport.countDocuments({ severity: 'critical' }),
      DisasterReport.countDocuments({ status: 'investigating' }),
      DisasterReport.countDocuments({ status: 'resolved' }),
      DisasterReport.countDocuments({ verificationStatus: 'verified' }),
    ]);

    // Recent by type
    const byType = await DisasterReport.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byDistrict = await DisasterReport.aggregate([
      { $group: { _id: '$district', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: { total, pending, critical, investigating, resolved, verified, byType, byDistrict },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Unable to load statistics.' });
  }
};

module.exports = { getReports, getReport, createReport, updateReport, deleteReport, updateStatus, verifyReport, getStats };
