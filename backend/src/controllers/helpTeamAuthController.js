const jwt = require('jsonwebtoken');
const HelpTeamMember = require('../models/HelpTeamMember');
const { findOrCreateTeamAndSubGroup } = require('../services/teamMatchingService');

const JWT_SECRET = process.env.HELP_TEAM_JWT_SECRET || process.env.JWT_SECRET || 'disasterlk_jwt_secret_key_2024_secure';

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '14d' });
};

// @desc    Register new Help Team member
// @route   POST /api/help-team/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone, district, town, skills, availability } = req.body;

    if (!name || !email || !password || !phone || !district || !town) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, phone, district, town.',
      });
    }

    const existingMember = await HelpTeamMember.findOne({ email: email.toLowerCase().trim() });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Parse skills
    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === 'string') {
      parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (parsedSkills.length === 0) {
      parsedSkills = ['Rescue'];
    }

    // Create member
    const member = new HelpTeamMember({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: phone.trim(),
      district: district.trim(),
      town: town.trim(),
      skills: parsedSkills,
      availability: availability !== undefined ? availability : true,
      status: availability === false ? 'offline' : 'active',
    });

    await member.save();

    // Automatically assign District Team and Town Sub Group
    const { team, subGroup } = await findOrCreateTeamAndSubGroup(district, town, member._id);

    member.teamId = team._id;
    member.subGroupId = subGroup._id;
    await member.save();

    const token = signToken(member._id);

    const populatedMember = await HelpTeamMember.findById(member._id)
      .populate('teamId', 'teamName district')
      .populate('subGroupId', 'name district town');

    res.status(201).json({
      success: true,
      message: `Registration successful. Automatically assigned to ${team.teamName} and ${subGroup.name}.`,
      token,
      member: {
        id: populatedMember._id,
        name: populatedMember.name,
        email: populatedMember.email,
        phone: populatedMember.phone,
        district: populatedMember.district,
        town: populatedMember.town,
        skills: populatedMember.skills,
        availability: populatedMember.availability,
        status: populatedMember.status,
        team: populatedMember.teamId,
        subGroup: populatedMember.subGroupId,
      },
    });
  } catch (error) {
    console.error('Help team register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error registering help team member.',
    });
  }
};

// @desc    Help Team member login
// @route   POST /api/help-team/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const member = await HelpTeamMember.findOne({ email: email.toLowerCase().trim() })
      .select('+password')
      .populate('teamId', 'teamName district')
      .populate('subGroupId', 'name district town');

    if (!member || !(await member.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect email or password.',
      });
    }

    const token = signToken(member._id);

    res.status(200).json({
      success: true,
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        district: member.district,
        town: member.town,
        skills: member.skills,
        availability: member.availability,
        status: member.status,
        team: member.teamId,
        subGroup: member.subGroupId,
      },
    });
  } catch (error) {
    console.error('Help team login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error logging in.',
    });
  }
};

// @desc    Get current member profile
// @route   GET /api/help-team/auth/me
// @access  Help Team Member
const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    member: {
      id: req.helpTeamMember._id,
      name: req.helpTeamMember.name,
      email: req.helpTeamMember.email,
      phone: req.helpTeamMember.phone,
      district: req.helpTeamMember.district,
      town: req.helpTeamMember.town,
      skills: req.helpTeamMember.skills,
      availability: req.helpTeamMember.availability,
      status: req.helpTeamMember.status,
      team: req.helpTeamMember.teamId,
      subGroup: req.helpTeamMember.subGroupId,
    },
  });
};

// @desc    Update availability and status
// @route   PATCH /api/help-team/auth/availability
// @access  Help Team Member
const updateAvailability = async (req, res) => {
  try {
    const { availability, status } = req.body;
    const member = await HelpTeamMember.findById(req.helpTeamMember._id);

    if (availability !== undefined) {
      member.availability = Boolean(availability);
    }
    if (status && ['active', 'busy', 'offline'].includes(status)) {
      member.status = status;
      if (status === 'offline') {
        member.availability = false;
      } else if (status === 'active') {
        member.availability = true;
      }
    }

    await member.save();

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully.',
      member: {
        id: member._id,
        availability: member.availability,
        status: member.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating availability.',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateAvailability,
};
