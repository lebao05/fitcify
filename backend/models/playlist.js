const mongoose = require("mongoose");
const playlistSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, default: '' },
        ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        isPublic: { type: Boolean, default: true },
        imageUrl: { type: String, default: '' },
        songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
        isArtistPlaylist: { type: Boolean, default: false }
    },
    { timestamps: true }
);
module.exports = mongoose.model('Playlist', playlistSchema);