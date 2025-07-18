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

module.exports = {
  toggleSongLike, getStream
};