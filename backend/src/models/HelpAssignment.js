const mongoose = require('mongoose');

const helpAssignmentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DisasterReport',
      required: [true, 'Incident reference is required'],
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpingTeam',
    },
    subGroupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpingTeamSubGroup',
    },
    assignmentType: {
      type: String,
      enum: ['subgroup', 'district_fallback', 'manual'],
      default: 'subgroup',
    },
    assignedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HelpTeamMember',
      },
    ],
    status: {
      type: String,
      enum: ['assigned', 'accepted', 'in_progress', 'arrived', 'completed', 'cancelled'],
      default: 'assigned',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    arrivedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'HelpTeamMember',
        },
        note: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

helpAssignmentSchema.index({ incidentId: 1, status: 1 });
helpAssignmentSchema.index({ subGroupId: 1, status: 1 });
helpAssignmentSchema.index({ teamId: 1, status: 1 });
helpAssignmentSchema.index({ assignedMembers: 1 });

module.exports = mongoose.model('HelpAssignment', helpAssignmentSchema);
