const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    itemType: {
      type: String,
      enum: ['album', 'playlist'],
      required: true,
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    playedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: false,
  }
);

// index to quickly get recent plays per user
historySchema.index({ userId: 1, playedAt: -1 });
// optional: prevent exact duplicate logs if desired
historySchema.index({ userId: 1, itemType: 1, itemId: 1, playedAt: 1 });

module.exports = mongoose.model('PlayHistory', historySchema);