const mongoose = require('mongoose');

const helpingTeamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      unique: true,
      trim: true,
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
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

helpingTeamSchema.index({ district: 1 });

module.exports = mongoose.model('HelpingTeam', helpingTeamSchema);
