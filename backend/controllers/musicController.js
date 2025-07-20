// controllers/songController.js
const musicService = require("../services/musicService");

/**
 * GET /api/songs/:id/stream
 * Streams audio from Cloudinary → Node → Client with Range support.
 */
const streamingAudio = async (req, res, next) => {
  try {
    const range = req.headers.range || "bytes=0-";

    // service returns Cloudinary response stream
    const cloudRes = await musicService.getStream(req.params.id, range);

    // Forward status & headers
    res.writeHead(cloudRes.statusCode, {
      "Content-Type": cloudRes.headers["content-type"] || "audio/mpeg",
      "Content-Length": cloudRes.headers["content-length"],
      "Content-Range": cloudRes.headers["content-range"] || undefined,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000",
    });

    // Pipe Cloudinary → client
    cloudRes.pipe(res);
  } catch (err) {
    next(err);
  }
};


const toggleSongLikeController = async (req, res) => {
  const userId = req.user._id;
  const { songId } = req.params;

  if (!songId) {
    return res.status(400).json({ message: 'Missing userId or songId' });
  }

  try {
    const result = await musicService.toggleSongLike(userId, songId);
    res.status(200).json({
      message: result.liked ? 'Song liked' : 'Song unliked',
      liked: result.liked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Lấy danh sách bài hát đã like của user
const getLikedTracksController = async (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const likedTracks = await musicService.getLikedTracks(userId);
    res.status(200).json({ likedTracks });
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({ message: error.message || 'Internal Server Error' });
  }
};

module.exports = { streamingAudio, toggleSongLikeController, getLikedTracksController };
