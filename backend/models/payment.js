const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'VND',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum : ['VNPAY', 'PayOS', 'Credit Card'],
      default: 'PayOS',
    },
    transactionId: {
      type: String,
      default: '',
    },
    processedAt: {
      type: Date,
      default: null,
    },
    orderCode: { type: Number, required: true, unique: true },
  },

  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
