// models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    planType: {
      type: String,
      enum: ['free', 'premium', 'family'],
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'pending'],
      default: 'pending',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: 'PayOS',
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'VND',
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // createdAt và updatedAt
  }
);

module.exports = mongoose.model('Subscription', subscriptionSchema);
