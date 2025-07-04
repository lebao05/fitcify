// models/artistVerificationRequest.js
const mongoose = require('mongoose');
const { Schema } = mongoose;
const artistVerificationRequestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',          // or 'Artist' if you use a separate model
        required: true,
        index: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    processedAt: Date,
    processedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
    },
    notes: String,
});

module.exports = mongoose.model(
    'ArtistVerificationRequest',
    artistVerificationRequestSchema
);