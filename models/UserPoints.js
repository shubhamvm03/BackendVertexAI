const mongoose = require('mongoose');

// Define the schema for user points
const userPointsSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    points: { type: Number, default: 0 },
    engagementHistory: [
      {
        feedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feed', required: true },
        pointsEarned: { type: Number, default: 1 },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create and export the model
const UserPoints = mongoose.model('UserPoints', userPointsSchema);

module.exports = UserPoints;
