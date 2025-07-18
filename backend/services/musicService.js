const Song = require("../models/song");

const mongoose = require('mongoose');

const toggleSongLike = async (userId, songId) => {
  try {
    const song = await Song.findById(songId);
    if (!song) throw new Error("Song not found");

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasLiked = song.likes.some(id => id.equals(userObjectId));

    if (hasLiked) {
      // Bỏ like
      song.likes = song.likes.filter(id => !id.equals(userObjectId));
    } else {
      // Thêm like
      song.likes.push(userObjectId);
    }

    await song.save();

    return {
      liked: !hasLiked,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  toggleSongLike
};
