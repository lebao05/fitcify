// models/songVerificationRequest.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * SongVerificationRequest
 *  – Raised by an artist to verify a specific song (e.g. copyright proof, ownership).
 */
const contentVerificationRequestSchema = new Schema({
    objectId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    artistId: {
        type: Schema.Types.ObjectId,
        ref: 'Artist',
        required: true,
    },
    type: {
        type: String,
        enum: ['Song', 'Album'],
        required: true,
    }
    ,
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
    'ContentVerificationRequest',
    contentVerificationRequestSchema
);