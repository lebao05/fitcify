const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    itemType: {
      type: String,
      enum: ['song', 'album', 'artist'],  // swapped out 'playlist' for 'artist'
      required: true
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    playCount: {
      type: Number,
      default: 1
    },
    playedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: false
  }
);

// indexes
historySchema.index({ userId: 1, playedAt: -1 });
historySchema.index({ userId: 1, itemType: 1, itemId: 1, playedAt: 1 });

module.exports = mongoose.model('PlayHistory', historySchema);
