const HelpingTeam = require('../models/HelpingTeam');
const HelpingTeamSubGroup = require('../models/HelpingTeamSubGroup');
const HelpTeamMember = require('../models/HelpTeamMember');
const HelpAssignment = require('../models/HelpAssignment');
const DisasterReport = require('../models/DisasterReport');
const { formatPlaceName } = require('./locationService');

/**
 * Auto-assigns or creates District Team and Town Sub Group for a member
 */
const findOrCreateTeamAndSubGroup = async (rawDistrict, rawTown, memberId) => {
  const district = formatPlaceName(rawDistrict);
  const town = formatPlaceName(rawTown);

  const teamName = `${district} Helping Team`;
  const subGroupName = `${town} Helping Sub Team`;

  // 1. Find or create District Team
  let team = await HelpingTeam.findOne({ district: new RegExp(`^${district}$`, 'i') });
  if (!team) {
    team = await HelpingTeam.create({
      teamName,
      district,
      members: memberId ? [memberId] : [],
      leader: memberId || null,
    });
  } else if (memberId && !team.members.includes(memberId)) {
    team.members.push(memberId);
    await team.save();
  }

  // 2. Find or create Town Sub Group under this District Team
  let subGroup = await HelpingTeamSubGroup.findOne({
    district: new RegExp(`^${district}$`, 'i'),
    town: new RegExp(`^${town}$`, 'i'),
  });

  if (!subGroup) {
    subGroup = await HelpingTeamSubGroup.create({
      name: subGroupName,
      district,
      town,
      teamId: team._id,
      members: memberId ? [memberId] : [],
      leader: memberId || null,
    });
  } else if (memberId && !subGroup.members.includes(memberId)) {
    subGroup.members.push(memberId);
    await subGroup.save();
  }

  return { team, subGroup };
};

/**
 * Matches an incident to the nearest town sub-group or district team fallback
 */
const matchIncidentToTeam = async (incidentId, priority = 'medium') => {
  const incident = await DisasterReport.findById(incidentId);
  if (!incident) {
    throw new Error('Disaster report not found');
  }

  const district = formatPlaceName(incident.district);
  const area = incident.area ? formatPlaceName(incident.area) : '';

  let matchedSubGroup = null;
  let matchedTeam = null;
  let assignedMembers = [];
  let assignmentType = 'subgroup';

  // Step 1: Attempt to match Town Sub Group
  if (area) {
    matchedSubGroup = await HelpingTeamSubGroup.findOne({
      district: new RegExp(`^${district}$`, 'i'),
      town: new RegExp(`^${area}$`, 'i'),
    }).populate('members');
  }

  // If no direct area match, try to find any sub-group in that district where the town name is in the description or area
  if (!matchedSubGroup && incident.description) {
    const subGroups = await HelpingTeamSubGroup.find({
      district: new RegExp(`^${district}$`, 'i'),
    }).populate('members');

    for (const sg of subGroups) {
      if (
        incident.description.toLowerCase().includes(sg.town.toLowerCase()) ||
        (area && area.toLowerCase().includes(sg.town.toLowerCase()))
      ) {
        matchedSubGroup = sg;
        break;
      }
    }
  }

  // Check available members in matched sub group
  if (matchedSubGroup && matchedSubGroup.members && matchedSubGroup.members.length > 0) {
    const availableMembers = matchedSubGroup.members.filter(
      (m) => m.availability === true && m.status !== 'offline'
    );

    if (availableMembers.length > 0) {
      assignedMembers = availableMembers.map((m) => m._id);
      matchedTeam = await HelpingTeam.findById(matchedSubGroup.teamId);
      assignmentType = 'subgroup';
    } else {
      // No available members in sub group, must fallback to district
      matchedSubGroup = null;
    }
  }

  // Step 2: Fallback to District Helping Team if sub group match failed or had no available members
  if (!matchedSubGroup) {
    matchedTeam = await HelpingTeam.findOne({
      district: new RegExp(`^${district}$`, 'i'),
    }).populate('members');

    if (matchedTeam && matchedTeam.members && matchedTeam.members.length > 0) {
      const availableDistrictMembers = matchedTeam.members.filter(
        (m) => m.availability === true && m.status !== 'offline'
      );

      if (availableDistrictMembers.length > 0) {
        assignedMembers = availableDistrictMembers.map((m) => m._id);
        assignmentType = 'district_fallback';
      }
    }
  }

  // Step 3: Check if assignment already exists for this incident
  let assignment = await HelpAssignment.findOne({ incidentId });

  if (assignment) {
    assignment.teamId = matchedTeam ? matchedTeam._id : assignment.teamId;
    assignment.subGroupId = matchedSubGroup ? matchedSubGroup._id : null;
    assignment.assignedMembers = assignedMembers.length > 0 ? assignedMembers : assignment.assignedMembers;
    assignment.assignmentType = assignmentType;
    assignment.priority = priority || incident.severity || 'medium';
    assignment.statusHistory.push({
      status: assignment.status,
      note: `Auto-matched: Assigned to ${matchedSubGroup ? matchedSubGroup.name : matchedTeam ? matchedTeam.teamName : 'District Team'} (${assignmentType})`,
    });
    await assignment.save();
  } else {
    assignment = await HelpAssignment.create({
      incidentId: incident._id,
      teamId: matchedTeam ? matchedTeam._id : null,
      subGroupId: matchedSubGroup ? matchedSubGroup._id : null,
      assignmentType,
      assignedMembers,
      priority: priority || incident.severity || 'medium',
      status: 'assigned',
      notes: `Auto-assigned via location matching (${assignmentType})`,
      statusHistory: [
        {
          status: 'assigned',
          note: `Incident auto-matched to ${matchedSubGroup ? matchedSubGroup.name : matchedTeam ? matchedTeam.teamName : 'Team'}`,
        },
      ],
    });
  }

  return assignment.populate([
    { path: 'teamId', select: 'teamName district' },
    { path: 'subGroupId', select: 'name district town' },
    { path: 'assignedMembers', select: 'name email phone skills status availability' },
    { path: 'incidentId' },
  ]);
};

module.exports = {
  findOrCreateTeamAndSubGroup,
  matchIncidentToTeam,
};
