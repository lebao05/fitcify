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
module.exports = { streamingAudio };
