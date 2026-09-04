const HelpingTeam = require('../models/HelpingTeam');
const HelpingTeamSubGroup = require('../models/HelpingTeamSubGroup');
const HelpTeamMember = require('../models/HelpTeamMember');

// @desc    Get all district helping teams with sub-group and member stats
// @route   GET /api/teams
// @access  Public / Admin
const getAllTeams = async (req, res) => {
  try {
    const teams = await HelpingTeam.find()
      .populate('leader', 'name email phone')
      .populate('members', 'name email phone skills status availability town')
      .sort({ district: 1 });

    // Also attach sub-groups to each team
    const teamsWithSubGroups = await Promise.all(
      teams.map(async (team) => {
        const subGroups = await HelpingTeamSubGroup.find({ teamId: team._id })
          .populate('leader', 'name email phone')
          .populate('members', 'name email phone skills status availability town');

        const totalMembers = team.members.length;
        const activeMembers = team.members.filter((m) => m.availability && m.status !== 'offline').length;

        return {
          ...team.toObject(),
          subGroups,
          totalMembers,
          activeMembers,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: teamsWithSubGroups.length,
      data: teamsWithSubGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching teams.',
    });
  }
};

// @desc    Get single district team with full hierarchy
// @route   GET /api/teams/:id
// @access  Public / Admin
const getTeamById = async (req, res) => {
  try {
    const team = await HelpingTeam.findById(req.params.id)
      .populate('leader', 'name email phone')
      .populate('members', 'name email phone skills status availability town');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Helping team not found.',
      });
    }

    const subGroups = await HelpingTeamSubGroup.find({ teamId: team._id })
      .populate('leader', 'name email phone')
      .populate('members', 'name email phone skills status availability town');

    res.status(200).json({
      success: true,
      data: {
        ...team.toObject(),
        subGroups,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching team details.',
    });
  }
};

// @desc    Get all town sub-groups (optionally filtered by district)
// @route   GET /api/teams/subgroups
// @access  Public / Admin
const getAllSubGroups = async (req, res) => {
  try {
    const { district } = req.query;
    const query = {};
    if (district) {
      query.district = new RegExp(`^${district}$`, 'i');
    }

    const subGroups = await HelpingTeamSubGroup.find(query)
      .populate('teamId', 'teamName district')
      .populate('leader', 'name email phone')
      .populate('members', 'name email phone skills status availability town')
      .sort({ district: 1, town: 1 });

    res.status(200).json({
      success: true,
      count: subGroups.length,
      data: subGroups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching sub-groups.',
    });
  }
};

// @desc    Get team hierarchy structure (District -> Town Subgroup -> Members)
// @route   GET /api/teams/hierarchy
// @access  Public / Admin
const getTeamHierarchy = async (req, res) => {
  try {
    const teams = await HelpingTeam.find().lean();
    const subGroups = await HelpingTeamSubGroup.find()
      .populate('members', 'name email phone skills status availability town')
      .lean();

    const hierarchy = teams.map((team) => {
      const teamSubGroups = subGroups.filter((sg) => String(sg.teamId) === String(team._id));
      return {
        _id: team._id,
        teamName: team.teamName,
        district: team.district,
        subGroups: teamSubGroups,
        totalSubGroups: teamSubGroups.length,
      };
    });

    res.status(200).json({
      success: true,
      data: hierarchy,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching hierarchy.',
    });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  getAllSubGroups,
  getTeamHierarchy,
};
