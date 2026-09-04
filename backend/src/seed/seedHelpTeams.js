const path = require('path');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const HelpTeamMember = require('../models/HelpTeamMember');
const HelpingTeam = require('../models/HelpingTeam');
const HelpingTeamSubGroup = require('../models/HelpingTeamSubGroup');
const HelpAssignment = require('../models/HelpAssignment');
const DisasterReport = require('../models/DisasterReport');
const { findOrCreateTeamAndSubGroup, matchIncidentToTeam } = require('../services/teamMatchingService');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vijayakumarvithusan2912_db_user:vtnv@cluster0.3cwyioh.mongodb.net/disaster?retryWrites=true&w=majority';

const sampleMembers = [
  {
    name: 'Kamal Perera',
    email: 'kamal@helpteam.lk',
    password: 'Kamal@123',
    phone: '0771234567',
    district: 'Jaffna',
    town: 'Chavakachcheri',
    skills: ['Rescue', 'Medical', 'First Aid'],
    availability: true,
    status: 'active',
  },
  {
    name: 'Suresh Kumar',
    email: 'suresh@helpteam.lk',
    password: 'Suresh@123',
    phone: '0772345678',
    district: 'Jaffna',
    town: 'Chavakachcheri',
    skills: ['Boat Navigation', 'Rescue'],
    availability: true,
    status: 'active',
  },
  {
    name: 'Nimali Silva',
    email: 'nimali@helpteam.lk',
    password: 'Nimali@123',
    phone: '0773456789',
    district: 'Colombo',
    town: 'Baseline Road',
    skills: ['Medical', 'Logistics', 'First Aid'],
    availability: true,
    status: 'active',
  },
  {
    name: 'Roshan Fernando',
    email: 'roshan@helpteam.lk',
    password: 'Roshan@123',
    phone: '0774567890',
    district: 'Kandy',
    town: 'Kadugannawa',
    skills: ['Rescue', 'Logistics', 'Heavy Equipment'],
    availability: true,
    status: 'active',
  },
  {
    name: 'Fathima Rizwan',
    email: 'fathima@helpteam.lk',
    password: 'Fathima@123',
    phone: '0775678901',
    district: 'Galle',
    town: 'Galle Fort',
    skills: ['First Aid', 'Shelter Operations', 'Medical'],
    availability: true,
    status: 'active',
  },
];

const seedHelpTeams = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Remove existing help team data
    await HelpTeamMember.deleteMany({});
    await HelpingTeam.deleteMany({});
    await HelpingTeamSubGroup.deleteMany({});
    await HelpAssignment.deleteMany({});
    console.log('🗑️  Cleared existing help team collections');

    for (const memData of sampleMembers) {
      const member = new HelpTeamMember(memData);
      await member.save();

      const { team, subGroup } = await findOrCreateTeamAndSubGroup(
        memData.district,
        memData.town,
        member._id
      );

      member.teamId = team._id;
      member.subGroupId = subGroup._id;
      await member.save();

      console.log(`👤 Created member: ${member.name} (${member.email}) -> ${team.teamName} / ${subGroup.name}`);
    }

    // Auto-match existing reports
    const reports = await DisasterReport.find().limit(5);
    console.log(`\n🔄 Matching ${reports.length} sample reports to teams...`);
    for (const rep of reports) {
      try {
        const assignment = await matchIncidentToTeam(rep._id, rep.severity);
        console.log(`📍 Assigned report ${rep.type} in ${rep.district} -> ${assignment.assignmentType}`);
      } catch (e) {
        console.log(`Failed to match report ${rep._id}:`, e.message);
      }
    }

    console.log('\n✅ Help Team data seeded successfully!');
    console.log('--- Sample Help Team Accounts ---');
    console.log('1) kamal@helpteam.lk / Kamal@123 (Jaffna / Chavakachcheri)');
    console.log('2) suresh@helpteam.lk / Suresh@123 (Jaffna / Chavakachcheri)');
    console.log('3) nimali@helpteam.lk / Nimali@123 (Colombo / Baseline Road)');
    console.log('4) roshan@helpteam.lk / Roshan@123 (Kandy / Kadugannawa)');
    console.log('5) fathima@helpteam.lk / Fathima@123 (Galle / Galle Fort)');
    console.log('---------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedHelpTeams();
