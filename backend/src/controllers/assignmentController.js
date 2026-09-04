const HelpAssignment = require('../models/HelpAssignment');
const DisasterReport = require('../models/DisasterReport');
const HelpingTeam = require('../models/HelpingTeam');
const HelpingTeamSubGroup = require('../models/HelpingTeamSubGroup');
const { matchIncidentToTeam } = require('../services/teamMatchingService');

// @desc    Get all incident assignments
// @route   GET /api/assignments
// @access  Public / Admin
const getAssignments = async (req, res) => {
  try {
    const { status, teamId, subGroupId, incidentId } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (teamId) query.teamId = teamId;
    if (subGroupId) query.subGroupId = subGroupId;
    if (incidentId) query.incidentId = incidentId;

    const assignments = await HelpAssignment.find(query)
      .populate('incidentId')
      .populate('teamId', 'teamName district')
      .populate('subGroupId', 'name district town')
      .populate('assignedMembers', 'name email phone skills status availability')
      .populate('statusHistory.updatedBy', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching assignments.',
    });
  }
};

// @desc    Auto-match incident to nearest town subgroup or district fallback
// @route   POST /api/assignments/auto-match/:incidentId
// @access  Admin / System
const autoMatch = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { priority } = req.body;

    const assignment = await matchIncidentToTeam(incidentId, priority);

    res.status(200).json({
      success: true,
      message: `Incident matched successfully (${assignment.assignmentType}).`,
      data: assignment,
    });
  } catch (error) {
    console.error('Auto match error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error auto-matching incident.',
    });
  }
};

// @desc    Manual assignment by Admin
// @route   POST /api/assignments/manual
// @access  Admin
const manualAssign = async (req, res) => {
  try {
    const { incidentId, teamId, subGroupId, memberIds, priority, notes } = req.body;

    if (!incidentId) {
      return res.status(400).json({
        success: false,
        message: 'Incident ID is required.',
      });
    }

    const incident = await DisasterReport.findById(incidentId);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Disaster report not found.',
      });
    }

    let assignment = await HelpAssignment.findOne({ incidentId });

    if (assignment) {
      assignment.teamId = teamId || assignment.teamId;
      assignment.subGroupId = subGroupId !== undefined ? subGroupId : assignment.subGroupId;
      assignment.assignedMembers = memberIds || assignment.assignedMembers;
      assignment.priority = priority || assignment.priority;
      assignment.assignmentType = 'manual';
      if (notes) assignment.notes = notes;

      assignment.statusHistory.push({
        status: assignment.status,
        note: `Manual reassignment by Admin: ${notes || 'Updated details'}`,
      });

      await assignment.save();
    } else {
      assignment = await HelpAssignment.create({
        incidentId,
        teamId: teamId || null,
        subGroupId: subGroupId || null,
        assignedMembers: memberIds || [],
        priority: priority || incident.severity || 'medium',
        assignmentType: 'manual',
        status: 'assigned',
        notes: notes || 'Manually assigned by Administrator',
        statusHistory: [
          {
            status: 'assigned',
            note: `Manually assigned by Admin: ${notes || 'Assigned to team'}`,
          },
        ],
      });
    }

    const populated = await HelpAssignment.findById(assignment._id)
      .populate('incidentId')
      .populate('teamId', 'teamName district')
      .populate('subGroupId', 'name district town')
      .populate('assignedMembers', 'name email phone skills status availability');

    res.status(200).json({
      success: true,
      message: 'Incident manually assigned.',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error assigning incident.',
    });
  }
};

// @desc    Get assignment stats
// @route   GET /api/assignments/stats
// @access  Public / Admin
const getAssignmentStats = async (req, res) => {
  try {
    const total = await HelpAssignment.countDocuments();
    const assigned = await HelpAssignment.countDocuments({ status: 'assigned' });
    const accepted = await HelpAssignment.countDocuments({ status: 'accepted' });
    const inProgress = await HelpAssignment.countDocuments({ status: 'in_progress' });
    const arrived = await HelpAssignment.countDocuments({ status: 'arrived' });
    const completed = await HelpAssignment.countDocuments({ status: 'completed' });

    res.status(200).json({
      success: true,
      data: {
        total,
        assigned,
        accepted,
        inProgress,
        arrived,
        completed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching assignment stats.',
    });
  }
};

module.exports = {
  getAssignments,
  autoMatch,
  manualAssign,
  getAssignmentStats,
};
