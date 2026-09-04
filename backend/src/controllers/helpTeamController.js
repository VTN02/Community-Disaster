const HelpAssignment = require('../models/HelpAssignment');
const DisasterReport = require('../models/DisasterReport');

// @desc    Get tasks assigned to logged-in help team member
// @route   GET /api/help-team/tasks
// @access  Help Team Member
const getMyTasks = async (req, res) => {
  try {
    const member = req.helpTeamMember;
    const { status } = req.query;

    const query = {
      $or: [
        { assignedMembers: member._id },
        { subGroupId: member.subGroupId },
        { teamId: member.teamId },
      ],
    };

    if (status && status !== 'all') {
      query.status = status;
    }

    const tasks = await HelpAssignment.find(query)
      .populate('incidentId')
      .populate('teamId', 'teamName district')
      .populate('subGroupId', 'name district town')
      .populate('assignedMembers', 'name email phone skills status availability')
      .populate('statusHistory.updatedBy', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get my tasks error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching tasks.',
    });
  }
};

// @desc    Get specific task by ID
// @route   GET /api/help-team/tasks/:id
// @access  Help Team Member
const getTaskById = async (req, res) => {
  try {
    const task = await HelpAssignment.findById(req.params.id)
      .populate('incidentId')
      .populate('teamId', 'teamName district')
      .populate('subGroupId', 'name district town')
      .populate('assignedMembers', 'name email phone skills status availability')
      .populate('statusHistory.updatedBy', 'name phone');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task assignment not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching task details.',
    });
  }
};

// @desc    Update incident task status: accepted -> in_progress -> arrived -> completed
// @route   PATCH /api/help-team/tasks/:id/status
// @access  Help Team Member
const updateTaskStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const member = req.helpTeamMember;

    const validStatuses = ['assigned', 'accepted', 'in_progress', 'arrived', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const task = await HelpAssignment.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task assignment not found.',
      });
    }

    // Update timestamp flags based on progression
    const now = new Date();
    task.status = status;

    if (status === 'accepted' && !task.acceptedAt) {
      task.acceptedAt = now;
    } else if (status === 'in_progress' && !task.startedAt) {
      task.startedAt = now;
    } else if (status === 'arrived' && !task.arrivedAt) {
      task.arrivedAt = now;
    } else if (status === 'completed') {
      task.completedAt = now;

      // Also update the underlying DisasterReport status to resolved or keep consistent
      if (task.incidentId) {
        await DisasterReport.findByIdAndUpdate(task.incidentId, {
          status: 'resolved',
          adminNotes: `Resolved by Help Team member ${member.name} (${member.town}) at ${now.toLocaleString()}`,
        });
      }
    }

    if (note) {
      task.notes = note;
    }

    // Record in history
    task.statusHistory.push({
      status,
      updatedAt: now,
      updatedBy: member._id,
      note: note || `Status transitioned to ${status}`,
    });

    // Ensure member is in assignedMembers list
    if (!task.assignedMembers.includes(member._id)) {
      task.assignedMembers.push(member._id);
    }

    await task.save();

    const updatedTask = await HelpAssignment.findById(task._id)
      .populate('incidentId')
      .populate('teamId', 'teamName district')
      .populate('subGroupId', 'name district town')
      .populate('assignedMembers', 'name email phone skills status availability')
      .populate('statusHistory.updatedBy', 'name phone');

    res.status(200).json({
      success: true,
      message: `Task status updated to ${status}.`,
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating task status.',
    });
  }
};

module.exports = {
  getMyTasks,
  getTaskById,
  updateTaskStatus,
};
