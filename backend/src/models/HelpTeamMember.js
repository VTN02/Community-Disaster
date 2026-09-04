const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const helpTeamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    town: {
      type: String,
      required: [true, 'Town is required'],
      trim: true,
    },
    skills: {
      type: [String],
      default: ['Rescue'],
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpingTeam',
    },
    subGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpingTeamSubGroup',
    },
    availability: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'busy', 'offline'],
      default: 'active',
    },
    currentLocation: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
helpTeamMemberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
helpTeamMemberSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
helpTeamMemberSchema.index({ district: 1, town: 1, availability: 1, status: 1 });

module.exports = mongoose.model('HelpTeamMember', helpTeamMemberSchema);
