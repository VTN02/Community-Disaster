const mongoose = require('mongoose');

const helpingTeamSubGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Sub-group name is required'],
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
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpingTeam',
      required: [true, 'Parent district team is required'],
    },
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpTeamMember',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HelpTeamMember',
      },
    ],
  },
  {
    timestamps: true,
  }
);

helpingTeamSubGroupSchema.index({ district: 1, town: 1 });
helpingTeamSubGroupSchema.index({ teamId: 1 });

module.exports = mongoose.model('HelpingTeamSubGroup', helpingTeamSubGroupSchema);
