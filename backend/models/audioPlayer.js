const mongoose = require("mongoose");
const playerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
    currentSong: { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    repeatMode: { type: Boolean, default: false },
    isPlaying: { type: Boolean, default: false },
    queue: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    currentPlaylist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', default: null },
    currentAlbum: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', default: null },
}, { timestamps: true });
module.exports = mongoose.model('Player', playerSchema);