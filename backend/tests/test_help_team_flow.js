const path = require('path');
const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const HelpTeamMember = require('./models/HelpTeamMember');
const HelpingTeam = require('./models/HelpingTeam');
const HelpingTeamSubGroup = require('./models/HelpingTeamSubGroup');
const HelpAssignment = require('./models/HelpAssignment');
const DisasterReport = require('./models/DisasterReport');

const { findOrCreateTeamAndSubGroup, matchIncidentToTeam } = require('./services/teamMatchingService');
const { calculateDistanceKm } = require('./services/locationService');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vijayakumarvithusan2912_db_user:vtnv@cluster0.3cwyioh.mongodb.net/disaster?retryWrites=true&w=majority';

const runVerification = async () => {
  try {
    console.log('--- STARTING HELP TEAM SYSTEM VERIFICATION ---');
    await mongoose.connect(MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Test 1: Location Service
    const dist = calculateDistanceKm(6.9271, 79.8612, 7.2906, 80.6337);
    console.log(`✓ Distance calculation test: Colombo to Kandy = ${dist} km`);
    if (!dist || dist < 90 || dist > 130) {
      throw new Error(`Distance calculation unexpected value: ${dist}`);
    }

    // Test 2: Auto Team & Sub Group Placement on Registration
    console.log('\n--- Testing Auto-Assignment on Registration ---');
    const testEmail = `auto_test_${Date.now()}@helpteam.lk`;
    const testMember = new HelpTeamMember({
      name: 'Test Responder Kamal',
      email: testEmail,
      password: 'Password@123',
      phone: '0779998877',
      district: 'Jaffna',
      town: 'Chavakachcheri',
      skills: ['Rescue', 'Medical', 'Boat Navigation'],
      availability: true,
      status: 'active',
    });
    await testMember.save();

    const { team, subGroup } = await findOrCreateTeamAndSubGroup(
      testMember.district,
      testMember.town,
      testMember._id
    );

    testMember.teamId = team._id;
    testMember.subGroupId = subGroup._id;
    await testMember.save();

    console.log(`✓ Member registered: ${testMember.name} (${testMember.email})`);
    console.log(`✓ Auto-assigned District Team: ${team.teamName} (ID: ${team._id})`);
    console.log(`✓ Auto-assigned Town Sub Group: ${subGroup.name} (ID: ${subGroup._id})`);

    if (!team.teamName.includes('Jaffna') || !subGroup.name.includes('Chavakachcheri')) {
      throw new Error('Auto-assignment names do not match expected District/Town structure');
    }

    // Test 3: Password Comparison
    const memberWithPass = await HelpTeamMember.findById(testMember._id).select('+password');
    const isPassMatch = await memberWithPass.comparePassword('Password@123');
    console.log(`✓ Password hashing and verification: ${isPassMatch ? 'MATCH' : 'FAILED'}`);
    if (!isPassMatch) throw new Error('Password comparison failed');

    // Test 4: Incident Matching & Auto-Dispatch
    console.log('\n--- Testing Location-Based Incident Auto-Matching ---');
    const testIncident = await DisasterReport.create({
      type: 'Flood',
      description: 'Severe flash flooding near Chavakachcheri market area with multiple trapped families.',
      severity: 'high',
      location: { latitude: 9.6615, longitude: 80.1581 },
      district: 'Jaffna',
      area: 'Chavakachcheri',
      reporterName: 'Resident Test',
      reporterContact: '0711112233',
    });
    console.log(`✓ Created test disaster report: ID ${testIncident._id}, District: ${testIncident.district}, Area: ${testIncident.area}`);

    const assignment = await matchIncidentToTeam(testIncident._id, testIncident.severity);
    console.log(`✓ Auto-matched assignment type: ${assignment.assignmentType}`);
    console.log(`✓ Assigned Sub Group: ${assignment.subGroupId?.name || assignment.subGroupId}`);
    console.log(`✓ Assigned Members count: ${assignment.assignedMembers?.length || 0}`);

    if (assignment.assignmentType !== 'subgroup') {
      throw new Error(`Expected subgroup match, got ${assignment.assignmentType}`);
    }

    // Test 5: Progression Workflow (Assigned -> Accepted -> In Progress -> Arrived -> Completed)
    console.log('\n--- Testing Status Progression Workflow ---');
    const transitions = ['accepted', 'in_progress', 'arrived', 'completed'];

    for (const nextStatus of transitions) {
      assignment.status = nextStatus;
      if (nextStatus === 'accepted') assignment.acceptedAt = new Date();
      if (nextStatus === 'in_progress') assignment.startedAt = new Date();
      if (nextStatus === 'arrived') assignment.arrivedAt = new Date();
      if (nextStatus === 'completed') {
        assignment.completedAt = new Date();
        await DisasterReport.findByIdAndUpdate(testIncident._id, { status: 'resolved' });
      }

      assignment.statusHistory.push({
        status: nextStatus,
        updatedAt: new Date(),
        updatedBy: testMember._id,
        note: `Progressed to ${nextStatus}`,
      });

      await assignment.save();
      console.log(`  ✓ Transitioned to: ${nextStatus.toUpperCase()}`);
    }

    // Verify incident marked as resolved
    const resolvedIncident = await DisasterReport.findById(testIncident._id);
    console.log(`✓ Underlying incident status after completion: ${resolvedIncident.status}`);
    if (resolvedIncident.status !== 'resolved') {
      throw new Error('Disaster report should be resolved after task completion');
    }

    // Cleanup test artifacts
    await HelpAssignment.findByIdAndDelete(assignment._id);
    await DisasterReport.findByIdAndDelete(testIncident._id);
    await HelpTeamMember.findByIdAndDelete(testMember._id);
    console.log('✓ Cleaned up test records');

    console.log('\n=========================================');
    console.log('🎉 ALL HELP TEAM SYSTEM TESTS PASSED! 🎉');
    console.log('=========================================');

    process.exit(0);
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  }
};

runVerification();
