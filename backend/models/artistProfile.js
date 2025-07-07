const mongoose = require("mongoose");
const artistProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isbanned: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationRequestDate: { type: Date },
    bio: { type: String, default: '' },
    totalPlays: { type: Number, default: 0 },
    albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album' }],
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    socialLinks: {
        spotify: String,
        instagram: String,
        twitter: String,
        website: String
    }
});
module.exports = mongoose.model('ArtistProfile', artistProfileSchema);