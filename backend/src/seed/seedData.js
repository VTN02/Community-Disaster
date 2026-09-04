require('dotenv').config({ path: '../../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const DisasterReport = require('../models/DisasterReport');
const EmergencyContact = require('../models/EmergencyContact');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://vijayakumarvithusan2912_db_user:vtnv@cluster0.3cwyioh.mongodb.net/disaster?retryWrites=true&w=majority';

const sampleReports = [
  {
    type: 'Flood',
    description: 'Heavy flooding has occurred near the Kelani River. Water has entered several houses along Baseline Road and nearby streets. Residents are being evacuated.',
    severity: 'critical',
    location: { latitude: 6.9271, longitude: 79.8612 },
    district: 'Colombo',
    area: 'Baseline Road',
    status: 'investigating',
    verificationStatus: 'verified',
  },
  {
    type: 'Landslide',
    description: 'A major landslide has blocked the A1 highway near Kadugannawa. Large rocks and debris are covering both lanes. Emergency services are on site.',
    severity: 'high',
    location: { latitude: 7.2806, longitude: 80.5255 },
    district: 'Kandy',
    area: 'Kadugannawa',
    status: 'investigating',
    verificationStatus: 'verified',
  },
  {
    type: 'Heavy Rain',
    description: 'Continuous heavy rain for the past 6 hours has caused widespread waterlogging in low-lying areas of Gampaha town. Several roads are impassable.',
    severity: 'high',
    location: { latitude: 7.0873, longitude: 80.0144 },
    district: 'Gampaha',
    area: 'Gampaha Town',
    status: 'pending',
    verificationStatus: 'pending',
  },
  {
    type: 'Road Blockage',
    description: 'A large tree has fallen across the B396 road near Galle Fort, blocking both directions. Police are managing traffic diversion.',
    severity: 'medium',
    location: { latitude: 6.0329, longitude: 80.2168 },
    district: 'Galle',
    area: 'Galle Fort',
    status: 'investigating',
    verificationStatus: 'verified',
  },
  {
    type: 'Flood',
    description: 'The Kalu River has overflowed its banks following heavy rainfall. Approximately 200 families have been displaced. Army assistance has been requested.',
    severity: 'critical',
    location: { latitude: 6.5854, longitude: 80.0428 },
    district: 'Kalutara',
    area: 'Kalutara North',
    status: 'investigating',
    verificationStatus: 'verified',
  },
  {
    type: 'Landslide',
    description: 'A small landslide on the Haputale-Koslanda road is partially blocking traffic. Advisory to use alternate routes.',
    severity: 'medium',
    location: { latitude: 6.7694, longitude: 81.0158 },
    district: 'Badulla',
    area: 'Haputale',
    status: 'pending',
    verificationStatus: 'pending',
  },
  {
    type: 'Storm',
    description: 'Strong winds and heavy rain from a developing depression in the Bay of Bengal are affecting the northern coast. Several fishing boats have reported damage.',
    severity: 'high',
    location: { latitude: 9.6615, longitude: 80.0255 },
    district: 'Jaffna',
    area: 'Jaffna Peninsula',
    status: 'investigating',
    verificationStatus: 'verified',
  },
  {
    type: 'Fire',
    description: 'A fire has broken out in a warehouse near the Colombo port area. Fire brigade is on site. Residents in adjacent areas should remain indoors.',
    severity: 'critical',
    location: { latitude: 6.9439, longitude: 79.8435 },
    district: 'Colombo',
    area: 'Colombo Port',
    status: 'investigating',
    verificationStatus: 'verified',
  },
  {
    type: 'Heavy Rain',
    description: 'Continuous rainfall since last night has caused flooding in residential areas near Matara bus stand. Some roads are impassable.',
    severity: 'medium',
    location: { latitude: 5.9496, longitude: 80.5353 },
    district: 'Matara',
    area: 'Matara Town',
    status: 'pending',
    verificationStatus: 'pending',
  },
  {
    type: 'Flood',
    description: 'Flooding reported in low-lying areas of Ratnapura following 12 hours of continuous heavy rain. Water levels are rising. Evacuations underway.',
    severity: 'high',
    location: { latitude: 6.6828, longitude: 80.4003 },
    district: 'Ratnapura',
    area: 'Ratnapura Town',
    status: 'investigating',
    verificationStatus: 'verified',
  },
  {
    type: 'Road Blockage',
    description: 'The A9 road near Vavuniya is partially blocked due to waterlogging. Vehicles advised to proceed with caution.',
    severity: 'low',
    location: { latitude: 8.7514, longitude: 80.4986 },
    district: 'Vavuniya',
    area: 'A9 Highway',
    status: 'resolved',
    verificationStatus: 'verified',
  },
  {
    type: 'Building Damage',
    description: 'Several homes in Kurunegala district have sustained roof damage due to strong winds last night. Families displaced seeking emergency shelter.',
    severity: 'medium',
    location: { latitude: 7.4818, longitude: 80.3609 },
    district: 'Kurunegala',
    area: 'Kurunegala Town',
    status: 'resolved',
    verificationStatus: 'verified',
  },
];

const sampleContacts = [
  {
    name: 'Police Emergency',
    organization: 'Sri Lanka Police',
    phone: '119',
    category: 'police',
    description: 'For all police emergencies and law enforcement assistance',
    order: 1,
  },
  {
    name: 'Fire & Rescue',
    organization: 'Sri Lanka Fire & Rescue Services',
    phone: '110',
    category: 'fire',
    description: 'For fire emergencies and rescue operations',
    order: 2,
  },
  {
    name: 'Ambulance / Suwa Seriya',
    organization: 'Suwa Seriya Foundation',
    phone: '1990',
    category: 'medical',
    description: 'Free ambulance service available 24/7 island-wide',
    order: 3,
  },
  {
    name: 'Disaster Management Centre',
    organization: 'Sri Lanka Disaster Management Centre',
    phone: '117',
    category: 'disaster',
    description: 'National Disaster Management Centre — reporting and coordination',
    order: 4,
  },
  {
    name: 'National Hospital Colombo',
    organization: 'National Hospital of Sri Lanka',
    phone: '0112 691111',
    category: 'medical',
    description: 'Main national hospital emergency services',
    order: 5,
  },
  {
    name: 'Coast Guard',
    organization: 'Sri Lanka Coast Guard',
    phone: '0112 531166',
    category: 'disaster',
    description: 'For maritime emergencies and coastal rescue operations',
    order: 6,
  },
  {
    name: 'CEB Emergency',
    organization: 'Ceylon Electricity Board',
    phone: '1987',
    category: 'utility',
    description: 'Report electricity failures and dangerous electrical situations',
    order: 7,
  },
  {
    name: 'Water Board Emergency',
    organization: 'National Water Supply & Drainage Board',
    phone: '1954',
    category: 'utility',
    description: 'Report water supply emergencies and pipe bursts',
    order: 8,
  },
];

const seedData = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Admin.deleteMany({});
    await DisasterReport.deleteMany({});
    await EmergencyContact.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin (pre('save') hook in Admin model will hash the password once)
    await Admin.create({
      name: 'System Administrator',
      email: 'admin@disasterlk.gov.lk',
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('👤 Admin created: admin@disasterlk.gov.lk / Admin@123');

    // Create reports
    await DisasterReport.insertMany(sampleReports);
    console.log(`📋 Created ${sampleReports.length} disaster reports`);

    // Create contacts
    await EmergencyContact.insertMany(sampleContacts);
    console.log(`📞 Created ${sampleContacts.length} emergency contacts`);

    console.log('\n✅ Database seeded successfully!');
    console.log('---');
    console.log('Admin Login:');
    console.log('  Email:    admin@disasterlk.gov.lk');
    console.log('  Password: Admin@123');
    console.log('---');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
