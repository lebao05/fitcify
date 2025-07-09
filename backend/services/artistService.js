const ArtistProfile = require('../models/artistProfile');
const ArtistVerificationRequest = require('../models/artistVerification');
const Song = require('../models/song');

module.exports = {
  async createSong(userId, data) {
    const song = await Song.create({
      title:      data.title,
      artistId:   userId,
      duration:   data.duration,
      audioUrl:   data.audioUrl,
      imageUrl:   data.imageUrl || '',
      albumId:    data.albumId || null,
      isApproved: false
    });
    return song;
  },

  async getMySongs(userId) {
    return Song.find({ artistId: userId })
      .sort({ uploadedAt: -1 });
  }
};