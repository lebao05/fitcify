
const https = require("https");
const Song = require("../models/song");
const mongoose = require('mongoose');

function proxyStreamFromCloudinary(cloudinaryUrl, range) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      cloudinaryUrl,
      { headers: { Range: range } },
      (res) => {
        resolve(res); // res is an IncomingMessage (readable stream)
      }
    );
    req.on("error", reject);
  });
}

async function getStream(songId, rangeHeader = "bytes=0-") {
  const song = await Song.findById(songId).select("audioUrl");
  if (!song) throw new Error("Song not found");
  const cloudRes = await proxyStreamFromCloudinary(song.audioUrl, rangeHeader);
  return cloudRes;
}

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

// Lấy danh sách bài hát đã like của user
const getLikedTracks = async (userId) => {
  if (!userId) {
    const err = new Error("Unauthorized: User must be logged in");
    err.status = 401;
    throw err;
  }
  try {
    const likedSongs = await Song.find({ likes: userId });
    return likedSongs;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  toggleSongLike,
  getStream,
  getLikedTracks,
};