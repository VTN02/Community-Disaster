const jwt = require('jsonwebtoken');
const HelpTeamMember = require('../models/HelpTeamMember');

const protectHelpTeam = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in as a Help Team member.',
    });
  }

  try {
    const secret = process.env.HELP_TEAM_JWT_SECRET || process.env.JWT_SECRET || 'disasterlk_jwt_secret_key_2024_secure';
    const decoded = jwt.verify(token, secret);
    const member = await HelpTeamMember.findById(decoded.id)
      .populate('teamId', 'teamName district')
      .populate('subGroupId', 'name district town');

    if (!member) {
      return res.status(401).json({
        success: false,
        message: 'Help Team member account not found.',
      });
    }

    req.helpTeamMember = member;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session. Please log in again.',
    });
  }
};

module.exports = { protectHelpTeam };
