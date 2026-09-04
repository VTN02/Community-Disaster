const mongoose = require('mongoose');

const disasterReportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Disaster type is required'],
      enum: ['Flood', 'Landslide', 'Heavy Rain', 'Road Blockage', 'Storm', 'Fire', 'Building Damage', 'Other'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    severity: {
      type: String,
      required: [true, 'Severity is required'],
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    location: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
      },
    },
    district: {
      type: String,
      required: [true, 'District is required'],
      trim: true,
    },
    area: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'investigating', 'resolved', 'rejected'],
      default: 'pending',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    imageUrl: {
      type: String,
      default: null,
    },
    reporterName: {
      type: String,
      trim: true,
      default: 'Anonymous',
    },
    reporterContact: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geo-queries
disasterReportSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
disasterReportSchema.index({ district: 1, severity: 1, status: 1 });

module.exports = mongoose.model('DisasterReport', disasterReportSchema);
